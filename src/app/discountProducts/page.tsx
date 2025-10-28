"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import CountdownTimer from "../component/Clock";

interface DiscountProduct {
  id: number;
  title: string;
  image: string;
  price: number;
  discount: number;
  description: string;
}

export default function DiscountProductsPage() {
  const [products, setProducts] = useState<DiscountProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/discountProducts");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data: DiscountProduct[] = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="w-full">
      <div className="mt-20 p-0">
        <div className="flex items-center justify-between w-full px-4 mt-16">
          <Image
            src="/image/image-in-main/logo-inside-container/Vector 7.png"
            alt="Logo Left"
            width={50}
            height={50}
            className="md:mr-[560px]"
          />
          <h1 className="font-bold text-2xl text-center">
            جشنواره پر تخفیف{" "}
            <span className="text-pink-300 text-3xl font-bold md:text-3xl">
              Beautyland
            </span>
          </h1>
          <Image
            src="/image/image-in-main/logo-inside-container/Vector 8.png"
            alt="Logo Right"
            width={50}
            height={50}
            className="md:ml-[560px]"
          />
        </div>

        <div className="bg-pink-300 w-full mt-10 rounded-4xl py-10 px-10 min-h-[400px]">
          <CountdownTimer />

          {loading ? (
            <div className="w-full flex justify-center items-center py-20">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-white text-lg animate-pulse">
                  در حال بارگذاری محصولات...
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* دسکتاپ */}
              <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full px-4 md:px-0">
                {products.map((p) => (
                  <Link
                    key={p.id}
                    href={`/discountProducts/${p.id}`}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden flex flex-col w-full"
                  >
                    <div className="w-full h-56 relative">
                      <Image src={p.image} alt={p.title} fill />
                    </div>
                    <div className="p-4 flex flex-col items-center">
                      <h2 className="font-bold text-lg text-gray-800">{p.title}</h2>
                      <p className="text-gray-400 line-through text-sm mt-1">
                        {p.price.toLocaleString("fa-IR")} تومان
                      </p>
                      <p className="text-pink-600 font-semibold mt-1">
                        {(p.price - (p.price * p.discount) / 100).toLocaleString(
                          "fa-IR"
                        )}{" "}
                        تومان
                      </p>
                      <p className="text-green-600 text-sm mt-1">{p.discount}% تخفیف</p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* موبایل */}
              <div className="md:hidden">
                <Swiper
                  modules={[Navigation, Pagination]}
                  spaceBetween={16}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                >
                  {products.map((p) => (
                    <SwiperSlide key={p.id}>
                      <Link
                        href={`/discountProducts/${p.id}`}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden block w-full"
                      >
                        <div className="w-full h-56 relative">
                          <Image src={p.image} alt={p.title} fill />
                        </div>
                        <div className="p-4 text-center">
                          <h2 className="font-bold text-lg text-gray-800">{p.title}</h2>
                          <p className="text-gray-400 line-through text-sm mt-1">
                            {p.price.toLocaleString("fa-IR")} تومان
                          </p>
                          <p className="text-pink-600 font-semibold mt-1">
                            {(p.price - (p.price * p.discount) / 100).toLocaleString(
                              "fa-IR"
                            )}{" "}
                            تومان
                          </p>
                          <p className="text-green-600 text-sm mt-1">{p.discount}% تخفیف</p>
                        </div>
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
