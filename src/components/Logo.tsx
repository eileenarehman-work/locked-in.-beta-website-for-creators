import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const sizeMap = {
    sm: { box: 'h-7 w-7', svg: 'h-4 w-4', text: 'text-sm' },
    md: { box: 'h-9 w-9', svg: 'h-5 w-5', text: 'text-base font-bold' },
    lg: { box: 'h-11 w-11', svg: 'h-6 w-6', text: 'text-xl font-bold' },
    xl: { box: 'h-14 w-14', svg: 'h-8 w-8', text: 'text-2xl font-bold' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Dynamic Maker Spark Emblem (Replaces the old 'W' block) */}
      <div
        className={`relative flex ${currentSize.box} items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-indigo-500/30 ring-1 ring-white/20`}
      >
        <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950/80 backdrop-blur-xs">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${currentSize.svg} text-indigo-400`}
          >
            {/* Hexagonal Maker Node / Geometric Crystal */}
            <path
              d="M12 2.5L20.5 7.4V16.6L12 21.5L3.5 16.6V7.4L12 2.5Z"
              stroke="url(#makerGradient)"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* High-voltage Creation Spark & Code / 3D Extrusion Core */}
            <path
              d="M13 6L8 13.5H13.5L11 18L16.5 10.5H11.5L13 6Z"
              fill="url(#sparkGradient)"
            />
            <defs>
              <linearGradient id="makerGradient" x1="3.5" y1="2.5" x2="20.5" y2="21.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#818CF8" />
                <stop offset="0.5" stopColor="#6366F1" />
                <stop offset="1" stopColor="#34D399" />
              </linearGradient>
              <linearGradient id="sparkGradient" x1="8" y1="6" x2="16.5" y2="18" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F59E0B" />
                <stop offset="0.6" stopColor="#10B981" />
                <stop offset="1" stopColor="#6EE7B7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {showText && (
        <span className={`tracking-tight text-white flex items-center gap-1.5 ${currentSize.text}`}>
          <span>We Did This</span>
        </span>
      )}
    </div>
  );
};
