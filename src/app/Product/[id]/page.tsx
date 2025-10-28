"use client";

import { useQuery } from "@tanstack/react-query";

import { useParams } from "next/navigation";
import Cart from "@/app/component/addcart";
import Container from "@/app/component/container";
import ProductList from "../ProductList";
import Image from "next/image";

interface IProduct {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
}

const fetchProduct = async (id: string) => {
  const res = await fetch("/api/productList");
  if (!res.ok) throw new Error("خطا در دریافت محصول");
  const products: IProduct[] = await res.json();
  const product = products.find((p) => p.id === Number(id));
  if (!product) throw new Error("محصول پیدا نشد");
  return product;
};

export default function ProductPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data: product, isLoading, error } = useQuery<IProduct>({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id!),
    enabled: !!id, // فقط وقتی id وجود داره fetch کن
  });

  if (!id) return <p className="text-center mt-20">شناسه محصول نامعتبر است</p>;
  if (isLoading) return <p className="text-center mt-20">در حال بارگذاری...</p>;
  if (error || !product)
    return <p className="text-red-500 text-center mt-20">محصول پیدا نشد</p>;

  return (
    <Container>
      <div className="p-6 flex flex-col md:grid md:grid-cols-12 md:gap-6 max-w-5xl mx-auto bg-white rounded-2xl shadow">
      <div className="md:col-span-3 flex justify-center items-center">
        <img
          src={product.image || "/placeholder.png"}
          alt={product.name}
          className="rounded-xl w-full"
        />
      </div>
      <div className="md:col-span-9 flex flex-col justify-center text-center md:text-right">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-pink-600 text-xl mt-2">
          {product.price.toLocaleString("fa-IR")} تومان
        </p>
        <p className="text-gray-600 mt-3">{product.description}</p>
        <div className="mt-4 flex justify-center md:justify-start">
          <Cart />
        </div>
      </div>
    </div>
    <div className="flex items-center justify-between w-full px-4 mt-30">
              <Image
                className="md:mr-[560px]"
                src="/image/image-in-main/logo-inside-container/Vector 7.png"
                alt=""
                width={50}
                height={50}
              />
              <h1 className="font-bold text-2xl text-center">لیست محصولات</h1>
              <Image
                className="md:ml-[560px]"
                src="/image/image-in-main/logo-inside-container/Vector 8.png"
                alt=""
                width={50}
                height={50}
              />
            </div>
     <div className="mt-20" >
      <ProductList />;
     </div>
    </Container>
  );
}
