"use client";

import React, { useState, useEffect } from "react";
import Container from "../component/container";
import LoginForm from "../component/LoginForm";
import Reviews from "../component/ProductReviews";

interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
}

export default function Page() {
  const [user, setUser] = useState<User | null>(null);

  // 🎯 بازیابی کاربر از localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // ✅ کنترل ورود و خروج
  const handleLogin = (userData: User | null) => {
    if (userData) {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  return (
    <Container>
      {!user ? (
        // ✅ فرم لاگین
        <LoginForm />
      ) : (
        // ✅ بعد از ورود
        <div className="flex flex-col items-center gap-6 p-4">
          <h2 className="text-2xl font-semibold text-pink-700">
            سلام {user.name}! 👋 خوش اومدی 💄
          </h2>

          {/* ✅ فرستادن کل اطلاعات کاربر به کامپوننت Reviews */}
          <Reviews productId={1} currentUser={user} />

          <button
            onClick={() => handleLogin(null)} // خروج از حساب
            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-all"
          >
            خروج از حساب
          </button>
        </div>
      )}
    </Container>
  );
}
