import { products } from '@/mocks/productData';
import Card from '../ui/Card';

export default function PublicProductList() {
  return (
    <>
      <div className="flex flex-wrap gap-5 justify-center">
        {products.map((e) => (
          <Card />
        ))}
      </div>
    </>
  );
}
