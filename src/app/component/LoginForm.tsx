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
      initial={{ opacity: 0, scale: 0.9, y: -50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 70 }}
      className="max-w-md mx-auto p-8 rounded-3xl bg-gradient-to-br from-black/70 via-gray-900/60 to-black/80 border border-amber-500 shadow-[0_25px_50px_rgba(255,200,0,0.3)] backdrop-blur-md"
    >
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-200 drop-shadow-lg">
          BeautyLand
        </h1>
        <p className="text-gray-300/70 mt-2">عضویت یا ورود به حساب</p>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-4">
        <motion.input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="نام کامل"
          whileFocus={{ scale: 1.02, boxShadow: "0 0 20px rgba(255,200,50,0.5)" }}
          className="p-3 rounded-xl bg-black/50 border border-amber-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <motion.input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="شماره تماس"
          whileFocus={{ scale: 1.02, boxShadow: "0 0 20px rgba(255,200,50,0.5)" }}
          className="p-3 rounded-xl bg-black/50 border border-amber-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <motion.input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ایمیل"
          type="email"
          whileFocus={{ scale: 1.02, boxShadow: "0 0 20px rgba(255,200,50,0.5)" }}
          className="p-3 rounded-xl bg-black/50 border border-amber-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(255,220,100,0.5)" }}
          whileTap={{ scale: 0.97 }}
          className="mt-3 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold text-lg shadow-lg"
          type="submit"
          disabled={loading}
        >
          {loading ? "در حال ثبت..." : "ثبت‌نام / ورود"}
        </motion.button>
      </form>

      {msg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center text-amber-100 font-medium"
        >
          {msg}
        </motion.div>
      )}

      <div className="mt-6 text-center text-xs text-gray-400">
        اطلاعات شما امن است — BeautyLand ✨
      </div>
    </motion.div>
  );
}
