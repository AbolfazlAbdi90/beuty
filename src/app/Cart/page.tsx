"use client";


import CartItem from "../component/CartItem";
import Container from "../component/container";

interface Props {
  className?: string;
}

export default function CartButton({ className }: Props) {
  return (
    <Container >
      <h1 className="text-center text-xl md:text-2xl font-semibold my-6">
        سبد خرید
      </h1>
      <CartItem />
      <CartItem />
     
      <div className="mt-8 max-w-md mx-auto bg-gradient-to-br from-pink-50 via-red-100 to-pink-200 rounded-3xl shadow-2xl p-6 sm:p-8 border border-pink-300 text-gray-800">
  <h2 className="text-center text-2xl font-extrabold text-pink-700 mb-6 drop-shadow-md">
      خرید شما
  </h2>

  <div className="space-y-4 text-right">
    <div className="flex justify-between border-b border-pink-200 pb-2">
      <h3 className="font-semibold text-lg">قیمت کل:</h3>
      <span className="font-bold text-pink-700">77$</span>
    </div>

    <div className="flex justify-between border-b border-pink-200 pb-2">
      <h3 className="font-semibold text-lg">سود شما از این خرید:</h3>
      <span className="font-bold text-green-600">77$</span>
    </div>

    <div className="flex justify-between">
      <h3 className="font-semibold text-lg">قیمت نهایی:</h3>
      <span className="font-bold text-red-600 text-xl">77$</span>
    </div>
  </div>
   <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 bg-white/40 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-inner">
  <input
    type="text"
    placeholder="کد تخفیف را وارد کنید"
    className="w-full sm:w-2/3 px-4 py-3 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-400 bg-white/60 shadow-sm transition-all duration-300"
  />
  <button
    className="w-full sm:w-auto bg-gradient-to-r from-pink-600 via-red-500 to-pink-600 text-white font-extrabold px-8 py-3 rounded-xl shadow-lg hover:shadow-pink-300 transition-all duration-300 hover:scale-105"
  >
    تایید
  </button>
</div>

  <div className="mt-6 text-center">
    <button className="bg-gradient-to-r from-pink-600 via-red-500 to-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:scale-105 transition-transform duration-300">
      تایید و پرداخت امن
    </button>
  </div>
</div>

    </Container>
  );
}
