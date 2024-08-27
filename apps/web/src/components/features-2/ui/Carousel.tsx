import Image from 'next/image';
import React, { FC, useState, MouseEvent } from 'react';

interface CarouselProps {
  images?: string[];
  tLayout?: 'flex-col' | 'flex-row' | 'flex-wrap';
  moreAction?: (event?: MouseEvent) => void;
  maxDefaultShow?: number;
}

const Carousel: FC<CarouselProps> = ({
  images = [],
  tLayout = 'flex-col',
  moreAction,
  maxDefaultShow,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const displayCount = maxDefaultShow
    ? Math.min(maxDefaultShow, images.length)
    : images.length;

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? displayCount - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === displayCount - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const displayedImages = maxDefaultShow
    ? images.slice(0, maxDefaultShow)
    : images;

  return (
    <div className={`h-full w-full flex justify-center ${tLayout}`}>
      <div
        className={`carousel relative justify-center items-center ${tLayout === 'flex-wrap' ? 'max-w-full w-full' : ''}`}
      >
        
        {/* <div className="flex items-center justify-center">
          <button onClick={handlePrev} className="btn btn-circle btn-sm mr-2">
            ❮
          </button>
        </div> */}

        <div
          className={`flex items-center justify-center ${tLayout === 'flex-wrap' ? 'max-w-full w-full' : 'max-w-md'} `}
        >
          <div className={`absolute  items-center  top-1/2 flex -translate-y-1/2 transform justify-center w-full ${tLayout === 'flex-wrap' ? 'max-w-full ' : 'max-w-md '}`}>
          <div className={`justify-between flex ${tLayout === 'flex-wrap' ? 'max-w-full ' : 'max-w-md '} w-full`}>
            <button onClick={handlePrev} className="btn btn-circle ">
              ❮
            </button>
            <button onClick={handleNext} className="btn btn-circle ">
              ❯
            </button>
          </div>
        </div>
          {displayedImages.length > 0 ? (
            displayedImages.map((image, index) => (
              <div
                key={index}
                className={`w-full ${index === currentSlide ? 'block' : 'hidden'}`}
              >
                <Image
                  src={image}
                  className="min-[1100px]:w-[50vw] w-full h-auto aspect-[6/4] object-scale-down"
                  alt={`Slide ${index + 1}`}
                  width={828}
                  height={828}
                  priority
                />
              </div>
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p>No images available</p>
            </div>
          )}
        </div>
        {/* <div className="flex items-center justify-center">
          <button onClick={handleNext} className="btn btn-circle btn-sm ml-2">
            ❯
          </button>
        </div> */}
      </div>

      {images.length > 0 && (
        <div className=" my-5 items-center self-center">
          <div className="flex flex-wrap max-w-md justify-center gap-2 py-2 mx-5 items-center">
            {displayedImages.map((image, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`aspect-square ${currentSlide === index ? 'outline outline-2 outline-offset-2' : ''}`}
              >
                <Image
                  src={image}
                  className="max-w-12 h-auto object-scale-down aspect-square"
                  alt={`Slide ${index + 1}`}
                  width={100}
                  height={100}
                  quality={15}
                  priority
                />
              </button>
            ))}
            {maxDefaultShow && images.length > maxDefaultShow && (
              <button onClick={moreAction} className={`max-w-20 btn btn-ghost`}>
                more
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Carousel;
