// components/CarouselWithThumb.tsx
import React, { CSSProperties, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "./css/carouselFeat2.css";
import Image from "next/image";

const CarouselWithThumb: React.FC<{ images?: string[] | null }> = ({
  images 
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const ifNotEnoughImage: string[] = [];
  let usedImg: string[] = images!
  let imgExist = false
  if (images && images.length>0) {
    imgExist = true
    if (images.length < 4) {
      ifNotEnoughImage.push(...images);
      ifNotEnoughImage.push(...images);
      ifNotEnoughImage.push(...images);
      ifNotEnoughImage.push(...images);
      ifNotEnoughImage.push(...images);
      usedImg = ifNotEnoughImage
    }
  } else {
    images = [
      "https://placehold.co/400x400.svg",
      "https://placehold.co/600x400.svg",
      "https://placehold.co/400x400.svg",
    ],
    ifNotEnoughImage.push(...images);
    ifNotEnoughImage.push(...images);
    ifNotEnoughImage.push(...images);
    ifNotEnoughImage.push(...images);
    usedImg = ifNotEnoughImage
  }

  return (
    <div className="w-full">
      <Swiper
        style={
          {
            "--swiper-navigation-color": "#2a2e33",
            "--swiper-pagination-color": "#2a2e33",
          } as CSSProperties
        }
        loop={true}
        spaceBetween={10}
        navigation={true}
        thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2 h-80 rounded-lg"
      >
        {usedImg.map((src, index) => (
          <SwiperSlide key={index} >
            <Image
              src={src}
              alt={`Image ${index + 1}`}
              className="aspect-square w-full object-scale-down rounded-lg"
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
            "--swiper-navigation-color": "#2a2e33",
            "--swiper-pagination-color": "#2a2e33",
          } as CSSProperties
        }
      >
        {usedImg.map((src, index) => (
          <SwiperSlide
            key={index}
            className="cursor-pointer opacity-40 hover:opacity-100"
          >
            <Image
              width={50}
              height={50}
              quality={15}
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

export default CarouselWithThumb;
