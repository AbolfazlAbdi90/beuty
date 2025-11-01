"use client";

import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  Timestamp,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";

interface Review {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: Timestamp;
  likes?: number; // اضافه کردم برای تعداد لایک
  replies?: Review[]; // اضافه کردم برای پاسخ‌ها
}

interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
}

interface ReviewsProps {
  productId: number | string;
  currentUser: User | null;
}

export default function Reviews({ productId, currentUser }: ReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReviewText, setNewReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // واکشی نظرات با اضافه کردن تعداد لایک و پاسخ‌ها به هر پیام
  const fetchReviews = async () => {
    try {
      const q = query(
        collection(db, "reviews"),
        where("productId", "==", productId),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const revs: Review[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        userId: doc.data().userId,
        userName: doc.data().userName,
        text: doc.data().text,
        createdAt: doc.data().createdAt,
        likes: doc.data().likes || 0, // تعداد لایک
        replies: doc.data().replies || [], // پاسخ‌ها (آرایه خالی اگر نداشته باشد)
      }));
      setReviews(revs);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  // ارسال نظر جدید
  const handleAddReview = async () => {
    if (!currentUser) {
      alert("برای ارسال نظر لطفا وارد حساب کاربری شوید.");
      return;
    }
    if (!newReviewText.trim()) return;

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "reviews"), {
        productId,
        userId: currentUser.id,
        userName: currentUser.name,
        text: newReviewText.trim(),
        createdAt: Timestamp.now(),
        likes: 0,
        replies: [],
      });
      setNewReviewText("");
      setReviews((prev) => [
        {
          id: docRef.id,
          userId: currentUser.id,
          userName: currentUser.name,
          text: newReviewText.trim(),
          createdAt: Timestamp.now(),
          likes: 0,
          replies: [],
        },
        ...prev,
      ]);
    } catch (error) {
      console.error("Error adding review:", error);
      alert("خطا در ارسال نظر");
    } finally {
      setLoading(false);
    }
  };

  // لایک پیام
  const handleLike = async (id: string) => {
    try {
      // آپدیت محلی
      setReviews((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, likes: (r.likes || 0) + 1 } : r
        )
      );
      // آپدیت دیتابیس
      const reviewRef = doc(db, "reviews", id);
      await updateDoc(reviewRef, {
        likes: (reviews.find((r) => r.id === id)?.likes || 0) + 1,
      });
    } catch (error) {
      console.error("Error liking review:", error);
    }
  };

  // پاسخ دادن به پیام
  const handleReply = async (id: string, text: string) => {
    if (!currentUser) {
      alert("برای پاسخ دادن باید وارد شوید.");
      return;
    }
    if (!text.trim()) return;

    try {
      // ساخت آبجکت پاسخ
      const reply: Review = {
        id: Math.random().toString(36).slice(2), // شناسه موقت
        userId: currentUser.id,
        userName: currentUser.name,
        text: text.trim(),
        createdAt: Timestamp.now(),
        likes: 0,
        replies: [],
      };
      // آپدیت محلی
      setReviews((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, replies: [...(r.replies || []), reply] } : r
        )
      );
      // آپدیت دیتابیس - پاسخ‌ها رو به آرایه اضافه می‌کنیم
      const reviewRef = doc(db, "reviews", id);
      const currentReplies = reviews.find((r) => r.id === id)?.replies || [];
      await updateDoc(reviewRef, {
        replies: [...currentReplies, reply],
      });

      setReplyingTo(null);
      setReplyText("");
    } catch (error) {
      console.error("Error replying to review:", error);
      alert("خطا در ارسال پاسخ");
    }
  };

  // حذف پیام (فقط پیام خود کاربر)
  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "reviews", id));
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("خطا در حذف پیام");
    }
  };

  // دکمه خروج از حساب
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/Login";
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-2xl text-white">
      <h2 className="text-3xl font-extrabold mb-6 text-center tracking-wide drop-shadow-lg">
        نظرات کاربران
      </h2>

      {/* فرم ارسال نظر فقط وقتی کاربر لاگین هست */}
      {currentUser ? (
        <div className="mb-6">
          <textarea
            className="w-full p-4 rounded-2xl resize-none border-2 border-yellow-400 bg-gray-900 placeholder-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-500 text-yellow-100 shadow-lg"
            rows={4}
            placeholder="نظر خود را اینجا بنویسید..."
            value={newReviewText}
            onChange={(e) => setNewReviewText(e.target.value)}
          />
          <button
            onClick={handleAddReview}
            disabled={loading || !newReviewText.trim()}
            className="mt-3 w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-2xl shadow-xl transition-transform active:scale-95 disabled:bg-gray-600"
          >
            {loading ? "در حال ارسال..." : "ارسال نظر"}
          </button>
        </div>
      ) : (
        <p className="mb-6 text-center text-yellow-300 font-semibold">
          برای ارسال نظر لطفا ابتدا وارد حساب کاربری شوید.
        </p>
      )}

      {/* لیست نظرات با انیمیشن */}
      <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-gray-800">
        <AnimatePresence initial={false}>
          {reviews.length ? (
            reviews.map((rev) => (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, x: 100, scale: 0.85 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.85 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-end bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 rounded-3xl p-5 shadow-xl max-w-xl"
              >
                {/* نام کاربر */}
                <p className="font-semibold text-black text-lg select-none mb-1">
                  {rev.userName}
                </p>

                {/* متن پیام */}
                <p className="text-black text-base whitespace-pre-wrap">
                  {rev.text}
                </p>

                {/* زمان پیام */}
                <p className="text-xs text-gray-700 mt-2 select-none">
                  {rev.createdAt.toDate().toLocaleString("fa-IR")}
                </p>

                {/* دکمه‌های لایک، پاسخ، حذف */}
                <div className="flex gap-5 mt-3 text-yellow-900 font-semibold select-none">
                  <button
                    onClick={() => handleLike(rev.id)}
                    className="flex items-center gap-1 hover:text-yellow-700 transition"
                    aria-label="لایک پیام"
                    title="لایک"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-6 h-6 ${
                        (rev.likes || 0) > 0
                          ? "fill-yellow-500 stroke-yellow-700"
                          : "stroke-current"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                    {(rev.likes || 0) > 0 ? rev.likes : ""}
                  </button>

                  <button
                    onClick={() =>
                      setReplyingTo(replyingTo === rev.id ? null : rev.id)
                    }
                    className="hover:text-yellow-700 transition"
                    aria-label="پاسخ دادن"
                    title="پاسخ"
                  >
                    پاسخ
                  </button>

                  {rev.userId === currentUser?.id && (
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            "آیا از حذف این پیام مطمئن هستید؟ این عمل غیرقابل بازگشت است."
                          )
                        )
                          handleDelete(rev.id);
                      }}
                      className="hover:text-red-600 transition"
                      aria-label="حذف پیام"
                      title="حذف"
                    >
                      حذف
                    </button>
                  )}
                </div>

                {/* فرم پاسخ */}
                {replyingTo === rev.id && (
                  <motion.form
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleReply(rev.id, replyText);
                    }}
                    className="mt-4 flex flex-col gap-2"
                  >
                    <textarea
                      className="w-full p-3 rounded-lg resize-none border-2 border-yellow-400 bg-gray-900 placeholder-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-500 text-yellow-100 shadow-inner"
                      rows={3}
                      placeholder="متن پاسخ را بنویسید..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText("");
                        }}
                        className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition text-yellow-300"
                      >
                        انصراف
                      </button>
                      <button
                        type="submit"
                        disabled={!replyText.trim()}
                        className="px-4 py-2 bg-yellow-400 rounded-lg text-black font-bold hover:bg-yellow-500 disabled:bg-gray-600 transition"
                      >
                        ارسال پاسخ
                      </button>
                    </div>
                  </motion.form>
                )}

                {/* نمایش پاسخ‌ها */}
                {rev.replies && rev.replies.length > 0 && (
                  <div className="mt-4 w-full pr-6 border-r-4 border-yellow-700">
                    {rev.replies.map((rep) => (
                      <div
                        key={rep.id}
                        className="bg-yellow-100 text-black rounded-xl p-3 my-2 shadow-inner"
                      >
                        <p className="font-semibold text-sm">{rep.userName}</p>
                        <p className="whitespace-pre-wrap">{rep.text}</p>
                        <p className="text-xs text-gray-600 mt-1 select-none">
                          {rep.createdAt.toDate
                            ? rep.createdAt.toDate().toLocaleString("fa-IR")
                            : new Date().toLocaleString("fa-IR")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <p className="text-center text-yellow-300 font-semibold mt-10">
              هنوز نظری ثبت نشده است.
            </p>
          )}
        </AnimatePresence>
      </div>

      {/* دکمه خروج از حساب */}
      {currentUser && (
        <div className="mt-8 text-center">
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 shadow-lg transition"
          >
            خروج از حساب
          </button>
        </div>
      )}
    </div>
  );
}
