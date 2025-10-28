import React from "react";
import Container from "../component/container";
import Link from "next/link";
import { FaInstagram, FaTelegramPlane } from "react-icons/fa";
export default function Footer() {
  const Navbar = [
    { title: "صفحه اصلی", href: "/" },
    { title: "فروشگاه", href: "/product" },
    { title: "مجله", href: "/articls" },
    { title: "درباره ما", href: "/aboutUs" },
    { title: "تماس با ما", href: "/contactUs" },
  ];

  return (
    <Container>
      <div className="w-full text-white md:h-[400px]  bg-[#30303D] mx-auto rounded-t-[32px] flex flex-col items-center py-8 gap-4">
        {/* بخش لوگو و توضیح */}
        <div className="text-center">
          <picture className="flex justify-center">
            <img
              className="w-30 h-24 mt-6 rounded-2xl"
              src="/image/logo-in-website/ChatGPT Image Sep 28, 2025, 05_03_22 AM.png"
              alt="logo-in-website"
            />
          </picture>
          <p className="text-center mt-2 text-gray-300 max-w-md mx-auto text-sm leading-6">
            لورم ایپسوم متن ساختگی برای طراحان می‌باشد که با استفاده از آن متن تستی می‌نویسند!
          </p>
        </div>

        {/* بخش لینک‌ها */}
        <nav className="mt-2">
          <ul className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center text-[15px]">
            {Navbar.map((item, index) => (
              <li key={index}>
                <Link href={item.href} className="hover:text-gray-400 transition-colors">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* بخش پایین: تلفن و نمادها */}
        <div className="w-full flex flex-col md:flex-row justify-between items-center mt-8 px-8">
          {/* تلفن */}
          <div className="flex items-center gap-3">
            <picture>
              <img
                src="/image/Phone/Phone.png"
                alt="Phone"
                className="w-6 h-6"
              />
            </picture>  
            <a href="tel:09378546568" className="text-lg">09378546568</a>
          </div>

          {/* نمادها */}
          <div className="flex gap-6 mt-6 md:mt-0">
            <img
              src="/image/Phone/3b1c0d60546ea949dc1a129623e55c9c130dc3ad (1).png"
              alt="نماد اعتماد"
              className="w-[100px] h-[120px]"
            />
            <img
              className="w-[80px] h-[120px]"
              src="/image/Phone/zarinPal.png"
              alt="زرین‌پال"
            />
          </div>
        </div>
      </div>

{/* نوار پایین صورتی */}
<div className="bg-[#FF6687] h-[94px] w-full rounded-b-[32px]">
  <div className="grid grid-cols-1 md:flex md:flex-row-reverse md:justify-between items-center px-8 h-full">
    {/* آیکون‌ها */}
    <div className="flex justify-center md:justify-start gap-4">
      <a
        href="https://t.me/bea_utylanddd"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#FF6687] p-3 rounded-full hover:bg-[#ff4d72] transition-all"
      >
        <FaTelegramPlane className="text-white text-[22px]" />
      </a>

      <a
        href="https://www.instagram.com/bea_utyland2025"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#FF6687] p-3 rounded-full hover:bg-[#ff4d72] transition-all"
      >
        <FaInstagram className="text-white text-[22px]" />
      </a>
    </div>

    {/* متن پایین */}
    <p className="text-white text-center md:text-left text-sm  md:mt-0">
      تمام حقوق این وب‌سایت متعلق به Beautyland می‌باشد
    </p>
  </div>
</div>

<h1  >hello world</h1>
    </Container>
  );
}
