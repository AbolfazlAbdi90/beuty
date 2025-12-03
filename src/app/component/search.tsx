"use client";

import React, { useState, useEffect, ChangeEvent, FocusEvent } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import Link from "next/link";

interface Product {
  id: string | number;
  name: string;
  href?: string;
}

const LOCAL_STORAGE_KEY = "recentSearches";

export default function Search() {
  const [query, setQuery] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // بارگذاری محصولات و سرچ‌های اخیر از لوکال استوریج فقط یک بار
  useEffect(() => {
    fetch("/api/productList")
      .then((res) => res.json())
      .then((data: Product[]) => {
        setProducts(data || []);
      })
      .catch(() => setProducts([]));

    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  // هر بار query تغییر کرد، فیلتر انجام میشه
  useEffect(() => {
    if (!query.trim()) {
      setFilteredSuggestions([]);
      return;
    }
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSuggestions(filtered);
  }, [query, products]);

  // ذخیره سرچ اخیر
  const saveRecentSearch = (search: string) => {
    if (!search.trim()) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item !== search);
      const newList = [search, ...filtered].slice(0, 10);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newList));
      return newList;
    });
  };

  // وقتی روی یکی از پیشنهادات کلیک شد
  // فقط سرچ اخیر رو ذخیره می‌کنیم، هدایت از طریق لینک انجام میشه
  const handleSelectSuggestion = (product: Product) => {
    saveRecentSearch(product.name);
    setQuery("");
    setFilteredSuggestions([]);
    setShowDropdown(false);
  };

  // وقتی روی یکی از سرچ‌های اخیر کلیک شد
  const handleSelectRecent = (item: string) => {
    setQuery(item);
    setShowDropdown(false);
  };

  // حذف سرچ اخیر
  const handleRemoveRecent = (item: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const newList = prev.filter((i) => i !== item);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newList));
      return newList;
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (!showDropdown) setShowDropdown(true);
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setShowDropdown(true);
  };

  // وقتی input blur میشه، با تاخیر dropdown رو می‌بندیم تا کلیک روی گزینه‌ها ثبت بشه
  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 150);
  };

  return (
    <div className="relative w-full max-w-[476px]">
      <input
        type="text"
        placeholder="جستجو در فروشگاه ..."
        className="bg-[#FFF0F7] text-center w-full md:w-[620px] h-12 rounded-2xl px-12"
        value={query}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoComplete="off"
      />
      <FiSearch
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={20}
      />

      {showDropdown && (
        <>
          {/* وقتی query خالیه، فقط سرچ‌های اخیر */}
          {!query.trim() && recentSearches.length > 0 && (
            <ul className="absolute z-30 bg-white w-full rounded-b-2xl max-h-60 overflow-y-auto shadow-lg text-black top-full mt-1">
              {recentSearches.map((item) => (
                <li
                  key={item}
                  className="cursor-pointer flex justify-between items-center px-4 py-2 hover:bg-pink-200"
                  onClick={() => handleSelectRecent(item)}
                >
                  <span>{item}</span>
                  <button
                    onClick={(e) => handleRemoveRecent(item, e)}
                    className="text-red-500 hover:text-red-700"
                    aria-label={`حذف ${item} از جستجوهای اخیر`}
                  >
                    <FiX />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* وقتی query داریم، سرچ‌های اخیر و زیرش پیشنهادات */}
          {query.trim() && (
            <>
              {recentSearches.length > 0 && (
                <ul className="absolute z-30 bg-white w-full rounded-t-2xl max-h-60 overflow-y-auto shadow-lg text-black top-full mt-1">
                  {recentSearches.map((item) => (
                    <li
                      key={item}
                      className="cursor-pointer flex justify-between items-center px-4 py-2 hover:bg-pink-200"
                      onClick={() => handleSelectRecent(item)}
                    >
                      <span>{item}</span>
                      <button
                        onClick={(e) => handleRemoveRecent(item, e)}
                        className="text-red-500 hover:text-red-700"
                        aria-label={`حذف ${item} از جستجوهای اخیر`}
                      >
                        <FiX />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {filteredSuggestions.length > 0 ? (
                <ul className="absolute z-20 bg-white w-full rounded-b-2xl max-h-60 overflow-y-auto shadow-lg text-black top-full mt-[50px]">
                  {filteredSuggestions.map((product) => (
                    <li key={product.id} className="px-4 py-2 hover:bg-pink-200">
                      <Link
                        href={`/Product/${product.id}`}
                        onClick={() => saveRecentSearch(product.name)}
                        className="block w-full"
                      >
                        {product.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="absolute z-10 bg-white w-full rounded-b-2xl max-h-60 overflow-y-auto shadow-lg text-black px-4 py-2 top-full mt-[calc(1.5rem*10+0.25rem)]">
                  موردی یافت نشد
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
