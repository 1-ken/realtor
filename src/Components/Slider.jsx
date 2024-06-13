import React from "react";
import { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import Spinner from "./Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from "swiper";
import "swiper/css/bundle";
import { useNavigate } from "react-router";
export default function Slider() {
  SwiperCore.use(Autoplay, Navigation, Pagination);
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchListing() {
      const listingRef = collection(db, "listings");
      const q = query(listingRef, orderBy("timestamp", "desc"), limit(10));
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
    fetchListing();
  }, []);
  if (loading) {
    return <Spinner />;
  }
  if (listings.length === 0) {
    return <></>;
  }
  return (
    listings && (
      <>
        <Swiper
          autoplay={{ delay: 3000 }}
          navigation
          slidesPerView={1}
          pagination={{ type: "progressbar" }}
          modules={[EffectFade]}
        >
          {listings.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <div
                style={{
                  background: `url(${data.imgUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="w-full h-[300px] overflow-hidden"
              ></div>
              <p className="text-[#fafaee] absolute left-1 top-3 font-medium max-w-[90$] bg-[#457b9d] shadow-lg opacity-90 p-2 rounded-tr-3xl">
                {data.name}
              </p>
              <p className="text-[#fafaee] absolute left-1 bottom-1 font-semibold max-w-[90$] bg-[#e63946] shadow-lg opacity-90 p-2 rounded-tr-3xl">
              Ksh
                { data.discountedPrice ?? data.regularPrice}
                {data.type === "rent" && " /month"}
              </p>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  );
}
