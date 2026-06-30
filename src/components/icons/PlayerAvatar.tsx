"use client";

interface PlayerAvatarProps {
  color: string;
  size?: number;
  className?: string;
  showInitial?: boolean;
  initial?: string;
}

export function PlayerAvatar({
  color,
  size = 48,
  className = "",
  showInitial = true,
  initial,
}: PlayerAvatarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background circle */}
      <circle cx="24" cy="24" r="22" fill={color} opacity="0.15" />
      <circle cx="24" cy="24" r="22" stroke={color} strokeWidth="2" opacity="0.4" />

      {/* Mask shape — mysterious imposter silhouette */}
      <path
        d="M14 20 Q14 14 24 12 Q34 14 34 20 L34 28 Q34 34 24 38 Q14 34 14 28 Z"
        fill={color}
        opacity="0.9"
      />

      {/* Eye cutouts */}
      <ellipse cx="19" cy="22" rx="3.5" ry="2.5" fill="#090909" />
      <ellipse cx="29" cy="22" rx="3.5" ry="2.5" fill="#090909" />

      {/* Eye glint */}
      <ellipse cx="20" cy="21.5" rx="1" ry="0.8" fill="white" opacity="0.6" />
      <ellipse cx="30" cy="21.5" rx="1" ry="0.8" fill="white" opacity="0.6" />

      {/* Initial letter */}
      {showInitial && initial && (
        <text
          x="24"
          y="33"
          textAnchor="middle"
          fill="white"
          fontSize="8"
          fontFamily="Plus Jakarta Sans, sans-serif"
          fontWeight="600"
        >
          {initial}
        </text>
      )}
    </svg>
  );
}

export function ImposterIcon({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Danger circle */}
      <circle cx="24" cy="24" r="22" fill="#dc2626" opacity="0.15" />
      <circle cx="24" cy="24" r="22" stroke="#dc2626" strokeWidth="2" opacity="0.5" />

      {/* Skull shape */}
      <path
        d="M16 20 Q16 12 24 10 Q32 12 32 20 L32 26 Q32 30 28 32 L28 36 L20 36 L20 32 Q16 30 16 26 Z"
        fill="#dc2626"
        opacity="0.9"
      />

      {/* Eye sockets */}
      <circle cx="20" cy="20" r="3" fill="#090909" />
      <circle cx="28" cy="20" r="3" fill="#090909" />

      {/* Nose */}
      <path d="M23 25 L24 27 L25 25" fill="#090909" />

      {/* Teeth */}
      <path d="M20 32 L20 36 M24 32 L24 36 M28 32 L28 36" stroke="#090909" strokeWidth="1.5" />
    </svg>
  );
}

export function CrewIcon({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Safe circle */}
      <circle cx="24" cy="24" r="22" fill="#3b82f6" opacity="0.15" />
      <circle cx="24" cy="24" r="22" stroke="#3b82f6" strokeWidth="2" opacity="0.4" />

      {/* Shield shape */}
      <path
        d="M24 10 L34 16 L34 28 Q34 36 24 40 Q14 36 14 28 L14 16 Z"
        fill="#3b82f6"
        opacity="0.8"
      />

      {/* Checkmark */}
      <path
        d="M18 24 L22 28 L30 18"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SecretIcon({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Mysterious glow */}
      <circle cx="24" cy="24" r="22" fill="#a855f7" opacity="0.1" />
      <circle cx="24" cy="24" r="22" stroke="#a855f7" strokeWidth="1.5" opacity="0.3" />

      {/* Finger over lips */}
      <rect x="22" y="12" width="4" height="20" rx="2" fill="#a855f7" opacity="0.8" />

      {/* Lips */}
      <path
        d="M16 30 Q24 36 32 30"
        fill="none"
        stroke="#a855f7"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16 30 Q24 26 32 30"
        fill="none"
        stroke="#a855f7"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
