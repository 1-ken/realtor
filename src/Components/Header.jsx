import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

export default function Header() {
  const [pageState, setPageState] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth,(user)=>{
      if(user){
        setPageState("profile")
      }else{
        setPageState("Sign In")
      }
    });
  });
  function pathMathRoute(route) {
    if (route === location.pathname) {
      return true;
    }
  }
  return (
    <div className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div>
        <header className="flex justify-between items-center px-3 max-w-6xl mx-auto">
          <div>
            <img
              onClick={() => navigate("/")}
              src="https://static.rdc.moveaws.com/rdc-ui/logos/logo-brand.svg"
              alt="logo"
              className="h-5 cursor-pointer"
            />
          </div>
          <div>
            <ul className="flex space-x-10">
              <li
                onClick={() => navigate("/")}
                className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${
                  pathMathRoute("/") && "text-black border-b-red-500"
                }`}
              >
                Home
              </li>
              <li
                onClick={() => navigate("/Offers")}
                className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${
                  pathMathRoute("/Offers") && "text-black border-b-red-500"
                }`}
              >
                Offers
              </li>
              <li
                onClick={() => navigate("/profile")}
                className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${
                  (pathMathRoute("/profile") || pathMathRoute("/sign-in")) &&
                  "text-black border-b-red-500"
                }`}
              >
                {pageState}
              </li>
            </ul>
          </div>
        </header>
      </div>
      <div></div>
    </div>
  );
}
