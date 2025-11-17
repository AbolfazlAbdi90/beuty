"use client";
import React from "react";
import Container from "../component/container";
import Link from "next/link";
import Image from "next/image";
import Search from "../component/search";
import Navbar from "../component/navbar";
import Profile from "../component/profile";
import { FiShoppingCart } from "react-icons/fi";
import { UseCartContext } from "../Context/CartContext";

export default function Header() {
  const { handleTotalyQty } = UseCartContext();

  return (
    <Container>
      {/* ------------------ موبایل ------------------ */}
      <div className="md:hidden flex flex-col py-4">
        <div className="flex items-center justify-between w-full px-4">
  {/* منو همبرگری سمت چپ */}
  <Navbar />

  {/* لوگو وسط + کارت کنار لوگو */}
  <div className="flex-1 flex justify-center relative">
    <Link href="/">
      <Image
        src="/image/logo-in-website/ChatGPT Image Sep 28, 2025, 05_03_22 AM.png"
        alt="logo-in-website"
        width={100}
        height={100}
        className="rounded-2xl mr-[-30px] h-[100px] w-[120px]"
      />
    </Link>
    

    {/* آیکون سبد خرید */}
    <Link
      href="/Cart"
      className="absolute left-0 top-1/2  -translate-y-1/2 bg-[#EC6880] text-white rounded-full shadow-md flex items-center justify-center
                 p-5 sm:p-4 md:p-5"
      style={{ minWidth: '40px', minHeight: '40px' }}
    >
      <FiShoppingCart
        className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
      />

      {/* badge تعداد روی آیکون */}
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs sm:text-sm w-6 h-6 flex items-center justify-center rounded-full font-semibold">
        {handleTotalyQty}
      </span>
    </Link>
  </div>
</div>


        {/* سرچ زیر لوگو */}
        <div className="w-full mt-4 px-4">
          <Search />
        </div>
      </div>

      {/* ------------------ دسکتاپ ------------------ */}
      <div className="hidden md:flex flex-col py-4">
        <div className="flex items-center justify-between w-full">
          {/* لوگو + سرچ سمت چپ */}
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image
                src="/image/logo-in-website/ChatGPT Image Sep 28, 2025, 05_03_22 AM.png"
                alt="logo-in-website"
                width={120}
                height={96}
                className="rounded-2xl"
              />
            </Link>

            <Search />
          </div>

          {/* سمت راست: پروفایل + تعداد سبد خرید + آیکون سبد خرید */}
          <div className="flex items-center gap-4 pr-4">
            {/* پروفایل */}
            <Profile />

            {/* تعداد سبد خرید */}
            <span className="ml-[-16px] mt-[-30px] bg-red-500 text-white px-3 py-1 rounded-2xl">
              {handleTotalyQty}
            </span>

            {/* آیکون سبد خرید */}
            <div className="flex items-center  cursor-pointer bg-[#EC6880] text-white p-4 rounded-full hover:bg-pink-600 transition">
              <Link href="/Cart">
                <FiShoppingCart size={24} />
              </Link>
            </div>
          </div>
        </div>

        {/* NavBar پایین لوگو */}
        <div className="flex justify-start mt-4 space-x-6 px-4">
          <Navbar />
        </div>
      </div>
    </Container>
  );
}
