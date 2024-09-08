"use client";

import Radio from "../ui/Radio"; 
import CommonResultInterface from "@/interfaces/CommonResultInterface";
import { ProductCategoryInterface } from "@/interfaces/ProductInterface";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/queryKeys";
import { getProductCategoryList } from "@/actions/categories";

export default function () {
  const { data }  = useQuery({
    queryKey: [queryKeys.productCategories],
    queryFn: getProductCategoryList,
  })
  return (
    <>
      <Radio defaultChecked={true} value={"all"} >
        All
      </Radio>
      {(data as CommonResultInterface<ProductCategoryInterface[]>)?.data?.map((e, i) => {
        return (
          <Radio key={i} value={e.name} >
            {e.display_name}
          </Radio>
        );
      })}
    </>
  );
}
