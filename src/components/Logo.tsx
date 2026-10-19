import React, { useState, useId } from 'react';
import { motion } from 'motion/react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const [isHovered, setIsHovered] = useState(false);
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '_');

  const sizeMap = {
    sm: { box: 'h-8 w-9', text: 'text-sm font-bold tracking-tight' },
    md: { box: 'h-10 w-11', text: 'text-base font-extrabold tracking-tight' },
    lg: { box: 'h-13 w-15', text: 'text-xl font-extrabold tracking-tight' },
    xl: { box: 'h-18 w-20', text: 'text-2xl font-black tracking-tight' },
  };

  const currentSize = sizeMap[size];

  return (
    <div
      className={`flex items-center gap-2.5 shrink-0 select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hand-Drawn Diamond Earth with Glowing Lightbulb & 4 Expressive Corner Mascots */}
      <div
        className={`relative flex ${currentSize.box} items-center justify-center shrink-0 cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95`}
        title="locked in logo (hover for surprise!)"
      >
        <svg
          viewBox="0 0 700 620"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full overflow-visible drop-shadow-sm"
        >
          <defs>
            {/* Consistent warm sunny bulb yellow radial gradient */}
            <radialGradient id={`bulbFillGrad_${uid}`} cx="45%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#fff3a8" />
              <stop offset="45%" stopColor="#ffd84d" />
              <stop offset="85%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </radialGradient>

            {/* Consistent warm amber aura filter for lightbulb */}
            <filter id={`consistentBulbGlow_${uid}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
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

            {/* Diamond rounded clip path */}
            <clipPath id={`diamondClip_${uid}`}>
              <rect
                x="195"
                y="155"
                width="310"
                height="310"
                rx="48"
                transform="rotate(45 350 310)"
              />
            </clipPath>
          </defs>

          {/* 1. CENTER DIAMOND EARTH */}
          <g id="center-diamond">
            {/* Continent & Ocean interior clipped to the diamond */}
            <g clipPath={`url(#diamondClip_${uid})`}>
              {/* Sky Blue Ocean background */}
              <rect x="80" y="40" width="540" height="540" fill="#88c3ff" />

              {/* Mint Green Continents - Perfectly Even, Prominent & Balanced: One top, one right, one left, small bottom */}
              {/* 1. TOP Landmass (Centered horizontally at top apex, clearly visible inside diamond) */}
              <path
                d="M 260 80
                   Q 285 140 290 175
                   C 310 215 330 220 350 218
                   C 370 220 390 215 410 175
                   Q 415 140 440 80
                   Z"
                fill="#7ee29d"
              />
              <path
                d="M 260 92
                   Q 285 140 290 175
                   C 310 215 330 220 350 218
                   C 370 220 390 215 410 175
                   Q 415 140 440 92"
                stroke="#1e293b"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />

              {/* 2. LEFT Landmass (Centered vertically at left apex, clearly visible inside diamond) */}
              <path
                d="M 115 190
                   Q 175 210 210 240
                   C 245 275 250 310 248 310
                   C 250 310 245 345 210 380
                   Q 175 410 115 430
                   Z"
                fill="#7ee29d"
              />
              <path
                d="M 125 205
                   Q 175 210 210 240
                   C 245 275 250 310 248 310
                   C 250 310 245 345 210 380
                   Q 175 410 125 415"
                stroke="#1e293b"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />

              {/* 3. RIGHT Landmass (Centered vertically at right apex, perfectly even with left) */}
              <path
                d="M 585 190
                   Q 525 210 490 240
                   C 455 275 450 310 452 310
                   C 450 310 455 345 490 380
                   Q 525 410 585 430
                   Z"
                fill="#7ee29d"
              />
              <path
                d="M 575 205
                   Q 525 210 490 240
                   C 455 275 450 310 452 310
                   C 450 310 455 345 490 380
                   Q 525 410 575 415"
                stroke="#1e293b"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />

              {/* 4. BOTTOM Landmass (Small polar cap / island, centered at bottom apex) */}
              <path
                d="M 315 460
                   C 335 440 365 440 385 460
                   Q 380 495 350 522
                   Q 320 495 315 460
                   Z"
                fill="#7ee29d"
              />
              <path
                d="M 315 460
                   C 335 440 365 440 385 460"
                stroke="#1e293b"
                strokeWidth="6.5"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* Hand-Drawn Charcoal Diamond Outer Border */}
            <rect
              x="195"
              y="155"
              width="310"
              height="310"
              rx="48"
              transform="rotate(45 350 310)"
              fill="none"
              stroke="#1e293b"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* LIGHT RAYS - Emanating symmetrically from center (350, 310) */}
            <motion.g
              id="bulb-light-rays"
              stroke="#e69500"
              strokeWidth="6"
              strokeLinecap="round"
              filter={`url(#consistentBulbGlow_${uid})`}
              animate={
                isHovered
                  ? {
                      opacity: [1, 0.1, 0.95, 0.15, 0.9, 0.2, 1],
                    }
                  : { opacity: 1 }
              }
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            >
              {/* Ray 1: Top vertical ray */}
              <path d="M 350 220 L 350 185" />
              {/* Ray 2: Top-right upper ray */}
              <path d="M 392 235 L 420 205" />
              {/* Ray 3: Top-right ray */}
              <path d="M 415 272 L 448 255" />
              {/* Ray 4: Right horizontal ray */}
              <path d="M 425 310 L 460 310" />
              {/* Ray 5: Lower-right ray */}
              <path d="M 405 355 L 435 380" />
              {/* Ray 6: Top-left ray */}
              <path d="M 308 235 L 280 205" />
              {/* Ray 7: Left upper diagonal ray */}
              <path d="M 285 272 L 252 255" />
              {/* Ray 8: Left horizontal ray */}
              <path d="M 275 310 L 240 310" />
              {/* Ray 9: Lower-left ray */}
              <path d="M 295 355 L 265 380" />
            </motion.g>

            {/* LIGHT BULB DEAD-CENTER IN THE GLOBE AT (350, 310) */}
            <g transform="translate(350, 310)">
              <motion.g
                id="lightbulb"
                filter={`url(#consistentBulbGlow_${uid})`}
                animate={
                  isHovered
                    ? {
                        opacity: [1, 0.15, 1, 0.2, 0.95, 0.25, 1],
                      }
                    : { opacity: 1 }
                }
                transition={{ duration: 0.8, ease: 'easeInOut' }}
              >
                {/* Bulb Base (grey screw thread socket centered below bulb glass) */}
                <g id="bulb-base">
                  <path
                    d="M -22 36 L 22 36 L 20 74 C 20 80 12 84 0 84 C -12 84 -20 80 -20 74 Z"
                    fill="#c5cbd6"
                    stroke="#1e293b"
                    strokeWidth="4.5"
                    strokeLinejoin="round"
                  />
                  <line x1="-20" y1="46" x2="20" y2="46" stroke="#718096" strokeWidth="4" strokeLinecap="round" />
                  <line x1="-19" y1="56" x2="19" y2="56" stroke="#718096" strokeWidth="4" strokeLinecap="round" />
                  <line x1="-18" y1="66" x2="18" y2="66" stroke="#718096" strokeWidth="4" strokeLinecap="round" />
                  <path
                    d="M -12 78 Q 0 84 12 78"
                    stroke="#ffffff"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </g>

                {/* Bulb Globe (Centered so combined visual center of bulb & base is at 0,0) */}
                <ellipse
                  cx="0"
                  cy="-14"
                  rx="58"
                  ry="60"
                  fill={`url(#bulbFillGrad_${uid})`}
                  stroke="#e69500"
                  strokeWidth="5"
                />
                <ellipse
                  cx="-1"
                  cy="-13"
                  rx="56"
                  ry="58"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="2.5"
                  opacity="0.8"
                />
                {/* Warm glow highlight */}
                <ellipse
                  cx="-16"
                  cy="-28"
                  rx="14"
                  ry="8"
                  transform="rotate(-25 -16 -28)"
                  fill="#ffffff"
                  opacity="0.65"
                />
                {/* Filament tungsten loop */}
                <path
                  d="M -12 12 L -6 -6 Q 0 -14 6 -6 L 12 12"
                  stroke="#b45309"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </motion.g>
            </g>
          </g>

          {/* 2. TOP-LEFT FACE (YELLOW - Curious) - Spins in place on hover until returning to original position */}
          <g transform="translate(150, 122)">
            <motion.g
              animate={isHovered ? { rotate: [0, 360], scale: [1, 1.15, 1] } : { rotate: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            >
              <circle cx="0" cy="0" r="58" fill="#ffea78" stroke="#1e293b" strokeWidth="7" />
              <path d="M -32 -46 Q -12 -58 10 -46" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" fill="none" />
              <circle cx="-24" cy="-14" r="5.5" fill="#0ea5e9" />
              <circle cx="24" cy="-14" r="5.5" fill="#0ea5e9" />
              <ellipse cx="2" cy="18" rx="20" ry="14" fill="#ebe4dc" stroke="#1e293b" strokeWidth="6" />
            </motion.g>
          </g>

          {/* 3. TOP-RIGHT FACE (CORAL/PINK - Joyful) - Spins in place on hover until returning to original position */}
          <g transform="translate(545, 128)">
            <motion.g
              animate={isHovered ? { rotate: [0, -360], scale: [1, 1.15, 1] } : { rotate: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            >
              <circle cx="0" cy="0" r="60" fill="#ffadad" stroke="#1e293b" strokeWidth="7" />
              <path d="M -24 -50 Q 6 -60 32 -48" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" fill="none" />
              <path d="M -32 -26 L -16 -26" stroke="#1e293b" strokeWidth="6.5" strokeLinecap="round" />
              <path d="M 12 -30 Q 24 -38 40 -30" stroke="#1e293b" strokeWidth="6.5" strokeLinecap="round" fill="none" />
              <circle cx="-22" cy="-10" r="5.5" fill="#1e293b" />
              <circle cx="26" cy="-10" r="5.5" fill="#1e293b" />
              <path
                d="M -20 12 L 24 12 L 2 44 Z"
                fill="#ffffff"
                stroke="#1e293b"
                strokeWidth="6"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </motion.g>
          </g>

          {/* 4. BOTTOM-LEFT FACE (PEACH - Squinting Smile) - Spins in place on hover until returning to original position */}
          <g transform="translate(142, 495)">
            <motion.g
              animate={isHovered ? { rotate: [0, -360], scale: [1, 1.15, 1] } : { rotate: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            >
              <circle cx="0" cy="0" r="60" fill="#ffcb95" stroke="#1e293b" strokeWidth="7" />
              <path d="M -26 -48 Q 0 -58 24 -48" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" fill="none" />
              <path d="M -32 -14 Q -20 -20 -10 -14" stroke="#1e293b" strokeWidth="6.5" strokeLinecap="round" fill="none" />
              <path d="M 10 -14 Q 20 -20 32 -14" stroke="#1e293b" strokeWidth="6.5" strokeLinecap="round" fill="none" />
              <path
                d="M -38 8 C -34 2, -28 4, -26 12 C -24 18, -28 22, -34 20"
                stroke="#1e293b"
                strokeWidth="6.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M -26 14 Q 0 24 26 14"
                stroke="#1e293b"
                strokeWidth="6.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 38 8 C 34 2, 28 4, 26 12 C 24 18, 28 22, 34 20"
                stroke="#1e293b"
                strokeWidth="6.5"
                strokeLinecap="round"
                fill="none"
              />
            </motion.g>
          </g>

          {/* 5. BOTTOM-RIGHT FACE (BEIGE / GREEN EYE - Friendly) - Spins in place on hover until returning to original position */}
          <g transform="translate(548, 502)">
            <motion.g
              animate={isHovered ? { rotate: [0, 360], scale: [1, 1.15, 1] } : { rotate: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            >
              <circle cx="0" cy="0" r="60" fill="#ede0d7" stroke="#1e293b" strokeWidth="7" />
              <path d="M -28 -48 Q 4 -60 26 -46" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" fill="none" />
              <circle cx="-28" cy="-14" r="6" fill="#22c55e" />
              <circle cx="22" cy="-14" r="5.5" fill="#1e293b" />
              <path
                d="M -20 16 Q 0 36 22 16"
                stroke="#1e293b"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </motion.g>
          </g>
        </svg>
      </div>

      {showText && (
        <span className={`text-slate-800 flex items-center ${currentSize.text}`}>
          <span className="font-black tracking-tight text-slate-800 drop-shadow-xs">
            locked in
          </span>
        </span>
      )}
    </div>
  );
};
