/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    turbo: {}, // به جای false
    // بقیه تنظیمات experimental رو هم همینطور باقی بذار
  },
};

module.exports = nextConfig;
