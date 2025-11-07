"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function AboutBeautyland() {
  const { scrollYProgress } = useScroll();
  const scaleGlow = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const ImageData = [
    { href: "/image/image-in-main/founden/abolfazl.png", name: "آبوالفضل عبدی" },
    { href: "/image/image-in-main/founden/Amin.png", name: "امین عبداللهی" },
    { href: "/image/image-in-main/founden/shervin.png", name: "شروین محبی" },
  ];

  return (
    <div
      className="relative min-h-screen bg-gradient-to-br from-pink-50 via-red-100 to-pink-200 text-gray-900 font-sans overflow-x-hidden"
      style={{ perspective: 1200 }}
    >
      {/* نوار رژ لب پایین صفحه */}
      <motion.div
        style={{ scale: scaleGlow }}
        initial={{ y: 120, rotateX: 90 }}
        animate={{ y: 0, rotateX: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed bottom-0 left-0 w-full h-16 bg-gradient-to-r from-pink-600 via-pink-700 to-red-600 shadow-2xl z-50 flex items-center justify-center overflow-hidden"
      >
        {/* افکت نور */}
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent blur-[30px]"
        />

        {/* بافت رژ لب */}
        <div
          className="absolute top-0 left-0 w-full h-full bg-[url('https://i.ibb.co/y6WLQzX/lipstick-texture.png')] bg-repeat-x bg-contain opacity-80"
          style={{ filter: "drop-shadow(0 0 15px #ff4d6d)" }}
        />

        <motion.h1
          initial={{ scale: 0.85, opacity: 0, rotateY: -30 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ delay: 0.6, duration: 1, type: "spring", stiffness: 90 }}
          className="relative text-white font-extrabold tracking-widest uppercase text-3xl drop-shadow-[0_0_15px_rgba(255,77,109,0.8)] select-none"
        >
          BEAUTYLAND
        </motion.h1>
      </motion.div>

      {/* هدر */}
      <header className="max-w-7xl mx-auto px-6 pt-28 pb-16 text-center relative overflow-visible">
        {/* ذرات تزئینی */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-3 pointer-events-none z-10">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: i * 0.12,
                repeat: Infinity,
                repeatType: "mirror",
                duration: 4 + Math.random() * 3,
              }}
              className="w-2 h-2 rounded-full bg-pink-400 blur-sm"
              style={{
                filter: `drop-shadow(0 0 6px rgba(255,105,180,0.8))`,
              }}
            />
          ))}
        </div>

        {/* عنوان */}
        <motion.h1
          initial={{ opacity: 0, y: -80, rotateX: -25 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.2, duration: 1, type: "spring", stiffness: 110 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-red-500 to-pink-700 drop-shadow-lg"
        >
          درباره <span className="text-white drop-shadow-lg">Beautyland</span>
        </motion.h1>

        {/* توضیح */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 1.5 }}
          className="mt-6 max-w-3xl sm:max-w-4xl mx-auto text-base sm:text-lg md:text-xl font-semibold text-pink-900/95 tracking-wide leading-relaxed px-4"
        >
          جایی که زیبایی و هنر با هم ترکیب می‌شوند، جایی که هر روز جلوه‌ای نو خلق می‌شود.  
          ما نه فقط یک برند زیبایی، بلکه یک خانواده بزرگ و پرانرژی هستیم که می‌خواهیم شما را به بهترین نسخه خودتان تبدیل کنیم.
        </motion.p>
      </header>

      {/* محتوای اصلی */}
      <main className="max-w-6xl mx-auto px-6 pb-48 flex flex-col gap-24 sm:gap-28">
        {/* تاریخچه */}
        <motion.section
          style={{ y: yParallax }}
          initial={{ opacity: 0, x: -80, rotateY: 20 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="bg-white/90 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-2xl border border-pink-300"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-pink-700 drop-shadow-md">
            تاریخچه ما
          </h2>
          <p className="text-base sm:text-lg leading-relaxed tracking-wide text-pink-900/95 font-semibold">
            Beautyland از یک ایده ساده شروع شد؛ ساختن فضایی که هر کسی با ورود به آن حس اعتماد به نفس، زیبایی و خلاقیت را تجربه کند.
          </p>
          <p className="mt-4 text-pink-800/90 tracking-wide leading-relaxed text-base sm:text-lg">
            تیم ما متشکل از متخصصان حرفه‌ای، هنرمندان خلاق و افراد متعهد است که با عشق و انرژی فراوان در جهت ارتقای تجربه مشتریان فعالیت می‌کنند.
          </p>
        </motion.section>

        {/* تیم ما */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="bg-gradient-to-r from-pink-100 to-red-200 p-8 sm:p-10 rounded-3xl shadow-2xl border border-pink-300"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-10 text-pink-700 drop-shadow-md text-center">
            تیم ما
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {ImageData.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{
                  scale: 1.1,
                  rotateZ: 3,
                  boxShadow: "0 0 20px #f43f5e",
                }}
                className="bg-white rounded-3xl shadow-lg p-6 flex flex-col items-center gap-4 cursor-pointer transition-all duration-300"
              >
                <img
                  src={item.href}
                  alt={item.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-pink-400 shadow-md"
                />
                <h3 className="text-lg sm:text-xl font-bold text-pink-700">{item.name}</h3>
                <p className="text-pink-900/90 text-center text-sm sm:text-base">
                  متخصص حرفه‌ای با سال‌ها تجربه در زمینه زیبایی و مراقبت پوست.
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* تماس با ما */}
        <motion.section
          initial={{ opacity: 0, scale: 0.75 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="bg-pink-700 text-white rounded-3xl p-10 sm:p-14 shadow-2xl text-center max-w-4xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 drop-shadow-lg">
            با ما در تماس باشید
          </h2>
          <p className="mb-10 text-base sm:text-xl max-w-3xl mx-auto tracking-wide leading-relaxed px-4">
            سوالی دارید؟ نیاز به مشاوره دارید؟ تیم ما همیشه آماده پاسخگویی است.
          </p>

          <div className="flex flex-col items-center gap-5">
            <motion.a
              href="tel:+989378546568"
              whileHover={{ scale: 1.1, textShadow: "0 0 12px #fff" }}
              className="inline-block bg-gradient-to-r from-pink-600 via-red-500 to-pink-600 px-10 py-4 rounded-full font-extrabold shadow-lg transition-all duration-300 cursor-pointer"
            >
              📞 تماس با ما
            </motion.a>

            <motion.a
              href="https://www.instagram.com/bea_utyland2025"
              target="_blank"
              whileHover={{ scale: 1.1, textShadow: "0 0 12px #fff" }}
              className="inline-block bg-gradient-to-r from-pink-600 via-red-500 to-pink-600 px-10 py-4 rounded-full font-extrabold shadow-lg transition-all duration-300 cursor-pointer"
            >
              📸 Instagram
            </motion.a>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
