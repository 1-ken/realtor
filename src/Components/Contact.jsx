import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { toast } from "react-toastify";

export default function Contact({ useRef, listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    async function getLandlord() {
      const docRef = doc(db, "users", useRef);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error("could not get the landlord data");
      }
    }
    getLandlord();
  }, [useRef]);
  function onChange(e) {
    setMessage(e.target.value);
  }
  return (
    <>
      {landlord !== null && (
        <div className="flex flex-col w-full mt-6">
          <p>
            Contact {landlord.name.toLowerCase()} for the{" "}
            {listing.name.toLowerCase()}
          </p>
          <div className="mt-3 mb-6">
            <textarea
              name="message"
              id="message"
              rows="2"
              value={message}
              onChange={onchange}
              className="w-full px-4 py-2  text-xl bg-white border border-gray-300 rounded transition ease-in-out focus:text-gray-700 focus:border-slate-600"
            />
          </div>
          <a
            href={`mailto:${landlord.email}?subject=${listing.name}&body=${message}`}
          >
            <button
              className="px-7 py-3 bg-blue-600 text-white rounded text-sm uppercase shadow-md hover:bg-blue-700 hover:shadow-lg transition duration-150 ease-in-out w-full text-center mb-6"
              type=""
            >
              send message
            </button>
          </a>
        </div>
      )}
    </>
  );
}
