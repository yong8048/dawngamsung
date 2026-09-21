"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export const ImageSwiper = ({ urls }: { urls: string[] }) => {
  return (
    <Swiper modules={[Pagination]} pagination={{ clickable: true }} className="h-full w-full">
      {urls.map(url => (
        <SwiperSlide key={url}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="매장 사진" className="h-full w-full object-cover" />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
