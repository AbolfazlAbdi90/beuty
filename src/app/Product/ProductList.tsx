"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "./ProductCard";

interface ProductType {
  id: number;
  name: string;
  image: string;
  price: number;
  description: string;
}

export default function ProductList() {
  const [showAll, setShowAll] = useState(false);

  const { data, isLoading, error } = useQuery<ProductType[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/productList");
      if (!res.ok) throw new Error("خطا در دریافت محصولات");
      return res.json();
    },
  });

  if (isLoading) return <p className="text-center mt-20">در حال بارگذاری...</p>;
  if (error || !data)
    return <p className="text-center mt-20 text-red-500">خطا در دریافت محصولات</p>;

  const productsToShow = showAll ? data : data.slice(0, 8);

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {productsToShow.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="flex justify-center mt-6">
        <button
          className="px-6 py-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "بستن محصولات" : "نمایش همه محصولات"}
        </button>
      </div>
    </div>
  );
}
