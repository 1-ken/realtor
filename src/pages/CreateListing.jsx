import React, { useRef, useState } from "react";
import Spinner from "../Components/Spinner";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router";

export default function CreateListing() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  function onChange(e) {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }
    //files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }
    //text/numbers and boolean
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  }
  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if (+discountedPrice > +regularPrice) {
      setLoading(false);
      toast.error("Discounted price should be less than the regular price");
      return;
    }
    if (images.length > 6) {
      setLoading(false);
      toast.error("images exceed a max of 6");
      return;
    }
    let geolocation = {};
    let location;
    if (geolocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${Address}&Key=${process.env.REACT_APP_GEOCODE_API_KEY}`
      );
      const data = await response.json();
      console.log(data);
      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;
      location = data.status === "ZERO_RESULTS" && undefined;
      {
        /*} if (location === undefined || location.includes("undefined")) {
        setLoading(false);
        toast.error("please enter a correct address");
        return;
      }*/
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }

    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }
    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });
    const FormDataCopy = {
      ...FormData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
      useRef: auth.currentUser.uid,
    };
    delete FormDataCopy.images;
    !FormDataCopy.offer && delete FormDataCopy.discountedPrice;
    delete FormDataCopy.latitude;
    delete FormDataCopy.longitude;
    const docRef = await addDoc(collection(db, "listings"), FormDataCopy);
    setLoading(false);
    toast.success("listing created");
    navigate(`/category/${FormDataCopy.type}/${docRef.id}`);
  }

  const [FormData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    Address: "",
    Description: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    longitude: 0,
    latitude: 0,
    images: {},
  });
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    Address,
    Description,
    offer,
    regularPrice,
    discountedPrice,
    longitude,
    latitude,
    images,
  } = FormData;
  if (loading) {
    return <Spinner />;
  }
  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold">Create Listing</h1>
      <form onSubmit={onSubmit}>
        <p className="text-lg mt-6 font-semibold">sell or rent</p>
        <div className="flex">
          <button
            onClick={onChange}
            type="button"
            className={`mr-3 px-7 py-3 uppercase font-medium text-sm shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              type === "rent"
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}
            id="type"
            value="sale"
          >
            Sell
          </button>
          <button
            onClick={onChange}
            type="button"
            className={`ml-3 px-7 py-3 uppercase font-medium text-sm shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              type === "sale"
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}
            id="type"
            value="rent"
          >
            Rent
          </button>
        </div>
        <p className="text-lg font-semibold mt-6 ">Name</p>
        <input
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:slate-600 mb-6"
          type="text"
          value={name}
          id="name"
          placeholder="Name"
          maxLength="32"
          minLength="10"
          required
          onChange={onChange}
        />
        <div className="flex space-x-6 mb-6">
          <div>
            <p className="text-xl font-semibold">Beds</p>
            <input
              type="number"
              id="bedrooms"
              value={bedrooms}
              onChange={onChange}
              min="1"
              max="50"
              required
              className="w-full px-4 py-2 text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
            />
          </div>
          <div>
            <p className="text-xl font-semibold">baths</p>
            <input
              type="number"
              id="bathrooms"
              value={bathrooms}
              onChange={onChange}
              min="1"
              max="50"
              required
              className="w-full px-4 py-2 text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
            />
          </div>
        </div>
        <p className="text-lg mt-6 font-semibold">Parking spot</p>
        <div className="flex">
          <button
            onClick={onChange}
            type="button"
            className={`mr-3 px-7 py-3 uppercase font-medium text-sm shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !parking ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
            id="parking"
            value={true}
          >
            Yes
          </button>
          <button
            onClick={onChange}
            type="button"
            className={`ml-3 px-7 py-3 uppercase font-medium text-sm shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              parking ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
            id="parking"
            value={false}
          >
            No
          </button>
        </div>
        <p className="text-lg mt-6 font-semibold">Furnished</p>
        <div className="flex">
          <button
            onClick={onChange}
            type="button"
            className={`mr-3 px-7 py-3 uppercase font-medium text-sm shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !furnished ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
            id="furnished"
            value={true}
          >
            Yes
          </button>
          <button
            onClick={onChange}
            type="button"
            className={`ml-3 px-7 py-3 uppercase font-medium text-sm shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              furnished ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
            id="furnished"
            value={false}
          >
            No
          </button>
        </div>
        <p className="text-lg font-semibold mt-6 ">Address</p>
        <textarea
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:slate-600 mb-6"
          type="text"
          value={Address}
          id="Address"
          placeholder="Address"
          maxLength="32"
          minLength="10"
          required
          onChange={onChange}
        />
        {!geolocationEnabled && (
          <div className="flex space-x-6 justify-start">
            <div className="">
              <p className="text-lg font-semibold">Latitude</p>
              <input
                type="number"
                id="latitude"
                value={latitude}
                required
                max="180"
                min="-180"
                onChange={onChange}
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:slate-600 mb-6"
              />
            </div>
            <div className="">
              <p className="text-lg font-semibold">Longitude</p>
              <input
                type="number"
                value={longitude}
                required
                id="longitude"
                max="90"
                min="-90"
                onChange={onChange}
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:slate-600 mb-6"
              />
            </div>
          </div>
        )}
        <p className="text-lg font-semibold">Description</p>
        <textarea
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:slate-600 mb-6"
          type="text"
          value={Description}
          id="Description"
          placeholder="Description"
          maxLength="32"
          minLength="10"
          required
          onChange={onChange}
        />
        <p className="text-lg  font-semibold">Offer</p>
        <div className="flex mb-6">
          <button
            onClick={onChange}
            type="button"
            className={`mr-3 px-7 py-3 uppercase font-medium text-sm shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              !offer ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
            id="offer"
            value={true}
          >
            Yes
          </button>
          <button
            onClick={onChange}
            type="button"
            className={`ml-3 px-7 py-3 uppercase font-medium text-sm shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${
              offer ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
            id="offer"
            value={false}
          >
            No
          </button>
        </div>
        <div>
          <p className="text-xl font-semibold">Regular price</p>
          <div className=" flex mb-6 items-center">
            <div className="flex w-full justify-center items-center space-x-6">
              <input
                type="number"
                id="regularPrice"
                value={regularPrice}
                onChange={onChange}
                max="400000"
                min="50"
                required
                className="w-full px-4 py2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-100 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-700 text-center"
              />
              {type === "rent" && (
                <div className="text-md w-full whitespace-nowrap">
                  <p>$ / month</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {offer && (
          <div>
            <p className="text-xl font-semibold">Discounted price</p>
            <div className=" flex mb-6 items-center">
              <div className="flex w-full justify-center items-center space-x-6">
                <input
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={onChange}
                  max="400000"
                  min="50"
                  required={offer}
                  className="w-full px-4 py2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-100 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-700 text-center"
                />
                {type === "rent" && (
                  <div className="text-md w-full whitespace-nowrap">
                    <p>$ / month</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="mb-6">
          <p className="text-xl font-semibold">Images</p>
          <p className="text-gray-600">
            The first Image will be the cover (max 6)
          </p>
          <input
            type="file"
            id="images"
            onChange={onChange}
            required
            multiple
            accept=".jpg,.png,jpeg"
            className="w-full py-5 px-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-gray-600"
          />
        </div>
        <button
          type="submit"
          className="mb-6 w-full px-7 py-3 bg-blue-600 font-medium text-white uppercase text-sm rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          create listing
        </button>
      </form>
    </main>
  );
}
