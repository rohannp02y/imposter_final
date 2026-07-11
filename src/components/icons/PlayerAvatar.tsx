"use client";

interface PlayerAvatarProps {
  color: string;
  size?: number;
  className?: string;
  showInitial?: boolean;
  initial?: string;
}

/**
 * Player chip — a rounded square with the player's color and initial,
 * matching the chips used in setup. One visual language everywhere.
 */
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
      <rect x="2" y="2" width="44" height="44" rx="13" stroke={color} strokeWidth="1.5" opacity="0.35" />
      <rect x="8" y="8" width="32" height="32" rx="9" fill={color} />
      {showInitial && initial && (
        <text
          x="24"
          y="24"
          dy="0.36em"
          textAnchor="middle"
          fill="white"
          fontSize="15"
          fontFamily="Plus Jakarta Sans, Inter, sans-serif"
          fontWeight="600"
        >
          {initial.toUpperCase()}
        </text>
      )}
    </svg>
  );
}

/** Imposter — incognito hat and glasses, crimson. */
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
      <circle cx="24" cy="24" r="22" stroke="#dc2626" strokeWidth="1.5" opacity="0.35" />
      <circle cx="24" cy="24" r="22" fill="#dc2626" opacity="0.08" />
      <g stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 24v-2.5a7 7 0 0 1 14 0V24" />
        <path d="M13 24h22" />
        <circle cx="18.5" cy="31.5" r="3.4" />
        <circle cx="29.5" cy="31.5" r="3.4" />
        <path d="M21.9 31.5h4.2" />
      </g>
    </svg>
  );
}

/** Crew — shield with a check, blue. */
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
      <circle cx="24" cy="24" r="22" stroke="#3b82f6" strokeWidth="1.5" opacity="0.35" />
      <circle cx="24" cy="24" r="22" fill="#3b82f6" opacity="0.08" />
      <g stroke="#60a5fa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M24 11l10 3.8v7.4c0 6.3-4 10.6-10 12.8-6-2.2-10-6.5-10-12.8v-7.4L24 11z" />
        <path d="M19.5 24.5l3.5 3.5 6.5-7.5" />
      </g>
    </svg>
  );
}

/** Secret — an eye kept shut, violet. */
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
      <circle cx="24" cy="24" r="22" stroke="#a855f7" strokeWidth="1.5" opacity="0.35" />
      <circle cx="24" cy="24" r="22" fill="#a855f7" opacity="0.08" />
      <g stroke="#c084fc" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 22c3.2 4 7 6 11 6s7.8-2 11-6" />
        <path d="M17 26.5l-2 3" />
        <path d="M24 28.5v3.5" />
        <path d="M31 26.5l2 3" />
      </g>
    </svg>
  );
}
