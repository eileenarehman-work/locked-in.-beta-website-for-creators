import React from 'react';
import { motion } from 'motion/react';
import robotHammerImg from '../assets/images/robot_hammer_logo.png';

export interface RobotHammerLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isActive?: boolean;
  className?: string;
  animateContinuous?: boolean;
}

export const RobotHammerLogo: React.FC<RobotHammerLogoProps> = ({
  size = 'sm',
  isActive = false,
  className = '',
  animateContinuous = true,
}) => {
  const sizeMap = {
    xs: 'h-5 w-5',
    sm: 'h-6 w-6',
    md: 'h-7 w-7',
    lg: 'h-9 w-9',
    xl: 'h-12 w-12',
  };

  const containerSize = sizeMap[size] || sizeMap.sm;

  // Active hammering motion keyframes
  const activeAnimation = {
    rotate: [0, -14, 6, -10, 4, 0],
    scale: [1, 1.08, 0.98, 1.05, 1],
    y: [0, -2, 1, -1, 0],
    transition: {
      duration: 1.8,
      repeat: Infinity,
      repeatType: 'loop' as const,
      ease: 'easeInOut' as const,
    },
  };

  // Idle gentle breathing & crafting bob
  const idleAnimation = animateContinuous
    ? {
        rotate: [-1.5, 1.5, -1.5],
        y: [0, -1.2, 0],
        transition: {
          duration: 3,
          repeat: Infinity,
          repeatType: 'loop' as const,
          ease: 'easeInOut' as const,
        },
      }
    : {};

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${containerSize} ${className}`}>
      {/* Animated Maker Sparks on Active / Tap */}
      {isActive && (
        <>
          <motion.span
            animate={{
              scale: [0, 1.2, 0],
              opacity: [0, 1, 0],
              x: [-2, -8, -12],
              y: [-2, -8, -14],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              repeatDelay: 0.2,
              ease: 'easeOut',
            }}
            className="absolute -top-1 left-1.5 h-1.5 w-1.5 rounded-full bg-amber-400 pointer-events-none z-10 shadow-xs"
          />
          <motion.span
            animate={{
              scale: [0, 1.4, 0],
              opacity: [0, 1, 0],
              x: [2, 6, 10],
              y: [-1, -6, -10],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              repeatDelay: 0.3,
              delay: 0.4,
              ease: 'easeOut',
            }}
            className="absolute -top-1 right-2 h-1 w-1 rounded-full bg-emerald-400 pointer-events-none z-10 shadow-xs"
          />
        </>
      )}

      {/* Main Hand-Drawn Robot & Claw Hammer Artwork with Motion */}
      <motion.div
        className="w-full h-full flex items-center justify-center"
        animate={isActive ? activeAnimation : idleAnimation}
        whileHover={{
          scale: 1.18,
          rotate: [0, -12, 6, 0],
          transition: { duration: 0.35, ease: 'easeOut' },
        }}
        whileTap={{
          scale: 0.92,
          rotate: 8,
          transition: { duration: 0.15 },
        }}
      >
        <img
          src={robotHammerImg}
          alt="Post Build Logo"
          className="h-full w-full object-contain mix-blend-multiply select-none pointer-events-none filter drop-shadow-2xs"
          draggable={false}
        />
      </motion.div>
    </div>
  );
};
