/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2f8f7",
          100: "#dcefeb",
          200: "#b9dfd7",
          300: "#8ec9bd",
          400: "#62ae9f",
          500: "#489486",
          600: "#34766a",
          700: "#2c5f56",
          800: "#264d46",
          900: "#213f3a",
        },
      },
      boxShadow: {
        card: "0 12px 28px rgba(33, 63, 58, 0.09)",
      },
    },
  },
  plugins: [],
};

