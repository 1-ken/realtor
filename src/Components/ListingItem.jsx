import React from "react";
import Moment from "react-moment";
import { MdLocationOn } from "react-icons/md";
import { Link } from "react-router-dom";

export default function ListingItem({ listing, id }) {
  return (
    <li className="relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 m-[10px]">
      <Link className="contents" to={`category ${listing.type}/${id}`}>
        <img
          className="h-[170px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in-out"
          loading="lazy"
          src={listing.imgUrls[0]}
          alt=""
        />
        <Moment
          className="absolute top-2 left-21 bg-[#3377cc] text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg"
          fromNow
        >
          {listing.timestamp?.toDate()}
        </Moment>
        <div className="w-full p-[10px]">
          <div className="flex items-center space-x-1">
            <MdLocationOn className="text-green-600 h-4 w-4" />
            <p className="font-semibold text-gray-600 truncate text-sm mb-[2px]">
              {listing.Address}
            </p>
          </div>
          <p className="font-semibold m-0 text-xl truncate">{listing.name}</p>
          <p className="text-[#457b9d] font-semibold mt-2">
            {listing.offer
              ? `Ksh ${listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
              : `Ksh ${listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`}
            {listing.type === "rent" && " / month"}
          </p>

          <div className="flex items-center space-x-3">
            <div>
              <p className="font-bold text-sm">
                {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
              </p>
            </div>
            <div>
              <p className="font-bold text-sm">
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Baths`
                  : "1 Bath"}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
}
