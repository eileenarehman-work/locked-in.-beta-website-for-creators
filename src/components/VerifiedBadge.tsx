import React from 'react';

export const VERIFIED_REPUTATION_THRESHOLD = 50;

export interface VerifiedBadgeProps {
  reputationScore?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  forceShow?: boolean;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  reputationScore = 0,
  size = 'sm',
  showText = false,
  className = '',
  forceShow = false,
}) => {
  const isVerified = forceShow || reputationScore >= VERIFIED_REPUTATION_THRESHOLD;

  if (!isVerified) return null;

  const sizeMap = {
    xs: { icon: 'w-3.5 h-3.5', text: 'text-[10px] px-1 py-0.2' },
    sm: { icon: 'w-4 h-4', text: 'text-[11px] px-1.5 py-0.5' },
    md: { icon: 'w-5 h-5', text: 'text-xs px-2 py-0.5' },
    lg: { icon: 'w-6 h-6', text: 'text-sm px-2.5 py-1' },
  };

  const currentSize = sizeMap[size];

  return (
    <span
      className={`inline-flex items-center gap-1 select-none ${className}`}
      title={`Verified Creator • Proof-of-Work threshold reached (${reputationScore} Points)`}
      aria-label="Verified Creator"
    >
      {/* Iconic 8-point scalloped verified badge */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${currentSize.icon} flex-shrink-0 drop-shadow-[0_1px_4px_rgba(56,189,248,0.45)] transition-transform duration-200 hover:scale-110`}
      >
        <defs>
          <linearGradient id="verified_grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
        {/* Scalloped badge seal */}
        <path
          d="M12 1.5L14.7 3.65L18.1 3.55L19.4 6.7L22.4 8.25L21.9 11.65L23.4 14.7L20.8 16.95L20.3 20.35L16.95 20.85L14.7 23.45L12 21.95L9.3 23.45L7.05 20.85L3.7 20.35L3.2 16.95L0.6 14.7L2.1 11.65L1.6 8.25L4.6 6.7L5.9 3.55L9.3 3.65L12 1.5Z"
          fill="url(#verified_grad)"
        />
        {/* Bold crisp checkmark */}
        <path
          d="M7.75 12.25L10.5 15L16.25 9.25"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {showText && (
        <span
          className={`font-semibold tracking-wide uppercase rounded-md bg-sky-500/15 border border-sky-400/30 text-sky-300 font-mono ${currentSize.text}`}
        >
          Verified
        </span>
      )}
    </span>
  );
};
