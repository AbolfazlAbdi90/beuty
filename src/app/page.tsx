import React from "react";
import Container from "./component/container";
import Link from "next/link";
import Main from "./Main/main";


export default function Home() {
  return (
    <Container>
      <div>
        <div className="flex text-center justify-center">
          <img
            className="w-30 h-24 rounded-2xl "
            src="/image/logo-in-website/ChatGPT Image Sep 28, 2025, 05_03_22 AM.png"
            alt="logo-in-website"
          />
        </div>
        <h1 className="font-bold text-2xl sm:text-4xl text-center mt-6 ">
          فروشگاه
          <span className="text-[#FF6687] mr-1 ">لوازم ارایشی </span>
          های خاص
        </h1>
        <div className=" text-center text-gray-500 p-3 rounded-md leading-relaxed">
          <strong>Beautyland</strong> واردکننده‌ی انواع
          <strong> لوازم آرایشی، بهداشتی و مراقبتی پوست و مو </strong>
          از برندهای معتبر خارجی می‌باشد و این یک متن تستی است جهت نمایش
          <strong> Beautyland </strong>
        </div>

        <div className="flex justify-center">
          <Link href="/Product">
                    <button className="w-[250px] cursor-pointer bg-[#FF6687] rounded-[43px] mt-6 text-white h-10">مشاهده محصولات</button>

          </Link>
        </div>

        {/* logo for main beard */}
        <Main />
      </div>
    </Container>
  );
}
