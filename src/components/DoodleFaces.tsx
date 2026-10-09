import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export type DoodleFaceKey =
  | 'surprised_yellow'
  | 'excited_pink'
  | 'blissful_peach'
  | 'mismatched_mint'
  | 'star_butter'
  | 'cool_specs'
  | 'sleepy_lavender'
  | 'sparkle_mint'
  | 'wink_apricot'
  | 'determined_coral'
  | 'nerdy_teal'
  | 'zen_cream'
  | 'mischief_violet'
  | 'laughing_sun';

interface DoodleFaceData {
  key: DoodleFaceKey;
  label: string;
  quip: string;
}

export const DOODLE_FACES_LIST: DoodleFaceData[] = [
  { key: 'surprised_yellow', label: 'Amazed', quip: 'yo wait who built that autonomous drone?' },
  { key: 'excited_pink', label: 'Pumped', quip: 'i need a frontend wizard for my project ASAP' },
  { key: 'blissful_peach', label: 'Zen Maker', quip: 'just soldered my 12th test board. pure peace.' },
  { key: 'mismatched_mint', label: 'Curious', quip: 'can i request to collaborate on your build?' },
  { key: 'star_butter', label: 'Inspired', quip: 'this community is where makers actually lock in' },
  { key: 'cool_specs', label: 'Engineer', quip: 'already writing the firmware docs for the repo' },
  { key: 'sleepy_lavender', label: 'Night Owl', quip: 'debugging CAD models at 3am hits different' },
  { key: 'sparkle_mint', label: 'Builder', quip: 'drop your build in the feed and let’s review it' },
  { key: 'wink_apricot', label: 'Playful', quip: 'my daily streak flame is literally on fire' },
  { key: 'determined_coral', label: 'Locked In', quip: 'no talk, just pure prototype progress' },
  { key: 'nerdy_teal', label: 'Hardware Nerd', quip: 'open sourcing the schematics for everyone' },
  { key: 'zen_cream', label: 'Cozy', quip: 'reviewing fellow makers builds gives you bonus points' },
  { key: 'mischief_violet', label: 'Crafty', quip: 'working on a secret project with my collaborator' },
  { key: 'laughing_sun', label: 'Stoked', quip: 'invited 2 builders to my team and we shipped!' },
];

interface DoodleFaceProps {
  type: DoodleFaceKey;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
  showQuipOnHover?: boolean;
}

