"use client";

import { useEffect, useState } from "react";

export default function CountdownTimer() {
  // زمان شروع: 7 روز
  const [timeLeft, setTimeLeft] = useState(7 * 24 * 60 * 60); // ثانیه

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // محاسبه روز، ساعت، دقیقه، ثانیه
  const days = Math.floor(timeLeft / (24 * 60 * 60));
  const hours = Math.floor((timeLeft % (24 * 60 * 60)) / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex justify-center mb-4 items-center gap-4  p-6 rounded-xl text-white  mx-auto">
  <div className="flex flex-col items-center bg-gray-800 px-4 py-2 rounded-lg">
    <span className="text-xl font-bold">{seconds.toString().padStart(2, "0")}</span>
    <span className="text-sm text-gray-400">ثانیه</span>
    
  </div>
  :
  <div className="flex flex-col items-center bg-gray-800 px-4 py-2 rounded-lg">
    <span className="text-xl font-bold">{minutes.toString().padStart(2, "0")}</span>
    <span className="text-sm text-gray-400">دقیقه</span>
  </div>
  :
  <div className="flex flex-col items-center bg-gray-800 px-4 py-2 rounded-lg">
    <span className="text-xl font-bold">{hours.toString().padStart(2, "0")}</span>
    <span className="text-sm text-gray-400">ساعت</span>
  </div>
  :
  <div className="flex flex-col items-center bg-gray-800 px-4 py-2 rounded-lg">
    <span className="text-xl font-bold">{days}</span>
    <span className="text-sm text-gray-400">روز</span>
  </div>
</div>

  );
}
