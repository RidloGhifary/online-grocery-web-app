"use client";

import { MouseEventHandler } from "react";
import Radio from "../../ui/Radio";
import { useProductCategory } from "@/hooks/publicProductCategoriesHooks";
import { usePathname, useRouter } from "next/navigation";

export default function CategoryFilter() {
  const { data } = useProductCategory();
  const router = useRouter();
  const pathname = usePathname();

  const handleSelect: MouseEventHandler<HTMLInputElement> = (e) => {
    const params = new URLSearchParams();
    params.set("category", e.currentTarget.value);
    if (e.currentTarget.value === 'all') {
      params.delete('category')
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      
      <Radio defaultChecked={true} value={"all"} action={handleSelect}>
        All
      </Radio>
      {data?.data?.map((e, i) => {
        return (
          <Radio key={i} value={e.name} action={handleSelect}>
            {e.display_name}
          </Radio>
        );
      })}
    </>
  );
}
