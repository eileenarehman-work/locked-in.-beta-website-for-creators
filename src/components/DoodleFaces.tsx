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

export const MAKER_QUIPS_POOL = [
  'hey baddie',
  'whatcha building?',
  'show me what you made',
  'cookin up something fire?',
  'you are awesomee',
  'drop the prototype',
  'need a teammate?',
  'you got this',
  'looking good today',
  'let them cook',
  'locking in',
  'tell me about your project',
  'wanna team up?',
  'wowwww',
  '10/10 prototype',
  'whats a cool thing you did today?',
  'who needs a co-builder?',
  'whats your next big idea',
];

export const DOODLE_FACES_LIST: DoodleFaceData[] = [
  { key: 'surprised_yellow', label: 'Amazed', quip: 'hey baddie' },
  { key: 'excited_pink', label: 'Pumped', quip: 'whatcha building?' },
  { key: 'blissful_peach', label: 'Zen', quip: 'show me what you made' },
  { key: 'mismatched_mint', label: 'Curious', quip: 'need a teammate?' },
  { key: 'star_butter', label: 'Inspired', quip: 'drop the prototype' },
  { key: 'cool_specs', label: 'Specs', quip: 'show me the CAD' },
  { key: 'sleepy_lavender', label: 'Cozy', quip: 'let them cook' },
  { key: 'sparkle_mint', label: 'Sparkle', quip: 'looking good today' },
  { key: 'wink_apricot', label: 'Playful', quip: 'cookin up something fire?' },
  { key: 'determined_coral', label: 'Locked In', quip: 'locking in' },
  { key: 'nerdy_teal', label: 'Hacker', quip: 'wanna team up?' },
  { key: 'zen_cream', label: 'Chill', quip: 'you got this' },
  { key: 'mischief_violet', label: 'Crafty', quip: 'tell me about your project' },
  { key: 'laughing_sun', label: 'Stoked', quip: '10/10 prototype' },
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
  interactive = false, // strictly non-clickable by default! Only bottom row and center of feed are interactive.
  onClick,
  showQuipOnHover = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [clickedQuip, setClickedQuip] = useState<string | null>(null);
  const data = DOODLE_FACES_LIST.find((f) => f.key === type) || DOODLE_FACES_LIST[0];

  const handleClick = (e: React.MouseEvent) => {
    if (!interactive) return;
    e.stopPropagation();
    // Pick from maker quips
    const randomQuip =
      MAKER_QUIPS_POOL[Math.floor(Math.random() * MAKER_QUIPS_POOL.length)];
    setClickedQuip(randomQuip);
    setTimeout(() => {
      setClickedQuip(null);
    }, 3500);

    onClick?.();
  };

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
      onClick={interactive ? handleClick : undefined}
      title={interactive ? data.label : undefined}
    >
      {renderSvg()}

      {/* Speech bubble when clicked (only if interactive) */}
      <AnimatePresence>
        {interactive && clickedQuip && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.92 }}
            animate={{ opacity: 1, y: -6, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.92 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 z-[100] pointer-events-none mb-2 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-center shadow-lg shadow-slate-900/10"
          >
            <span className="text-xs font-sans font-semibold text-slate-900 leading-snug block">
              {clickedQuip}
            </span>
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 h-2 w-2 rotate-45 border-r border-b border-slate-200 bg-white" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Quip Bubble on Hover (only if interactive) */}
      <AnimatePresence>
        {interactive && showQuipOnHover && isHovered && !clickedQuip && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: -6, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 z-50 pointer-events-none mb-1 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3 py-1 text-center text-xs font-sans font-medium text-slate-800 shadow-md"
          >
            <p className="leading-tight">{data.quip}</p>
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 h-1.5 w-1.5 rotate-45 border-r border-b border-slate-200 bg-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface FacesSurroundBoxProps {
  children: React.ReactNode;
  className?: string;
  badge?: React.ReactNode;
  innerClassName?: string;
}

/**
 * Adorable decorative box framed on all sides (top, bottom, left, right)
 * with the signature pastel doodle maker faces!
 */
export const FacesSurroundBox: React.FC<FacesSurroundBoxProps> = ({
  children,
  className = '',
  badge,
  innerClassName = '',
}) => {
  const topFaces: DoodleFaceKey[] = [
    'surprised_yellow',
    'excited_pink',
    'blissful_peach',
    'mismatched_mint',
    'star_butter',
    'cool_specs',
    'sleepy_lavender',
    'sparkle_mint',
    'wink_apricot',
    'determined_coral',
    'nerdy_teal',
    'laughing_sun',
  ];

  const bottomFaces: DoodleFaceKey[] = [
    'laughing_sun',
    'nerdy_teal',
    'mischief_violet',
    'zen_cream',
    'determined_coral',
    'wink_apricot',
    'sparkle_mint',
    'sleepy_lavender',
    'cool_specs',
    'star_butter',
    'mismatched_mint',
    'surprised_yellow',
  ];

  const sideFacesLeft: DoodleFaceKey[] = [
    'excited_pink',
    'blissful_peach',
    'mismatched_mint',
  ];

  const sideFacesRight: DoodleFaceKey[] = [
    'wink_apricot',
    'determined_coral',
    'sparkle_mint',
  ];

  return (
    <div
      className={`relative rounded-3xl border-2 border-slate-200/90 bg-white shadow-xs p-2 sm:p-2.5 overflow-hidden select-none ${className}`}
    >
      {/* Top Border Row of Faces */}
      <div className="flex items-center justify-between gap-1 overflow-hidden px-1 pb-1.5 pt-0.5 border-b border-slate-100/80">
        {topFaces.map((f, i) => (
          <div key={`top-${f}-${i}`} className="shrink-0 opacity-85 hover:opacity-100 transition-opacity">
            <DoodleFace type={f} size="xs" interactive={false} />
          </div>
        ))}
      </div>

      {/* Middle row: Left Column Faces + Content + Right Column Faces */}
      <div className="flex items-stretch justify-between py-1.5 gap-2">
        {/* Left Side Faces Column */}
        <div className="hidden sm:flex flex-col justify-around py-1 shrink-0 px-0.5 opacity-85">
          {sideFacesLeft.map((f, i) => (
            <div key={`left-${f}-${i}`} className="my-auto">
              <DoodleFace type={f} size="xs" interactive={false} />
            </div>
          ))}
        </div>

        {/* Center Content Box */}
        <div className={`flex-1 rounded-2xl bg-slate-50/60 p-3 sm:p-5 border border-slate-100 ${innerClassName}`}>
          {badge && <div className="mb-2">{badge}</div>}
          {children}
        </div>

        {/* Right Side Faces Column */}
        <div className="hidden sm:flex flex-col justify-around py-1 shrink-0 px-0.5 opacity-85">
          {sideFacesRight.map((f, i) => (
            <div key={`right-${f}-${i}`} className="my-auto">
              <DoodleFace type={f} size="xs" interactive={false} />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Border Row of Faces */}
      <div className="flex items-center justify-between gap-1 overflow-hidden px-1 pt-1.5 pb-0.5 border-t border-slate-100/80">
        {bottomFaces.map((f, i) => (
          <div key={`bottom-${f}-${i}`} className="shrink-0 opacity-85 hover:opacity-100 transition-opacity">
            <DoodleFace type={f} size="xs" interactive={false} />
          </div>
        ))}
      </div>
    </div>
  );
};

interface BottomFacesRowProps {
  onFaceClick?: (quip: string, faceKey: DoodleFaceKey) => void;
}

export const BottomFacesRow: React.FC<BottomFacesRowProps> = ({ onFaceClick }) => {
  const [activeSpeech, setActiveSpeech] = useState<{ quip: string; faceKey: DoodleFaceKey } | null>(null);

  const handleFaceClick = (item: DoodleFaceData) => {
    // Pick from pool with bias toward "hey baddie" and "whatcha building?"
    const quip =
      Math.random() < 0.35
        ? Math.random() < 0.5
          ? 'hey baddie'
          : 'whatcha building?'
        : MAKER_QUIPS_POOL[Math.floor(Math.random() * MAKER_QUIPS_POOL.length)];
    setActiveSpeech({ quip, faceKey: item.key });
    if (onFaceClick) {
      onFaceClick(quip, item.key);
    }
    setTimeout(() => {
      setActiveSpeech((prev) => (prev?.faceKey === item.key ? null : prev));
    }, 4000);
  };

  return (
    <div className="w-full bg-slate-50/80 border-t border-slate-200/90 py-1.5 px-4 relative overflow-visible select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 sm:gap-4 flex-wrap overflow-visible">
        {DOODLE_FACES_LIST.map((item, index) => {
          const isSpeaking = activeSpeech?.faceKey === item.key;
          return (
            <div key={item.key} className="relative group overflow-visible">
              <button
                type="button"
                onClick={() => handleFaceClick(item)}
                className={`p-0.5 rounded-full transition-all cursor-pointer opacity-80 hover:opacity-100 hover:scale-135 active:scale-95 ${
                  index % 2 === 0 ? 'hover:-rotate-6' : 'hover:rotate-6'
                }`}
                title={item.label}
                aria-label={item.label}
              >
                <DoodleFace type={item.key} size="xs" interactive={false} />
              </button>

              {/* Speech Bubble when clicked */}
              <AnimatePresence>
                {isSpeaking && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.92 }}
                    animate={{ opacity: 1, y: -6, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.92 }}
                    transition={{ duration: 0.15 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 z-[100] pointer-events-none mb-2 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-center shadow-lg shadow-slate-900/10"
                  >
                    <span className="text-xs font-sans font-semibold text-slate-800 leading-snug block">
                      {activeSpeech.quip}
                    </span>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 h-2 w-2 rotate-45 border-r border-b border-slate-200 bg-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
