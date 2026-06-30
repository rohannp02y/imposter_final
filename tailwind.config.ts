import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        imposter: {
          red: "#EF4444",
          "red-dark": "#DC2626",
          blue: "#3B82F6",
          "blue-dark": "#2563EB",
          green: "#22C55E",
          purple: "#A855F7",
          yellow: "#EAB308",
          dark: "#080808",
          "dark-light": "#191d20",
          "dark-lighter": "#334155",
        },
        accent: {
          primary: "#7170ff",
          "primary-hover": "#818fff",
          success: "#00ba7c",
          danger: "#eb5757",
        },
        surface: {
          DEFAULT: "#191d20",
          hover: "#1e2732",
        },
        border: {
          DEFAULT: "#585a5c",
          light: "#383b3f",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-subtle": "bounce 2s infinite",
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(113, 112, 255, 0.5)" },
          "100%": { boxShadow: "0 0 20px rgba(113, 112, 255, 0.8)" },
        },
      },
      fontFamily: {
        sans: [
          "Inter Variable",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: ["Berkeley Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
export default config;
