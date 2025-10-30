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

interface LoginFormProps {
  onLogin: (user: User) => void;
}

type FormValues = {
  name: string;
  phone: string;
  email: string;
};

export default function LoginForm({ onLogin }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    mode: "onBlur", // اعتبارسنجی در blur و submit
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const user = await res.json();
      if (!res.ok) {
        // اگر API پیغام خطا داد، نمایش alert یا handle کن
        alert(user?.error || "خطا در ثبت‌نام");
        return;
      }
      // ذخیره در localStorage و اطلاع parent
      localStorage.setItem("currentUser", JSON.stringify(user));
      onLogin(user);
      reset();
      // پیام تصویری کوتاه
      // (می‌تونی این را به state تبدیل کنی و نمایش دهی)
      // alert(`خوش آمدی، ${user.name} ✨`);
    } catch (err) {
      console.error(err);
      alert("خطا در ارتباط با سرور");
    }
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
        {/* نام */}
        <div>
          <input
            {...register("name", {
              required: "نام اجباری است.",
              minLength: { value: 2, message: "نام باید حداقل ۲ حرف باشد." },
              maxLength: { value: 60, message: "نام خیلی طولانی است." },
              setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
            })}
            placeholder="نام کامل"
            aria-invalid={errors.name ? "true" : "false"}
            className="w-full p-3 rounded-xl bg-black/40 border border-rose-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          {errors.name && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-1 text-xs text-red-400"
              role="alert"
            >
              {errors.name.message}
            </motion.p>
          )}
        </div>

        {/* شماره تلفن */}
        <div>
          <input
            {...register("phone", {
              required: "شماره تماس اجباری است.",
              // حذف فاصله‌ها و نمادها
              setValueAs: (v) => (typeof v === "string" ? v.replace(/\D/g, "") : v),
              validate: {
                startsWith09: (v) =>
                  /^09\d{9}$/.test(v) || "شماره باید با 09 شروع کند و شامل 11 رقم باشد.",
                exactLength: (v) =>
                  v && v.length === 11 || "شماره باید دقیقا 11 رقم باشد.",
              },
            })}
            placeholder="شماره تماس (مثال: 09123456789)"
            aria-invalid={errors.phone ? "true" : "false"}
            inputMode="numeric"
            className="w-full p-3 rounded-xl bg-black/40 border border-rose-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          {errors.phone && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1 text-xs text-red-400">
              {errors.phone.message as string}
            </motion.p>
          )}
        </div>

        {/* ایمیل */}
        <div>
          <input
            {...register("email", {
              required: "ایمیل اجباری است.",
              pattern: {
                // regex ساده و قابل‌پذیرش برای ایمیل
                value:
                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "فرمت ایمیل نامعتبر است.",
              },
              setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
            })}
            placeholder="ایمیل"
            type="email"
            aria-invalid={errors.email ? "true" : "false"}
            className="w-full p-3 rounded-xl bg-black/40 border border-rose-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
          {errors.email && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-1 text-xs text-red-400">
              {errors.email.message as string}
            </motion.p>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.03, boxShadow: "0 6px 30px rgba(255,200,80,0.25)" }}
          whileTap={{ scale: 0.98 }}
          className="mt-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-semibold"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "در حال ثبت..." : "ثبت‌نام / ورود"}
        </motion.button>
      </form>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center text-xs text-gray-400">
        اطلاعات شما امن است — BeautyLand ✨
      </motion.div>
    </motion.div>
  );
}
