"use client";

import React, { useEffect, useState } from "react";
import Cart from "./addcart";
import axios from "axios";

export interface IProduct {
  id: number;
  name: string;
  image: string;
  description?: string;
  price: number;
  href?: string;
}

interface ICartitemProps {
  id: number;
  qty: number;
}

export default function CartItem({ id, qty }: ICartitemProps) {
  const [data, setData] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === undefined || id === null) return;

    setLoading(true);
    setError(null);
    setData(null);

    axios
      .get(`/api/product/${id}`)
      .then((res) => {
        const productData = res.data;

        if (productData && !Array.isArray(productData)) {
          setData(productData as IProduct);
          return;
        }

        if (productData && Array.isArray(productData)) {
          const found = productData.find((p: IProduct) => Number(p.id) === Number(id));
          if (found) {
            setData(found);
            return;
          }
        }

        // محصول پیدا نشد؛ عمداً خطا بنداز
        return Promise.reject(new Error("محصول در endpoint اول یافت نشد"));
      })
      .catch(() => {
        // fallback: گرفتن کل لیست محصولات و جستجو
        axios
          .get(`/api/productList`)
          .then((res2) => {
            const products = res2.data as IProduct[];

            if (Array.isArray(products)) {
              const found = products.find((p) => Number(p.id) === Number(id));
              if (found) setData(found);
              else setError("محصولی با این شناسه در لیست محصولات یافت نشد.");
            } else {
              setError("داده نامعتبر از productList دریافت شد.");
            }
          })
          .catch(() => {
            setError("خطا در دریافت اطلاعات محصول");
          });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return <p className="text-center mt-10">در حال بارگذاری اطلاعات محصول...</p>;

  if (error)
    return <p className="text-center mt-10 text-red-500">{error}</p>;

  if (!data)
    return <p className="text-center mt-10 text-red-500">محصولی یافت نشد.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 shadow-md mt-10 p-4 rounded-2xl bg-white">
      <div className="md:col-span-3 flex justify-center md:justify-start">
        <img
          src={data.image}
          alt={data.name}
          className="rounded-2xl mt-4 w-[220px] md:w-[260px] h-[220px] object-contain"
        />
      </div>

      <div className="md:col-span-9 md:text-right text-center mt-4 md:mt-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{data.name}</h1>
        <p className="text-gray-600 mt-2">{data.description}</p>

        <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
          <p className="text-lg font-semibold">
            تعداد: <span className="font-bold">{qty}</span>
          </p>

          <p className="text-xl font-extrabold text-pink-600">
            قیمت: {Number(data.price).toLocaleString("fa-IR")} تومان
          </p>
        </div>

        <div className="flex justify-center md:justify-start mt-6">
          <Cart id={String(data.id)} />
        </div>
      </div>
    </div>
  );
}
