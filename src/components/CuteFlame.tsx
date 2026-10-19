import React, { useState } from 'react';
import { motion } from 'motion/react';

export interface CuteFlameProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  className?: string;
  onClick?: () => void;
  title?: string;
  /** Force movement even without hover (optional, defaults to false) */
  forceMove?: boolean;
}

const sizeClasses: Record<string, string> = {
  xs: 'w-4 h-4',
  sm: 'w-5 h-5',
  md: 'w-7 h-7',
  lg: 'w-10 h-10',
  xl: 'w-14 h-14',
  '2xl': 'w-20 h-20',
};

export const CuteFlame: React.FC<CuteFlameProps> = ({
  size = 'md',
  className = '',
  onClick,
  title = 'Streak Flame',
  forceMove = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isMoving = isHovered || forceMove;

  const sizeStyle = typeof size === 'number' ? { width: size, height: size } : undefined;
  const sizeClass = typeof size === 'string' ? sizeClasses[size] || 'w-7 h-7' : '';

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center select-none shrink-0 ${sizeClass} ${className} ${
        onClick ? 'cursor-pointer' : ''
      }`}
      style={{
        ...sizeStyle,
        transformOrigin: '50% 90%',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // Only moves when hovered over!
      animate={
        isMoving
          ? {
              rotate: [-5, 5, -4, 4, -5],
              skewX: [-3, 3, -2, 2, -3],
              scaleY: [1.02, 1.09, 0.96, 1.07, 1.02],
              scaleX: [1, 0.94, 1.03, 0.96, 1],
              scale: 1.12,
            }
          : {
              rotate: 0,
              skewX: 0,
              scaleY: 1,
              scaleX: 1,
              scale: 1,
            }
      }
      transition={
        isMoving
          ? {
              duration: 1.15,
              repeat: Infinity,
              ease: 'easeInOut',
            }
          : {
              duration: 0.28,
              ease: 'easeOut',
            }
      }
      whileTap={onClick ? { scale: 0.94 } : undefined}
      onClick={onClick}
      title={title}
      aria-label={title}
      role={onClick ? 'button' : 'img'}
    >
      {/* Burning Heat Aura (Subtle warm glow) */}
      <div
        className={`absolute inset-0 -m-1 rounded-full bg-orange-500/20 blur-xs pointer-events-none transition-opacity duration-300 ${
          isMoving ? 'opacity-100 scale-125' : 'opacity-40'
        }`}
      />

      <svg
        viewBox="0 0 500 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible drop-shadow-xs relative z-10"
      >
        {/* 1. OUTER FLAME BODY - EXACT Red-Orange from drawing (#ea4c16) */}
        <path
          d="M 248 12
             C 255 16, 268 45, 276 75
             C 285 108, 305 145, 335 178
             C 342 165, 365 145, 395 130
             C 422 118, 436 128, 434 152
             C 432 178, 412 210, 424 248
             C 435 285, 442 330, 434 380
             C 424 435, 385 470, 320 488
             C 260 502, 195 498, 140 472
             C 85 444, 62 395, 66 335
             C 70 275, 92 245, 88 200
             C 84 158, 98 125, 118 108
             C 134 95, 148 112, 155 138
             C 162 165, 185 185, 208 172
             C 225 158, 235 110, 240 65
             C 243 38, 244 18, 248 12 Z"
          fill="#ea4c16"
          stroke="#9e2a07"
          strokeWidth="7"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Hand-drawn sketchy contour accents on outer edge */}
        <path
          d="M 72 340 C 68 410, 115 472, 210 492 C 300 502, 395 475, 428 410"
          stroke="#b8340d"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 148 480 C 230 505, 330 496, 400 455"
          stroke="#7a1c02"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />

        {/* 2. MIDDLE FLAME LAYER - EXACT Saturated Orange from drawing (#f97918) */}
        <path
          d="M 250 82
             C 258 115, 282 165, 312 202
             C 328 190, 352 172, 380 162
             C 398 156, 404 168, 398 192
             C 390 224, 385 262, 392 312
             C 398 360, 375 412, 325 436
             C 275 452, 215 448, 168 426
             C 122 402, 102 360, 108 305
             C 112 258, 128 230, 122 195
             C 118 168, 130 152, 142 160
             C 154 170, 172 205, 202 202
             C 226 198, 240 148, 246 108
             C 248 94, 249 85, 250 82 Z"
          fill="#f97918"
          stroke="#d2580a"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* 3. INNER FLAME FACE - EXACT Sunshine Yellow from drawing (#fec124) */}
        <path
          d="M 132 285
             C 142 268, 162 252, 185 248
             C 205 245, 222 258, 242 245
             C 258 235, 275 242, 298 250
             C 325 258, 348 248, 362 272
             C 376 295, 372 328, 362 365
             C 348 408, 312 432, 252 434
             C 192 432, 148 404, 134 362
             C 125 330, 124 302, 132 285 Z"
          fill="#fec124"
          stroke="#e89f10"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Sketchy shadow stroke under inner face */}
        <path
          d="M 152 385 C 205 422, 298 420, 348 382"
          stroke="#df9208"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.65"
        />

        {/* 4. ADORABLE FACE FEATURES */}
        {/* Left Bead Eye */}
        <ellipse cx="178" cy="282" rx="9.5" ry="11.5" fill="#181413" />
        {/* Left Eye Twinkle / Catchlight */}
        <circle cx="181.5" cy="278.5" r="3.2" fill="#ffffff" />

        {/* Right Bead Eye */}
        <ellipse cx="316" cy="278" rx="9.5" ry="11.5" fill="#181413" />
        {/* Right Eye Twinkle / Catchlight */}
        <circle cx="319.5" cy="274.5" r="3.2" fill="#ffffff" />

        {/* Cute "v" Shaped Smiling Mouth */}
        <path
          d="M 238 279 Q 247 293 256 279"
          stroke="#181413"
          strokeWidth="6.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Subtle Rosy Cheek Blushes */}
        <circle cx="152" cy="302" r="9" fill="#f87b1c" opacity="0.38" />
        <circle cx="340" cy="298" r="9" fill="#f87b1c" opacity="0.38" />

        {/* 5. BURNING SPARKS (Dance & rise off flame tips when hovered) */}
        {/* Center Tip Spark */}
        <motion.circle
          cx="252"
          cy="2"
          r="4.5"
          fill="#fec124"
          stroke="#ea4c16"
          strokeWidth="1.5"
          animate={
            isMoving
              ? {
                  cy: [2, -18, -28],
                  cx: [252, 258, 250],
                  opacity: [1, 0.8, 0],
                  scale: [1, 1.3, 0.4],
                }
              : {
                  cy: 2,
                  cx: 252,
                  opacity: 0.9,
                  scale: 1,
                }
          }
          transition={
            isMoving
              ? {
                  duration: 1.1,
                  repeat: Infinity,
                  ease: 'easeOut',
                }
              : { duration: 0.2 }
          }
        />

        {/* Left Flame Tip Spark */}
        <motion.circle
          cx="108"
          cy="92"
          r="3.5"
          fill="#f97918"
          stroke="#9e2a07"
          strokeWidth="1"
          animate={
            isMoving
              ? {
                  cy: [92, 75, 62],
                  cx: [108, 98, 92],
                  opacity: [1, 0.85, 0],
                  scale: [1, 1.25, 0.3],
                }
              : {
                  cy: 92,
                  cx: 108,
                  opacity: 0.85,
                  scale: 1,
                }
          }
          transition={
            isMoving
              ? {
                  duration: 1.25,
                  repeat: Infinity,
                  ease: 'easeOut',
                  delay: 0.2,
                }
              : { duration: 0.2 }
          }
        />

        {/* Right Flame Tip Spark */}
        <motion.circle
          cx="418"
          cy="115"
          r="4"
          fill="#fec124"
          stroke="#ea4c16"
          strokeWidth="1.2"
          animate={
            isMoving
              ? {
                  cy: [115, 96, 82],
                  cx: [418, 428, 434],
                  opacity: [1, 0.9, 0],
                  scale: [1, 1.3, 0.4],
                }
              : {
                  cy: 115,
                  cx: 418,
                  opacity: 0.85,
                  scale: 1,
                }
          }
          transition={
            isMoving
              ? {
                  duration: 1.18,
                  repeat: Infinity,
                  ease: 'easeOut',
                  delay: 0.4,
                }
              : { duration: 0.2 }
          }
        />
      </svg>
    </motion.div>
  );
};
