import React, { MouseEvent } from "react";
import ButtonWithAction from "../ui/ButtonWithAction";
import { FaEdit, FaInfoCircle, FaTrash } from "react-icons/fa";
import { CategoryInterface } from "@/interfaces/CategoryInterface";
import { useAtom } from "jotai";
import { currentDetailCategorysAtom, currentProductCategoryOperation } from "@/stores/productCategoryStores";

interface ProductCategoryTableProps {
  categories?: CategoryInterface[]; // Made categories optional
}

export default function ({ categories = [] }: ProductCategoryTableProps) { // Default to empty array
  // console.log(categories);

  const [, setCurrenctCategory] = useAtom(currentDetailCategorysAtom)
  const [, setProductOperation] = useAtom(currentProductCategoryOperation)

  function handleEdit(e:MouseEvent) {
    e.preventDefault()
    const currentId = Number(e.currentTarget.id)
    const currentData = categories.filter(category=>category.id == currentId )[0]
    setCurrenctCategory(currentData)
    setProductOperation('edit')
  }
  function handleDelete(e:MouseEvent) {
    e.preventDefault()
    const currentId = Number(e.currentTarget.id)
    const currentData = categories.filter(category=>category.id == currentId )[0]
    setCurrenctCategory(currentData)
    setProductOperation('delete')
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="table w-full text-base">
        <thead>
          <tr>
            <th className="text-lg font-extrabold">Display Name</th>
            <th className="text-lg font-extrabold ">Category Name</th>
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
                <td className="">{category.name}</td>
                <td>
                <div className="flex flex-wrap gap-2 ">
                  <ButtonWithAction replaceTWClass="btn btn-accent btn-sm" action={handleEdit} eventType="onClick" type="button" id={category.id}>
                    <FaEdit />
                  </ButtonWithAction>
                  <ButtonWithAction replaceTWClass="btn btn-error btn-sm" id={category.id}  action={handleDelete} eventType="onClick" type="button">
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
