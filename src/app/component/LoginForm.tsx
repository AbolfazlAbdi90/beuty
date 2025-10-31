"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

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

interface LoginFormProps {
  onLogin: (user: User) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    mode: "onBlur",
  });

  const onSubmit = (values: FormValues) => {
    // ساخت user و ذخیره در localStorage
    const user: User = { ...values, id: Date.now().toString() };
    localStorage.setItem("currentUser", JSON.stringify(user));
    onLogin(user);
    reset();
    alert(`خوش آمدی، ${user.name} ✨`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 80 }}
      className="max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-br from-[#0b0b0b] via-[#111213] to-[#0f0f10] border border-rose-900 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
    >
      <div className="mb-4 text-center">
        <div className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-200 drop-shadow-md">
          BeautyLand
        </div>
        <p className="text-sm text-gray-300/80 mt-1">عضویت یا ورود به حساب</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
        <input
          {...register("name", { required: "نام اجباری است.", minLength: { value: 2, message: "نام باید حداقل ۲ حرف باشد." } })}
          placeholder="نام کامل"
          className="w-full p-3 rounded-xl bg-black/40 border border-rose-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
        />
        {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}

        <input
          {...register("phone", { required: "شماره تماس اجباری است.", pattern: { value: /^09\d{9}$/, message: "شماره باید با 09 شروع کند و شامل 11 رقم باشد." } })}
          placeholder="شماره تماس (مثال: 09123456789)"
          className="w-full p-3 rounded-xl bg-black/40 border border-rose-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
        />
        {errors.phone && <p className="text-xs text-red-400">{errors.phone.message}</p>}

        <input
          {...register("email", { required: "ایمیل اجباری است.", pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "ایمیل نامعتبر است." } })}
          placeholder="ایمیل"
          className="w-full p-3 rounded-xl bg-black/40 border border-rose-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
        />
        {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}

        <motion.button
          type="submit"
          whileHover={{ scale: 1.03, boxShadow: "0 6px 30px rgba(255,200,80,0.25)" }}
          whileTap={{ scale: 0.98 }}
          className="mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-semibold"
          disabled={isSubmitting}
        >
          {isSubmitting ? "در حال ثبت..." : "ثبت‌نام / ورود"}
        </motion.button>
      </form>
    </motion.div>
  );
}
