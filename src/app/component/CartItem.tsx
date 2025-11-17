import React from "react";
import Cart from "./addcart";

interface IProduct {
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function CartItem({ product }: { product: IProduct }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 shadow-md mt-10 p-4 rounded-2xl">
      <div className="md:col-span-3 flex justify-center md:justify-start ">
        <img
          src={product.image}
          alt={product.name}
          className="rounded-2xl mt-4 w-[282px] md:w-[300px] h-70"
        />
      </div>

      <div className="md:col-span-9 md:text-right text-center mt-8">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-2xl font-bold">تعداد: <span>1</span></p>
        <p className="text-xl font-bold">
          قیمت محصول: <span>{product.price}</span>
        </p>

        <div className="flex justify-center md:justify-start mt-8">
          <Cart id={String(product.id)} />
        </div>
      </div>
    </div>
  );
}
