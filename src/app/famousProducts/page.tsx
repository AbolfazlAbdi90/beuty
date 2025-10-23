"use client";

import { useState } from "react";
import { famousProducts } from "./data/products";
import { categories } from "./data/products";
import ProductCard from "../component/ProductCard";

export default function FamousProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("همه محصولات");
  const [showAll, setShowAll] = useState(false);

  const filteredProducts =
    selectedCategory === "همه محصولات"
      ? famousProducts
      : famousProducts.filter((p) => p.category === selectedCategory);

  // فقط ۴ تا محصول اول اگه showAll=false باشه
  const visibleProducts =
    selectedCategory === "همه محصولات" && !showAll
      ? famousProducts.slice(0, 4)
      : filteredProducts;

  return (
    <div className="p-6 ">
      <div className="flex justify-center ">
        {/* تب‌ها */}
        <div className="flex  overflow-x-auto md:justify-center md:w-[800px] p-1 bg-[#FFF0F7] rounded-2xl h-[44px] gap-3 mb-6 scrollbar-hide md:overflow-visible">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setShowAll(false); // وقتی تب عوض میشه، نمایش همه بسته بشه
              }}
              className={`px-4 cursor-pointer py-2 rounded-full text-sm whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-pink-500 text-white"
                  : "bg-pink-100 text-pink-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* گرید محصولات */}
      <div className="grid grid-cols-2 w-full md:grid-cols-4 gap-4">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* دکمه فقط برای "همه محصولات" */}
      {selectedCategory === "همه محصولات" && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition"
          >
            {showAll ? "بستن محصولات" : "نمایش همه محصولات"}
          </button>
        </div>
      )}
    </div>
  );
}