export const DoodleFace: React.FC<DoodleFaceProps> = ({
  type,
  size = 'md',
  className = '',
  interactive = false,
  onClick,
  showQuipOnHover = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const data = DOODLE_FACES_LIST.find((f) => f.key === type) || DOODLE_FACES_LIST[0];

  const sizeClasses = {
    xs: 'h-5 w-5',
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-14 w-14',
  };

  const renderSvg = () => {
    switch (type) {
      // 1. Surprised Yellow (Reference face #1)
      case 'surprised_yellow':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
            <circle cx="50" cy="50" r="46" fill="#fef08a" stroke="#1e293b" strokeWidth="6" />
            <path d="M 28 14 Q 45 8 58 14" stroke="#1e293b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <circle cx="32" cy="38" r="5" fill="#0284c7" />
            <circle cx="68" cy="38" r="5" fill="#0284c7" />
            <ellipse cx="50" cy="62" rx="13" ry="11" fill="#1e293b" />
            <ellipse cx="50" cy="62" rx="9" ry="7" fill="#fef08a" />
          </svg>
        );

      // 2. Excited Pink (Reference face #2)
      case 'excited_pink':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
            <circle cx="50" cy="50" r="46" fill="#fca5a5" stroke="#1e293b" strokeWidth="6" />
            <line x1="22" y1="26" x2="38" y2="26" stroke="#1e293b" strokeWidth="5.5" strokeLinecap="round" />
            <path d="M 58 22 Q 68 16 78 22" stroke="#1e293b" strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <circle cx="32" cy="38" r="4.5" fill="#1e293b" />
            <circle cx="68" cy="38" r="4.5" fill="#1e293b" />
            <path d="M 33 52 L 67 52 L 50 80 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="5.5" strokeLinejoin="round" />
          </svg>
        );

      // 3. Blissful Peach (Reference face #3)
      case 'blissful_peach':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
            <circle cx="50" cy="50" r="46" fill="#fed7aa" stroke="#1e293b" strokeWidth="6" />
            <path d="M 24 38 Q 34 26 44 38" stroke="#1e293b" strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <path d="M 56 38 Q 66 26 76 38" stroke="#1e293b" strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <path d="M 22 52 C 24 47 28 48 29 54" stroke="#1e293b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M 29 55 Q 50 67 71 55" stroke="#1e293b" strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <path d="M 78 52 C 76 47 72 48 71 54" stroke="#1e293b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </svg>
        );

      // 4. Mismatched Mint (Reference face #4)
      case 'mismatched_mint':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
            <circle cx="50" cy="50" r="46" fill="#f5ebe0" stroke="#1e293b" strokeWidth="6" />
            <circle cx="30" cy="38" r="6" fill="#16a34a" />
            <circle cx="70" cy="38" r="5" fill="#1e293b" />
            <path d="M 36 60 Q 50 74 64 60" stroke="#1e293b" strokeWidth="5.5" strokeLinecap="round" fill="none" />
          </svg>
        );

      // 5. Star Butter
      case 'star_butter':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
            <circle cx="50" cy="50" r="46" fill="#fde047" stroke="#1e293b" strokeWidth="6" />
            <path d="M 32 30 L 34 38 L 42 40 L 34 42 L 32 50 L 30 42 L 22 40 L 30 38 Z" fill="#1e293b" />
            <path d="M 68 30 L 70 38 L 78 40 L 70 42 L 68 50 L 66 42 L 58 40 L 66 38 Z" fill="#1e293b" />
            <path d="M 32 62 Q 50 78 68 62" stroke="#1e293b" strokeWidth="5.5" strokeLinecap="round" fill="none" />
          </svg>
        );

      // 6. Cool Specs
      case 'cool_specs':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
            <circle cx="50" cy="50" r="46" fill="#bae6fd" stroke="#1e293b" strokeWidth="6" />
            <circle cx="32" cy="38" r="13" stroke="#1e293b" strokeWidth="5" fill="#e0f2fe" />
            <circle cx="68" cy="38" r="13" stroke="#1e293b" strokeWidth="5" fill="#e0f2fe" />
            <line x1="45" y1="38" x2="55" y2="38" stroke="#1e293b" strokeWidth="5" />
            <circle cx="32" cy="38" r="3.5" fill="#1e293b" />
            <circle cx="68" cy="38" r="3.5" fill="#1e293b" />
            <path d="M 38 65 Q 56 68 66 60" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" fill="none" />
          </svg>
        );

      // 7. Sleepy Lavender
      case 'sleepy_lavender':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
            <circle cx="50" cy="50" r="46" fill="#ddd6fe" stroke="#1e293b" strokeWidth="6" />
            <path d="M 24 38 Q 34 46 44 38" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M 56 38 Q 66 46 76 38" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" fill="none" />
            <circle cx="24" cy="52" r="5" fill="#f472b6" opacity="0.6" />
            <circle cx="76" cy="52" r="5" fill="#f472b6" opacity="0.6" />
            <ellipse cx="50" cy="62" rx="5" ry="3" fill="#1e293b" />
          </svg>
        );

      // 8. Sparkle Mint
      case 'sparkle_mint':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
            <circle cx="50" cy="50" r="46" fill="#a7f3d0" stroke="#1e293b" strokeWidth="6" />
            <circle cx="32" cy="38" r="5.5" fill="#1e293b" />
            <circle cx="68" cy="38" r="5.5" fill="#1e293b" />
            <circle cx="30" cy="36" r="2" fill="#ffffff" />
            <circle cx="66" cy="36" r="2" fill="#ffffff" />
            <circle cx="50" cy="64" r="7" stroke="#1e293b" strokeWidth="4.5" fill="#ffffff" />
          </svg>
        );

      // 9. Wink Apricot
      case 'wink_apricot':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
            <circle cx="50" cy="50" r="46" fill="#ffedd5" stroke="#1e293b" strokeWidth="6" />
            <path d="M 24 38 Q 34 28 44 38" stroke="#1e293b" strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <circle cx="68" cy="38" r="5.5" fill="#1e293b" />
            <path d="M 35 56 Q 50 68 65 56" stroke="#1e293b" strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <path d="M 46 64 C 46 72 54 72 54 64 Z" fill="#fb7185" stroke="#1e293b" strokeWidth="3.5" />
          </svg>
        );

      // 10. Determined Coral
      case 'determined_coral':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
            <circle cx="50" cy="50" r="46" fill="#f87171" stroke="#1e293b" strokeWidth="6" />
            <line x1="22" y1="28" x2="42" y2="36" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
            <line x1="78" y1="28" x2="58" y2="36" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
            <circle cx="34" cy="42" r="4.5" fill="#1e293b" />
            <circle cx="66" cy="42" r="4.5" fill="#1e293b" />
            <rect x="36" y="58" width="28" height="10" rx="3" fill="#ffffff" stroke="#1e293b" strokeWidth="4.5" />
            <line x1="50" y1="58" x2="50" y2="68" stroke="#1e293b" strokeWidth="3.5" />
          </svg>
        );

      // 11. Nerdy Teal
      case 'nerdy_teal':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
            <circle cx="50" cy="50" r="46" fill="#99f6e4" stroke="#1e293b" strokeWidth="6" />
            <circle cx="32" cy="38" r="11" stroke="#1e293b" strokeWidth="4.5" fill="none" />
            <circle cx="68" cy="38" r="11" stroke="#1e293b" strokeWidth="4.5" fill="none" />
            <line x1="43" y1="38" x2="57" y2="38" stroke="#1e293b" strokeWidth="4.5" />
            <circle cx="32" cy="38" r="3" fill="#1e293b" />
            <circle cx="68" cy="38" r="3" fill="#1e293b" />
            {/* Freckles */}
            <circle cx="22" cy="52" r="1.5" fill="#1e293b" />
            <circle cx="26" cy="55" r="1.5" fill="#1e293b" />
            <circle cx="74" cy="52" r="1.5" fill="#1e293b" />
            <circle cx="78" cy="55" r="1.5" fill="#1e293b" />
            <path d="M 38 64 Q 50 72 62 64" stroke="#1e293b" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </svg>
        );

      // 12. Zen Cream
      case 'zen_cream':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
            <circle cx="50" cy="50" r="46" fill="#fef3c7" stroke="#1e293b" strokeWidth="6" />
            <line x1="26" y1="38" x2="42" y2="38" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
            <line x1="58" y1="38" x2="74" y2="38" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
            <path d="M 35 58 Q 50 70 65 58" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" fill="none" />
          </svg>
        );

      // 13. Mischief Violet
      case 'mischief_violet':
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
            <circle cx="50" cy="50" r="46" fill="#e9d5ff" stroke="#1e293b" strokeWidth="6" />
            <circle cx="28" cy="36" r="4.5" fill="#1e293b" />
            <circle cx="64" cy="36" r="4.5" fill="#1e293b" />
            <path d="M 40 60 Q 56 66 68 56" stroke="#1e293b" strokeWidth="5.5" strokeLinecap="round" fill="none" />
          </svg>
        );

      // 14. Laughing Sun
      case 'laughing_sun':
      default:
        return (
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
            <circle cx="50" cy="50" r="46" fill="#fef08a" stroke="#1e293b" strokeWidth="6" />
            <path d="M 24 36 Q 34 26 44 36" stroke="#1e293b" strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <path d="M 56 36 Q 66 26 76 36" stroke="#1e293b" strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <path d="M 32 54 C 32 74 68 74 68 54 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="5" strokeLinejoin="round" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${sizeClasses[size]} ${className} ${
        interactive ? 'cursor-pointer transition-transform duration-200 hover:scale-115 active:scale-95' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      title={data.label}
    >
      {renderSvg()}

      {/* Floating Quip Bubble on Hover */}
      <AnimatePresence>
        {showQuipOnHover && isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: -8, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 z-50 pointer-events-none mb-1 whitespace-nowrap rounded-xl bg-slate-900 px-3 py-1.5 text-left text-[11px] font-sans font-medium text-white shadow-xl"
          >
            <p className="leading-tight text-amber-200">{data.quip}</p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface BottomFacesRowProps {
  onFaceClick?: (quip: string, faceKey: DoodleFaceKey) => void;
}

export const BottomFacesRow: React.FC<BottomFacesRowProps> = ({ onFaceClick }) => {
  const [activeSpeech, setActiveSpeech] = useState<{ quip: string; faceKey: DoodleFaceKey } | null>(null);

  const handleFaceClick = (item: DoodleFaceData) => {
    setActiveSpeech({ quip: item.quip, faceKey: item.key });
    if (onFaceClick) {
      onFaceClick(item.quip, item.key);
    }
    setTimeout(() => {
      setActiveSpeech((prev) => (prev?.faceKey === item.key ? null : prev));
    }, 4500);
  };

  return (
    <div className="w-full bg-amber-50/70 border-t-2 border-amber-200/60 py-3 px-4 relative overflow-hidden select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left Side: Informal Maker Intrigue Hook */}
        <div className="flex items-center gap-2 shrink-0 text-left">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-900/80">
            Makers locked in
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-xs font-sans text-slate-600 hidden sm:inline">
            Click any face to see what people are building right now
          </span>
        </div>

        {/* Center / Right: The Row of Faces */}
        <div className="relative flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {DOODLE_FACES_LIST.map((item, index) => {
            const isSpeaking = activeSpeech?.faceKey === item.key;
            return (
              <div key={item.key} className="relative group">
                <button
                  type="button"
                  onClick={() => handleFaceClick(item)}
                  className={`p-1 rounded-full transition-transform cursor-pointer hover:scale-120 active:scale-90 ${
                    index % 2 === 0 ? 'hover:-rotate-6' : 'hover:rotate-6'
                  }`}
                  aria-label={item.label}
                >
                  <DoodleFace type={item.key} size="md" />
                </button>

                {/* Speech Bubble when clicked */}
                <AnimatePresence>
                  {isSpeaking && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.9 }}
                      animate={{ opacity: 1, y: -6, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.9 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 z-50 pointer-events-none mb-1.5 w-48 rounded-2xl border-2 border-slate-900 bg-white p-2.5 text-center text-xs font-sans font-medium text-slate-900 shadow-xl"
                    >
                      <p className="text-[11px] text-slate-800 leading-snug">
                        "{activeSpeech.quip}"
                      </p>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1.5 border-6 border-transparent border-t-slate-900" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
