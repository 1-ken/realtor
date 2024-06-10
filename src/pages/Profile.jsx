import { getAuth, updateProfile } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { db } from "../firebase";
import Spinner from "../Components/Spinner";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { FcHome } from "react-icons/fc";
import { Link } from "react-router-dom";
import ListingItem from "../Components/ListingItem";
export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [FormData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const { name, email } = FormData;
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  function onLogout() {
    auth.signOut();
    navigate("/");
  }

  const [changeDetail, setChangeDetail] = useState(false);

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }
  async function onDelete(listingID) {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "listings", listingID));
      const updateListings = listings.filter(
        (listing) => listing.id !== listingID
      );
      setListings(updateListings);
      toast.success("successfully deleted the listing");
    }
  }
  function onEdit(listingID) {
    navigate(`edit-listing/${listingID}`);
  }
  async function onSubmit() {
    try {
      if (auth.currentUser.displayName !== name) {
        //update the name in the firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        //update the name in the firestore
        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name,
        });
      }
      toast.success("profile updated successfully");
    } catch (error) {
      toast.error("could not update the details");
      console.log(error);
    }
  }
  useEffect(() => {
    async function fetchUserListings() {
      setLoading(true);
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("useRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);
  return (
    <>
      <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
        <h1 className="text-3xl  text-center mt-6 font-bold ">My Profile</h1>
        <div className="w-full md:w-[50%] mt-6 px-3">
          <form>
            {/*name input*/}
            <input
              disabled={!changeDetail}
              onChange={onChange}
              id="name"
              type="text"
              value={name}
              className={`w-full px-4 py-6 text-xl text-gray-700 bg-white  border-gray-300 rounded transition ease-in-out mb-6 ${
                changeDetail && "bg-red-200 focus:bg-red-200"
              }`}
            />
            {/*email input*/}

            <input
              disabled={!changeDetail}
              id="email"
              type="text"
              value={email}
              className="w-full px-4 py-6 text-xl text-gray-700 bg-white  border-gray-300 rounded transition ease-in-out mb-6"
            />

            <div className="flex justify-between whitespace-nowrap text-sm  sm:text-lg">
              <p className="flex items-center">
                Do you want to change your name
                <span
                  onClick={() => {
                    changeDetail && onSubmit();
                    setChangeDetail((prevState) => !prevState);
                  }}
                  className="text-red-600 hover:text-red-700 cursor-pointer transition ease-in-out duration-200 ml-1"
                >
                  {changeDetail ? "Apply changes" : " Edit"}
                </span>
              </p>
              <p
                onClick={onLogout}
                className="text-blue-600 hover:to-blue-700 transition duration-200 ease-in-out cursor-pointer"
              >
                Sign Out
              </p>
            </div>
          </form>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm font-medium rounded hover:bg-blue-700 shadow-md transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800 "
          >
            <Link
              className="flex justify-center items-center"
              to="/create-listing"
            >
              <FcHome className="mr-2 text-lg bg-red-200 rounded-full border-2 " />
              sell or rent your home
            </Link>
          </button>
        </div>
      </section>
      <div className="max-w-6xl px-3 mt-6 mx-auto">
        {loading ? (
          <Spinner />
        ) : listings ? (
          <>
            <h2 className="text-2xl text-center font-semibold mb-6">
              My Listings
            </h2>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
              ;
            </ul>
          </>
        ) : (
          <p>No listings found</p>
        )}
      </div>
    </>
  );
}
