import React, { useState } from 'react';
import { Play, Volume2, VolumeX, Maximize2 } from 'lucide-react';

export function isVideoUrl(url?: string | null): boolean {
  if (!url) return false;
  const clean = url.trim().toLowerCase();
  if (
    clean.startsWith('data:video/') ||
    clean.startsWith('blob:') ||
    clean.endsWith('.mp4') ||
    clean.endsWith('.webm') ||
    clean.endsWith('.mov') ||
    clean.endsWith('.m4v') ||
    clean.endsWith('.ogg') ||
    clean.includes('video/mp4') ||
    clean.includes('video/webm')
  ) {
    return true;
  }
  return false;
}

interface MediaDisplayProps {
  url?: string | null;
  alt?: string;
  className?: string;
  autoPlay?: boolean;
  autoPlayPreview?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  showBadge?: boolean;
  objectFit?: 'cover' | 'contain';
}

export const MediaDisplay: React.FC<MediaDisplayProps> = ({
  url,
  alt = 'Media preview',
  className = '',
  autoPlay = false,
  autoPlayPreview = false,
  loop = true,
  muted = true,
  controls = false,
  showBadge = false,
  objectFit = 'cover',
}) => {
  const shouldAutoPlay = autoPlay || autoPlayPreview;
  const [isPlaying, setIsPlaying] = useState(shouldAutoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const isVideo = isVideoUrl(url);

  if (!url) return null;

  if (isVideo) {
    return (
      <div className={`relative w-full h-full group/video overflow-hidden ${className}`}>
        <video
          src={url}
          className={`w-full h-full ${objectFit === 'cover' ? 'object-cover' : 'object-contain'}`}
          autoPlay={shouldAutoPlay}
          loop={loop}
          muted={isMuted}
          playsInline
          controls={controls}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        {showBadge && (
          <span className="absolute top-2.5 right-2.5 z-10 inline-flex items-center gap-1 rounded-full bg-slate-950/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-mono font-bold text-sky-300 border border-sky-400/30 shadow-xs pointer-events-none">
            <Play className="h-2.5 w-2.5 fill-sky-300" />
            <span>VIDEO</span>
          </span>
        )}

        {/* Quick hover controls when controls={false} */}
        {!controls && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-0 group-hover/video:opacity-100 transition-opacity z-10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted(!isMuted);
              }}
              className="rounded-full bg-slate-900/80 backdrop-blur-md p-1.5 text-white hover:bg-slate-950 transition-colors shadow-xs cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      referrerPolicy="no-referrer"
      className={`${className} ${objectFit === 'cover' ? 'object-cover' : 'object-contain'}`}
    />
  );
};
