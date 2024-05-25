import { getAuth } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [FormData, setFormData] = useState({
    name: "keen",
    email: "kennicmwimu@gmail.com",
  });
  const { name, email } = FormData;
  function onLogout (){
    auth.signOut();
    navigate("/");
  }

  return (
    <>
      <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
        <h1 className="text-3xl  text-center mt-6 font-bold ">My Profile</h1>
        <div className="w-full md:w-[50%] mt-6 px-3">
          <form>
            {/*name input*/}
            <input
              disabled
              id="name"
              type="text"
              value={name}
              className="w-full px-4 py-6 text-xl text-gray-700 bg-white  border-gray-300 rounded transition ease-in-out mb-6"
            />
            {/*email input*/}

            <input
              disabled
              id="email"
              type="text"
              value={email}
              className="w-full px-4 py-6 text-xl text-gray-700 bg-white  border-gray-300 rounded transition ease-in-out mb-6"
            />

            <div className="flex justify-between whitespace-nowrap text-sm  sm:text-lg">
              <p className="flex items-center">
                Do you want to change your name
                <span className="text-red-600 hover:text-red-700 cursor-pointer transition ease-in-out duration-200 ">
                  Edit
                </span>
              </p>
              <p onClick={onLogout} className="text-blue-600 hover:to-blue-700 transition duration-200 ease-in-out cursor-pointer">
                Sign Out
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
