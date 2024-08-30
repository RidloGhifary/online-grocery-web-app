import AdminProductTable from "@/components/features-2/layouts/admin/AdminProductTable";
import { products } from "@/mocks/productData";
import Image from "next/image";

export default function () {
  return (
    <>
      <div className="bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]">
        <AdminProductTable products={products} />
      </div>
    </>
  );
}
