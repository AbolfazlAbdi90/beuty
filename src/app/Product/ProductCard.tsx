// app/products/ProductCard.tsx
import Link from "next/link";
import Image from "next/image";

interface ProductType {
  id: number;
  name: string;
  image: string;
  price: number;
}

export default function ProductCard({ product }: { product: ProductType }) {
  return (
    <Link href={`/Product/${product.id}`}>
      <div className="p-4 bg-white rounded-xl hover:bg-gray-100 transition cursor-pointer">
        <Image
          src={product.image || "/placeholder.png"}
          alt={product.name}
          width={300}
          height={240}
          className="w-full h-60 object-cover rounded-md"
        />
        <h2 className="font-semibold text-lg mt-2 text-center">{product.name}</h2>
        <p className="text-pink-600 text-center font-medium mt-1">
          {product.price.toLocaleString("fa-IR")} تومان
        </p>
      </div>
    </Link>
  );
}
