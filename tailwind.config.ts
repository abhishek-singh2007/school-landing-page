import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        pillar: {
          50: "#fff8de",
          100: "#fff0b0",
          200: "#ffe36f",
          300: "#f8ce40",
          400: "#e4b72e",
          500: "#d4a72c",
          600: "#b58723",
        },
      },
      boxShadow: {
        glass: "0 20px 60px rgba(15, 23, 42, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
