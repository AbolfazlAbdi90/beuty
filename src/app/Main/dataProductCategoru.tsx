"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import GlowingSpinner from "./loading";
import DotsSpinner from "./loading";

interface IProductType {
  id: number;
  href: string;
  name: string;
  image: string;
}

export default function DataProductCategoru() {
  const { data: products, isLoading, error } = useQuery<IProductType[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/product");
      if (!res.ok) {
        throw new Error("خطا در دریافت محصولات");
      }
      return res.json();
    },
  });

  if (isLoading) {
    return <DotsSpinner/>
  }

  if (error) {
    return <p className="text-red-500 text-center">خطا در دریافت محصولات</p>;
  }

  return (
    <div className="grid grid-cols-2 mt-4 md:grid-cols-7 p-4 gap-4">
      {products?.map((item) => (
        <Link key={item.id} href={item.href}>
          <div className="p-4 border rounded-[18px] bg-[#FFF0F7] cursor-pointer hover:bg-gray-200">
            <img src={item.image} alt={item.name} className="w-full h-32 object-cover mb-2 "/>
            <h2 className="font-bold text-lg text-center ">{item.name}</h2>
          </div>
        </Link>
      ))}
    </div>
  );
}



// "use client"
// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import Link from "next/link";

// interface IProductType {
//   id: number;
//   href: string;
//   name: string;
//   image: string;
// }
// export default function DataProductCategoru() {
//   const {
//     data: products,
//     isLoading,
//     error,
//   } = useQuery<IProductType[]>({
//     queryKey: ["products"],
//     queryFn: async () => {
//       const res = await fetch("app/api/product/route.ts");
//       if (!res.ok) {
//         throw new Error("خطا در دریافت محصولات ");
//       }
//       return res.json();
//     },
//   });
//   if (isLoading) {
//     return <p className="text-red-500 text-center">Loading ...</p>;
//   }
//   if (error) {
//     return <p className="text-red-500 text-center">خطا در دریافت محصولات </p>;
//   }
//   return (
//     <div className="grid grid-cols-2 md:grid-cols-7 p-4 gap-4 ">
//       {products?.map((item, index) => (
//         <Link key={index} href={`${item.href}`}>
//           <div className="p-4 border rounded bg-gray-100 cursor-pointer hover:bg-gray-200">
//             <img src={`${item.image}`} alt="" />
//             <h2 className="font-bold text-lg">{item.name}</h2>
//           </div>
//         </Link>
//       ))}
//     </div>
//   );
// }
