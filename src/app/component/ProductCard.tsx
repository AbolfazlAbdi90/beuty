'use client';

import Image from "next/image";
import Link from "next/link";
interface IProduct{
  id:number;
  title:string;
  price:number;
  image:string
}
export default function ProductCard({ product }: { product: IProduct }) {
  return (
    <Link
      href={`/famousProducts/${product.id}`}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden cursor-pointer"
    >
      <div className="flex justify-center">
        <Image
        src={product.image}
        alt={product.title}
        width={300}
        height={0}
        className="w-full h-40 md:h-45 md:w-40 text-center "
      />
      </div>
      
      <div className="p-3 text-center">
        <h3 className="text-2xl  font-bold text-gray-800">{product.title}</h3>
        <p className="text-pink-500 font-semibold mt-1">
          {product.price.toLocaleString("fa-IR")} تومان
        </p>
      </div>
    </Link>
  );
}
