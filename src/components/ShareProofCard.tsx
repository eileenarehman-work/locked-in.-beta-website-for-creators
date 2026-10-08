import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { X, Copy, Check, Share2, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface ShareProofCardProps {
  project: Project;
  onClose: () => void;
}

export const ShareProofCard: React.FC<ShareProofCardProps> = ({ project, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [cardTheme, setCardTheme] = useState<'sky' | 'mint' | 'peach'>('sky');

  // Easy exit on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const shareUrl = `https://wedidthis.dev/p/${project.slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const themeStyles = {
    sky: 'bg-gradient-to-br from-sky-100 via-sky-50 to-emerald-50 border-sky-200 text-slate-800',
    mint: 'bg-gradient-to-br from-emerald-100 via-teal-50 to-sky-50 border-emerald-200 text-slate-800',
    peach: 'bg-gradient-to-br from-amber-100 via-rose-50 to-orange-50 border-amber-200 text-slate-800',
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm cursor-pointer animate-in fade-in duration-150"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 8 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-3xl border-2 border-sky-200 bg-white p-6 shadow-2xl space-y-6 cursor-default relative text-slate-800"
      >
        <div className="flex items-center justify-between border-b border-sky-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-700">
              <Share2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">Proof-of-Innovation Card</h3>
              <p className="text-[11px] text-slate-500 font-medium">Share your creation with peer-review proof!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            title="Close (Esc)"
            aria-label="Close (Esc)"
            className="flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs text-slate-600 hover:bg-sky-100 hover:text-slate-900 transition-all shadow-2xs cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            <span className="text-[10px] font-mono text-slate-500">Esc</span>
          </button>
        </div>

        {/* Theme Picker */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500 font-bold">Pastel Style:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCardTheme('sky')}
              className={`px-3 py-1 rounded-full border-2 text-xs font-bold transition-all cursor-pointer ${
                cardTheme === 'sky'
                  ? 'border-sky-400 bg-sky-100 text-sky-900 shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Pastel Sky
            </button>
            <button
              onClick={() => setCardTheme('mint')}
              className={`px-3 py-1 rounded-full border-2 text-xs font-bold transition-all cursor-pointer ${
                cardTheme === 'mint'
                  ? 'border-emerald-400 bg-emerald-100 text-emerald-900 shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Pastel Mint
            </button>
            <button
              onClick={() => setCardTheme('peach')}
              className={`px-3 py-1 rounded-full border-2 text-xs font-bold transition-all cursor-pointer ${
                cardTheme === 'peach'
                  ? 'border-amber-400 bg-amber-100 text-amber-900 shadow-2xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Sunny Peach
            </button>
          </div>
        </div>

        {/* Dynamic OG Social Card Canvas Preview */}
        <div
          className={`relative aspect-[1200/630] w-full overflow-hidden rounded-2xl border-2 p-6 flex flex-col justify-between shadow-lg ${themeStyles[cardTheme]}`}
        >
          {/* Card Top Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-sky-400 to-emerald-400 flex items-center justify-center font-black text-slate-950 text-xs shadow-2xs">
                w.
              </div>
              <span className="text-sm font-black tracking-tight text-slate-900">wedidthis</span>
              <span className="text-slate-400 text-xs">·</span>
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                Human Peer-Reviewed
              </span>
            </div>

            <span className="text-[11px] font-bold text-sky-800 bg-white/80 border border-sky-200 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
              <Sparkles className="h-3 w-3 text-amber-500" />
              <span>{project.qualities?.[0] || 'Working Prototype'}</span>
            </span>
          </div>

          {/* Card Main Title & Info */}
          <div className="my-auto space-y-2">
            <div className="flex flex-wrap gap-1.5 text-xs font-bold text-sky-700">
              {project.tags.map((t) => (
                <span key={t} className="rounded-full bg-white/70 px-2 py-0.5 border border-sky-100">
                  {t}
                </span>
              ))}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug line-clamp-2">
              {project.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 font-medium">
              {project.tagline}
            </p>

            {/* Actual Qualities of Interest */}
            {project.qualities && project.qualities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.qualities.slice(0, 3).map((q, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200 shadow-2xs"
                  >
                    ✓ {q}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Card Footer Author & Metrics */}
          <div className="flex items-center justify-between border-t border-slate-200/60 pt-3">
            <div className="flex items-center gap-2.5">
              <img
                src={project.author.avatarUrl}
                alt={project.author.displayName}
                referrerPolicy="no-referrer"
                className="h-8 w-8 rounded-full object-cover ring-2 ring-emerald-300"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  {project.author.displayName}
                </span>
                <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                  <span>@{project.author.handle}</span>
                  <span>·</span>
                  <Star className="h-2.5 w-2.5 text-amber-500 fill-amber-400" />
                  <span className="font-bold text-amber-700">{project.author.reputationScore} Points</span>
                </span>
              </div>
            </div>

            <div className="text-right text-[11px] font-bold text-slate-500">
              <span>JOIN THE FIGHT FOR INNOVATION</span>
            </div>
          </div>
        </div>

        {/* Copy Link & Action Row */}
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 rounded-2xl border-2 border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-700">
            <span className="truncate">{shareUrl}</span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-sky-400 via-emerald-300 to-amber-200 px-5 py-2.5 text-xs font-black text-slate-950 shadow-md shadow-sky-300/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-800" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
