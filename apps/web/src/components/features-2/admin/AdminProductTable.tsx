import React from "react";
import Image from "next/image";
// import { productDefault as products } from "@/mocks/productData";
import { FaInfoCircle } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { ProductCompleteInterface } from "@/interfaces/ProductInterface";
import ButtonWithAction from "../ui/ButtonWithAction";

export default function ({
  products,
}: {
  products: ProductCompleteInterface[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full text-base">
        <thead>
          <tr>
            <th className="text-lg font-extrabold">Product</th>
            <th className="hidden text-lg font-extrabold sm:table-cell">SKU</th>
            <th className="hidden text-lg font-extrabold sm:table-cell">
              Category
            </th>
            <th className="hidden text-lg font-extrabold md:table-cell">
              Stock
            </th>
            <th className="hidden text-lg font-extrabold md:table-cell">
              Unit
            </th>
            <th className="hidden text-lg font-extrabold md:table-cell">
              Price
            </th>
            <th className="text-lg font-extrabold">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <div className="flex min-w-40 flex-col items-start justify-start sm:flex-row sm:items-center sm:space-x-4">
                  <Image
                    src={product.image || "https://via.placeholder.com/150"}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="hidden rounded-md sm:table-cell"
                  />
                  {/* {product.name} */}
                  <span>{product.name}</span>
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
                  <ButtonWithAction replaceTWClass="btn btn-info btn-sm">
                    <FaInfoCircle />
                  </ButtonWithAction>
                  <ButtonWithAction replaceTWClass="btn btn-accent btn-sm">
                    <FaEdit />
                  </ButtonWithAction>
                  <ButtonWithAction replaceTWClass="btn btn-error btn-sm">
                    <FaTrash />
                  </ButtonWithAction>
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
