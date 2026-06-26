"use client";

import React from "react";

const AVATAR_CONFIGS: Record<string, { body: string; accent: string; features: string }> = {
  "#EF4444": { body: "#EF4444", accent: "#DC2626", features: "#FCA5A5" },
  "#3B82F6": { body: "#3B82F6", accent: "#2563EB", features: "#93C5FD" },
  "#22C55E": { body: "#22C55E", accent: "#16A34A", features: "#86EFAC" },
  "#EAB308": { body: "#EAB308", accent: "#CA8A04", features: "#FDE047" },
  "#A855F7": { body: "#A855F7", accent: "#9333EA", features: "#D8B4FE" },
  "#F97316": { body: "#F97316", accent: "#EA580C", features: "#FDBA74" },
  "#EC4899": { body: "#EC4899", accent: "#DB2777", features: "#F9A8D4" },
  "#06B6D4": { body: "#06B6D4", accent: "#0891B2", features: "#67E8F9" },
  "#92400E": { body: "#92400E", accent: "#78350F", features: "#D97706" },
  "#F8FAFC": { body: "#CBD5E1", accent: "#94A3B8", features: "#F1F5F9" },
};

const SHAPES: Array<(config: { body: string; accent: string; features: string }) => React.ReactNode> = [
  // Cat-like
  (c) => (svg: boolean) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="55" r="32" fill={c.body} />
      <polygon points="25,30 35,8 45,28" fill={c.body} />
      <polygon points="55,28 65,8 75,30" fill={c.body} />
      <polygon points="28,28 35,12 42,26" fill={c.accent} />
      <polygon points="58,26 65,12 72,28" fill={c.accent} />
      <ellipse cx="38" cy="50" rx="5" ry="6" fill="white" />
      <ellipse cx="62" cy="50" rx="5" ry="6" fill="white" />
      <ellipse cx="39" cy="51" rx="3" ry="3.5" fill="#1a1a2e" />
      <ellipse cx="63" cy="51" rx="3" ry="3.5" fill="#1a1a2e" />
      <ellipse cx="50" cy="58" rx="3" ry="2" fill={c.features} />
      <path d="M42,63 Q50,70 58,63" fill="none" stroke="#1a1a2e" strokeWidth="1.5" />
      <line x1="20" y1="52" x2="33" y2="55" stroke={c.accent} strokeWidth="1" />
      <line x1="20" y1="57" x2="33" y2="58" stroke={c.accent} strokeWidth="1" />
      <line x1="67" y1="55" x2="80" y2="52" stroke={c.accent} strokeWidth="1" />
      <line x1="67" y1="58" x2="80" y2="57" stroke={c.accent} strokeWidth="1" />
    </svg>
  ),
  // Bear-like
  (c) => (svg: boolean) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="30" cy="30" r="14" fill={c.body} />
      <circle cx="70" cy="30" r="14" fill={c.body} />
      <circle cx="30" cy="30" r="8" fill={c.accent} />
      <circle cx="70" cy="30" r="8" fill={c.accent} />
      <circle cx="50" cy="55" r="32" fill={c.body} />
      <ellipse cx="50" cy="60" rx="14" ry="12" fill={c.accent} />
      <ellipse cx="40" cy="48" rx="4.5" ry="5" fill="white" />
      <ellipse cx="60" cy="48" rx="4.5" ry="5" fill="white" />
      <ellipse cx="41" cy="49" rx="2.5" ry="3" fill="#1a1a2e" />
      <ellipse cx="61" cy="49" rx="2.5" ry="3" fill="#1a1a2e" />
      <ellipse cx="50" cy="58" rx="4" ry="3" fill="#1a1a2e" />
      <path d="M46,64 Q50,68 54,64" fill="none" stroke="#1a1a2e" strokeWidth="1.5" />
    </svg>
  ),
  // Fox-like
  (c) => (svg: boolean) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <polygon points="20,15 35,50 5,50" fill={c.body} />
      <polygon points="80,15 65,50 95,50" fill={c.body} />
      <polygon points="23,20 35,48 11,48" fill={c.accent} />
      <polygon points="77,20 65,48 89,48" fill={c.accent} />
      <ellipse cx="50" cy="58" rx="30" ry="28" fill={c.body} />
      <ellipse cx="50" cy="65" rx="18" ry="15" fill="white" />
      <ellipse cx="40" cy="50" rx="4" ry="5" fill="white" />
      <ellipse cx="60" cy="50" rx="4" ry="5" fill="white" />
      <ellipse cx="41" cy="51" rx="2.5" ry="3" fill="#1a1a2e" />
      <ellipse cx="61" cy="51" rx="2.5" ry="3" fill="#1a1a2e" />
      <ellipse cx="50" cy="60" rx="3.5" ry="2.5" fill="#1a1a2e" />
      <path d="M45,65 Q50,69 55,65" fill="none" stroke="#1a1a2e" strokeWidth="1.5" />
    </svg>
  ),
  // Owl-like
  (c) => (svg: boolean) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <ellipse cx="50" cy="55" rx="30" ry="32" fill={c.body} />
      <polygon points="35,25 50,10 65,25" fill={c.body} />
      <polygon points="38,28 50,15 62,28" fill={c.accent} />
      <circle cx="38" cy="48" r="12" fill="white" />
      <circle cx="62" cy="48" r="12" fill="white" />
      <circle cx="38" cy="48" r="6" fill="#1a1a2e" />
      <circle cx="62" cy="48" r="6" fill="#1a1a2e" />
      <circle cx="40" cy="46" r="2" fill="white" />
      <circle cx="64" cy="46" r="2" fill="white" />
      <polygon points="47,56 50,62 53,56" fill={c.features} />
      <path d="M35,70 Q50,78 65,70" fill="none" stroke={c.accent} strokeWidth="2" />
    </svg>
  ),
  // Alien-like
  (c) => (svg: boolean) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <ellipse cx="50" cy="55" rx="28" ry="32" fill={c.body} />
      <ellipse cx="50" cy="28" rx="18" ry="10" fill={c.accent} />
      <ellipse cx="36" cy="50" rx="10" ry="12" fill={c.features} />
      <ellipse cx="64" cy="50" rx="10" ry="12" fill={c.features} />
      <ellipse cx="36" cy="50" rx="5" ry="7" fill="#1a1a2e" />
      <ellipse cx="64" cy="50" rx="5" ry="7" fill="#1a1a2e" />
      <ellipse cx="50" cy="65" rx="3" ry="1.5" fill={c.accent} />
      <path d="M42,70 Q50,74 58,70" fill="none" stroke={c.accent} strokeWidth="1.5" />
    </svg>
  ),
  // Ghost-like
  (c) => (svg: boolean) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <path d="M25,50 Q25,20 50,20 Q75,20 75,50 L75,75 Q68,68 60,75 Q52,68 44,75 Q36,68 28,75 Z" fill={c.body} />
      <ellipse cx="38" cy="45" rx="5" ry="6" fill="white" />
      <ellipse cx="62" cy="45" rx="5" ry="6" fill="white" />
      <ellipse cx="39" cy="46" rx="3" ry="3.5" fill="#1a1a2e" />
      <ellipse cx="63" cy="46" rx="3" ry="3.5" fill="#1a1a2e" />
      <ellipse cx="50" cy="58" rx="4" ry="3" fill={c.accent} />
      <circle cx="41" cy="50" r="1.5" fill={c.features} opacity="0.5" />
      <circle cx="59" cy="50" r="1.5" fill={c.features} opacity="0.5" />
    </svg>
  ),
  // Robot-like
  (c) => (svg: boolean) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect x="25" y="25" width="50" height="45" rx="8" fill={c.body} />
      <rect x="42" y="15" width="16" height="12" rx="3" fill={c.accent} />
      <circle cx="50" cy="20" r="3" fill={c.features} />
      <rect x="33" y="40" width="12" height="10" rx="2" fill={c.features} />
      <rect x="55" y="40" width="12" height="10" rx="2" fill={c.features} />
      <circle cx="39" cy="45" r="3" fill="#1a1a2e" />
      <circle cx="61" cy="45" r="3" fill="#1a1a2e" />
      <rect x="40" y="57" width="20" height="6" rx="3" fill={c.accent} />
      <line x1="44" y1="60" x2="56" y2="60" stroke={c.features} strokeWidth="1" />
      <rect x="35" y="72" width="12" height="10" rx="3" fill={c.body} />
      <rect x="53" y="72" width="12" height="10" rx="3" fill={c.body} />
    </svg>
  ),
  // Panda-like
  (c) => (svg: boolean) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="30" cy="30" r="14" fill="#1a1a2e" />
      <circle cx="70" cy="30" r="14" fill="#1a1a2e" />
      <circle cx="50" cy="55" r="32" fill="white" />
      <ellipse cx="38" cy="48" rx="10" ry="11" fill="#1a1a2e" />
      <ellipse cx="62" cy="48" rx="10" ry="11" fill="#1a1a2e" />
      <circle cx="38" cy="47" r="3" fill="white" />
      <circle cx="62" cy="47" r="3" fill="white" />
      <ellipse cx="50" cy="60" rx="4" ry="3" fill="#1a1a2e" />
      <path d="M44,65 Q50,69 56,65" fill="none" stroke="#1a1a2e" strokeWidth="1.5" />
    </svg>
  ),
  // Zombie-like
  (c) => (svg: boolean) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <ellipse cx="50" cy="55" rx="28" ry="30" fill={c.body} />
      <ellipse cx="50" cy="25" rx="12" ry="6" fill={c.accent} />
      <ellipse cx="38" cy="48" rx="7" ry="8" fill="white" />
      <ellipse cx="62" cy="50" rx="6" ry="7" fill="white" />
      <circle cx="38" cy="49" r="4" fill="#1a1a2e" />
      <circle cx="62" cy="51" r="3.5" fill="#1a1a2e" />
      <path d="M38,65 L42,62 L46,66 L50,62 L54,66 L58,62 L62,65" fill="none" stroke="#1a1a2e" strokeWidth="2" />
      <line x1="32" y1="55" x2="28" y2="60" stroke={c.accent} strokeWidth="1.5" />
    </svg>
  ),
  // Monster-like
  (c) => (svg: boolean) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <ellipse cx="50" cy="58" rx="32" ry="30" fill={c.body} />
      <ellipse cx="30" cy="30" rx="10" ry="12" fill={c.body} />
      <ellipse cx="70" cy="30" rx="10" ry="12" fill={c.body} />
      <circle cx="30" cy="28" r="5" fill="white" />
      <circle cx="70" cy="28" r="5" fill="white" />
      <circle cx="31" cy="28" r="2.5" fill="#1a1a2e" />
      <circle cx="71" cy="28" r="2.5" fill="#1a1a2e" />
      <ellipse cx="50" cy="62" rx="12" ry="8" fill={c.accent} />
      <polygon points="38,62 42,68 46,62" fill="white" />
      <polygon points="46,62 50,68 54,62" fill="white" />
      <polygon points="54,62 58,68 62,62" fill="white" />
    </svg>
  ),
];

export function AvatarSVG({
  color,
  size = 48,
  className = "",
}: {
  color: string;
  size?: number;
  className?: string;
}) {
  const config = AVATAR_CONFIGS[color] || { body: color, accent: color, features: "#fff" };
  const shapeIndex = color.charCodeAt(1) % SHAPES.length;
  const renderShape = SHAPES[shapeIndex];

  return (
    <div
      className={`rounded-full overflow-hidden flex items-center justify-center ${className}`}
      style={{ width: size, height: size, backgroundColor: config.body + "30" }}
    >
      {renderShape(config)(true)}
    </div>
  );
}

export const AVATAR_COLORS = Object.keys(AVATAR_CONFIGS);

export function getAvatarColor(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}
