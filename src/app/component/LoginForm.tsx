"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
}

interface LoginFormProps {
  onLogin: (user: User) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !email.trim()) {
      setMsg("لطفاً همه فیلدها را پر کنید.");
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email }),
      });
      const user = await res.json();
      if (!res.ok) {
        setMsg(user?.error || "خطا در ثبت‌نام");
        setLoading(false);
        return;
      }
      // ذخیره محلی و اطلاع والد
      localStorage.setItem("currentUser", JSON.stringify(user));
      onLogin(user);
      setMsg(`خوش آمدی، ${user.name} ✨`);
      setName(""); setPhone(""); setEmail("");
    } catch (err) {
      console.error(err);
      setMsg("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
      className="max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-br from-[#0b0b0b] via-[#111213] to-[#0f0f10] border border-rose-900 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
    >
      <div className="mb-4 text-center">
        <div className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-200 drop-shadow-md">
          BeautyLand
        </div>
        <p className="text-sm text-gray-300/80 mt-1">عضویت یا ورود به حساب</p>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="نام کامل"
          className="p-3 rounded-xl bg-black/40 border border-rose-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
        />
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="شماره تماس"
          className="p-3 rounded-xl bg-black/40 border border-rose-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ایمیل"
          type="email"
          className="p-3 rounded-xl bg-black/40 border border-rose-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
        />

        <motion.button
          whileHover={{ scale: 1.03, boxShadow: "0 6px 30px rgba(255,200,80,0.25)" }}
          whileTap={{ scale: 0.98 }}
          className="mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-semibold"
          type="submit"
          disabled={loading}
        >
          {loading ? "در حال ثبت..." : "ثبت‌نام / ورود"}
        </motion.button>
      </form>

      {msg && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-center text-sm text-amber-100">
          {msg}
        </motion.div>
      )}

      <div className="mt-4 text-center text-xs text-gray-400">
        اطلاعات شما امن است — BeautyLand ✨
      </div>
    </motion.div>
  );
}
