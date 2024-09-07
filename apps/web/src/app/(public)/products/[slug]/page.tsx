'use client'
import React from "react";
import CarouselWithThumb from "@/components/features-2/ui/CarouselWithThumb";
import { useQuery } from "@tanstack/react-query";
import { notFound, useParams } from "next/navigation";
import { getSingleProduct } from "@/actions/products";
import { ProductCompleteInterface } from "@/interfaces/ProductInterface";
import PublicProductDetailV2 from "@/components/features-2/product/PublicProductDetailV2";

export default function Page() {
  const { slug } = useParams<{ slug: string }>();

  const { isLoading, error, data: product } = useQuery({
    queryKey: ['publicProduct', slug],
    queryFn: async () => {
      const response = await getSingleProduct({ slug });
      
      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    },
    retry: 1,
    enabled: !!slug, // Only run the query if slug is defined
  });

  if (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage.includes('404')) {
      return notFound();
    }
    return <div>{errorMessage}</div>;
  }

  return (
    <div className="w-full max-w-full items-center justify-center">
      <div className="flex w-full max-w-full flex-wrap justify-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]">
        <div className="w-full max-w-xl">
          {product?.data ? <CarouselWithThumb images={[]} /> : <div className="flex w-full justify-center py-5">
        {/* <div className="w-full max-w-xl">
          {product?.data ? <CarouselWithThumb images={[]} /> : <div className="flex w-full justify-center py-5"> */}
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>}
        </div>
        <div className="w-full max-w-xl">
          <PublicProductDetailV2 
            productDetail={product?.data as ProductCompleteInterface} 
            isLoading={isLoading} 
          />
        </div>
      </div>
    </div>
  );
}
