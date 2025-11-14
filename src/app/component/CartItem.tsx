import React from 'react'
import Cart from './addcart'

export default function CartItem() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 shadow-md mt-10 p-4 rounded-2xl">
        <div className="md:col-span-3 flex justify-center md:justify-start ">
          <img
            src="/image/image-in-main/founden/abolfazl.png"
            alt="محصول در سبد خرید"
            className="rounded-2xl mt-4 w-[282px] md:w-[300px] h-70 "
          />
        </div>
        <div className="md:col-span-9 md:text-right text-center mt-8 " >
         <h1 className="text-3xl font-bold" >اسم محصول:</h1>
         <p className="text-2xl font-bold" >تعداد :<span>0</span></p>
         <p className="text-xl font-bold" >قیمت محصول: <span>$45000</span></p>
         <div className=" flex justify-center md:justify-start  mt-8" >
            <Cart />
         </div>
        </div>
      </div>
  )
}
