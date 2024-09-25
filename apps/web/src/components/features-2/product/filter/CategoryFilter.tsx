"use client";

import { MouseEventHandler } from "react";
import Radio from "../../ui/Radio";
import { useProductCategory } from "@/hooks/publicProductCategoriesHooks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function CategoryFilter() {
  const { data } = useProductCategory();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSelect: MouseEventHandler<HTMLInputElement> = (e) => {
    const params = new URLSearchParams(searchParams.toString());
    const selectedCategory = e.currentTarget.value;

    if (selectedCategory === "all") {
      params.delete("category");
    } else {
      params.set("category", selectedCategory);
    }
    params.set("page", '1');
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <Radio
        defaultChecked={!searchParams.get("category")}
        value="all"
        action={handleSelect}
      >
        All
      </Radio>
      {data?.data?.data?.map((category, index) => (
        <Radio
          defaultChecked={searchParams.get("category") === category.name}
          key={index}
          value={category.name}
          action={handleSelect}
        >
          {category.display_name}
        </Radio>
      ))}
    </>
  );
}
