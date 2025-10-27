/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // ← خیلی مهم
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
