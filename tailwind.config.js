/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Required for next-themes
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
}
