import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { db } from "../firebase";
import Spinner from "../Components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  FaShare,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
} from "react-icons/fa";
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from "swiper";
import "swiper/css/bundle";
import { getAuth } from "firebase/auth";
import Contact from "../Components/Contact";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

export default function Listing() {
  const auth = getAuth();
  const [contactLandlord, setContactLandlord] = useState(false);
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  SwiperCore.use([Autoplay, Navigation, Pagination]);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
        console.log(listing);
      }
    }
    fetchListing();
  }, [params.listingId]);
  if (loading) {
    return <Spinner />;
  }
  return (
    <main>
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        modules={[EffectFade]}
        autoplay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full overflow-hidden h-[300px]"
              style={{
                background: `url(${listing.imgUrls[index]}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
        className="fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer border-gray-400 rounded-full w-12 h-12 flex justify-center items-center "
      >
        <FaShare className="text-lg text-slate-500" />
      </div>
      {shareLinkCopied && (
        <p className="fixed top-[23%] right-[5%] font-semibold border-2 border-gray-400 rounded-md bg-white z-10 p-2">
          Link copied
        </p>
      )}
      <div className="m-4 flex flex-col md:flex-row max-w-6xl lg:mx-auto p-4 shadow-lg bg-white lg:space-x-5">
        <div className="w-full">
          <p className="text-2xl font-bold mb-3 text-blue-900">
            {listing.name} - Ksh{" "}
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" ? " /month" : ""}
          </p>
          <p className="flex items-center mt-6 mb-3 font-semibold">
            <FaMapMarkerAlt className="text-green-700 mr-1" />
            {listing.Address}
          </p>
          <div className="flex justify-start items-center space-x-4 w-[75%]">
            <p className="bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md">
              {listing.type === "rent" ? "Rent" : "sale"}
            </p>
            {listing.offer && (
              <p className="w-full max-w-[200px] bg-green-800 text-white rounded-md text-center font-semibold shadow-md">
                ${+listing.regularPrice - +listing.discountedPrice}
              </p>
            )}
          </div>
          <p className="mt-3 mb-3 ">
            Description -{" "}
            <span className="font-semibold">{listing.Description}</span>
          </p>
          <ul className="flex items-center space-x-2 sm:space-x-10 text-sm font-semibold mb-6">
            {" "}
            <li className="flex items-center whitespace-nowrap">
              <FaBed />
              {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
            </li>{" "}
            <li className="flex items-center whitespace-nowrap">
              <FaBath />
              {+listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaParking />
              {+listing.parking ? "Parking Sport" : "No Parking"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaChair />
              {+listing.furnished ? " furnished" : "Not furnished"}
            </li>
          </ul>
          {contactLandlord && (
            <Contact useRef={listing.useRef} listing={listing} />
          )}
          {listing.useRef !== auth.currentUser?.uid && !contactLandlord && (
            <div className="mt-6">
              <button
                onClick={() => {
                  setContactLandlord("true");
                  console.log("am clicked already");
                }}
                className="bg-blue-600 font-medium rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:shadow-lg focus:bg-blue-700 text-center w-full transition duration-150 ease-out uppercase text-white px-7 py-3"
              >
                contact Landlord
              </button>
            </div>
          )}
        </div>
        <div className="w-full h-[200px] md:h-[400px] z-10 overflow-x-hidden mt-6 md:mt-0 md:ml-2">
          <MapContainer
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
            style={{height:"100%", width:"100%"}}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[listing.geolocation.lat, listing.geolocation.lng]}
            >
              <Popup>
              {listing.name}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </main>
  );
}
