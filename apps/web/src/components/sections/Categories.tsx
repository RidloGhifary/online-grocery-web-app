"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProductCategoryList } from "@/actions/categories";
import { queryKeys } from "@/constants/queryKeys";

export default function Categories() {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: [queryKeys.productCategories],
    queryFn: () => getProductCategoryList({}),
  });

  if (isLoading)
    return (
      <div className={`flex items-center gap-3 justify-center`}>
        <div className="skeleton h-14 w-32 md:w-40 lg:w-48"></div>
      </div>
    );

  if (!data) return null;
  return (
    <div className="flex w-full items-center justify-center">
      <ul className="menu menu-horizontal rounded-box bg-primary text-white">
        {data?.data?.data?.slice(0, 5).map((category) => (
          <li
            onClick={() => router.push(`/products?category=${category.name}`)}
            key={category.id}
          >
            <a>{category.display_name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
