import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#090909",
        surface: {
          DEFAULT: "#111111",
          elevated: "#1a1a1a",
          glass: "rgba(255,255,255,0.03)",
        },
        crimson: {
          DEFAULT: "#dc2626",
          deep: "#991b1b",
          glow: "#ef4444",
        },
        ink: {
          primary: "#fafafa",
          secondary: "#a1a1aa",
          muted: "#52525b",
          ghost: "#27272a",
        },
        hairline: "#18181b",
      },
      fontFamily: {
        display: [
          "Plus Jakarta Sans",
          "Inter",
          "-apple-system",
          "sans-serif",
        ],
        body: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        "ultra-tight": "-0.06em",
        "mega-tight": "-0.08em",
        "poster": "-0.04em",
      },
      animation: {
        "breathe": "breathe 8s ease-in-out infinite",
        "drift": "drift 20s linear infinite",
        "emerge": "emerge 0.8s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-up": "fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards",
        "slide-in": "slideIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards",
        "glow-pulse": "glowPulse 4s ease-in-out infinite",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.05)" },
        },
        drift: {
          "0%": { transform: "translate(0, 0) rotate(0deg)" },
          "33%": { transform: "translate(30px, -30px) rotate(120deg)" },
          "66%": { transform: "translate(-20px, 20px) rotate(240deg)" },
          "100%": { transform: "translate(0, 0) rotate(360deg)" },
        },
        emerge: {
          "0%": { opacity: "0", transform: "translateY(40px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(220,38,38,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(220,38,38,0.6)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
