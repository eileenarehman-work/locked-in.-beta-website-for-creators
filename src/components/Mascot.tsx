import React, { useId } from 'react';

export type MascotType = 'curious' | 'cheerful' | 'wavy' | 'friendly' | 'earth' | 'bulb';

interface MascotProps {
  type?: MascotType;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  title?: string;
}

export const Mascot: React.FC<MascotProps> = ({
  type = 'curious',
  size = 'md',
  className = '',
  title,
}) => {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '_');

  const sizeMap = {
    xs: 'h-4 w-4',
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-14 w-14',
  };

  const currentSizeClass = sizeMap[size];

  // 1. Center Diamond Earth with Lightbulb
  if (type === 'earth') {
    return (
      <svg
        viewBox="0 0 600 540"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${currentSizeClass} ${className} shrink-0 overflow-visible`}
        aria-label={title || 'Diamond Earth with Lightbulb'}
      >
        <defs>
          <radialGradient id={`mascotBulbGrad_${uid}`} cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#fff3a8" />
            <stop offset="45%" stopColor="#ffd84d" />
            <stop offset="85%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </radialGradient>
          <filter id={`mascotGlowFilter_${uid}`} x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0.98   0 1 0 0 0.75   0 0 1 0 0.15  0 0 0 0.6 0"
              result="coloredBlur"
            />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <clipPath id={`mascotDiamondClip_${uid}`}>
            <rect
              x="165"
              y="145"
              width="290"
              height="290"
              rx="42"
              transform="rotate(45 310 290)"
            />
          </clipPath>
        </defs>

        <g clipPath={`url(#mascotDiamondClip_${uid})`}>
          {/* Sky blue ocean */}
          <rect x="60" y="40" width="500" height="500" fill="#88c3ff" />

          {/* 1. Even TOP Landmass */}
          <path
            d="M 230 75
               Q 255 125 260 160
               C 280 195 295 200 310 198
               C 325 200 340 195 360 160
               Q 365 125 390 75
               Z"
            fill="#7ee29d"
            stroke="#1e293b"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* 2. Even LEFT Landmass */}
          <path
            d="M 105 180
               Q 155 198 185 225
               C 215 258 220 290 218 290
               C 220 290 215 322 185 355
               Q 155 382 105 400
               Z"
            fill="#7ee29d"
            stroke="#1e293b"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* 3. Even RIGHT Landmass (Even with left) */}
          <path
            d="M 515 180
               Q 465 198 435 225
               C 405 258 400 290 402 290
               C 400 290 405 322 435 355
               Q 465 382 515 400
               Z"
            fill="#7ee29d"
            stroke="#1e293b"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* 4. Small Even BOTTOM Landmass */}
          <path
            d="M 280 425
               C 295 408 325 408 340 425
               Q 335 458 310 482
               Q 285 458 280 425
               Z"
            fill="#7ee29d"
            stroke="#1e293b"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
        </g>

        {/* Charcoal border */}
        <rect
          x="165"
          y="145"
          width="290"
          height="290"
          rx="42"
          transform="rotate(45 310 290)"
          fill="none"
          stroke="#1e293b"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Light rays centered around (310, 290) with consistent glow */}
        <g stroke="#e69500" strokeWidth="5.5" strokeLinecap="round" filter={`url(#mascotGlowFilter_${uid})`}>
          <line x1="310" y1="205" x2="310" y2="175" />
          <line x1="350" y1="220" x2="375" y2="195" />
          <line x1="370" y1="255" x2="400" y2="240" />
          <line x1="380" y1="290" x2="410" y2="290" />
          <line x1="360" y1="330" x2="388" y2="355" />
          <line x1="270" y1="220" x2="245" y2="195" />
          <line x1="250" y1="255" x2="220" y2="240" />
          <line x1="240" y1="290" x2="210" y2="290" />
          <line x1="260" y1="330" x2="232" y2="355" />
        </g>

        {/* Center glowing lightbulb dead center at (310, 290) */}
        <g transform="translate(310, 290)" filter={`url(#mascotGlowFilter_${uid})`}>
          {/* Base */}
          <g id="mascot-bulb-base">
            <path
              d="M -20 32 L 20 32 L 18 68 C 18 74 10 78 0 78 C -10 78 -18 74 -18 68 Z"
              fill="#c5cbd6"
              stroke="#1e293b"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <line x1="-18" y1="42" x2="18" y2="42" stroke="#718096" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="-17" y1="52" x2="17" y2="52" stroke="#718096" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="-16" y1="62" x2="16" y2="62" stroke="#718096" strokeWidth="3.5" strokeLinecap="round" />
          </g>
          {/* Bulb Globe centered */}
          <ellipse cx="0" cy="-12" rx="52" ry="54" fill={`url(#mascotBulbGrad_${uid})`} stroke="#e69500" strokeWidth="4.5" />
          <ellipse cx="-14" cy="-24" rx="12" ry="7" transform="rotate(-25 -14 -24)" fill="#ffffff" opacity="0.65" />
        </g>
      </svg>
    );
  }

  // Standalone Glowing Lightbulb
  if (type === 'bulb') {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${currentSizeClass} ${className} shrink-0`}
        aria-label={title || 'Idea Lightbulb'}
      >
        {/* Rays */}
        <line x1="50" y1="6" x2="50" y2="14" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="72" y1="14" x2="66" y2="22" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="84" y1="36" x2="74" y2="38" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="28" y1="14" x2="34" y2="22" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="16" y1="36" x2="26" y2="38" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
        {/* Base */}
        <rect x="40" y="66" width="20" height="22" rx="4" fill="#c0c7d4" stroke="#1e293b" strokeWidth="2.5" />
        <line x1="41" y1="72" x2="59" y2="72" stroke="#718096" strokeWidth="2" strokeLinecap="round" />
        <line x1="41" y1="78" x2="59" y2="78" stroke="#718096" strokeWidth="2" strokeLinecap="round" />
        <line x1="41" y1="84" x2="59" y2="84" stroke="#718096" strokeWidth="2" strokeLinecap="round" />
        {/* Globe */}
        <circle cx="50" cy="42" r="26" fill="#ffd13b" stroke="#f59e0b" strokeWidth="3" />
      </svg>
    );
  }

  // 2. Curious Yellow Mascot (Top-Left of logo)
  if (type === 'curious') {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${currentSizeClass} ${className} shrink-0`}
        aria-label={title || 'Curious Star'}
      >
        <ellipse cx="50" cy="50" rx="46" ry="45" fill="#ffea78" stroke="#1e293b" strokeWidth="6" />
        <path d="M 28 14 Q 45 6 60 14" stroke="#1e293b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <circle cx="31" cy="38" r="4.5" fill="#0ea5e9" />
        <circle cx="69" cy="38" r="4.5" fill="#0ea5e9" />
        <ellipse cx="50" cy="62" rx="15" ry="11" fill="#ebe4dc" stroke="#1e293b" strokeWidth="5" />
      </svg>
    );
  }

  // 3. Cheerful Coral / Pink Mascot (Top-Right of logo)
  if (type === 'cheerful') {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${currentSizeClass} ${className} shrink-0`}
        aria-label={title || 'Cheerful Buddy'}
      >
        <ellipse cx="50" cy="50" rx="47" ry="46" fill="#ffadad" stroke="#1e293b" strokeWidth="6" />
        <path d="M 32 12 Q 52 4 72 14" stroke="#1e293b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <path d="M 24 28 L 38 28" stroke="#1e293b" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M 60 24 Q 70 18 80 24" stroke="#1e293b" strokeWidth="5.5" strokeLinecap="round" fill="none" />
        <circle cx="33" cy="38" r="4.5" fill="#1e293b" />
        <circle cx="70" cy="38" r="4.5" fill="#1e293b" />
        <path d="M 35 56 L 67 56 L 51 82 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    );
  }

  // 4. Wavy Peach Mascot (Bottom-Left of logo)
  if (type === 'wavy') {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${currentSizeClass} ${className} shrink-0`}
        aria-label={title || 'Cozy Champ'}
      >
        <ellipse cx="50" cy="50" rx="48" ry="45" fill="#ffcb95" stroke="#1e293b" strokeWidth="6" />
        <path d="M 30 12 Q 50 4 68 12" stroke="#1e293b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <path d="M 25 38 Q 35 32 44 38" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M 57 38 Q 66 32 76 38" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path
          d="M 20 54 C 23 49 28 50 29 57 C 31 62 27 65 22 63"
          stroke="#1e293b"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M 29 58 Q 50 67 71 58" stroke="#1e293b" strokeWidth="5.5" strokeLinecap="round" fill="none" />
        <path
          d="M 80 54 C 77 49 72 50 71 57 C 69 62 73 65 78 63"
          stroke="#1e293b"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    );
  }

  // 5. Friendly Beige / Mint Eye Mascot (Bottom-Right of logo)
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${currentSizeClass} ${className} shrink-0`}
      aria-label={title || 'Kind Helper'}
    >
      <ellipse cx="50" cy="50" rx="47" ry="46" fill="#ede0d7" stroke="#1e293b" strokeWidth="6" />
      <path d="M 28 12 Q 52 3 70 14" stroke="#1e293b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      <circle cx="30" cy="38" r="5" fill="#22c55e" />
      <circle cx="70" cy="38" r="4.5" fill="#1e293b" />
      <path d="M 35 60 Q 50 76 65 60" stroke="#1e293b" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
};
