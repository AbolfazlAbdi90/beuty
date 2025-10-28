import { notFound } from "next/navigation";
import Image from "next/image";
import { famousProducts } from "../data/products";
import Cart from "@/app/component/addcart";
import FamousProductsPage from "../page";

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = famousProducts.find((p) => p.id === Number(params.id));

  if (!product) return notFound();

  return (
    <>
      <div className=" flex items-center justify-center p-6 ">
        <div className="bg-white rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-12 max-w-4xl w-full overflow-hidden">
          {/* بخش تصویر */}
          <div className="md:col-span-5 flex justify-center items-center bg-gray-100">
            <Image
              src={product.image}
              alt={product.title}
              width={600}
              height={600}
              className="w-full h-64 md:h-full "
            />
          </div>

          {/* بخش اطلاعات */}
          <div className="md:col-span-7 p-6 flex flex-col justify-center text-center md:text-right">
            <h1 className="text-2xl font-bold text-gray-800">
              {product.title}
            </h1>
            <p className="text-pink-600 text-2xl mt-3 font-semibold">
              {product.price.toLocaleString("fa-IR")} تومان
            </p>
            <Cart />
            {/* توضیحات (اختیاری)
          <p className="text-gray-600 text-sm mt-4 leading-relaxed">
            {product.description || "توضیحی برای این محصول وجود ندارد."}
          </p> */}
          </div>
        </div>
      </div>
      <div className="mt-20">
        <div className="flex items-center justify-between w-full px-4 mt-16">
          <Image
            className="md:mr-[560px]"
            src="/image/image-in-main/logo-inside-container/Vector 7.png"
            alt=""
            width={50}
            height={50}
          />
          <h1 className="font-bold text-2xl text-center">محبوب ترین محصولات</h1>
          <Image
            className="md:ml-[560px]"
            src="/image/image-in-main/logo-inside-container/Vector 8.png"
            alt=""
            width={50}
            height={50}
          />
        </div>
        <FamousProductsPage />
      </div>
    </>
  );
}
