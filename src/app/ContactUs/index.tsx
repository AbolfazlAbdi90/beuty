"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const BOT_TOKEN = "8298102290:AAHS39MUeN14b025Y2D1GIJr49O9bBhXlPE";
  const CHAT_ID = "6826669340";

  const sendMessage = async (e: any) => {
    e.preventDefault();

    if (!name || !phone || !message) {
      setStatus("لطفاً همه‌ی فیلدها را پر کنید ⚠️");
      return;
    }

    const text = `
📩 درخواست پشتیبانی جدید از فرم سایت Beautyland
---------------------------
👤 نام: ${name}
📞 شماره موبایل: ${phone}
📝 توضیحات: ${message}
`;

    try {
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text,
        }),
      });

      if (res.ok) {
        setStatus("✅ پیام شما با موفقیت ارسال شد!");
        setName("");
        setPhone("");
        setMessage("");
      } else {
        setStatus("❌ خطا در ارسال پیام. دوباره تلاش کنید.");
      }
    } catch (error) {
      console.error(error);
      setStatus("❌ خطا در اتصال به سرور تلگرام.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-100 to-pink-200 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-white/90 backdrop-blur-md p-10 sm:p-12 rounded-3xl shadow-2xl border border-pink-300 max-w-lg w-full text-center"
      >
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-extrabold mb-6 text-pink-700 drop-shadow-md"
        >
          تماس با پشتیبانی Beautyland
        </motion.h1>

        <form onSubmit={sendMessage} className="flex flex-col gap-5 text-right">
          <input
            type="text"
            placeholder="نام شما"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-4 rounded-2xl border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm placeholder-pink-400 text-gray-700"
          />

          <input
            type="tel"
            placeholder="شماره موبایل"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="p-4 rounded-2xl border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm placeholder-pink-400 text-gray-700"
          />

          <textarea
            placeholder="توضیحات مشکل شما..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="p-4 rounded-2xl border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-sm placeholder-pink-400 text-gray-700 h-32 resize-none"
          ></textarea>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-gradient-to-r from-pink-600 via-red-500 to-pink-600 text-white font-extrabold py-4 rounded-full shadow-lg transition-all duration-300"
          >
            🚀 ارسال به پشتیبانی
          </motion.button>
        </form>

        {status && (
          <p className="mt-6 text-pink-700 font-semibold">{status}</p>
        )}
      </motion.div>
    </div>
  );
}
