import React from 'react';

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
        className={`${currentSizeClass} ${className} shrink-0`}
        aria-label={title || 'Diamond Earth with Lightbulb'}
      >
        <defs>
          <radialGradient id="mascotBulbGrad" cx="45%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#ffea75" />
            <stop offset="65%" stopColor="#ffc526" />
            <stop offset="100%" stopColor="#f59e0b" />
          </radialGradient>
          <clipPath id="mascotDiamondClip">
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

        <g clipPath="url(#mascotDiamondClip)">
          <rect x="60" y="40" width="500" height="500" fill="#88c3ff" />
          {/* Top/Apex Continent */}
          <path
            d="M 190 70 C 230 115, 280 125, 320 100 C 355 80, 400 115, 435 80 L 400 30 L 210 30 Z"
            fill="#7ee29d"
          />
          <path
            d="M 190 70 C 230 115, 280 125, 320 100 C 355 80, 400 115, 435 80"
            stroke="#1e293b"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
          {/* Western/Left Continents */}
          <path
            d="M 90 160 C 165 190, 215 230, 205 270 C 195 315, 225 350, 245 380 C 265 405, 245 450, 210 475 L 80 440 L 60 140 Z"
            fill="#7ee29d"
          />
          <path
            d="M 90 160 C 165 190, 215 230, 205 270 C 195 315, 225 350, 245 380 C 265 405, 245 450, 210 475"
            stroke="#1e293b"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Eastern/Right continent */}
          <path
            d="M 350 200 C 390 230, 460 220, 500 190 L 530 330 L 490 440 C 430 445, 385 410, 370 360 C 355 315, 390 270, 350 230 Z"
            fill="#7ee29d"
          />
          <path
            d="M 350 200 C 390 230, 460 220, 500 190"
            stroke="#1e293b"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 490 440 C 430 445, 385 410, 370 360 C 355 315, 390 270, 350 230"
            stroke="#1e293b"
            strokeWidth="7"
            strokeLinecap="round"
            fill="none"
          />
          {/* Southern patch */}
          <path
            d="M 250 440 C 285 415, 340 420, 370 445 L 310 520 Z"
            fill="#7ee29d"
          />
          {/* Archipelago Island */}
          <ellipse cx="230" cy="190" rx="12" ry="8" fill="#7ee29d" stroke="#1e293b" strokeWidth="4.5" />
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

        {/* Light rays */}
        <g stroke="#f59e0b" strokeWidth="6" strokeLinecap="round">
          <line x1="310" y1="80" x2="310" y2="116" />
          <line x1="358" y1="104" x2="378" y2="132" />
          <line x1="392" y1="140" x2="416" y2="182" />
          <line x1="416" y1="228" x2="460" y2="224" />
          <line x1="282" y1="88" x2="290" y2="116" />
          <line x1="228" y1="116" x2="252" y2="148" />
          <line x1="202" y1="236" x2="238" y2="232" />
          <line x1="230" y1="318" x2="252" y2="306" />
        </g>

        {/* Center glowing lightbulb */}
        <g transform="translate(310, 270)">
          {/* Base */}
          <rect
            x="-30"
            y="52"
            width="60"
            height="80"
            rx="10"
            fill="#c0c7d4"
            stroke="#1e293b"
            strokeWidth="5.5"
          />
          <line x1="-28" y1="68" x2="28" y2="68" stroke="#718096" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="-28" y1="84" x2="28" y2="84" stroke="#718096" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="-28" y1="100" x2="28" y2="100" stroke="#718096" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="-26" y1="116" x2="26" y2="116" stroke="#718096" strokeWidth="4.5" strokeLinecap="round" />
          {/* Bulb Globe */}
          <circle cx="0" cy="-22" r="74" fill="url(#mascotBulbGrad)" stroke="#f59e0b" strokeWidth="5.5" />
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
