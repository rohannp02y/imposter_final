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
          dark: "#0F172A",
          "dark-light": "#1E293B",
          "dark-lighter": "#334155",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-subtle": "bounce 2s infinite",
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(239, 68, 68, 0.5)" },
          "100%": { boxShadow: "0 0 20px rgba(239, 68, 68, 0.8)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
