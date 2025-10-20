"use client";
import { FiShoppingCart } from "react-icons/fi";

interface Props {
  className?: string;
}

export default function CartButton({ className }: Props) {
  return (
    <button
      className={`flex items-center justify-center bg-[#EC6880] text-white p-4 rounded-full hover:bg-pink-600 transition ${className}`}
    >
      <FiShoppingCart size={24} />
    </button>
  );
}
