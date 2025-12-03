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
  const [showRecent, setShowRecent] = useState(false);

  // بارگذاری همه محصولات فقط یک بار در ابتدا
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

  // ذخیره سرچ‌های اخیر در لوکال استوریج
  const saveRecentSearch = (search: string) => {
    if (!search.trim()) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item !== search);
      const newList = [search, ...filtered].slice(0, 10);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newList));
      return newList;
    });
  };

  // فیلتر کردن پیشنهادات بر اساس query
  useEffect(() => {
    if (!query) {
      setFilteredSuggestions([]);
      return;
    }
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSuggestions(filtered);
  }, [query, products]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSelectSuggestion = (product: Product) => {
    saveRecentSearch(product.name);
    setQuery("");
    setFilteredSuggestions([]);
    setShowRecent(false);
  };

  const handleSelectRecent = (item: string) => {
    setQuery(item);
    setShowRecent(false);
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    if (recentSearches.length > 0) setShowRecent(true);
  };

  const handleRemoveRecent = (item: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const newList = prev.filter((i) => i !== item);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newList));
      return newList;
    });
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowRecent(false);
    }, 150);
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

      {/* فقط وقتی query خالیه و سرچ‌های اخیر داریم */}
      {!query && recentSearches.length > 0 && showRecent && (
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

      {/* وقتی query داریم و سرچ‌های اخیر داریم */}
      {query && recentSearches.length > 0 && showRecent && (
        <>
          {/* سرچ‌های اخیر */}
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

          {/* پیشنهادات جستجو */}
          {filteredSuggestions.length > 0 && (
            <ul className="absolute z-20 bg-white w-full rounded-b-2xl max-h-60 overflow-y-auto shadow-lg text-black top-full mt-[calc(1.5rem*10+0.25rem)]">
              {filteredSuggestions.map((product) => (
                <li
                  key={product.id}
                  className="cursor-pointer px-4 py-2 hover:bg-pink-200"
                  onClick={() => handleSelectSuggestion(product)}
                >
                  <Link href={`/Product/${product.id}`}>{product.name}</Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {/* وقتی query داریم ولی هیچ پیشنهادی نیست */}
      {query && filteredSuggestions.length === 0 && (
        <div className="absolute z-10 bg-white w-full rounded-b-2xl max-h-60 overflow-y-auto shadow-lg text-black px-4 py-2 top-full mt-1">
          موردی یافت نشد
        </div>
      )}
    </div>
  );
}
