import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../firebase";
import Spinner from "../Components/Spinner";
import ListingItem from "../Components/ListingItem";
import { useParams } from "react-router-dom";
export default function Category() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);
  const params = useParams();
  useEffect(() => {
    async function fetchListing() {
      try {
        const listingRef = collection(db, "listings");
        const q = query(
          listingRef,
          where("type", "==", params.categoryName),
          orderBy("timestamp", "desc"),
          limit(4)
        );
        const querySnap = await getDocs(q);
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);
        const listing = [];
        querySnap.forEach((doc) => {
          return listing.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setListings(listing);
        setLoading(false);
      } catch (error) {
        toast.error("could not fetch listing");
        console.log(error);
      }
    }
    fetchListing();
  }, [params.categoryName]);
  async function onFetchMoreListing() {
    try {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("type", "==", params.categoryName),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing),
        limit(4)
      );
      const querySnap = await getDocs(q);
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);
      const listing = [];
      querySnap.forEach((doc) => {
        return listing.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings((prevState) => [...prevState, ...listing]);
      setLoading(false);
    } catch (error) {
      toast.error("could not fetch listing");
      console.log(error);
    }
  }
  return (
    <div className="max-w-6xl mx-auto px-3">
      <h1 className="text-3xl uppercase text-center mt-6 font-bold mb-6">
        {params.categoryName === "rent" ? "places for rent" : "places for sale"}
      </h1>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <main>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                />
              ))}
            </ul>
          </main>
          {lastFetchedListing && (
            <div
              onClick={onFetchMoreListing}
              className="flex justify-center items-center"
            >
              <button className="uppercase bg-white px-3 py-1.5 text-gray-700 border border-gray-300 mb-6 mt-6 hover:border-slate-600 rounded transition duration-150 ease-out">
                Load more
              </button>
            </div>
          )}
        </>
      ) : (
        <p>there are no listing</p>
      )}
    </div>
  );
}
