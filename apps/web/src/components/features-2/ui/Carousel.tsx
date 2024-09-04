import Image from 'next/image';
import React, { FC, useState, useRef, useEffect, useCallback } from 'react';
import { Modal } from './Modal';

interface CarouselProps {
  images?: string[];
  tLayout?: 'flex-col' | 'flex-row' | 'flex-wrap';
  maxDefaultShow?: number;
}

const Carousel: FC<CarouselProps> = ({
  images = [],
  tLayout = 'flex-col',
  maxDefaultShow,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [intervalTime, setIntervalTime] = useState<number>(6600); // 6.6 seconds
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollInterval = useRef<NodeJS.Timeout | null>(null);
  const resetTimeout = useRef<NodeJS.Timeout | null>(null);

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

  const handleImageClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const startAutoScroll = () => {
    scrollInterval.current = setInterval(() => {
      handleRightArrow();
    }, intervalTime);
  };

  const stopAutoScroll = () => {
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
    }
  };

  const resetAutoScroll = () => {
    stopAutoScroll();
    startAutoScroll();
  };

  const extendInterval = () => {
    setIntervalTime(10000); // 10 seconds
    resetAutoScroll();
    if (resetTimeout.current) {
      clearTimeout(resetTimeout.current);
    }
    resetTimeout.current = setTimeout(() => {
      setIntervalTime(6600); // back to 6.6 seconds
      resetAutoScroll();
    }, 10000);
  };

  const handleLeftArrow = useCallback(() => {
    if (scrollRef.current) {
      const scrollAmount = -300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      if (scrollRef.current.scrollLeft === 0) {
        scrollRef.current.scroll({ left: scrollRef.current.scrollWidth, behavior: 'smooth' });
      }
    }
    extendInterval();
  }, []);

  const handleRightArrow = useCallback(() => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      if (scrollRef.current.scrollLeft + scrollRef.current.clientWidth >= scrollRef.current.scrollWidth) {
        scrollRef.current.scroll({ left: 0, behavior: 'smooth' });
      }
    }
    extendInterval();
  }, []);

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, []);

  return (
    <div className={`h-full w-full flex justify-center ${tLayout}`}>
      <div
        className={`carousel relative justify-center items-center ${
          tLayout === 'flex-wrap' ? 'max-w-full w-full lg:max-w-3xl' : ''
        }`}
      >
        <div
          className={`flex items-center justify-center ${
            tLayout === 'flex-wrap' ? 'max-w-full w-full' : 'max-w-md'
          }`}
        >
          <div
            className={`absolute items-center top-1/2 flex -translate-y-1/2 transform justify-center w-full ${
              tLayout === 'flex-wrap' ? 'max-w-full' : 'max-w-md'
            }`}
          >
            <div
              className={`justify-between flex ${
                tLayout === 'flex-wrap' ? 'max-w-full ' : 'max-w-md '
              } w-full`}
            >
              <button
                onClick={handlePrev}
                className="btn btn-circle border-none bg-opacity-20"
              >
                ❮
              </button>
              <button
                onClick={handleNext}
                className="btn btn-circle border-none bg-opacity-20"
              >
                ❯
              </button>
            </div>
          </div>
          {displayedImages.length > 0 ? (
            displayedImages.map((image, index) => (
              <button
                key={index}
                onClick={handleImageClick}
                className={`bg-white ${
                  index === currentSlide ? 'block' : 'hidden'
                }`}
              >
                <Image
                  src={image}
                  className="min-[1310px]:w-[80vw] w-full h-auto aspect-square object-scale-down"
                  alt={`Slide ${index + 1}`}
                  width={1800}
                  height={1200}
                  priority
                />
              </button>
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p>No images available</p>
            </div>
          )}
        </div>
      </div>

      {images.length > 0 && (
        <div className="my-5 items-center self-center w-full max-w-lg flex justify-center">
          <div className="flex flex-wrap justify-center gap-2 py-2 mx-5 items-center">
            <button
              onClick={handleLeftArrow}
              className="btn btn-circle border-none bg-opacity-20">
              {"❮"}
            </button>
            <div
              ref={scrollRef}
              className="carousel carousel-center max-w-lg overflow-x-auto space-x-4 bg-transparent h-auto">
              {displayedImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`aspect-square ${
                    currentSlide === index
                      ? 'outline outline-2 outline-offset-2'
                      : ''
                  }`}
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
            </div>
            <button
              onClick={handleRightArrow}
              className="btn btn-circle border-none bg-opacity-20">
              {"❯"}
            </button>
          </div>
        </div>
      )}

      {/* Modal for showing full image */}
      <Modal useTCustomContentWidthClass="max-w-4xl" show={isModalOpen} onClose={handleCloseModal}>
        <div className="flex justify-center ">
          <Image
            src={images[currentSlide]}
            className="w-full h-auto aspect-square object-scale-down"
            alt={`Full Slide ${currentSlide + 1}`}
            width={1800}
            height={1200}
            priority
          />
        </div>
      </Modal>
    </div>
  );
};

export default Carousel;
