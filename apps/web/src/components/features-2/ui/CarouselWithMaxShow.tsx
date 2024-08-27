import React, { FC, useState } from 'react';
import Carousel from './Carousel';
import { Modal } from './Modal';

const CarouselWithMaxShow: FC<{
  images: string[];
  tLayout?: 'flex-col' | 'flex-row' | 'flex-wrap';
}> = ({ images, tLayout = 'flex-col' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMoreAction = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="w-full max-w-full">
        <Carousel
          images={images}
          maxDefaultShow={4}
          moreAction={handleMoreAction}
        />
        <Modal useTCustomContentWidthClass='max-w-full' show={isModalOpen} onClose={handleCloseModal}>
          <Carousel tLayout={tLayout} images={images} />
        </Modal>
      </div>
    </>
  );
};

export default CarouselWithMaxShow;
