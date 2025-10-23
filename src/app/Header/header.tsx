"use client";
import React from "react";
import Container from "../component/container";
import Link from "next/link";
import Search from "../component/search";
import Navbar from "../component/navbar";
import CartButton from "../component/CartList";
import Profile from "../component/profile";

export default function Header() {
  return (
    <Container>
      {/* موبایل */}
      <div className="md:hidden flex flex-col py-4">
        <div className="flex items-center justify-between w-full px-4">
          {/* Hamburger سمت چپ */}
          <Navbar />

          {/* لوگو وسط */}
          <div className="flex-1 flex justify-center">
            <Link href="/">
              <img
                className="w-24 h-20 rounded-2xl"
                src="/image/logo-in-website/ChatGPT Image Sep 28, 2025, 05_03_22 AM.png"
                alt="logo-in-website"
              />
            </Link>
          </div>

          {/* Cart سمت راست */}
          <CartButton />
        </div>

        {/* Search زیر لوگو */}
        <div className="w-full mt-4 px-4">
          <Search />
        </div>
      </div>

      {/* دسکتاپ */}
      <div className="hidden md:flex flex-col py-4">
        <div className="flex items-center justify-between w-full">
          {/* Logo + Search سمت چپ */}
          <div className="flex items-center gap-4">
            <Link href="/">
              <img
                className="w-30 h-24 rounded-2xl"
                src="/image/logo-in-website/ChatGPT Image Sep 28, 2025, 05_03_22 AM.png"
                alt="logo-in-website"
              />
            </Link>
            <Search />
          </div>

          {/* Cart + Profile سمت راست */}
          <div className="flex items-center gap-4">
            {/* پروفایل (مخفی در موبایل) */}
            <Profile />
            <CartButton />
          </div>
        </div>

        {/* Tabs زیر */}
        <div className="flex justify-start mt-4 space-x-6 px-4">
          <Navbar />
        </div>
      </div>
    </Container>
  );
}
