/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#f4f4f8",
        "card-bg": "#ffffff",
        "accent-pink": "#f6ecff",
        "accent-yellow": "#fff7d6"
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem"
      },
      boxShadow: {
        soft: "0 18px 40px rgba(15, 23, 42, 0.07)"
      }
    }
  },
  plugins: []
};

