import React from "react";
import { ProductCategoryInterface } from "@/interfaces/ProductInterface";
import ButtonWithAction from "../ui/ButtonWithAction";
import { FaEdit, FaInfoCircle, FaTrash } from "react-icons/fa";

interface ProductCategoryTableProps {
  categories?: ProductCategoryInterface[]; // Made categories optional
}

export default function ({ categories = [] }: ProductCategoryTableProps) { // Default to empty array
  return (
    <div className="overflow-x-auto">
      <table className="table w-full text-base">
        <thead>
          <tr>
            <th className="text-lg font-extrabold">Display Name</th>
            <th className="text-lg font-extrabold max-[1024px]:hidden">Category Name</th>
            <th className="text-lg font-extrabold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center">No categories available</td>
            </tr>
          ) : (
            categories.map((category) => (
              <tr key={category.id}>
                <td>{category.display_name || "N/A"}</td>
                <td className="max-[1024px]:hidden">{category.name}</td>
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
