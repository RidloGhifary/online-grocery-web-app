"use client";

import React, { useEffect, useState } from "react";
import PublicProductDetail from "@/components/features-2/product/PublicProductDetail";
import CarouselWithThumb from "@/components/features-2/ui/CarouselWithThumb";
import { useParams } from "next/navigation";
import { getProductById } from "@/api/products/route";

export default function Page() {
  const { id } = useParams() as { id: string };
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  console.log("Retrieved ID from useParams:", id);

  useEffect(() => {
    if (!id) {
      console.error("Product ID is undefined");
      setError("Product ID is missing");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await getProductById(Number(id));
        setProduct(response?.data);
      } catch (err) {
        console.error("Failed to load product data:", err);
        setError("Failed to load product data");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>No product found</div>;
  }

  return (
    <div className="w-full max-w-full items-center justify-center">
      <div className="flex w-full max-w-full flex-wrap justify-center">
        <div className="w-full max-w-xl">
          <CarouselWithThumb images={[product.image]} />
        </div>
        <PublicProductDetail product={product} />
      </div>
    </div>
  );
}
