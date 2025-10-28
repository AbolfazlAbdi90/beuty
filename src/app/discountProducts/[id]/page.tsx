"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Cart from "@/app/component/addcart";

interface DiscountProduct {
  id: number;
  title: string;
  image: string;
  price: number;
  discount: number;
  description: string;
}

async function fetchProduct(id: string): Promise<DiscountProduct> {
  const res = await fetch("/api/discountProducts");
  if (!res.ok) throw new Error("Failed to fetch products");

  const products: DiscountProduct[] = (await res.json()) as DiscountProduct[];
  const product = products.find((p) => p.id === Number(id));

  if (!product) throw new Error("Product not found");
  return product;
}

export default function DiscountProductPage({ params }: { params: { id: string } }) {
  const { data: product, isLoading, error } = useQuery<DiscountProduct, Error>({
    queryKey: ["product", params.id],
    queryFn: () => fetchProduct(params.id),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error || !product) return <p>Product not found</p>;

  const discountedPrice = product.price - (product.price * product.discount) / 100;

  return (
    <div className="flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-12 max-w-4xl w-full overflow-hidden">
        <div className="md:col-span-5 flex justify-center items-center bg-gray-100">
          <Image
            src={product.image}
            alt={product.title}
            width={600}
            height={600}
            className="w-full h-64 md:h-full object-cover"
          />
        </div>
        <div className="md:col-span-7 p-6 flex flex-col justify-center text-center md:text-right">
          <h1 className="text-2xl font-bold text-gray-800">{product.title}</h1>
          <p className="text-gray-500 line-through mt-2">{product.price.toLocaleString("fa-IR")} تومان</p>
          <p className="text-pink-600 text-2xl font-semibold mt-1">{discountedPrice.toLocaleString("fa-IR")} تومان</p>
          <p className="text-green-600 font-bold mt-1">{product.discount}% تخفیف</p>
          <p className="text-gray-600 text-sm mt-4 leading-relaxed">{product.description}</p>
          <Cart />
        </div>
      </div>
    </div>
  );
}
