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
                className="rounded-2xl mr-[-10px] h-[100px] w-[220px] "
              />
            </Link>

            {/* سبد خرید در موبایل (کنار لوگو سمت چپ) */}
                {/* تعداد سبد خرید */}
            <div className="flex justify-end" >
              <span className=" bg-red-500 mr-[0] w-[40px] px-3.75 py-2 h-[40px] text-white  rounded-full">
              {handleTotalyQty}
            </span>
            </div>
            <Link
              href="/Cart"
              className="absolute left-[0px] top-1/2 -translate-y-1/2 bg-[#EC6880] text-white py-5 px-5 rounded-full shadow-md flex items-center justify-center"
            >
              <FiShoppingCart size={22} />
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
