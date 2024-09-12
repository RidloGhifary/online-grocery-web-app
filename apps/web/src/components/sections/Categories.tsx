"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProductCategoryList } from "@/actions/categories";

export default function Categories() {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["categories-home-page"],
    queryFn: () => getProductCategoryList(),
  });

  if (isLoading) return <p className="text-center text-sm">Loading...</p>;

  if (!data) return null;
  return (
    <div className="flex w-full items-center justify-center">
      <ul className="menu menu-horizontal rounded-box bg-primary text-white">
        {data?.data?.slice(0, 5).map((category) => (
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
