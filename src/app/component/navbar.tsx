"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
     
    { name: "خانه", href: "/" },
    { name: "تماس با ما", href: "/contact" },
    { name: "ورود , ثبته نام", href: "/login" },
    { name: "درباره ما", href: "/about" },
    { name: "پروفایل", href: "/Profile" },
    { name: "فروشگاه", href: "/Product" },
  ];

  return (
    <>
      {/* Hamburger موبایل */}
      <div className="md:hidden bg-[#EC6880] p-4 flex rounded-full text-white ">
        <button onClick={toggleMenu}>
          <FiMenu size={28} />
        </button>
      </div>

      {/* دسکتاپ: Tabs */}
      <div className="hidden bg-[#30303D] w-full h-15 font-bold text-[14px] rounded-[60px] px-15 text-white md:flex justify-between items-center">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="relative pb-1 font-bold text-[20px] border-b-2 border-transparent hover:border-pink-500 transition-all duration-300"
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Sidebar موبایل */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleMenu}>
            <FiX size={28} />
          </button>
        </div>

        <nav className="flex flex-col space-y-4 px-6 mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="pb-1 border-b-2 border-transparent hover:border-pink-500 transition-all duration-300"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
