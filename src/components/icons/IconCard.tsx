"use client";

import React from "react";

type GradientType =
  | "green"
  | "teal"
  | "cyan"
  | "blue"
  | "purple"
  | "magenta"
  | "red"
  | "orange"
  | "yellow";

const GRADIENTS: Record<GradientType, string> = {
  green: "from-green-500 to-green-600",
  teal: "from-teal-500 to-teal-600",
  cyan: "from-cyan-500 to-cyan-600",
  blue: "from-blue-500 to-blue-600",
  purple: "from-purple-500 to-purple-600",
  magenta: "from-pink-500 to-pink-600",
  red: "from-red-500 to-red-600",
  orange: "from-orange-500 to-orange-600",
  yellow: "from-yellow-500 to-yellow-600",
};

interface IconCardProps {
  icon: React.ReactNode;
  gradient?: GradientType;
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

const SIZES = {
  sm: "w-10 h-10",
  md: "w-14 h-14",
  lg: "w-20 h-20",
};

const ICON_SIZES = {
  sm: "w-5 h-5",
  md: "w-7 h-7",
  lg: "w-10 h-10",
};

export function IconCard({
  icon,
  gradient = "blue",
  size = "md",
  label,
  className = "",
}: IconCardProps) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div
        className={`${SIZES[size]} rounded-2xl bg-gradient-to-br ${GRADIENTS[gradient]} flex items-center justify-center shadow-lg`}
      >
        <div className={`${ICON_SIZES[size]} text-white`}>{icon}</div>
      </div>
      {label && (
        <span className="text-xs text-white/60 font-medium">{label}</span>
      )}
    </div>
  );
}
