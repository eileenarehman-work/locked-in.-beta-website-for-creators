import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { X, Copy, Check, Share2, ShieldCheck, Download, Sparkles, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface ShareProofCardProps {
  project: Project;
  onClose: () => void;
}

export const ShareProofCard: React.FC<ShareProofCardProps> = ({ project, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [cardTheme, setCardTheme] = useState<'slate' | 'cyber' | 'emerald'>('slate');

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
    slate: 'bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 border-slate-700/80',
    cyber: 'bg-gradient-to-br from-indigo-950 via-slate-950 to-purple-950 border-indigo-700/80',
    emerald: 'bg-gradient-to-br from-slate-950 via-emerald-950/40 to-slate-950 border-emerald-700/80',
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md cursor-pointer animate-in fade-in duration-150"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-6 cursor-default relative"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Shareable Proof-of-Work Card</h3>
          </div>
          <button
            onClick={onClose}
            title="Close (Esc)"
            aria-label="Close (Esc)"
            className="flex items-center gap-1 rounded-xl border border-slate-700/80 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition-all shadow-sm"
          >
            <X className="h-4 w-4" />
            <span className="text-[10px] font-mono text-slate-400">Esc</span>
          </button>
        </div>

        {/* Theme Picker */}
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Card Colorway:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCardTheme('slate')}
              className={`px-2.5 py-1 rounded-md border ${
                cardTheme === 'slate'
                  ? 'border-indigo-500 bg-indigo-500/20 text-white'
                  : 'border-slate-800 text-slate-400'
              }`}
            >
              Slate Indigo
            </button>
            <button
              onClick={() => setCardTheme('cyber')}
              className={`px-2.5 py-1 rounded-md border ${
                cardTheme === 'cyber'
                  ? 'border-purple-500 bg-purple-500/20 text-white'
                  : 'border-slate-800 text-slate-400'
              }`}
            >
              Deep Cyber
            </button>
            <button
              onClick={() => setCardTheme('emerald')}
              className={`px-2.5 py-1 rounded-md border ${
                cardTheme === 'emerald'
                  ? 'border-emerald-500 bg-emerald-500/20 text-white'
                  : 'border-slate-800 text-slate-400'
              }`}
            >
              Emerald Grid
            </button>
          </div>
        </div>

        {/* Dynamic OG Social Card Canvas Preview */}
        <div
          className={`relative aspect-[1200/630] w-full overflow-hidden rounded-xl border p-6 flex flex-col justify-between shadow-2xl ${themeStyles[cardTheme]}`}
        >
          {/* Card Top Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-emerald-400 flex items-center justify-center font-bold text-white text-[11px] shadow-sm">
                li.
              </div>
              <span className="text-sm font-extrabold tracking-tight text-white">locked in.</span>
              <span className="text-slate-500 text-xs">·</span>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                100% Human Peer-Reviewed
              </span>
            </div>

            <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1 font-semibold">
              <Sparkles className="h-2.5 w-2.5 text-amber-300" />
              <span>{project.qualities?.[0] || 'Verified Proof-of-Work'}</span>
            </span>
          </div>

          {/* Card Main Title & Info */}
          <div className="my-auto space-y-2">
            <div className="flex flex-wrap gap-2 text-xs font-mono text-indigo-300">
              {project.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug line-clamp-2">
              {project.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 line-clamp-2">
              {project.tagline}
            </p>

            {/* Actual Qualities of Interest */}
            {project.qualities && project.qualities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.qualities.slice(0, 3).map((q, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-mono text-emerald-200 border border-white/15"
                  >
                    ✓ {q}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Card Footer Author & Metrics */}
          <div className="flex items-center justify-between border-t border-white/10 pt-3">
            <div className="flex items-center gap-2.5">
              <img
                src={project.author.avatarUrl}
                alt={project.author.displayName}
                referrerPolicy="no-referrer"
                className="h-8 w-8 rounded-full object-cover ring-1 ring-emerald-400"
              />
              <div>
                <span className="text-xs font-semibold text-white block">
                  {project.author.displayName}
                </span>
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <span>@{project.author.handle}</span>
                  <span>·</span>
                  <Star className="h-2.5 w-2.5 text-amber-400 fill-amber-400/40" />
                  <span>{project.author.reputationScore} Points</span>
                </span>
              </div>
            </div>

            <div className="text-right text-[11px] font-mono text-slate-400">
              <span>locked in. // {project.slug}</span>
            </div>
          </div>
        </div>

        {/* Copy Link & Action Row */}
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs font-mono text-slate-300">
            <span className="truncate">{shareUrl}</span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
