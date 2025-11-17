"use client";

import Cart from "@/app/component/addcart";
import Container from "@/app/component/container";
import ProductCategoryBox from "@/app/component/productCategory";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

interface IProductType {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
}

async function fetchProduct(id: string): Promise<IProductType> {
  const res = await fetch("/api/product");
  if (!res.ok) throw new Error("خطا در دریافت محصول");
  const products: IProductType[] = await res.json();
  const product = products.find((p) => p.id === Number(id));
  if (!product) throw new Error("محصول پیدا نشد");
  return product;
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const { data: product, isLoading, error } = useQuery<IProductType>({
    queryKey: ["product", params.id],
    queryFn: () => fetchProduct(params.id),
  });

  if (isLoading) return <p className="text-center mt-20">در حال بارگذاری...</p>;
  if (error || !product)
    return <p className="text-red-500 text-center mt-20">محصول پیدا نشد</p>;

  return (
 <Container>
     <div className="flex flex-col items-center justify-center p-6">
      {/* کارت محصول */}
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl overflow-hidden md:max-w-5xl md:grid md:grid-cols-12">
        {/* تصویر سمت چپ در دسکتاپ */}
        <div className="md:col-span-5 flex justify-center items-center bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={400}
            className="w-full h-64 md:h-full object-contain"
          />
        </div>

        {/* اطلاعات سمت راست */}
        <div className="p-6 text-center md:text-right md:col-span-7 flex flex-col justify-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-pink-600 text-xl font-semibold">
            {product.price.toLocaleString("fa-IR")} تومان
          </p>

          <div className="flex justify-center md:justify-start">
            <Cart id={product.id.toString()} />
          </div>
        </div>
      </div>
    
      {/* باکس دسته‌بندی پایین صفحه */}
      <div className="mt-60 w-full">
        <ProductCategoryBox />
      </div>
          <div className="flex items-center justify-between w-full px-4 mt-16">
                <Image
                  className="md:mr-[560px]"
                  src="/image/image-in-main/logo-inside-container/Vector 7.png"
                  alt=""
                  width={50}
                  height={50}
                />
                <h1 className="font-bold text-pink-600 text-2xl text-center">BeautyLand</h1>
                <Image
                  className="md:ml-[560px]"
                  src="/image/image-in-main/logo-inside-container/Vector 8.png"
                  alt=""
                  width={50}
                  height={50}
                />
              </div>
    </div>
 </Container>
  );
}
