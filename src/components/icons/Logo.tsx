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
      {/* Dhaka Topi Hat */}
      <path
        d="M25 35 L50 10 L75 35 L70 38 L50 18 L30 38 Z"
        fill="#7f1d1d"
      />
      <path
        d="M30 38 L50 18 L70 38 L65 42 L50 25 L35 42 Z"
        fill="#991b1b"
      />
      <path
        d="M35 42 L50 25 L65 42 L60 46 L50 32 L40 46 Z"
        fill="#b91c1c"
      />
      <path
        d="M40 46 L50 32 L60 46 L55 50 L50 38 L45 50 Z"
        fill="#dc2626"
      />

      {/* Face outline */}
      <path
        d="M30 45 Q30 35 40 30 L50 28 L60 30 Q70 35 70 45 L70 60 Q70 75 50 85 Q30 75 30 60 Z"
        fill="#fef2f2"
      />

      {/* Mask */}
      <path
        d="M32 48 Q32 42 42 40 L50 38 L58 40 Q68 42 68 48 L68 55 Q68 60 58 62 L50 63 L42 62 Q32 60 32 55 Z"
        fill="#7f1d1d"
      />

      {/* Eyes */}
      <ellipse cx="42" cy="50" rx="5" ry="3" fill="#fef2f2" />
      <ellipse cx="58" cy="50" rx="5" ry="3" fill="#fef2f2" />

      {/* Nose */}
      <path
        d="M48 55 L50 60 L52 55"
        fill="none"
        stroke="#991b1b"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Smirk */}
      <path
        d="M44 66 Q50 70 56 66"
        fill="none"
        stroke="#991b1b"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Collar */}
      <path
        d="M35 78 L50 85 L65 78 L60 82 L50 88 L40 82 Z"
        fill="#7f1d1d"
      />
    </svg>
  );
}
