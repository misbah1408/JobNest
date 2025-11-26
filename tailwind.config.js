/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Required for next-themes
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        syne: ["var(--font-syne)", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
