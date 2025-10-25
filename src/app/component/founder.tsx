"use client";

import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Founder = {
  id: number;
  // photo and name intentionally left optional/empty so you can fill later
  photo?: string; // URL or keep undefined to show placeholder
  name?: string;  // keep undefined or "" if you want blank
  bio: string;
};

const founders: Founder[] = [
  {
    id: 1,
    photo: "/image/image-in-main/founden/abolfazl.png",
    name: "ابوالفضل عبدی",
    bio:
      "بنیان‌گذار اول و مسئول توسعه وب. با دیدی آینده‌نگر و مهارت در فناوری، او ساختار دیجیتال BeautyLand را پایه‌گذاری کرد تا پلی میان زیبایی، خلاقیت و تجربه کاربری بی‌نقص ایجاد کند.",
  },
  {
    id: 2,
    photo: "/image/image-in-main/founden/shervin.png",
    name: "شروین محبی",
    bio:
      "بنیان‌گذار دوم و معمار تجربه کاربری. او با تمرکز بر طراحی دقیق، سادگی و تعامل مؤثر، تلاش کرده تا هر کاربر در BeautyLand تجربه‌ای خاص و الهام‌بخش از دنیای زیبایی داشته باشد.",
  },
  {
    id: 3,
    photo: "/image/image-in-main/founden/Amin.png",
    name: "امین عبداللهی",
    bio:
      "بنیان‌گذار سوم و مدیر راهبردی عملیات. با نظارت بر زنجیره تأمین و کیفیت خدمات، او اطمینان می‌دهد که هر سفارش با دقت، سرعت و رضایت کامل به دست مشتریان برسد.",
  },
];


export default function Founders() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
        بنیان‌گذاران
        <span className="font-bold text-2xl text-pink-600">Beautyland</span>
      </h2>

      {/* دسکتاپ: سه ستون */}
      <div className="hidden md:grid grid-cols-3 gap-6">
        {founders.map((f) => (
          <article
            key={f.id}
            className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center"
          >
            {/* تصویر (placeholder وقتی خالیه) */}
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden mb-4">
              {f.photo ? (
                // اگر می‌خوای از next/image استفاده کنی و آدرس داری، از این استفاده کن
                // <Image src={f.photo} alt={f.name || ""} width={128} height={128} className="object-cover" />
                <Image
                  src={f.photo}
                  alt={f.name || "Founder"}
                  width={128}
                  height={128}
                  className=""
                />
              ) : (
                // placeholder خالی
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-10 h-10 opacity-60"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM6 20a6 6 0 0112 0" />
                  </svg>
                </div>
              )}
            </div>

            {/* نام (خالی می‌مونه) */}
            <h3 className="text-lg font-semibold min-h-[1.6rem]">
              {f.name ?? ""}
            </h3>

            {/* متن / بیو */}
            <p className="text-sm text-gray-600 mt-3">{f.bio}</p>
          </article>
        ))}
      </div>

      {/* موبایل: اسلایدر */}
      <div className="md:hidden">
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={12}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
        >
          {founders.map((f) => (
            <SwiperSlide key={f.id}>
              <article className="bg-white rounded-2xl shadow-md p-6 mx-2 flex flex-col items-center text-center">
                <div className="w-36 h-36 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden mb-4">
                  {f.photo ? (
                    <Image
                      src={f.photo}
                      alt={f.name || "Founder"}
                      width={144}
                      height={144}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-12 h-12 opacity-60"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM6 20a6 6 0 0112 0" />
                      </svg>
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-semibold min-h-[1.6rem]">
                  {f.name ?? ""}
                </h3>

                <p className="text-sm text-gray-600 mt-3">{f.bio}</p>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
