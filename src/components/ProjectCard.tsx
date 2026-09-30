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

interface ProjectCardProps {
  project: Project;
  onOpenProject: (project: Project) => void;
  onShareProject: (project: Project) => void;
  onToggleLike: (projectId: string) => void;
  isLiked: boolean;
  onOpenAuthorProfile?: (author: User) => void;
  onSelectTag?: (tag: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
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

    const rotX = -((y - centerY) / centerY) * 6; // Max 6 deg
    const rotY = ((x - centerX) / centerX) * 6;

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
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
        scale: isHovered ? 1.015 : 1,
      }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      onClick={() => onOpenProject(project)}
      className="group relative cursor-pointer rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 shadow-lg backdrop-blur-md transition-shadow hover:border-slate-700 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between"
    >
      {/* Subtle glass glow border effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 via-transparent to-emerald-500/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {/* Cover Media */}
        <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800">
          {project.mediaUrls[0] ? (
            <img
              src={project.mediaUrls[0]}
              alt={project.title}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 p-4 text-center">
              <Sparkles className="h-6 w-6 text-indigo-400 mb-1.5 opacity-80" />
              <span className="text-xs font-semibold text-indigo-200">
                {project.qualities?.[0] || 'Verified Proof-of-Work'}
              </span>
              <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                {project.tags[0] || '#makers'}
              </span>
            </div>
          )}

          {/* Actual Qualities Overlay Tag on Image (Top-Left) */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-950/85 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/40 shadow-sm">
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              <span>{project.qualities?.[0] || 'Working Prototype'}</span>
            </span>
          </div>

          {/* Quick share action */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onShareProject(project);
            }}
            className="absolute top-2.5 right-2.5 rounded-lg bg-slate-950/70 p-1.5 text-slate-300 backdrop-blur-md transition-colors hover:bg-slate-900 hover:text-white"
            title="Generate Shareable Proof Card"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        {/* YouTube / Instagram Style Custom Hashtags */}
        <div className="mb-2 flex flex-wrap items-center gap-1.5 text-xs font-mono text-slate-400">
          {project.tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectTag) onSelectTag(tag);
              }}
              className="text-indigo-400/90 font-medium hover:text-indigo-300 hover:underline transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Project Title */}
        <h3 className="text-lg font-semibold text-white tracking-tight group-hover:text-indigo-300 transition-colors line-clamp-1">
          {project.title}
        </h3>

        {/* Tagline */}
        <p className="mt-2 text-sm text-slate-300 line-clamp-2 leading-relaxed">
          {project.tagline}
        </p>

        {/* Actual Qualities Chips That Interest Users */}
        {project.qualities && project.qualities.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {project.qualities.slice(0, 3).map((quality, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-md bg-slate-950/80 px-2 py-0.5 text-[10px] font-mono text-indigo-300 border border-slate-800"
              >
                <span className="h-1 w-1 rounded-full bg-indigo-400" />
                <span>{quality}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Metrics & Author */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-800/80 pt-3.5">
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
            className="h-6 w-6 rounded-full object-cover ring-1 ring-slate-700 group-hover/author:ring-indigo-400"
          />
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-xs font-medium text-slate-300 group-hover/author:text-white truncate max-w-[120px]">
              @{project.author.handle}
            </span>
            <VerifiedBadge
              size="xs"
              reputationScore={project.author.reputationScore}
            />
            {project.author.reputationScore >= 150 ? (
              <span title="Top Reviewer Badge Earned" className="text-amber-400 flex items-center">
                <Star className="h-3 w-3 fill-amber-400/40" />
              </span>
            ) : project.author.reputationScore >= 100 ? (
              <span title="Pro Builder Badge Earned" className="text-amber-400 flex items-center">
                <Trophy className="h-3 w-3" />
              </span>
            ) : null}
          </div>
        </button>

        {/* Metrics Engine: Views & Like Micro-animation */}
        <div className="flex items-center gap-3">
          {/* Views count */}
          <div className="flex items-center gap-1 text-xs text-slate-400 font-mono tabular-nums">
            <Eye className="h-3.5 w-3.5 text-slate-500" />
            <span>{project.viewsCount.toLocaleString()}</span>
          </div>

          {/* Like Button with Framer Motion spring 1.4x scale and particle explosion */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              onClick={handleLikeClick}
              className={`relative flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-mono tabular-nums transition-colors ${
                isLiked
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-slate-700/50'
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
