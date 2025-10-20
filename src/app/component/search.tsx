import React from "react";
import { FiSearch } from "react-icons/fi"; // آیکون سرچ

export default function Search() {
  return (
    <div className="  relative w-full max-w-[476px]">
      <input
        type="text"
        placeholder="جستجو در فروشگاه ..."
        className="bg-[#FFF0F7] text-center w-full md:w-[620px] h-12 rounded-2xl px-12"
      />
      <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
    </div>
  );
}
