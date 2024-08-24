"use client";

import ProductCard from "./ProductCard";

export default function ProductsList() {
  return (
    <div className="my-8 space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i}>
            <ProductCard />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <div className="join">
          <button className="btn join-item">«</button>
          <button className="btn join-item">Page 1</button>
          <button className="btn join-item">»</button>
        </div>
      </div>
    </div>
  );
}
