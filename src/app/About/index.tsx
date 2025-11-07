"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function AboutBeautyland() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ container: ref });
  const scaleGlow = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      ref={ref}
      className="relative min-h-screen bg-gradient-to-br from-pink-50 via-red-100 to-pink-200 text-gray-900 font-sans overflow-x-hidden"
      style={{ perspective: 1200 }}
    >
      {/* نوار رژ لب 3D پایین صفحه */}
      <motion.div
        style={{ scale: scaleGlow }}
        initial={{ y: 120, rotateX: 90 }}
        animate={{ y: 0, rotateX: 0 }}
        transition={{ type: "spring", stiffness: 150, damping: 18 }}
        className="fixed bottom-0 left-0 w-full h-16 bg-gradient-to-r from-pink-600 via-pink-700 to-red-600 shadow-2xl z-50 flex items-center justify-center overflow-hidden"
      >
        {/* افکت نور متحرک */}
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent blur-[30px]"
        />
        {/* بافت رژ لب متحرک */}
        <div
          className="absolute top-0 left-0 w-full h-full bg-[url('https://i.ibb.co/y6WLQzX/lipstick-texture.png')] bg-repeat-x bg-contain opacity-80"
          style={{ filter: "drop-shadow(0 0 15px #ff4d6d)" }}
        ></div>

        <motion.h1
          initial={{ scale: 0.8, opacity: 0, rotateY: -45 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ delay: 0.5, duration: 1.2, type: "spring", stiffness: 100 }}
          className="relative text-white font-extrabold tracking-widest uppercase text-3xl drop-shadow-[0_0_15px_rgba(255,77,109,0.8)] select-none"
        >
          BEAUTYLAND
        </motion.h1>
      </motion.div>

      {/* هدر با Particle جادویی */}
      <header className="max-w-7xl mx-auto px-6 pt-28 pb-16 relative text-center overflow-visible">
        {/* ذرات کوچک جادویی */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 flex gap-4 pointer-events-none z-10">
          {[...Array(25)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.4 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: i * 0.1,
                repeat: Infinity,
                repeatType: "mirror",
                duration: 3 + Math.random() * 3,
              }}
              className="w-2 h-2 rounded-full bg-pink-400 blur-sm"
              style={{
                filter: `drop-shadow(0 0 6px rgba(255,105,180,0.8))`,
              }}
            />
          ))}
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -100, rotateX: -30 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.2, duration: 1.2, type: "spring", stiffness: 120 }}
          className="text-6xl md:text-7xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-red-500 to-pink-700 drop-shadow-lg"
        >
          درباره <span className="text-white drop-shadow-lg">Beautyland</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1.6 }}
          className="mt-6 max-w-4xl mx-auto text-lg md:text-xl font-semibold text-pink-900/95 tracking-wide leading-relaxed"
        >
          جایی که زیبایی و هنر با هم ترکیب می‌شوند، جایی که هر روز جلوه‌ای نو
          خلق می‌شود. ما نه فقط یک برند زیبایی، بلکه یک خانواده بزرگ و پرانرژی
          هستیم که می‌خواهیم شما را به بهترین نسخه خودتان تبدیل کنیم.
        </motion.p>
      </header>

      {/* محتوای اصلی */}
      <main className="max-w-6xl mx-auto px-6 pb-48 flex flex-col gap-28">
        {/* بخش تاریخچه با پارالاکس */}
        <motion.section
          style={{ y: yParallax }}
          initial={{ opacity: 0, x: -100, rotateY: 25 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-pink-300"
        >
          <h2 className="text-4xl font-extrabold mb-6 text-pink-700 drop-shadow-md">
            تاریخچه ما
          </h2>
          <p className="text-lg leading-relaxed tracking-wide text-pink-900/95 font-semibold">
            Beautyland از یک ایده ساده شروع شد؛ ساختن فضایی که هر کسی با ورود به آن
            حس اعتماد به نفس، زیبایی و خلاقیت را تجربه کند. از سال ۲۰۲۰، ما
            به‌سرعت رشد کردیم و با تلاش مستمر و تعهد به کیفیت، تبدیل به یکی از
            محبوب‌ترین برندهای حوزه زیبایی شدیم.
          </p>
          <p className="mt-4 text-pink-800/90 tracking-wide leading-relaxed">
            تیم ما متشکل از متخصصان حرفه‌ای، هنرمندان خلاق و افراد متعهد است که
            با عشق و انرژی فراوان در جهت ارتقای تجربه مشتریان فعالیت می‌کنند.
          </p>
        </motion.section>

        {/* بخش ماموریت با ورود چرخشی */}
        <motion.section
          initial={{ opacity: 0, scale: 0.8, rotateZ: -15 }}
          whileInView={{ opacity: 1, scale: 1, rotateZ: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="bg-gradient-to-r from-pink-100 to-red-200 p-10 rounded-3xl shadow-2xl border border-pink-300"
        >
          <h2 className="text-4xl font-extrabold mb-6 text-pink-700 drop-shadow-md">
            ماموریت ما
          </h2>
          <p className="text-lg leading-relaxed tracking-wide text-pink-900/95 font-semibold">
            ماموریت ما خلق تجربه‌ای فراتر از زیبایی است؛ جایی که هر فرد بتواند
            بهترین نسخه خودش باشد. ما با استفاده از فناوری‌های روز، مواد طبیعی
            و آموزش مستمر، خدماتی نوآورانه و بی‌نظیر ارائه می‌دهیم.
          </p>
          <p className="mt-4 text-pink-800/90 tracking-wide leading-relaxed">
            به‌روزرسانی مداوم و گوش دادن به نیازهای مشتریان باعث شده ما همیشه
            در صدر صنعت زیبایی باقی بمانیم.
          </p>
        </motion.section>

        {/* بخش ارزش‌ها با انیمیشن‌های تاب‌دار و افکت Hover */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-white/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-pink-300"
        >
          <h2 className="text-4xl font-extrabold mb-12 text-pink-700 drop-shadow-md text-center">
            ارزش‌های ما
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "کیفیت بی‌نظیر",
                desc: "استفاده از بهترین مواد اولیه و فرآیندهای کنترل کیفیت دقیق برای تضمین بهترین نتایج.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-14 w-14 text-pink-500 group-hover:text-red-500 transition-colors duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ),
              },
              {
                title: "نوآوری و خلاقیت",
                desc: "ایجاد محصولات و خدماتی متفاوت و به‌روز با نگاه به آینده صنعت زیبایی.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-14 w-14 text-pink-500 group-hover:text-red-500 transition-colors duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8c-2 4-6 4-8 0 2-4 6-4 8 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8c2 4 6 4 8 0-2-4-6-4-8 0z"
                    />
                  </svg>
                ),
              },
              {
                title: "احترام و صداقت",
                desc: "رفتار صادقانه و محترمانه با مشتریان و همکاران، پایه‌های اصلی ارتباطات ما.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-14 w-14 text-pink-500 group-hover:text-red-500 transition-colors duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 11l5 5 5-5"
                    />
                  </svg>
                ),
              },
            ].map(({ title, desc, icon }) => (
              <motion.div
                key={title}
                whileHover={{ scale: 1.1, rotateZ: 3 }}
                className="group bg-pink-50 p-8 rounded-3xl shadow-lg flex flex-col items-center text-center gap-6 cursor-pointer select-none transition-transform duration-300"
              >
                {icon}
                <h3 className="text-2xl font-bold text-pink-700 group-hover:text-red-600 transition-colors duration-300">
                  {title}
                </h3>
                <p className="text-pink-900/90 text-lg">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* بخش تیم با انیمیشن zoom و Hover */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="bg-gradient-to-r from-pink-100 to-red-200 p-10 rounded-3xl shadow-2xl border border-pink-300"
        >
          <h2 className="text-4xl font-extrabold mb-10 text-pink-700 drop-shadow-md text-center">
            تیم زیبایی ما
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.15, rotateZ: 5, boxShadow: "0 0 20px #f43f5e" }}
                className="bg-white rounded-3xl shadow-lg p-6 flex flex-col items-center gap-4 cursor-pointer transition-shadow duration-300 select-none"
              >
                <img
                  src={`/images/team-avatar-${i}.jpg`}
                  alt={`عضو تیم ${i}`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-pink-400 shadow-md"
                  draggable={false}
                />
                <h3 className="text-xl font-bold text-pink-700">{`عضو تیم ${i}`}</h3>
                <p className="text-pink-900/90 text-center max-w-xs">
                  متخصص حرفه‌ای با سال‌ها تجربه در زمینه زیبایی و مراقبت پوست.
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* تماس با ما با دکمه‌های متحرک */}
        <motion.section
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="bg-pink-700 text-white rounded-3xl p-14 shadow-2xl text-center max-w-4xl mx-auto"
        >
          <h2 className="text-4xl font-extrabold mb-8 drop-shadow-lg">
            با ما در تماس باشید
          </h2>
          <p className="mb-10 text-xl max-w-3xl mx-auto tracking-wide leading-relaxed">
            سوالی دارید؟ نیاز به مشاوره دارید؟ تیم ما همیشه آماده پاسخگویی است.
            از طریق شماره یا ایمیل زیر با ما در ارتباط باشید.
          </p>
          <motion.a
            href="tel:+989123456789"
            whileHover={{ scale: 1.1, textShadow: "0 0 10px #fff" }}
            className="inline-block bg-gradient-to-r from-pink-600 via-red-500 to-pink-600 px-10 py-4 rounded-full font-extrabold shadow-lg transition-all duration-300 cursor-pointer"
          >
            📞 +98 912 345 6789
          </motion.a>
          <br />
          <motion.a
            href="mailto:info@beautyland.com"
            whileHover={{ scale: 1.1, textShadow: "0 0 10px #fff" }}
            className="inline-block mt-6 bg-gradient-to-r from-pink-600 via-red-500 to-pink-600 px-10 py-4 rounded-full font-extrabold shadow-lg transition-all duration-300 cursor-pointer"
          >
            📧 info@beautyland.com
          </motion.a>
        </motion.section>
      </main>
    </div>
  );
}
