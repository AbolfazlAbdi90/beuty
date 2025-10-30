"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
}

interface ReviewsProps {
  productId: number;
  currentUser: User | null;
}

export default function Reviews({ productId, currentUser }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);

  const fetchReviews = async () => {
    const res = await fetch(`/api/review?productId=${productId}`);
    const data = await res.json();
    setReviews(data);
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      window.location.href = "/Login";
      return;
    }
    if (!text.trim()) return alert("متن نظر نمی‌تواند خالی باشد.");

    const res = await fetch("/api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        userId: currentUser.id,
        name: currentUser.name,
        text,
        parentId: replyTo,
      }),
    });

    if (res.ok) {
      setText("");
      setReplyTo(null);
      fetchReviews();
    } else {
      alert("خطا در ارسال نظر");
    }
  };

  const handleLike = async (id: string) => {
    if (!currentUser) return (window.location.href = "/Login");
    await fetch("/api/review", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, userId: currentUser.id }),
    });
    fetchReviews();
  };

  const handleDelete = async (id: string, userId: string) => {
    if (!currentUser || currentUser.id !== userId)
      return alert("شما اجازه حذف این نظر را ندارید.");
    await fetch(`/api/review?id=${id}`, { method: "DELETE" });
    fetchReviews();
  };

  const handleReply = (id: string) => setReplyTo(id);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-pink-50 via-white to-pink-100 p-8 rounded-3xl shadow-[0_0_30px_rgba(255,0,128,0.1)] border border-pink-200">
      {/* ✨ عنوان با انیمیشن */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="text-3xl font-extrabold text-center text-pink-600 mb-6 drop-shadow-[0_0_10px_rgba(255,0,128,0.4)]"
      >
        💖 نظرات کاربران BeautyLand 💖
      </motion.h2>

      {/* ✍️ فرم نظر */}
      <AnimatePresence>
        {currentUser && (
          <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 bg-white/40 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-pink-200"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5 }}
          >
            {replyTo && (
              <p className="text-sm text-pink-600">
                در حال پاسخ به یک نظر...{" "}
                <button
                  type="button"
                  onClick={() => setReplyTo(null)}
                  className="text-gray-500 underline"
                >
                  لغو
                </button>
              </p>
            )}

            <motion.textarea
              whileFocus={{ scale: 1.02, borderColor: "#ec4899" }}
              transition={{ type: "spring", stiffness: 150 }}
              placeholder="نظر خود را بنویسید..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="border-2 border-pink-200 p-3 rounded-xl bg-white/70 shadow-inner focus:outline-none"
            />

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(236, 72, 153, 0.6)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-gradient-to-r from-pink-600 to-pink-400 text-white font-semibold py-2 rounded-xl"
            >
              ارسال نظر ✨
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* ❌ اگر لاگین نکرد */}
      {!currentUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6 text-gray-700"
        >
          برای ارسال نظر ابتدا{" "}
          <a href="/Login" className="text-pink-600 font-semibold underline">
            وارد شوید 💅
          </a>
        </motion.div>
      )}

      {/* 💬 لیست نظرات */}
      <div className="mt-8 flex flex-col gap-5">
        {reviews.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center text-gray-500"
          >
            هنوز نظری ثبت نشده 🥲 اولین نفر باش!
          </motion.p>
        ) : (
          reviews.map((review) => (
            <motion.div
              key={review.id}
              className="bg-white/80 p-4 rounded-2xl shadow-md border border-pink-100 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] transition"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold text-pink-700">{review.name}</p>
                <p className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString("fa-IR")}
                </p>
              </div>
              <p className="mt-2 text-gray-700 leading-relaxed">{review.text}</p>

              {/* ❤️ 💬 🗑 */}
              <div className="flex gap-4 text-sm text-gray-500 mt-3">
                <button onClick={() => handleLike(review.id)}>❤️ {review.likes.length}</button>
                <button onClick={() => handleReply(review.id)}>💬 پاسخ</button>
                {currentUser?.id === review.userId && (
                  <button
                    onClick={() => handleDelete(review.id, review.userId)}
                    className="text-red-500"
                  >
                    🗑 حذف
                  </button>
                )}
              </div>

              {/* پاسخ‌ها */}
              {review.replies?.length > 0 && (
                <div className="ml-6 mt-3 border-l-2 border-pink-200 pl-3">
                  {review.replies.map((reply) => (
                    <motion.div
                      key={reply.id}
                      className="bg-pink-50 p-3 rounded-lg mt-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <p className="font-semibold text-pink-600">{reply.name}</p>
                      <p>{reply.text}</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
