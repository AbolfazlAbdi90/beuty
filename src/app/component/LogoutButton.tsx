"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LogoutButton() {
  const [confirming, setConfirming] = useState(false);

  const handleLogout = () => {
    // حذف اطلاعات کاربر از localStorage
    localStorage.removeItem("currentUser");
    // انتقال به صفحه لاگین
    window.location.href = "/Login";
  };

  return (
    <div className="relative inline-block">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setConfirming(true)}
        className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg font-semibold"
      >
        خروج از حساب
      </motion.button>

      <AnimatePresence>
        {confirming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="bg-white rounded-2xl shadow-xl p-6 max-w-sm text-center"
            >
              <h2 className="text-lg font-bold text-gray-800 mb-3">
                آیا مطمئنی می‌خوای از حساب خود خارج شی؟ 😢
              </h2>
              <p className="text-sm text-gray-600 mb-5">
                اگر تأیید کنی، باید دوباره وارد حساب بشی.
              </p>
              <div className="flex justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow-sm"
                >
                  ✅ تأیید
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setConfirming(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold"
                >
                  ❌ لغو
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
