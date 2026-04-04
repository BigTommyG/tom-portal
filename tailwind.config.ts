import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Atea brand colors
        atea: {
          green: "#008A00",
          "green-dark": "#006E00",
          "green-light": "#7BC87A",
          "green-muted": "#E8F5E8",
          "green-tint": "rgba(0,138,0,0.10)",
          grey: "#4D4D4D",
          "grey-mid": "#808080",
          "grey-light": "#F5F5F5",
          "grey-border": "#E0E0E0",
        },
        primary: {
          50: "#E8F5E8",
          100: "#C8E6C8",
          200: "#A5D4A5",
          300: "#7BC87A",
          400: "#4DB84D",
          500: "#008A00",
          600: "#006E00",
          700: "#005500",
          800: "#003D00",
          900: "#002600",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
