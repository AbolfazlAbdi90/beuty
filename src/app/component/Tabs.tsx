"use client";
import { categories } from "../famousProducts/data/products";
import { useState } from "react";

export default function Tabs({ onSelect }: { onSelect: (c: string) => void }) {
  const [active, setActive] = useState(categories[0]);

  return (
<div className="flex overflow-x-auto gap-2 p-2 rounded-lg bg-[#FFF0F7]">
  {categories.map((c) => (
    <button
      key={c}
      onClick={() => {
        setActive(c);
        onSelect(c);
      }}
      className={`px-4 py-2  rounded-full text-sm whitespace-nowrap transition flex-shrink-0 ${
        active === c
          ? "bg-pink-500 text-white"
          : "bg-pink-100 text-pink-600 hover:bg-pink-200"
      }`}
    >
      {c}
    </button>
  ))}
</div>


  );
}
