"use client";

import Radio from "../ui/Radio"; 
import { useQuery } from "@tanstack/react-query";
import CommonResultInterface from "@/interfaces/CommonResultInterface";
import { ProductCategoryMockInterface } from "@/mocks/productCategory";
import { adminQueryKey } from "@/constants/adminQueryKeys";
import { getProductCategoryList } from "@/actions/categories";

export default function () {
  const { data }  = useQuery({
    queryKey:[adminQueryKey.adminProductCategories],
    queryFn : async () => await getProductCategoryList()
  }) 
  return (
    <>
      
      <Radio defaultChecked={true} value={"all"} >
        All
      </Radio>
      {(data as CommonResultInterface<ProductCategoryMockInterface[]>)?.data?.map((e, i) => {
        return (
          <Radio key={i} value={e.name} >
            {e.display_name}
          </Radio>
        );
      })}
    </>
  );
}
