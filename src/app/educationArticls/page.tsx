"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Article } from "@/app/api/articles/route";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch("/api/articles")
      .then(res => res.json())
      .then(data => setArticles(data))
      .finally(() => setLoading(false));
  }, []);

  const displayed = showAll ? articles : articles.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto p-6">
      

      {loading ? (
        <p>در حال بارگذاری...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayed.map(article => (
              <Link key={article.id} href={`/educationArticls/${article.id}`} className="block rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition">
                <div className="relative w-full h-48 bg-gray-200">
                  {article.image ? (
                    <Image src={article.image} alt={article.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">بدون تصویر</div>
                  )}
                </div>
                <h2 className="text-xl font-semibold mt-2 p-2">{article.title}</h2>
              </Link>
            ))}
          </div>
          {articles.length > 6 && (
            <div className="flex justify-center mt-4" >
                <button
              className="mt-4 cursor-pointer px-6 py-2 bg-pink-600 text-white rounded-lg"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "نمایش کمتر" : "نمایش همه مقالات"}
            </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
