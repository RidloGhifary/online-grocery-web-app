"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "@/components/css/hero-section-swiper.css";

export default function Hero() {
  return (
    <div className="grid pb-10 pt-6 lg:place-content-center">
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        loop={true}
        grabCursor={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        navigation={true}
        modules={[Autoplay, Navigation]}
        className="mySwiper"
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <SwiperSlide key={index}>
            <Image
              width={1000}
              height={1000}
              src={`/banners/${index + 1}.png`}
              alt="Placeholder"
              className="h-full w-full object-cover"
              priority
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
