"use client";

interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 32, className = "" }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Minimal mask silhouette */}
      <path
        d="M20 35 Q20 20 50 15 Q80 20 80 35 L80 55 Q80 70 50 80 Q20 70 20 55 Z"
        fill="#dc2626"
      />

      {/* Eye cutouts — clean, sharp */}
      <path
        d="M32 42 L42 38 L42 46 Z"
        fill="#090909"
      />
      <path
        d="M68 42 L58 38 L58 46 Z"
        fill="#090909"
      />

      {/* Subtle highlight */}
      <path
        d="M35 30 Q50 25 65 30 Q70 35 70 42 L50 35 L30 42 Q30 35 35 30 Z"
        fill="#ef4444"
        opacity="0.3"
      />
    </svg>
  );
}
