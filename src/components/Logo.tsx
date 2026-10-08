import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const sizeMap = {
    sm: { box: 'h-8 w-9', text: 'text-sm font-bold tracking-tight' },
    md: { box: 'h-10 w-11', text: 'text-base font-extrabold tracking-tight' },
    lg: { box: 'h-13 w-15', text: 'text-xl font-extrabold tracking-tight' },
    xl: { box: 'h-18 w-20', text: 'text-2xl font-black tracking-tight' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 shrink-0 select-none ${className}`}>
      {/* Hand-Drawn Diamond Earth with Glowing Lightbulb & 4 Expressive Corner Mascots */}
      <div className={`relative flex ${currentSize.box} items-center justify-center shrink-0 transition-transform duration-200 hover:scale-105 active:scale-95`}>
        <svg
          viewBox="0 0 700 620"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full overflow-visible drop-shadow-sm"
        >
          <defs>
            {/* Warm sunny bulb yellow fill */}
            <radialGradient id="bulbFillGrad" cx="48%" cy="46%" r="52%">
              <stop offset="0%" stopColor="#ffdc40" />
              <stop offset="85%" stopColor="#fec92a" />
              <stop offset="100%" stopColor="#f59e0b" />
            </radialGradient>
            {/* Diamond rounded clip path */}
            <clipPath id="diamondClip">
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
            <g clipPath="url(#diamondClip)">
              {/* Sky Blue Ocean background */}
              <rect x="80" y="40" width="540" height="540" fill="#9ecaff" />

              {/* Mint Green Continents with exact organic hand-drawn shapes from the drawing */}
              {/* Top Apex continent patch */}
              <path
                d="M 270 80
                   C 310 140, 360 140, 410 90
                   L 370 40
                   Z"
                fill="#a2e8af"
              />
              <path
                d="M 270 80
                   C 310 140, 360 140, 410 90"
                stroke="#1e293b"
                strokeWidth="7"
                strokeLinecap="round"
                fill="none"
              />

              {/* Left & Bottom-Left Green Continent */}
              <path
                d="M 130 180
                   C 195 210, 215 250, 205 285
                   C 195 325, 205 375, 255 395
                   C 285 405, 280 470, 240 500
                   L 110 490
                   L 80 140
                   Z"
                fill="#a2e8af"
              />
              <path
                d="M 130 180
                   C 195 210, 215 250, 205 285
                   C 195 325, 205 375, 255 395
                   C 285 405, 280 470, 240 500"
                stroke="#1e293b"
                strokeWidth="7.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Right & Bottom-Right Green Continent */}
              <path
                d="M 430 250
                   C 460 270, 520 260, 570 230
                   L 570 470
                   L 370 560
                   C 400 515, 410 450, 390 395
                   C 380 355, 410 310, 465 285
                   Z"
                fill="#a2e8af"
              />
              <path
                d="M 430 250
                   C 460 270, 520 260, 570 230"
                stroke="#1e293b"
                strokeWidth="7.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 370 560
                   C 400 515, 410 450, 390 395
                   C 380 355, 410 310, 465 285"
                stroke="#1e293b"
                strokeWidth="7.5"
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

            {/* EXACT HAND-DRAWN LIGHT RAYS (Matched position, angle, and curvature to drawing) */}
            <g id="bulb-light-rays" stroke="#e69500" strokeWidth="6" strokeLinecap="round">
              {/* Ray 1: Top vertical ray pointing straight up into the diamond point */}
              <path d="M 345 125 L 343 80" />

              {/* Ray 2: Top-right upper ray pointing northeast */}
              <path d="M 388 150 L 406 112" />

              {/* Ray 3: Right diagonal ray pointing toward right edge */}
              <path d="M 425 210 L 452 170" />

              {/* Ray 4: Right horizontal ray pointing eastward */}
              <path d="M 432 268 Q 455 264 478 262" fill="none" />

              {/* Ray 5: Lower-right downward sloping ray */}
              <path d="M 408 340 Q 425 348 444 356" fill="none" />

              {/* Ray 6: Top-left ray pointing northwest */}
              <path d="M 312 148 L 290 120" />

              {/* Ray 7: Left upper diagonal ray */}
              <path d="M 276 195 L 244 180" />

              {/* Ray 8: Left middle horizontal ray */}
              <path d="M 264 262 L 225 262" />

              {/* Ray 9: Left lower diagonal ray pointing southwest */}
              <path d="M 280 328 L 240 338" />
            </g>

            {/* HAND-DRAWN LIGHT BULB IN CENTER */}
            <g id="lightbulb" transform="translate(345, 280)">
              {/* Bulb Base (grey screw thread socket) */}
              <g id="bulb-base">
                {/* Main grey socket base rectangle with rounded bottom */}
                <path
                  d="M -32 50 L 32 50 L 32 120 C 32 130 18 135 0 135 C -18 135 -32 130 -32 120 Z"
                  fill="#c5cbd6"
                  stroke="#1e293b"
                  strokeWidth="5"
                  strokeLinejoin="round"
                />
                {/* Horizontal screw thread lines */}
                <line x1="-30" y1="66" x2="30" y2="66" stroke="#718096" strokeWidth="4.5" strokeLinecap="round" />
                <line x1="-30" y1="82" x2="30" y2="82" stroke="#718096" strokeWidth="4.5" strokeLinecap="round" />
                <line x1="-30" y1="98" x2="30" y2="98" stroke="#718096" strokeWidth="4.5" strokeLinecap="round" />
                <line x1="-28" y1="114" x2="28" y2="114" stroke="#718096" strokeWidth="4.5" strokeLinecap="round" />
                {/* Hand-drawn white chalk highlight at bottom contact */}
                <path
                  d="M -22 128 Q 0 136 22 128"
                  stroke="#ffffff"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>

              {/* Bulb Globe (Big warm yellow circular bulb) */}
              <ellipse
                cx="0"
                cy="-26"
                rx="75"
                ry="78"
                fill="url(#bulbFillGrad)"
                stroke="#e69500"
                strokeWidth="5.5"
              />
              {/* Hand-drawn sketchy outer ring contour */}
              <ellipse
                cx="-1"
                cy="-25"
                rx="74"
                ry="77"
                fill="none"
                stroke="#d97706"
                strokeWidth="3"
                opacity="0.8"
              />
            </g>
          </g>

          {/* 2. TOP-LEFT FACE (YELLOW - Curious / Surprised) */}
          <g transform="translate(150, 122)">
            {/* Round yellow head */}
            <circle cx="0" cy="0" r="58" fill="#ffea78" stroke="#1e293b" strokeWidth="7" />
            {/* Top-left hair squiggle */}
            <path d="M -32 -46 Q -12 -58 10 -46" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" fill="none" />
            {/* Two bright cyan dot eyes */}
            <circle cx="-24" cy="-14" r="5.5" fill="#0ea5e9" />
            <circle cx="24" cy="-14" r="5.5" fill="#0ea5e9" />
            {/* Surprised oval open mouth with light grey/beige interior */}
            <ellipse cx="2" cy="18" rx="20" ry="14" fill="#ebe4dc" stroke="#1e293b" strokeWidth="6" />
          </g>

          {/* 3. TOP-RIGHT FACE (CORAL/PINK - Joyful / Open wedge smile) */}
          <g transform="translate(545, 128)">
            {/* Round coral/pink head */}
            <circle cx="0" cy="0" r="60" fill="#ffadad" stroke="#1e293b" strokeWidth="7" />
            {/* Top hair squiggle */}
            <path d="M -24 -50 Q 6 -60 32 -48" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" fill="none" />
            {/* Eyebrows: flat horizontal left, arched right */}
            <path d="M -32 -26 L -16 -26" stroke="#1e293b" strokeWidth="6.5" strokeLinecap="round" />
            <path d="M 12 -30 Q 24 -38 40 -30" stroke="#1e293b" strokeWidth="6.5" strokeLinecap="round" fill="none" />
            {/* Two dark dot eyes */}
            <circle cx="-22" cy="-10" r="5.5" fill="#1e293b" />
            <circle cx="26" cy="-10" r="5.5" fill="#1e293b" />
            {/* Open triangular smile with white inside */}
            <path
              d="M -20 12 L 24 12 L 2 44 Z"
              fill="#ffffff"
              stroke="#1e293b"
              strokeWidth="6"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>

          {/* 4. BOTTOM-LEFT FACE (PEACH - Squinting / Curly dimple smile) */}
          <g transform="translate(142, 495)">
            {/* Round peach/warm apricot head */}
            <circle cx="0" cy="0" r="60" fill="#ffcb95" stroke="#1e293b" strokeWidth="7" />
            {/* Top hair squiggle */}
            <path d="M -26 -48 Q 0 -58 24 -48" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" fill="none" />
            {/* Closed squinting curved eyes */}
            <path d="M -32 -14 Q -20 -20 -10 -14" stroke="#1e293b" strokeWidth="6.5" strokeLinecap="round" fill="none" />
            <path d="M 10 -14 Q 20 -20 32 -14" stroke="#1e293b" strokeWidth="6.5" strokeLinecap="round" fill="none" />
            {/* Left cheek curly dimple */}
            <path
              d="M -38 8 C -34 2, -28 4, -26 12 C -24 18, -28 22, -34 20"
              stroke="#1e293b"
              strokeWidth="6.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Horizontal smile line */}
            <path
              d="M -26 14 Q 0 24 26 14"
              stroke="#1e293b"
              strokeWidth="6.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Right cheek curly dimple */}
            <path
              d="M 38 8 C 34 2, 28 4, 26 12 C 24 18, 28 22, 34 20"
              stroke="#1e293b"
              strokeWidth="6.5"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* 5. BOTTOM-RIGHT FACE (WARM GREY / BEIGE - Friendly smile & green eye) */}
          <g transform="translate(548, 502)">
            {/* Round warm grey / beige head */}
            <circle cx="0" cy="0" r="60" fill="#ede0d7" stroke="#1e293b" strokeWidth="7" />
            {/* Top hair squiggle */}
            <path d="M -28 -48 Q 4 -60 26 -46" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" fill="none" />
            {/* Left eye: Green dot! Right eye: Black dot */}
            <circle cx="-28" cy="-14" r="6" fill="#22c55e" />
            <circle cx="22" cy="-14" r="5.5" fill="#1e293b" />
            {/* Soft curved gentle smile */}
            <path
              d="M -20 16 Q 0 36 22 16"
              stroke="#1e293b"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
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
