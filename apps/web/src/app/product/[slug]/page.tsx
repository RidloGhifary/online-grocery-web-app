'use client';
import PublicProductDetail from '@/components/features-2/product/PublicProductDetail';
import CarouselWithMaxShow from '@/components/features-2/ui/CarouselWithMaxShow';
import { products } from '@/mocks/productData';

export default function Page() {
  const images = products
    .map((e) => e.image)
    .filter((image): image is string => image !== null);

  return (
    <>
      <div className="max-w-full w-full justify-center items-center">
        <div className="w-full max-w-full flex justify-center flex-col">
          <PublicProductDetail />
          <CarouselWithMaxShow tLayout="flex-wrap" images={images} />
        </div>
      </div>
    </>
  );
}
