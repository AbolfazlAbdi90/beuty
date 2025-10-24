import { notFound } from "next/navigation";
import Image from "next/image";
import Cart from "@/app/component/addcart";

interface DiscountProduct {
  id: number;
  title: string;
  image: string;
  price: number;
  discount: number;
  description: string;
}

async function getDiscountProduct(id: string): Promise<DiscountProduct | undefined> {
  // ساخت URL کامل بر اساس محیط اجرا (Vercel یا local)
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/discountProducts`, { cache: "no-store" });
  if (!res.ok) {
    console.error("Failed to fetch discount products");
    return undefined;
  }

  const products: DiscountProduct[] = await res.json();
  return products.find((p) => p.id === Number(id));
}

export default async function DiscountProductPage({ params }: { params: { id: string } }) {
  const product = await getDiscountProduct(params.id);

  if (!product) return notFound();

  const discountedPrice = product.price - (product.price * product.discount) / 100;

  return (
    <div className="flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-12 max-w-4xl w-full overflow-hidden">
        {/* تصویر */}
        <div className="md:col-span-5 flex justify-center items-center bg-gray-100">
          <Image
            src={product.image}
            alt={product.title}
            width={600}
            height={600}
            className="w-full h-64 md:h-full object-cover"
          />
        </div>

        {/* اطلاعات */}
        <div className="md:col-span-7 p-6 flex flex-col justify-center text-center md:text-right">
          <h1 className="text-2xl font-bold text-gray-800">{product.title}</h1>
          <p className="text-gray-500 line-through mt-2">
            {product.price.toLocaleString("fa-IR")} تومان
          </p>
          <p className="text-pink-600 text-2xl font-semibold mt-1">
            {discountedPrice.toLocaleString("fa-IR")} تومان
          </p>
          <p className="text-green-600 font-bold mt-1">{product.discount}% تخفیف</p>
          <p className="text-gray-600 text-sm mt-4 leading-relaxed">
            {product.description}
          </p>
          <Cart />
        </div>
      </div>
    </div>
  );
}
