import { products } from '@/mocks/productData';
import Card from '../ui/Card';

export default function PublicProductList() {
  return (
    <>
      <div className="flex flex-wrap gap-5 justify-center lg:gap-5 mx-[0.6rem] sm:mx-5">
        {products.map((e, i) => (
          <Card extraCardCSSClassName='lg:w-56 sm:w-44' baseSizeClassName='w-36 h-auto' key={i} />
        ))}
      </div>
    </>
  );
}
