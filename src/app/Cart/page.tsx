"use client";

import Link from "next/link";
import CartItem from "../component/CartItem";
import Container from "../component/container";
import { UseCartContext } from "../Context/CartContext";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useEffect, useState } from "react";
import axios from "axios";
import { IProduct } from "../Product/[id]/page";
import { formatNumberWithCommas } from "../utils/number";
import Discount from "../component/discount";

export default function CartButton() {
  const { cartItems } = UseCartContext();
  const [data, setData] = useState<IProduct[]>([]);
  const [finalPrice, setFinalPrice] = useState(0);

  useEffect(() => {
    axios("/api/productList").then((result) => {
      const { data } = result;
      setData(data);
    });
  }, []);

  // محاسبه قیمت کل
  const totalPrice = cartItems.reduce((total, item) => {
    const product = data.find((p) => p.id === item.id);
    if (!product) return total;
    return total + product.price * item.qty;
  }, 0);

  // آپدیت قیمت نهایی
  useEffect(() => {
    setFinalPrice(totalPrice);
  }, [totalPrice]);

  // سبد خالی
  if (cartItems.length === 0) {
    return (
      <Container>
        <h1 className="text-center text-xl md:text-2xl font-semibold my-6">
          سبد خرید
        </h1>
        <div className="flex flex-col items-center justify-center mt-10 text-gray-500">
          <AiOutlineShoppingCart size={100} />
          <p className="mt-4 text-xl font-semibold">سبد خرید شما خالی است</p>

          <Link
            href={"/Product"}
            className="cursor-pointer px-4 py-2 rounded-2xl text-white bg-pink-600 mt-4"
          >
            <button className="cursor-pointer">وارد صفحه محصولات شوید</button>
          </Link>
        </div>
      </Container>
    );
  }

  // گرفتن تخفیف از Discount
  const handleApplyDiscount = (discountAmount: number) => {
    const newFinalPrice = totalPrice - discountAmount;
    setFinalPrice(newFinalPrice >= 0 ? newFinalPrice : 0);
  };

  return (
    <Container>
      <h1 className="text-center text-xl md:text-2xl font-semibold my-6">
        سبد خرید
      </h1>

      {cartItems.map((item, index) => (
        <CartItem key={index} {...item} />
      ))}

      {/* کارت خرید زیبا */}
      <div className="
      mt-8 max-w-md mx-auto 
      bg-gradient-to-br from-white/70 via-pink-50 to-red-100 
      rounded-3xl 
      shadow-[0_8px_35px_rgba(255,0,130,0.25)] 
      p-6 sm:p-8 
      border border-white/40 
      backdrop-blur-lg text-gray-800"
      >
        <h2 className="
        text-center text-3xl font-black text-pink-700 mb-8 
        drop-shadow-[0_3px_6px_rgba(255,0,120,0.3)]
        ">
          خرید شما
        </h2>

        <div className="space-y-4 text-right">

          <div className="flex justify-between border-b border-pink-200 pb-3">
            <h3 className="font-semibold text-lg">قیمت کل:</h3>
            <span className="font-black text-pink-700 text-xl">
              {formatNumberWithCommas(totalPrice)} تومان
            </span>
          </div>

          <div className="flex justify-between border-b border-pink-200 pb-3">
            <h3 className="font-semibold text-lg">سود شما از این خرید:</h3>
            <span className="font-black text-green-600 text-xl">
              {formatNumberWithCommas(Math.floor(totalPrice * 0.1))} تومان
            </span>
          </div>

          <div className="flex justify-between pt-2">
            <h3 className="font-semibold text-xl">قیمت نهایی:</h3>
            <span className="font-black text-red-600 text-2xl drop-shadow-sm">
              {formatNumberWithCommas(finalPrice)} تومان
            </span>
          </div>

        </div>

        {/* کامپوننت تخفیف */}
        <Discount totalPrice={totalPrice} onApplyDiscount={handleApplyDiscount} />

        <div className="mt-8 text-center">
          <button className="
          bg-gradient-to-r from-pink-600 via-red-500 to-pink-600 
          text-white font-extrabold py-4 px-10 rounded-full 
          shadow-[0_8px_20px_rgba(255,0,140,0.4)]
          hover:scale-110 hover:shadow-[0_10px_28px_rgba(255,0,140,0.55)]
          transition-all duration-300
          ">
            تایید و پرداخت امن
          </button>
        </div>
      </div>
    </Container>
  );
}
