import React, { useState, useEffect } from "react";
import { ClipboardCopy, Check } from "lucide-react"; // ← آیکون‌ها

interface DiscountProps {
  totalPrice: number;
  onApplyDiscount: (discountAmount: number) => void;
}

export default function Discount({ totalPrice, onApplyDiscount }: DiscountProps) {
  const [couponInput, setCouponInput] = useState("");
  const [message, setMessage] = useState("");
  const [discountUsed, setDiscountUsed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const [generatedCode, setGeneratedCode] = useState("");
  const [generatedPercent, setGeneratedPercent] = useState<number | null>(null);
  const [showCode, setShowCode] = useState(false);

  const [copied, setCopied] = useState(false); // ← حالت کپی

  const createRandomCode = () => {
    return "DIS-" + Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const getPercent = (price: number) => {
    if (price >= 3_000_000) return 13;
    if (price >= 2_000_000) return 10;
    if (price >= 1_000_000) return 5;
    return 0;
  };

  useEffect(() => {
    const percent = getPercent(totalPrice);

    if (percent === 0) {
      resetDiscount();
      return;
    }

    const newCode = createRandomCode();
    setGeneratedCode(newCode);
    setGeneratedPercent(percent);
    setShowCode(true);
    setDiscountUsed(false);
    setTimeLeft(60);
  }, [totalPrice]);

  useEffect(() => {
    if (!showCode || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          resetDiscount();
          setMessage("⛔ کد تخفیف منقضی شد.");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showCode, timeLeft]);

  const resetDiscount = () => {
    setShowCode(false);
    setGeneratedCode("");
    setGeneratedPercent(null);
    setDiscountUsed(false);
    setTimeLeft(0);
  };

  // 🔥 کپی کردن کد
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  };

  const handleApply = () => {
    if (!generatedCode) {
      setMessage("هیچ کد تخفیفی فعال نیست.");
      return;
    }

    if (couponInput.trim().toUpperCase() !== generatedCode) {
      setMessage("❌ کد تخفیف اشتباه است.");
      return;
    }

    if (discountUsed) {
      setMessage("این کد قبلاً استفاده شده.");
      return;
    }

    const percent = generatedPercent!;
    const amount = (totalPrice * percent) / 100;

    setDiscountUsed(true);
    setShowCode(false);
    setMessage(`🎉 تخفیف ${percent}% معادل ${amount.toLocaleString()} تومان اعمال شد.`);
    onApplyDiscount(amount);
  };

  return (
    <div className="flex flex-col items-center gap-3 mt-6 bg-white/40 backdrop-blur-xl border border-pink-200/40 p-6 rounded-3xl shadow-lg w-full">

      {/* نمایش کد تخفیف */}
      {showCode && (
        <div className="w-full text-center bg-pink-100 border border-pink-300 rounded-2xl p-4 shadow-md animate-fadeIn">
          <p className="text-pink-700 font-bold text-lg flex items-center justify-center gap-2">
            🎁 کد تخفیف شما:
            <span className="font-mono bg-white px-3 py-1 rounded-lg border shadow-sm">
              {generatedCode}
            </span>

            {/* دکمه Copy */}
            <button
              className="ml-2 p-2 bg-white rounded-full border shadow hover:bg-pink-50 transition"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="text-green-600" size={20} />
              ) : (
                <ClipboardCopy className="text-pink-600" size={20} />
              )}
            </button>
          </p>

          <p className="text-pink-600 mt-2 font-semibold">
            ⏳ {timeLeft} ثانیه تا انقضا  
          </p>
        </div>
      )}

      {/* ورودی کد */}
      <input
        type="text"
        placeholder="کد تخفیف را وارد کنید"
        className="w-full px-4 py-3 rounded-xl text-gray-700 bg-white/70 shadow-md 
        focus:outline-none focus:ring-2 focus:ring-pink-500"
        value={couponInput}
        onChange={(e) => setCouponInput(e.target.value)}
        disabled={discountUsed}
      />

      {/* دکمه تایید */}
      <button
        className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white 
        font-bold px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-all disabled:opacity-50"
        onClick={handleApply}
        disabled={discountUsed}
      >
        تایید
      </button>

      {/* پیام‌ها */}
      {message && (
        <p className="text-center mt-2 text-pink-700 font-semibold">{message}</p>
      )}
    </div>
  );
}
