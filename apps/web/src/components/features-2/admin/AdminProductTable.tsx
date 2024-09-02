import React from "react";
import Image from "next/image";
// import { productDefault as products } from "@/mocks/productData";
import { FaInfoCircle } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { ProductCompleteInterface } from "@/interfaces/ProductInterface";

export default function ({ products }: { products: ProductCompleteInterface[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full text-base">
        <thead>
          <tr>
            <th className="font-extrabold text-lg">Product</th>
            <th className="font-extrabold hidden sm:table-cell text-lg">SKU</th>
            <th className="font-extrabold hidden sm:table-cell text-lg">Category</th>
            <th className="font-extrabold hidden md:table-cell text-lg">Stock</th>
            <th className="font-extrabold hidden md:table-cell text-lg">Unit</th>
            <th className="font-extrabold hidden md:table-cell text-lg">Price</th>
            <th className="font-extrabold text-lg">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <div className="flex flex-col sm:items-center items-start justify-start sm:flex-row sm:space-x-4 min-w-40">
                  <Image
                    src={product.image ?? "https://via.placeholder.com/150"}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="hidden rounded-md sm:table-cell"
                  />
                  {/* {product.name} */}
                  <span >{product.name}</span>
                </div>
              </td>
              <td className="hidden sm:table-cell">{product.sku}</td>
              <td className="hidden sm:table-cell">
                {product.product_category_id}
              </td>
              <td className="hidden md:table-cell">{product.current_stock}</td>
              <td className="hidden md:table-cell">{product.unit}</td>
              <td className="hidden md:table-cell">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(product.price)}
              </td>
              <td>
                <div className="flex flex-wrap gap-2">
                  <button className="btn btn-primary btn-sm"><FaInfoCircle /></button>
                  <button className="btn btn-secondary btn-sm"><FaEdit /></button>
                  <button className="btn btn-error btn-sm"><FaTrash /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// export default ProductTable;
