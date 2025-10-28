// app/products/ShowMoreButton.tsx
"use client";
import { useState } from "react";
import ProductCard from "./ProductCard";

export default function ShowMoreButton({ products }: { products: any[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? products : products.slice(0, 8);

  return (
    <>
      {showAll && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {products.slice(8).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
      <button
        onClick={() => setShowAll(!showAll)}
        className="mt-6 px-6 py-2 bg-pink-600 text-white rounded-full hover:bg-pink-700"
      >
        {showAll ? "بستن" : "نمایش همه محصولات"}
      </button>
    </>
  );
}
