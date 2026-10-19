import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, User } from '../types';
import {
  Heart,
  Eye,
  ArrowUpRight,
  Share2,
  Sparkles,
  Trophy,
  Star,
  ShieldCheck,
  Users,
  ChevronLeft,
  ChevronRight,
  Trash2,
  EyeOff,
  Lock,
  Unlock,
} from 'lucide-react';
import { VerifiedBadge } from './VerifiedBadge';
import { Mascot } from './Mascot';
import { MediaDisplay, isVideoUrl } from './MediaDisplay';
import { DoodleFace } from './DoodleFaces';

interface ProjectCardProps {
  project: Project;
  index?: number;
  currentUser?: User | null;
  onOpenProject: (project: Project) => void;
  onShareProject: (project: Project) => void;
  onToggleLike: (projectId: string) => void;
  isLiked: boolean;
  onOpenAuthorProfile?: (author: User) => void;
  onSelectTag?: (tag: string) => void;
  onOpenCollaboration?: (project: Project, mode: 'request' | 'invite') => void;
  onDeleteProject?: (projectId: string) => void;
  onToggleHideProject?: (projectId: string) => void;
  onToggleCollabOpen?: (projectId: string, isOpen: boolean) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index = 0,
  currentUser = null,
  onOpenProject,
  onShareProject,
  onToggleLike,
  isLiked,
  onOpenAuthorProfile,
  onSelectTag,
  onOpenCollaboration,
  onDeleteProject,
  onToggleHideProject,
  onToggleCollabOpen,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [burstParticles, setBurstParticles] = useState<number[]>([]);
  const [mediaIdx, setMediaIdx] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

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
      id="project-card"
      initial={{ opacity: 0, y: 22 }}
      animate={{
        opacity: 1,
        y: 0,
        rotateX,
        rotateY,
      }}
      whileHover={{
        y: -7,
        scale: 1.022,
        transition: { type: 'spring', stiffness: 350, damping: 22 },
      }}
      whileTap={{
        scale: 0.985,
        transition: { duration: 0.1 },
      }}
      transition={{
        opacity: { duration: 0.45, delay: Math.min(index * 0.06, 0.45), ease: [0.21, 0.45, 0.27, 0.9] },
        rotateX: { type: 'spring', stiffness: 350, damping: 25 },
        rotateY: { type: 'spring', stiffness: 350, damping: 25 },
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
        {/* Hidden Post Status Notice */}
        {project.hidden && (
          <div className="mb-3 flex items-center justify-between rounded-2xl bg-slate-100 border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <EyeOff className="h-3.5 w-3.5 text-slate-500" />
              <span>Hidden Post (Only visible to you)</span>
            </span>
            {onToggleHideProject && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleHideProject(project.id);
                }}
                className="text-sky-600 hover:text-sky-800 hover:underline cursor-pointer font-bold text-[11px]"
              >
                Unhide
              </button>
            )}
          </div>
        )}

        {/* Cover Media / Multi-image Carousel */}
        <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200">
          {project.mediaUrls && project.mediaUrls.length > 0 ? (
            <MediaDisplay
              url={project.mediaUrls[mediaIdx] || project.mediaUrls[0]}
              alt={`${project.title} asset ${mediaIdx + 1}`}
              showBadge={true}
              autoPlay={false}
              controls={isVideoUrl(project.mediaUrls[mediaIdx] || project.mediaUrls[0])}
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

          {/* Multi-Image/Video Carousel Arrow Controls */}
          {project.mediaUrls && project.mediaUrls.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMediaIdx((prev) => (prev > 0 ? prev - 1 : project.mediaUrls.length - 1));
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/70 text-white backdrop-blur-md hover:bg-slate-900 active:scale-95 transition-all shadow-md cursor-pointer"
                title="Previous photo/video"
                aria-label="Previous photo/video"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMediaIdx((prev) => (prev < project.mediaUrls.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/70 text-white backdrop-blur-md hover:bg-slate-900 active:scale-95 transition-all shadow-md cursor-pointer"
                title="Next photo/video"
                aria-label="Next photo/video"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              {/* Indicator Pill */}
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 rounded-full bg-slate-950/70 px-2 py-0.5 text-[10px] font-mono font-bold text-white backdrop-blur-md shadow-xs pointer-events-none">
                <span>{mediaIdx + 1}/{project.mediaUrls.length}</span>
              </div>
            </>
          )}

          {/* Action buttons: Hide, Delete, Share */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-20">
            {currentUser?.id === project.authorId && (
              <>
                {onToggleHideProject && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleHideProject(project.id);
                    }}
                    className={`rounded-full p-1.5 backdrop-blur-md transition-colors border shadow-2xs cursor-pointer active:scale-95 ${
                      project.hidden
                        ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                        : 'bg-white/90 text-slate-600 hover:bg-white hover:text-slate-950 border-slate-200'
                    }`}
                    title={project.hidden ? 'Unhide post (make public)' : 'Hide post from feed'}
                  >
                    <EyeOff className="h-4 w-4" />
                  </button>
                )}

                {onDeleteProject && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Permanently delete "${project.title}"?`)) {
                        onDeleteProject(project.id);
                      }
                    }}
                    className="rounded-full bg-white/90 p-1.5 text-rose-600 backdrop-blur-md transition-colors hover:bg-rose-50 hover:text-rose-700 border border-rose-200 shadow-2xs cursor-pointer active:scale-95"
                    title="Delete post"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onShareProject(project);
              }}
              className="rounded-full bg-white/90 p-1.5 text-slate-600 backdrop-blur-md transition-colors hover:bg-white hover:text-slate-950 border border-slate-200 shadow-2xs cursor-pointer active:scale-95"
              title="Generate Shareable Proof Card"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
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

        {/* Project Description Write-up with Read More Truncation */}
        {(() => {
          const desc = project.tagline || '';
          const isLong = desc.length > 95;
          return (
            <div className="mt-1.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p className={isExpanded ? '' : 'line-clamp-2'}>
                {desc}
              </p>
              {isLong && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded((prev) => !prev);
                  }}
                  className="mt-0.5 inline-flex items-center text-[11px] font-bold text-sky-700 hover:text-sky-900 hover:underline cursor-pointer"
                >
                  {isExpanded ? 'Show less' : 'Read more'}
                </button>
              )}
            </div>
          );
        })()}


        {/* Collaboration Team & Request Button */}
        {(() => {
          const isOwner = currentUser?.id === project.authorId;
          const contributors = project.contributors || [];
          const acceptedContributors = contributors.filter((c) => c.status === 'ACCEPTED');
          const hasPendingRequest = Boolean(
            currentUser &&
              contributors.some(
                (c) => c.userId === currentUser.id && c.status === 'PENDING'
              )
          );
          const isAcceptedContributor = Boolean(
            currentUser &&
              contributors.some(
                (c) => c.userId === currentUser.id && c.status === 'ACCEPTED'
              )
          );

          return (
            <div className="mt-3.5 flex items-center justify-between gap-2 pt-2.5 border-t border-slate-100">
              <div className="flex items-center gap-1.5 min-w-0">
                <Users className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                {acceptedContributors.length > 0 ? (
                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-600">
                    <span className="font-bold text-slate-800">{acceptedContributors.length + 1}</span>
                    <span>team</span>
                    <div className="flex -space-x-1.5 ml-1">
                      {acceptedContributors.slice(0, 3).map((c) => (
                        <img
                          key={c.id}
                          src={c.user.avatarUrl}
                          alt={c.user.displayName}
                          title={`${c.user.displayName} (${c.role})`}
                          className="h-4 w-4 rounded-full ring-1 ring-white object-cover"
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <span className="text-[11px] font-sans text-slate-400 font-medium truncate">
                    {isOwner ? 'Add team members' : 'Seeking collaborators'}
                  </span>
                )}
              </div>

              {/* The Collaboration Action Button */}
              {isOwner ? (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleCollabOpen?.(project.id, project.openForCollab === false);
                    }}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold border transition-all cursor-pointer ${
                      project.openForCollab !== false
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200'
                    }`}
                    title="Click to toggle collaborator applications"
                  >
                    {project.openForCollab !== false ? (
                      <>
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span>Apps Open</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-3 w-3 text-slate-500" />
                        <span>Apps Closed</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenCollaboration) {
                        onOpenCollaboration(project, 'invite');
                      } else {
                        onOpenProject(project);
                      }
                    }}
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-300 transition-all cursor-pointer"
                  >
                    <Users className="h-3 w-3 text-sky-700" />
                    <span>Invite</span>
                  </button>
                </div>
              ) : project.openForCollab === false && !isAcceptedContributor && !hasPendingRequest ? (
                <div
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200 select-none"
                  title="The creator is not accepting collaborator applications right now"
                >
                  <Lock className="h-3 w-3 text-slate-400" />
                  <span>Apps Closed</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenCollaboration) {
                      onOpenCollaboration(project, 'request');
                    } else {
                      onOpenProject(project);
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    hasPendingRequest
                      ? 'bg-amber-50 text-amber-800 border border-amber-300'
                      : isAcceptedContributor
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : 'bg-gradient-to-r from-sky-400 via-emerald-300 to-amber-200 text-slate-950 shadow-2xs hover:scale-103 active:scale-97'
                  }`}
                >
                  {hasPendingRequest ? (
                    <>
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                      <span>Request Pending</span>
                    </>
                  ) : isAcceptedContributor ? (
                    <>
                      <Users className="h-3 w-3 text-emerald-600" />
                      <span>On Team</span>
                    </>
                  ) : (
                    <>
                      <Users className="h-3 w-3 text-slate-900" />
                      <span>Team Up</span>
                    </>
                  )}
                </button>
              )}
            </div>
          );
        })()}
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
