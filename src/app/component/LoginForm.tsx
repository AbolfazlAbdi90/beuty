"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  doc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

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
  likes: string[];
  replyTo?: string | null;
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  exit: { opacity: 0, y: 20 },
};

const messageVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.2 } },
};

export default function LoginForm() {
  // فرم ورود و ثبت نام
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({ mode: "onBlur" });

  // فرم ارسال پیام
  const {
    register: registerMessage,
    handleSubmit: handleSubmitMessage,
    reset: resetMessage,
    setValue,
    formState: { errors: errorsMessage },
  } = useForm<MessageFormValues>({ mode: "onBlur" });

  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);

  // بارگذاری کاربر ذخیره شده در localStorage
  useEffect(() => {
    const saved = localStorage.getItem("currentUser");
    if (saved) {
      setCurrentUser(JSON.parse(saved));
    }
  }, []);

  // بارگذاری پیام‌ها از Firestore با به‌روزرسانی زنده
  useEffect(() => {
    if (!currentUser) return;

    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: Message[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data() as Omit<Message, "id">;
        msgs.push({
          id: docSnap.id,
          userId: data.userId,
          userName: data.userName,
          message: data.message,
          createdAt: data.createdAt,
          likes: data.likes || [],
          replyTo: data.replyTo || null,
        });
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // ثبت نام یا ورود کاربر
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

    if (!data.message.trim()) {
      alert("پیام نمی‌تواند خالی باشد!");
      return;
    }

    setSendingMessage(true);
    try {
      await addDoc(collection(db, "messages"), {
        userId: currentUser.id,
        userName: currentUser.name,
        message: data.message.trim(),
        createdAt: serverTimestamp(),
        likes: [],
        replyTo: replyToMessage ? replyToMessage.id : null,
      });

      resetMessage();
      setReplyToMessage(null);
    } catch (err) {
      console.error("خطا در ارسال پیام:", err);
      alert("ارسال پیام موفق نبود.");
    } finally {
      setSendingMessage(false);
    }
  };

  // خروج از حساب
  const handleLogout = () => {
    if (!confirm("آیا می‌خواهید از حساب خارج شوید؟")) return;

    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setMessages([]);
    setReplyToMessage(null);
  };

  // لایک یا آن‌لایک پیام
  const handleLike = async (msg: Message) => {
    if (!currentUser) return;

    const hasLiked = msg.likes.includes(currentUser.id);
    const updatedLikes = hasLiked
      ? msg.likes.filter((id) => id !== currentUser.id)
      : [...msg.likes, currentUser.id];

    try {
      const msgDoc = doc(db, "messages", msg.id);
      await updateDoc(msgDoc, { likes: updatedLikes });
    } catch (err) {
      console.error("خطا در لایک:", err);
    }
  };

  // حذف پیام (فقط برای پیام‌های خود کاربر)
  const handleDelete = async (msg: Message) => {
    if (!currentUser || msg.userId !== currentUser.id) return;

    if (!confirm("آیا مطمئنید می‌خواهید این پیام را حذف کنید؟")) return;

    try {
      await deleteDoc(doc(db, "messages", msg.id));
    } catch (err) {
      console.error("خطا در حذف پیام:", err);
      alert("حذف پیام موفق نبود.");
    }
  };

  // شروع پاسخ دادن به پیام
  const startReply = (msg: Message) => {
    setReplyToMessage(msg);
    setValue("message", `@${msg.userName} `);
  };

  // لغو پاسخ دادن
  const cancelReply = () => {
    setReplyToMessage(null);
    resetMessage();
  };

  // پیام‌های اصلی (بدون پاسخ)
  const rootMessages = messages.filter((msg) => !msg.replyTo);

  // گرفتن پاسخ‌ها برای یک پیام
  const getReplies = (msgId: string) =>
    messages
      .filter((msg) => msg.replyTo === msgId)
      .sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));

  // رندر پیام به همراه پاسخ‌ها به صورت تو در تو
  const renderMessageWithReplies = (msg: Message, level = 0) => {
    const likedByUser = currentUser && msg.likes.includes(currentUser.id);
    const replies = getReplies(msg.id);

    return (
      <motion.div
        key={msg.id}
        variants={messageVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`border border-yellow-400 rounded-3xl p-5 bg-gradient-to-r from-yellow-100 via-yellow-50 to-yellow-100 shadow-lg flex flex-col gap-3 ${
          level > 0 ? "ml-6 border-l-8 border-yellow-300" : ""
        }`}
        style={{ marginRight: level * 20 }}
        whileHover={{ scale: 1.03, boxShadow: "0 8px 15px rgba(255, 193, 7, 0.4)" }}
      >
        <div className="flex justify-between items-center">
          <p className="font-extrabold text-yellow-900 text-lg tracking-wide select-none drop-shadow-lg">
            {msg.userName}
          </p>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => handleLike(msg)}
              className={`flex items-center gap-1 text-sm px-3 py-1 rounded-full font-semibold ${
                likedByUser
                  ? "bg-yellow-500 text-white shadow-md shadow-yellow-400/50"
                  : "bg-yellow-200 text-yellow-900 hover:bg-yellow-300"
              }`}
              whileTap={{ scale: 0.9 }}
              aria-label="لایک پیام"
            >
              {likedByUser ? "❤️" : "🤍"} <span>{msg.likes.length}</span>
            </motion.button>

            {currentUser && msg.userId === currentUser.id && (
              <motion.button
                onClick={() => handleDelete(msg)}
                className="text-white bg-red-500 hover:bg-red-700 px-3 py-1 rounded-full shadow-md shadow-red-400/50 font-semibold"
                whileTap={{ scale: 0.9 }}
                title="حذف پیام"
                aria-label="حذف پیام"
              >
                حذف
              </motion.button>
            )}

            <motion.button
              onClick={() => startReply(msg)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full shadow-md shadow-blue-400/50 font-semibold"
              whileTap={{ scale: 0.9 }}
              title="پاسخ دادن"
              aria-label="پاسخ دادن به پیام"
            >
              پاسخ
            </motion.button>
          </div>
        </div>

        <p className="whitespace-pre-wrap text-yellow-900 text-base leading-relaxed tracking-wide drop-shadow-sm">
          {msg.message}
        </p>

        {replies.length > 0 && (
          <motion.div className="flex flex-col gap-4 mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {replies.map((reply) => renderMessageWithReplies(reply, level + 1))}
          </motion.div>
        )}
      </motion.div>
    );
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto p-6 bg-gradient-to-tr from-yellow-50 via-yellow-100 to-yellow-50 rounded-3xl shadow-2xl"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
    >
      {!currentUser ? (
        <>
          <motion.h2
            className="text-3xl mb-6 font-extrabold text-yellow-700 tracking-wide drop-shadow-md select-none"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
          >
            ورود یا ثبت‌نام
          </motion.h2>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <motion.input
              {...register("name", { required: "نام الزامی است" })}
              placeholder="نام"
              className="border-2 border-yellow-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              aria-invalid={errors.name ? "true" : "false"}
            />
            {errors.name && <p className="text-red-600">{errors.name.message}</p>}

            <motion.input
              {...register("phone", {
                required: "تلفن الزامی است",
                pattern: {
                  value: /^[0-9]{10,15}$/,
                  message: "شماره تلفن معتبر نیست",
                },
              })}
              placeholder="تلفن"
              className="border-2 border-yellow-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              aria-invalid={errors.phone ? "true" : "false"}
            />
            {errors.phone && <p className="text-red-600">{errors.phone.message}</p>}

            <motion.input
              {...register("email", {
                required: "ایمیل الزامی است",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "ایمیل معتبر نیست",
                },
              })}
              placeholder="ایمیل"
              className="border-2 border-yellow-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email && <p className="text-red-600">{errors.email.message}</p>}

            <motion.button
              type="submit"
              disabled={loading || isSubmitting}
              className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-3 rounded-lg shadow-md disabled:opacity-50"
              whileTap={{ scale: 0.95 }}
            >
              {loading ? "در حال ارسال..." : "ورود / ثبت‌نام"}
            </motion.button>
          </form>
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-extrabold text-yellow-700 tracking-wide drop-shadow-md select-none">
              خوش آمدی، {currentUser.name}
            </h2>
            <motion.button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white rounded-lg px-4 py-2 shadow-md"
              whileTap={{ scale: 0.95 }}
              aria-label="خروج از حساب"
            >
              خروج
            </motion.button>
          </div>

          <form onSubmit={handleSubmitMessage(onSendMessage)} className="mb-6 flex flex-col gap-4">
            {replyToMessage && (
              <div className="bg-yellow-100 text-yellow-900 p-3 rounded-lg flex justify-between items-center shadow-inner shadow-yellow-200">
                <p>در حال پاسخ به: <strong>{replyToMessage.userName}</strong></p>
                <button
                  type="button"
                  onClick={cancelReply}
                  className="text-red-500 hover:text-red-700 font-bold"
                  aria-label="لغو پاسخ"
                >
                  لغو پاسخ
                </button>
              </div>
            )}

            <textarea
              {...registerMessage("message", { required: "پیام نمی‌تواند خالی باشد" })}
              rows={3}
              placeholder="پیام خود را بنویسید..."
              className="border-2 border-yellow-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
              aria-invalid={errorsMessage.message ? "true" : "false"}
            />
            {errorsMessage.message && <p className="text-red-600">{errorsMessage.message.message}</p>}

            <motion.button
              type="submit"
              disabled={sendingMessage}
              className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-3 rounded-lg shadow-md disabled:opacity-50"
              whileTap={{ scale: 0.95 }}
            >
              {sendingMessage ? "در حال ارسال..." : "ارسال پیام"}
            </motion.button>
          </form>

          <motion.div
            className="flex flex-col gap-6 max-h-[500px] overflow-y-auto px-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {messages.length === 0 ? (
              <p className="text-center text-yellow-700 font-semibold">هیچ پیامی وجود ندارد.</p>
            ) : (
              rootMessages.map((msg) => renderMessageWithReplies(msg))
            )}
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
