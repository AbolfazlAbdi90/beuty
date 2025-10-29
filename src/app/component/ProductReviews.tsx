"use client";
import { useState, useEffect } from "react";

interface Review {
  id: string;
  productId: number;
  userId: string;
  name: string;
  text: string;
  createdAt: string;
  likes: string[];
  replies: Review[];
}

interface ReviewsProps {
  productId: number;
  currentUserId: string;
}

export default function Reviews({ productId, currentUserId }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [replyId, setReplyId] = useState<string | null>(null);

  const fetchReviews = async () => {
    const res = await fetch(`/api/review?productId=${productId}`);
    const data: Review[] = await res.json();
    setReviews(data);
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (parentId?: string) => {
    if (!name || !text) return;

    const res = await fetch("/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, userId: currentUserId, name, text, parentId }),
    });

    const newReview: Review = await res.json();

    if (parentId) {
      setReviews(prev =>
        prev.map(r =>
          r.id === parentId ? { ...r, replies: [newReview, ...r.replies] } : r
        )
      );
      setReplyId(null);
    } else {
      setReviews(prev => [newReview, ...prev]);
    }

    setName("");
    setText("");
  };

  const handleLike = async (id: string, parentId?: string) => {
    await fetch("/api/review", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, userId: currentUserId, parentId }),
    });

    fetchReviews(); // بعد از لایک مجدد کلاینت آپدیت می‌شود
  };

  const handleDelete = async (id: string, parentId?: string, ownerId?: string) => {
    if (ownerId !== currentUserId) return; // فقط صاحب نظر می‌تواند حذف کند
    // می‌توانی بعداً DELETE API اضافه کنی
    if (parentId) {
      setReviews(prev =>
        prev.map(r =>
          r.id === parentId
            ? { ...r, replies: r.replies.filter(rep => rep.id !== id) }
            : r
        )
      );
    } else {
      setReviews(prev => prev.filter(r => r.id !== id));
    }
  };

  const renderReview = (r: Review, level = 0, parentId?: string) => (
    <div
      key={r.id}
      className={`p-3 rounded-lg shadow-sm mb-4 border ${level === 0 ? "bg-white" : "bg-gray-50"}`}
      style={{ marginLeft: level * 20 }}
    >
      <div className="flex justify-between items-center mb-1">
        <strong>{r.name}</strong>
        {r.userId === currentUserId && (
          <button
            className="text-red-500 text-xs hover:underline"
            onClick={() => handleDelete(r.id, parentId, r.userId)}
          >
            حذف
          </button>
        )}
      </div>
      <p className="mb-2">{r.text}</p>
      <div className="flex gap-3 items-center text-xs mb-2">
        <button
          className="hover:text-pink-600 transition-colors"
          onClick={() => handleLike(r.id, parentId)}
        >
          {r.likes?.includes(currentUserId) ? "♥" : "♡"} {r.likes?.length || 0}
        </button>
        <button
          className="text-pink-600 hover:underline transition"
          onClick={() => setReplyId(r.id)}
        >
          پاسخ
        </button>
        <span className="text-gray-400">{new Date(r.createdAt).toLocaleString()}</span>
      </div>

      {replyId === r.id && (
        <div className="flex flex-col gap-2 mt-2">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="نام شما"
            className="border p-2 rounded"
          />
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="پاسخ شما"
            className="border p-2 rounded"
          />
          <button
            onClick={() => handleSubmit(r.id)}
            className="bg-pink-600 text-white p-2 rounded w-24"
          >
            ثبت
          </button>
        </div>
      )}

      {r.replies.map(rep => renderReview(rep, level + 1, r.id))}
    </div>
  );

  return (
    <div className="mt-10 p-4 rounded-lg shadow bg-gray-100 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">نظرات کاربران</h2>

      <div className="flex flex-col gap-2 mb-6">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="نام شما"
          className="border p-2 rounded"
        />
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="نظر شما"
          className="border p-2 rounded"
        />
        <button
          onClick={() => handleSubmit()}
          className="bg-pink-600 text-white p-2 rounded w-32 mx-auto"
        >
          ثبت نظر
        </button>
      </div>

      {reviews.length === 0 && <p className="text-gray-500 text-center">هیچ نظری ثبت نشده است.</p>}

      <div>{reviews.map(r => renderReview(r))}</div>
    </div>
  );
}
