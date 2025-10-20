"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex mt-10 flex-col items-center  h-screen text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">صفحه‌ای که دنبال آن بودید پیدا نشد!</p>
      <Link href="/" className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition">
        بازگشت به خانه
      </Link>
    </div>
  );
}
