"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCgnoar5Wqv2UsYw9TSCuV3omSQXvT7IcA",
  authDomain: "beautylandapp-896de.firebaseapp.com",
  projectId: "beautylandapp-896de",
  storageBucket: "beautylandapp-896de.firebasestorage.app",
  messagingSenderId: "544616799175",
  appId: "1:544616799175:web:91e7adbb7a04f16bad57e2",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
}

type FormValues = {
  name: string;
  phone: string;
  email: string;
};

type MessageFormValues = {
  message: string;
};

interface Message {
  id: string;
  userId: string;
  userName: string;
  message: string;
  createdAt: any;
}

export default function LoginForm() {
  // فرم لاگین
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ mode: "onBlur" });

  // فرم پیام
  const {
    register: registerMessage,
    handleSubmit: handleSubmitMessage,
    reset: resetMessage,
    formState: { errors: errorsMessage },
  } = useForm<MessageFormValues>({ mode: "onBlur" });

  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sendingMessage, setSendingMessage] = useState(false);

  // بارگذاری کاربر از localStorage
  useEffect(() => {
    const saved = localStorage.getItem("currentUser");
    if (saved) {
      setCurrentUser(JSON.parse(saved));
    }
  }, []);

  // بارگذاری پیام‌ها وقتی کاربر لاگین بود
  useEffect(() => {
    if (!currentUser) return;

    const fetchMessages = async () => {
      const q = query(
        collection(db, "messages"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const msgs: Message[] = [];
      querySnapshot.forEach((doc) => {
        msgs.push({
          id: doc.id,
          ...(doc.data() as Omit<Message, "id">),
        });
      });
      setMessages(msgs);
    };

    fetchMessages();
  }, [currentUser]);

  // ارسال فرم لاگین
  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const q = query(collection(db, "users"), where("email", "==", values.email));
      const querySnapshot = await getDocs(q);

      let user: User;
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        user = { id: docSnap.id, ...(docSnap.data() as Omit<User, "id">) };
      } else {
        const docRef = await addDoc(collection(db, "users"), values);
        user = { id: docRef.id, ...values };
      }

      localStorage.setItem("currentUser", JSON.stringify(user));
      setCurrentUser(user);
      reset();
    } catch (err) {
      console.error("❌ خطا در ثبت:", err);
      alert("مشکلی در ارتباط با سرور پیش آمد!");
    } finally {
      setLoading(false);
    }
  };

  // ارسال پیام
  const onSendMessage = async (data: MessageFormValues) => {
    if (!currentUser) return;

    setSendingMessage(true);
    try {
      const docRef = await addDoc(collection(db, "messages"), {
        userId: currentUser.id,
        userName: currentUser.name,
        message: data.message,
        createdAt: new Date(),
      });

      setMessages((prev) => [
        { id: docRef.id, userId: currentUser.id, userName: currentUser.name, message: data.message, createdAt: new Date() },
        ...prev,
      ]);
      resetMessage();
    } catch (err) {
      console.error("خطا در ارسال پیام:", err);
      alert("ارسال پیام موفق نبود.");
    } finally {
      setSendingMessage(false);
    }
  };

  // خروج از حساب
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setConfirmLogout(false);
    setCurrentUser(null);
    setMessages([]);
    window.location.href = "/Login";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 80 }}
      className="max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-br from-[#0b0b0b] via-[#111213] to-[#0f0f10] border border-rose-900 shadow-[0_10px_40px_rgba(0,0,0,0.6)] text-center"
    >
      <div className="mb-4">
        <div className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-200 drop-shadow-md">
          BeautyLand
        </div>
      </div>

      {currentUser ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4 mb-6"
          >
            <p className="text-amber-300 text-lg font-semibold">
              خوش اومدی {currentUser.name} 🌸
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setConfirmLogout(true)}
              className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-5 py-2 rounded-xl shadow-md hover:shadow-lg font-semibold"
            >
              خروج از حساب
            </motion.button>
          </motion.div>

          {/* فرم پیام */}
          <form
            onSubmit={handleSubmitMessage(onSendMessage)}
            className="flex flex-col gap-3 mb-6"
          >
            <textarea
              {...registerMessage("message", {
                required: "پیام نمی‌تواند خالی باشد.",
                minLength: { value: 3, message: "پیام باید حداقل ۳ حرف باشد." },
              })}
              placeholder="پیام خود را بنویسید..."
              className="w-full p-3 rounded-xl bg-black/40 border border-rose-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none h-24"
            />
            {errorsMessage.message && (
              <p className="text-xs text-red-400">{errorsMessage.message.message}</p>
            )}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={sendingMessage}
              className="py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-semibold"
            >
              {sendingMessage ? "در حال ارسال..." : "ارسال پیام"}
            </motion.button>
          </form>

          {/* نمایش پیام‌ها */}
          <div className="max-h-48 overflow-y-auto bg-black/30 p-3 rounded-lg text-left text-white">
            {messages.length === 0 && <p>هیچ پیامی وجود ندارد.</p>}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-2 p-2 rounded-md ${
                  msg.userId === currentUser.id
                    ? "bg-amber-700 text-amber-100"
                    : "bg-gray-800 text-gray-200"
                }`}
              >
                <p className="text-sm font-semibold">{msg.userName}:</p>
                <p className="whitespace-pre-wrap">{msg.message}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-3"
          noValidate
        >
          <input
            {...register("name", {
              required: "نام اجباری است.",
              minLength: { value: 2, message: "نام باید حداقل ۲ حرف باشد." },
            })}
            placeholder="نام کامل"
            className="w-full p-3 rounded-xl bg-black/40 border border-rose-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          {errors.name && (
            <p className="text-xs text-red-400">{errors.name.message}</p>
          )}

          <input
            {...register("phone", {
              required: "شماره تلفن اجباری است.",
              minLength: { value: 11, message: "شماره باید حداقل ۱۱ رقم باشد." },
            })}
            placeholder="شماره تلفن"
            className="w-full p-3 rounded-xl bg-black/40 border border-rose-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          {errors.phone && (
            <p className="text-xs text-red-400">{errors.phone.message}</p>
          )}

          <input
            {...register("email", {
              required: "ایمیل اجباری است.",
              pattern: {
                value:
                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "ایمیل نامعتبر است.",
              },
            })}
            placeholder="ایمیل"
            className="w-full p-3 rounded-xl bg-black/40 border border-rose-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          {errors.email && (
            <p className="text-xs text-red-400">{errors.email.message}</p>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading || isSubmitting}
            className="py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-semibold"
          >
            {loading ? "در حال بارگذاری..." : "ورود / ثبت نام"}
          </motion.button>
        </form>
      )}

      <AnimatePresence>
        {confirmLogout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-sm w-full text-center"
            >
              <p className="mb-4 text-lg font-semibold">
                آیا مطمئن هستید که می‌خواهید خارج شوید؟
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  بله، خروج
                </button>
                <button
                  onClick={() => setConfirmLogout(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                >
                  لغو
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
