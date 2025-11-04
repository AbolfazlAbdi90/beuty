"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase"; // فرض می‌کنم db را همان‌طور که قبلاً ساخته‌ای صادر کرده‌ای

// ----- تایپ‌ها -----
export interface User {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

export interface ReviewItem {
  id: string;
  userId: string;
  userName: string;
  message: string;
  createdAt: any;
  likes: string[]; // لیست userId‌هایی که لایک زده‌اند
  replyTo?: string | null;
}

export interface ReviewsProps {
  productId: number | string;
  currentUser: User;
}

// انیمیشن‌ها (با تایپ)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const messageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

// ----- کامپوننت -----
export default function Reviews({ productId, currentUser }: ReviewsProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<ReviewItem | null>(null);
  const [sending, setSending] = useState(false);

  // subscribe -> دریافت زنده‌ی نظرات مرتبط با productId
  useEffect(() => {
    const q = query(
      collection(db, "reviews"),
      orderBy("createdAt", "desc")
    );

    // چون فیلتر بر اساس productId داریم، ولی نمی‌خواهم where نادرست بزنم (ممکنه undefined باشه)
    // پس فیلتر سمت کلاینت انجام میشه بعد از گرفتن اسنپ‌شات
    const unsubscribe = onSnapshot(q, (snap) => {
      const rows: ReviewItem[] = [];
      snap.forEach((d) => {
        const data = d.data() as any;
        // فقط نظراتِ مربوط به این محصول را بپذیر
        if (String(data.productId) !== String(productId)) return;
        rows.push({
  id: d.id,
  userId: data.userId,
  userName: data.userName,
  message: data.message,
  createdAt: data.createdAt,
  // ✅ تضمین اینکه likes همیشه آرایه است
  likes: Array.isArray(data.likes) ? data.likes : [],
  replyTo: data.replyTo ?? null,
});

      });
      setReviews(rows);
    });

    return () => unsubscribe();
  }, [productId]);

  // ارسال پیام یا پاسخ
  const handleSend = async () => {
    if (!currentUser) {
      // اگر جایی دیگر لاگین رو مدیریت کردی، این فقط ایمن سازیه
      alert("برای ارسال نظر ابتدا وارد شوید.");
      return;
    }
    if (!text.trim()) return;
    setSending(true);
    try {
      await addDoc(collection(db, "reviews"), {
        productId,
        userId: currentUser.id,
        userName: currentUser.name,
        message: text.trim(),
        createdAt: serverTimestamp(),
        likes: [],
        replyTo: replyTo ? replyTo.id : null,
      });
      setText("");
      setReplyTo(null);
    } catch (err) {
      console.error("خطا در ارسال نظر:", err);
      alert("ارسال نظر موفق نبود.");
    } finally {
      setSending(false);
    }
  };

  // لایک (هر کاربر فقط یک بار): ذخیره userId در آرایه likes
  const toggleLike = async (r: ReviewItem) => {
    if (!currentUser) {
      alert("برای لایک کردن ابتدا وارد شوید.");
      return;
    }
    try {
      const reviewRef = doc(db, "reviews", r.id);
      const liked = r.likes.includes(currentUser.id);
      const newLikes = liked ? r.likes.filter((id) => id !== currentUser.id) : [...r.likes, currentUser.id];
      await updateDoc(reviewRef, { likes: newLikes });
    } catch (err) {
      console.error("خطا در لایک:", err);
    }
  };

  // حذف (فقط صاحب نظر)
  const handleDelete = async (r: ReviewItem) => {
    if (r.userId !== currentUser.id) {
      alert("فقط می‌توانید نظرات خود را حذف کنید.");
      return;
    }
    if (!confirm("آیا از حذف نظر مطمئنید؟")) return;
    try {
      await deleteDoc(doc(db, "reviews", r.id));
    } catch (err) {
      console.error("خطا در حذف:", err);
    }
  };

  // شروع پاسخ دادن
  const startReply = (r: ReviewItem) => {
    setReplyTo(r);
    setText(`@${r.userName} `);
  };

  // گرفتن نظرات اصلی (بدون replyTo) و پاسخ‌ها
  const rootReviews = reviews.filter((r) => !r.replyTo);
  const getReplies = (id: string) => reviews.filter((r) => r.replyTo === id).sort((a, b) => {
    const aSec = a.createdAt?.seconds ?? 0;
    const bSec = b.createdAt?.seconds ?? 0;
    return aSec - bSec;
  });

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-md border border-pink-100">
      <h3 className="text-2xl font-bold text-center text-pink-600 mb-4">نظرات کاربران</h3>

      {/* فرم ارسال */}
      <div className="mb-4">
        {replyTo && (
          <div className="mb-2 p-2 bg-pink-50 rounded flex justify-between items-center text-sm">
            <div>در حال پاسخ به: <strong>{replyTo.userName}</strong></div>
            <button onClick={() => { setReplyTo(null); setText(""); }} className="text-red-500">لغو</button>
          </div>
        )}

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={replyTo ? `پاسخ به ${replyTo.userName}` : "نظر خود را بنویسید..."}
          className="w-full border border-pink-200 rounded-lg p-3 resize-none focus:ring-2 focus:ring-pink-300"
          rows={3}
        />
        <div className="flex gap-3 mt-3">
          <button
            onClick={handleSend}
            disabled={sending}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600"
          >
            {sending ? "در حال ارسال..." : "ارسال نظر"}
          </button>
          {replyTo && (
            <button onClick={() => { setReplyTo(null); setText(""); }} className="px-4 py-2 rounded-lg border">لغو پاسخ</button>
          )}
        </div>
      </div>

      {/* لیست نظرات */}
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-4">
        {rootReviews.length === 0 ? (
          <p className="text-center text-pink-400">هنوز نظری ثبت نشده است 💗</p>
        ) : (
          rootReviews.map((r) => {
            const replies = getReplies(r.id);
            const likedByUser = r.likes.includes(currentUser.id);
            return (
              <div key={r.id} className="bg-pink-50 border border-pink-100 rounded-2xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-pink-700">{r.userName}</div>
                    <div className="text-gray-600 mt-1 whitespace-pre-wrap">{r.message}</div>
                    <div className="text-xs text-gray-400 mt-2">
                      {r.createdAt?.toDate ? r.createdAt.toDate().toLocaleString("fa-IR") : ""}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button onClick={() => toggleLike(r)} className={`px-3 py-1 rounded-full ${likedByUser ? "bg-pink-600 text-white" : "bg-white text-pink-600 border border-pink-200"}`}>
                      ❤️ {r.likes.length}
                    </button>

                    <div className="flex gap-2">
                      <button onClick={() => startReply(r)} className="text-sm text-gray-600 hover:text-pink-600">پاسخ</button>
                      {r.userId === currentUser.id && <button onClick={() => handleDelete(r)} className="text-sm text-red-500">حذف</button>}
                    </div>
                  </div>
                </div>

                {/* پاسخ‌ها */}
                {replies.length > 0 && (
                  <div className="mt-4 border-r-4 border-pink-200 pr-4 space-y-3">
                    {replies.map((rep) => (
                      <div key={rep.id} className="bg-white rounded-xl p-3">
                        <div className="flex justify-between">
                          <strong className="text-pink-700">{rep.userName}</strong>
                          <div className="text-xs text-gray-400">
                            {rep.createdAt?.toDate ? rep.createdAt.toDate().toLocaleString("fa-IR") : ""}
                          </div>
                        </div>
                        <div className="mt-2 text-gray-700">{rep.message}</div>
                        <div className="flex justify-end gap-2 mt-2">
                          <button onClick={() => toggleLike(rep)} className={`text-sm ${rep.likes.includes(currentUser.id) ? "text-pink-600" : "text-gray-500"}`}>
                            ❤️ {rep.likes.length}
                          </button>
                          {rep.userId === currentUser.id && <button onClick={() => handleDelete(rep)} className="text-sm text-red-500">حذف</button>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </motion.div>
    </div>
  );
}
