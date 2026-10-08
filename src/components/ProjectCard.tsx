import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, User } from '../types';
import {
  Heart,
  Eye,
  ArrowUpRight,
  Share2,
  CheckCircle2,
  Sparkles,
  Trophy,
  Star,
  ShieldCheck,
} from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';
import { Mascot } from './Mascot';

interface ProjectCardProps {
  project: Project;
  index?: number;
  onOpenProject: (project: Project) => void;
  onShareProject: (project: Project) => void;
  onToggleLike: (projectId: string) => void;
  isLiked: boolean;
  onOpenAuthorProfile?: (author: User) => void;
  onSelectTag?: (tag: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index = 0,
  onOpenProject,
  onShareProject,
  onToggleLike,
  isLiked,
  onOpenAuthorProfile,
  onSelectTag,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [burstParticles, setBurstParticles] = useState<number[]>([]);

  // 3D perspective tilt calculations
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 4; // Max 4 deg subtle tilt
    const rotY = ((x - centerX) / centerX) * 4;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleLike(project.id);
    if (!isLiked) {
      setBurstParticles([1, 2, 3, 4, 5, 6]);
      setTimeout(() => setBurstParticles([]), 700);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 22 }}
      animate={{
        opacity: 1,
        y: isHovered ? -5 : 0,
        rotateX,
        rotateY,
        scale: isHovered ? 1.018 : 1,
      }}
      transition={{
        opacity: { duration: 0.45, delay: Math.min(index * 0.06, 0.45), ease: [0.21, 0.45, 0.27, 0.9] },
        y: isHovered ? { duration: 0.2, ease: 'easeOut' } : { duration: 0.45, delay: Math.min(index * 0.06, 0.45), ease: [0.21, 0.45, 0.27, 0.9] },
        rotateX: { type: 'spring', stiffness: 350, damping: 25 },
        rotateY: { type: 'spring', stiffness: 350, damping: 25 },
        scale: { type: 'spring', stiffness: 350, damping: 25 },
      }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpenProject(project)}
      className="group relative cursor-pointer rounded-3xl border-2 border-slate-100 bg-white p-5 shadow-xs transition-all hover:border-sky-300 hover:shadow-xl hover:shadow-sky-100/70 flex flex-col justify-between text-slate-800"
    >
      {/* Subtle glass glow border effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-sky-400/5 via-transparent to-emerald-400/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {/* Cover Media */}
        <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200">
          {project.mediaUrls[0] ? (
            <img
              src={project.mediaUrls[0]}
              alt={project.title}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-sky-50 to-emerald-50 p-4 text-center">
              <Mascot type="earth" size="lg" className="mb-2 transition-transform group-hover:scale-110" />
              <span className="text-xs font-bold text-slate-800">
                {project.title}
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5">
                {project.category || 'Maker Build'}
              </span>
            </div>
          )}

          {/* Actual Qualities Overlay Tag on Image (Top-Left) */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-300 shadow-2xs">
              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
              <span>{project.qualities?.[0] || 'Working Prototype'}</span>
            </span>
          </div>

          {/* Quick share action */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShareProject(project);
            }}
            className="absolute top-2.5 right-2.5 rounded-full bg-white/90 p-1.5 text-slate-600 backdrop-blur-md transition-colors hover:bg-white hover:text-slate-950 border border-slate-200 shadow-2xs"
            title="Generate Shareable Proof Card"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        {/* YouTube / Instagram Style Custom Hashtags */}
        <div className="mb-2.5 flex flex-wrap items-center gap-1.5 text-xs font-mono">
          {project.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectTag) onSelectTag(tag);
              }}
              className="text-sky-800 rounded-full bg-sky-50 border border-sky-200 px-2.5 py-0.5 text-[11px] font-bold hover:border-sky-400 hover:text-sky-950 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Project Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight group-hover:text-sky-700 transition-colors line-clamp-1">
          {project.title}
        </h3>

        {/* Tagline */}
        <p className="mt-1.5 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {project.tagline}
        </p>

        {/* Actual Qualities Chips That Interest Users */}
        {project.qualities && project.qualities.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {project.qualities.slice(0, 3).map((quality, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-0.5 text-[10px] font-bold text-sky-800 border border-sky-100 shadow-2xs"
              >
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{quality}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Metrics & Author */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3.5">
        {/* Author Avatar & Handle - Click to open Creator Profile */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenAuthorProfile) onOpenAuthorProfile(project.author);
          }}
          className="group/author flex items-center gap-2 text-left hover:opacity-95 transition-opacity"
        >
          <img
            src={project.author.avatarUrl}
            alt={project.author.displayName}
            referrerPolicy="no-referrer"
            className="h-6 w-6 rounded-full object-cover ring-2 ring-emerald-300 group-hover/author:ring-sky-400"
          />
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-xs font-bold text-slate-800 group-hover/author:text-sky-700 truncate max-w-[120px]">
              @{project.author.handle}
            </span>
            <VerifiedBadge
              size="xs"
              reputationScore={project.author.reputationScore}
            />
            {project.author.reputationScore >= 150 ? (
              <span title="Helpful Heart Badge Earned" className="text-amber-500 flex items-center">
                <Star className="h-3 w-3 fill-amber-400" />
              </span>
            ) : project.author.reputationScore >= 100 ? (
              <span title="Crafty Bee Badge Earned" className="text-amber-500 flex items-center">
                <Trophy className="h-3 w-3" />
              </span>
            ) : null}
          </div>
        </button>

        {/* Metrics Engine: Views & Like Micro-animation */}
        <div className="flex items-center gap-3">
          {/* Views count */}
          <div className="flex items-center gap-1 text-xs text-slate-500 font-mono tabular-nums font-semibold">
            <Eye className="h-3.5 w-3.5 text-slate-400" />
            <span>{project.viewsCount.toLocaleString()}</span>
          </div>

          {/* Like Button with Framer Motion spring 1.4x scale and particle explosion */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              onClick={handleLikeClick}
              className={`relative flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-mono tabular-nums font-bold transition-colors ${
                isLiked
                  ? 'bg-rose-50 text-rose-600 border border-rose-300'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <motion.div
                animate={isLiked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                <Heart
                  className={`h-3.5 w-3.5 ${
                    isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'
                  }`}
                />
              </motion.div>
              <span>{project.likesCount}</span>
            </motion.button>

            {/* Particle explosion effect */}
            <AnimatePresence>
              {burstParticles.map((id, index) => {
                const angle = (index / burstParticles.length) * 2 * Math.PI;
                const distance = 22;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;

                return (
                  <motion.span
                    key={id}
                    initial={{ opacity: 1, scale: 0.6, x: 0, y: 0 }}
                    animate={{ opacity: 0, scale: 1.2, x, y }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.55, ease: 'easeOut' }}
                    className="pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-400"
                  />
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
