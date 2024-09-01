// components/CarouselWithThumbs.tsx
import React, { CSSProperties, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "./css/carouselFeat2.css";
import Image from "next/image";
import { productDefault as products } from "@/mocks/productData";

const CarouselWithThumbs: React.FC = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  //   const images = [
  //     "https://swiperjs.com/demos/images/nature-1.jpg",
  //     "https://swiperjs.com/demos/images/nature-2.jpg",
  //     "https://swiperjs.com/demos/images/nature-3.jpg",
  //     "https://swiperjs.com/demos/images/nature-4.jpg",
  //     "https://swiperjs.com/demos/images/nature-5.jpg",
  //     "https://swiperjs.com/demos/images/nature-6.jpg",
  //     "https://swiperjs.com/demos/images/nature-7.jpg",
  //     "https://swiperjs.com/demos/images/nature-8.jpg",
  //     "https://swiperjs.com/demos/images/nature-9.jpg",
  //     "https://swiperjs.com/demos/images/nature-10.jpg",
  //   ];
  const images = products
    .map((e) => e.image)
    .filter((image): image is string => image !== null);

  return (
    <div className="w-full">
      <Swiper
        style={
          {
            "--swiper-navigation-color": "#fff",
            "--swiper-pagination-color": "#fff",
          } as CSSProperties
        }
        loop={true}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2 h-80"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <Image
              src={src}
              alt={`Image ${index + 1}`}
              className="aspect-square w-full object-scale-down"
              width={800}
              height={800}
              priority
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        onSwiper={setThumbsSwiper}
        loop={true}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper mt-3 h-20"
        navigation={true}
        style={
          {
            "--swiper-navigation-color": "#fff",
            "--swiper-pagination-color": "#fff",
          } as CSSProperties
        }
      >
        {images.map((src, index) => (
          <SwiperSlide
            key={index}
            className="cursor-pointer opacity-40 hover:opacity-100"
          >
            <Image
              width={100}
              height={100}
              quality={25}
              src={src}
              alt={`Thumbnail ${index + 1}`}
              className="aspect-square w-full object-scale-down"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CarouselWithThumbs;
