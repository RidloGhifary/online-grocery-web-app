import { products } from "@/mocks/productData";
import ProductCardF2 from "../ui/ProductCardF2";

export default function PublicProductList() {
  return (
    <>
      <div className="mx-[0.6rem] sm:flex sm:flex-wrap grid grid-cols-2 justify-center sm:gap-5 sm:mx-5 ">
        {products.map((e, i) => (
          // <Card extraCardCSSClassName='lg:w-56 sm:w-44' baseSizeClassName='w-36 h-auto' key={i} />
          // <ProductCard/>
          <div className="flex items-center justify-center my-2" key={i}>
          <ProductCardF2  />
          </div>
        ))}
      </div>
    </>
  );
}
