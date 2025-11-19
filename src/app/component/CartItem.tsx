"use client";

import React, { useEffect, useState } from "react";
import Cart from "./addcart";
import axios from "axios";
import { IProduct } from "../Product/[id]/page";


interface ICartitemProps {
  id: number;
  qty: number;
}

export default function CartItem({ id, qty }: ICartitemProps) {
  const [data, setData] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    axios
      .get(`/api/productList/${id}`)
      .then((result) => {
        const products = result.data;
        const product = products.find((p: IProduct) => p.id === id);

        if (!product) {
          setError("محصول یافت نشد.");
          setData(null);
        } else {
          setData(product);
        }
      })
      .catch(() => {
        setError("خطا در دریافت اطلاعات محصول");
        setData(null);
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
    <div className="grid grid-cols-1 md:grid-cols-12 shadow-md mt-10 p-4 rounded-2xl">
      <div className="md:col-span-3 flex justify-center md:justify-start">
        <img
          src={data.image}
          alt={data.name}
          className="rounded-2xl mt-4 w-[282px] md:w-[300px] h-70"
        />
      </div>

      <div className="md:col-span-9 md:text-right text-center mt-8">
        <h1 className="text-3xl font-bold">{data.name}</h1>
        <p className="text-2xl font-bold">
          تعداد: <span>{qty}</span>
        </p>
        <p>{data.description}</p>
        <p className="text-xl font-bold">
          قیمت محصول: <span>{data.price}</span>
        </p>

        <div className="flex justify-center md:justify-start mt-8">
          <Cart id={String(data.id)} />
        </div>
      </div>
    </div>
  );
}
