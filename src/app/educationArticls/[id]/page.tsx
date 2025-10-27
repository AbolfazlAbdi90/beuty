"use client";

import Container from "@/app/component/container";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";
import ArticlesPage from "../page";

interface Article {
  id: number;
  title: string;
  image: string;
  content: string;
}

async function fetchArticle(id: string): Promise<Article | undefined> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
  const res = await fetch(`${baseUrl}/api/articles`, { cache: "no-store" });
  if (!res.ok) return undefined;
  const articles: Article[] = await res.json();
  return articles.find((a) => String(a.id) === id);
}

export default function ArticleDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const {
    data: article,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["article", id],
    queryFn: () => fetchArticle(id),
  });

  if (isLoading)
    return (
      <p className="text-center py-20 text-gray-500">در حال بارگذاری...</p>
    );
  if (isError || !article)
    return (
      <p className="text-center py-20 text-gray-500">
        مقاله مورد نظر پیدا نشد 😔
      </p>
    );

  return (
    <Container>
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
      {/* عکس */}
      <div className="md:col-span-5 w-full h-64 md:h-[400px] relative rounded-2xl overflow-hidden shadow-xl">
        {article.image ? (
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            بدون تصویر
          </div>
        )}
      </div>

      {/* توضیحات */}
      <div className="md:col-span-7 flex flex-col md:mt-[60px] justify-start">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
          {article.title}
        </h1>
        <p className="text-gray-700 text-base md:text-lg leading-8 whitespace-pre-line">
          {article.content}
        </p>
      </div>
      
    </div>
    <div className="flex gap-4 mr-46 mt-12 " >
        <img src="/image/articls/articls.png" alt="articls"></img>
        <h2 className="font-bold text-2xl" >همه مقالات</h2>
      </div>
      <ArticlesPage />
    </Container>
  )
}
