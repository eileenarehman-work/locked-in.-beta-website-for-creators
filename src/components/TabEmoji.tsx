import React from 'react';
import { motion } from 'motion/react';
import { CuteFlame } from './CuteFlame';
import { RobotHammerLogo } from './RobotHammerLogo';

export type TabType = 'feed' | 'streak' | 'studio' | 'reviews' | 'messages';

interface TabEmojiProps {
  tab: TabType;
  isActive?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TabEmoji: React.FC<TabEmojiProps> = ({
  tab,
  isActive = false,
  className = '',
  size = 'sm',
}) => {
  const sizeMap = {
    sm: 'h-4.5 w-4.5',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const sz = sizeMap[size];

  // 1. FEED: Original Feed Design - Multi-card stream with dynamic discovery signal (No faces!)
  if (tab === 'feed') {
    return (
      <motion.svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${sz} ${className} shrink-0`}
        whileHover={{ scale: 1.15, rotate: -4 }}
        animate={isActive ? { scale: [1, 1.06, 1] } : {}}
        transition={{ duration: 0.25 }}
      >
        {/* Back card (shifted up-right) */}
        <rect
          x="30"
          y="15"
          width="54"
          height="54"
          rx="12"
          fill="#bae6fd"
          stroke="#1e293b"
          strokeWidth="6"
        />
        {/* Back card header line */}
        <line x1="42" y1="28" x2="68" y2="28" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />

        {/* Front main feed card */}
        <rect
          x="16"
          y="31"
          width="54"
          height="54"
          rx="12"
          fill={isActive ? '#38bdf8' : '#e0f2fe'}
          stroke="#1e293b"
          strokeWidth="6.5"
        />
        {/* Media preview box in feed card */}
        <rect
          x="26"
          y="41"
          width="34"
          height="22"
          rx="6"
          fill="#ffffff"
          stroke="#1e293b"
          strokeWidth="4.5"
        />
        {/* Miniature media spark */}
        <circle cx="43" cy="52" r="4.5" fill="#0284c7" />
        {/* Text preview lines */}
        <line x1="26" y1="71" x2="52" y2="71" stroke="#1e293b" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="26" y1="78" x2="40" y2="78" stroke="#1e293b" strokeWidth="4.5" strokeLinecap="round" />

        {/* Dynamic explore pulse orb (accent) */}
        <circle cx="76" cy="38" r="8" fill="#34d399" stroke="#1e293b" strokeWidth="4.5" />
      </motion.svg>
    );
  }

  // 2. STREAK: Exact cute hand-drawn flame mascot with swishing animation
  if (tab === 'streak') {
    return (
      <CuteFlame
        size={size}
        className={`${className} shrink-0`}
        title="Streak Hub"
      />
    );
  }

  // 3. STUDIO / POST TAB: Hand-drawn Robot & Hammer logo with playful hammering animation
  if (tab === 'studio') {
    return (
      <RobotHammerLogo
        size={size}
        isActive={isActive}
        className={className}
      />
    );
  }

  // 4. REVIEWS: Original Reviews Design - Peer Rosette Ribbon & Golden Rating Star (No faces!)
  if (tab === 'reviews') {
    return (
      <motion.svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${sz} ${className} shrink-0`}
        whileHover={{ scale: 1.15, rotate: -6 }}
        animate={isActive ? { scale: [1, 1.08, 1] } : {}}
        transition={{ duration: 0.25 }}
      >
        {/* Review Ribbon tails at bottom */}
        <path
          d="M 38 68 L 30 90 L 44 84 L 50 90 L 46 68"
          fill="#f59e0b"
          stroke="#1e293b"
          strokeWidth="5.5"
          strokeLinejoin="round"
        />
        <path
          d="M 62 68 L 70 90 L 56 84 L 50 90 L 54 68"
          fill="#f59e0b"
          stroke="#1e293b"
          strokeWidth="5.5"
          strokeLinejoin="round"
        />

        {/* Circular Medallion */}
        <circle
          cx="50"
          cy="46"
          r="36"
          fill={isActive ? '#fbbf24' : '#fef08a'}
          stroke="#1e293b"
          strokeWidth="6.5"
        />

        {/* Golden 5-Point Star in center */}
        <path
          d="M 50 24
             L 55 37
             L 69 38
             L 58 48
             L 61 62
             L 50 54
             L 39 62
             L 42 48
             L 31 38
             L 45 37 Z"
          fill="#f59e0b"
          stroke="#1e293b"
          strokeWidth="4.5"
          strokeLinejoin="round"
        />
      </motion.svg>
    );
  }

  // 5. MESSAGES: Original Messages Design - Overlapping Speech Bubbles & Sound dots (No faces!)
  return (
    <motion.svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sz} ${className} shrink-0`}
      whileHover={{ scale: 1.15, y: -1 }}
      animate={isActive ? { scale: [1, 1.08, 1] } : {}}
      transition={{ duration: 0.25 }}
    >
      {/* Back speech bubble */}
      <rect
        x="36"
        y="16"
        width="50"
        height="38"
        rx="14"
        fill="#c7d2fe"
        stroke="#1e293b"
        strokeWidth="6"
      />
      <path
        d="M 72 54 L 80 64 L 66 54 Z"
        fill="#c7d2fe"
        stroke="#1e293b"
        strokeWidth="5"
        strokeLinejoin="round"
      />

      {/* Front primary speech bubble */}
      <rect
        x="14"
        y="36"
        width="56"
        height="44"
        rx="16"
        fill={isActive ? '#818cf8' : '#e0e7ff'}
        stroke="#1e293b"
        strokeWidth="6.5"
      />
      <path
        d="M 28 80 L 20 92 L 38 80 Z"
        fill={isActive ? '#818cf8' : '#e0e7ff'}
        stroke="#1e293b"
        strokeWidth="5.5"
        strokeLinejoin="round"
      />

      {/* Typing/Communication Dots inside front bubble */}
      <circle cx="30" cy="58" r="4.5" fill="#1e293b" />
      <circle cx="42" cy="58" r="4.5" fill="#1e293b" />
      <circle cx="54" cy="58" r="4.5" fill="#1e293b" />
    </motion.svg>
  );
};
