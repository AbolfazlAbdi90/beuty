import React from "react";
import Container from "../component/container";
import ProductCategoryBox from "../component/productCategory";
import ProductsPage from "../famousProducts/page";
import DiscountProductsPage from "../discountProducts/page";
import OurDeatails from "../component/ourDeatails";
import AddresInstagram from "../component/Addres";
import Founders from "../component/founder";

export default function Main() {
  return (
    <Container>
      <div>
        <div className="flex justify-center mt-[38px]">
          <img
            className="md:w-[722.189453125px] md:h-[454.7462463378906px]"
            src="/image/image-in-main/Frame 1261157350.png"
            alt="image-in-main"
          />
        </div>
        <div className="flex justify-between">
          <div className="  hidden md:block py-4 rounded-full bg-[#30303D] h-25 w-25 mb-50 mt-[-280] ">
            <h3 className="text-[#FF6687] font-bold text-3xl  text-center">
              1m+
            </h3>
            <p className="text-white text-center ">مشتری راضی</p>
          </div>
          <div className="   hidden  md:block py-4 rounded-full bg-[#30303D] h-25 w-25 mb-50 mt-[-280] ">
            <h3 className="text-[#FF6687] font-bold text-3xl  text-center">
              ۳۰۰+
            </h3>
            <p className="text-white text-center ">محصول</p>
          </div>
        </div>

        <ProductCategoryBox />

        <div className="flex items-center justify-between w-full px-4 mt-16  ">
          <img
            className="md:mr-[560px]"
            src="/image/image-in-main/logo-inside-container/Vector 7.png"
            alt=""
          />
          <h1 className=" font-bold text-2xl text-center">
            محبوب ترین محصولات
          </h1>
          <img
            className="md:ml-[560px]"
            src="/image/image-in-main/logo-inside-container/Vector 8.png"
            alt=""
          />
        </div>
      </div>
      <ProductsPage />
      <div className="grid grid-cols-1 justify-center md:grid-cols-2 mt-15 gap-8 ">
        <img
          className=" w-full h-[166px] md:w-full "
          src="/image/image-in-main/Frame 1261157117.png"
          alt="image-in-main"
        />
        <div className="flex md:justify-end">
          <img
            className=" h-[166px] md:w-full"
            src="/image/image-in-main/Frame 1261157116.png"
            alt="image-in-main"
          />
        </div>
        {/* محصولات با تخفیف */}
      </div>
      <DiscountProductsPage />
      <div className="flex flex-col md:flex-row justify-start items-center mt-20 md:ml-10">
        {/* عکس */}
        <div className="flex justify-center md:justify-start">
          <img src="/image/image-in-main/Strawberries.png" alt="" />
        </div>

        {/* متن */}
        <div className="flex flex-col justify-center items-center md:items-start text-center md:text-right md:ml-4">
          <h1 className="text-[20px] md:text-[28px] font-semibold">
            چرا <span className="text-[#FF6687]">Beautyland</span> بهترین انتخاب
            شماست؟
          </h1>
        </div>
      </div>

      <OurDeatails />
      <AddresInstagram />
      <Founders />
    </Container>
  );
}
