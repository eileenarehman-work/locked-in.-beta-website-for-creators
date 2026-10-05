import React, { useState, useEffect } from 'react';
import { Project, Review, User } from '../types';
import { evaluateReviewQuality, ReviewQualityResult } from '../services/geminiService';
import {
  X,
  ExternalLink,
  Github,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Sparkles,
  Star,
  ThumbsUp,
  AlertCircle,
  Eye,
  Heart,
  Share2,
  UserCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { VerifiedBadge } from './VerifiedBadge';

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
  reviews: Review[];
  onAddReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  onUpvoteReview: (reviewId: string) => void;
  onOpenMessageWithAuthor: (author: User) => void;
  onShareProject: (project: Project) => void;
  onOpenGoogleLogin?: () => void;
  currentUser: User | null;
  onOpenAuthorProfile?: (author: User) => void;
  isFollowingAuthor?: boolean;
  onToggleFollowAuthor?: (authorId: string) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  reviews,
  onAddReview,
  onUpvoteReview,
  onOpenMessageWithAuthor,
  onShareProject,
  onOpenGoogleLogin,
  currentUser,
  onOpenAuthorProfile,
  isFollowingAuthor = false,
  onToggleFollowAuthor,
}) => {
  // Review form state
  const [rubric, setRubric] = useState({
    clarity: 22,
    execution: 22,
    technicality: 24,
    documentation: 20,
  });
  const [feedbackText, setFeedbackText] = useState('');
  const [isBlindReview, setIsBlindReview] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<ReviewQualityResult | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'milestones'>('overview');

  const totalScore = rubric.clarity + rubric.execution + rubric.technicality + rubric.documentation;

  const handleEvaluate = async () => {
    if (!feedbackText.trim()) return;
    setIsEvaluating(true);
    try {
      const res = await evaluateReviewQuality(feedbackText, project.title, rubric);
      setEvalResult(res);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evalResult || !evalResult.isApproved || !currentUser) return;

    onAddReview({
      projectId: project.id,
      reviewerId: currentUser.id,
      reviewer: currentUser,
      rubric,
      totalScore,
      feedbackText,
      aiQualityScore: evalResult.qualityScore,
      isBlindReview,
      upvotesCount: 0,
      status: 'APPROVED',
    });

    // Reset form
    setFeedbackText('');
    setEvalResult(null);
  };

  // Easy exit with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-950/80 backdrop-blur-md overflow-y-auto cursor-pointer animate-in fade-in duration-150"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative my-8 w-full max-w-4xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] cursor-default"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-indigo-400 font-medium">
              BUILD // {project.slug}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onShareProject(project)}
              className="rounded-lg border border-slate-700/60 bg-slate-800/80 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Share2 className="h-3.5 w-3.5 text-indigo-400" />
              <span>Share Build</span>
            </button>
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
        </div>

        {/* Modal Scroll Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Hero Banner with Actual Qualities Overlay */}
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
            {project.mediaUrls[0] ? (
              <img
                src={project.mediaUrls[0]}
                alt={project.title}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-950 text-center p-6">
                <Sparkles className="h-8 w-8 text-indigo-400 mb-2" />
                <span className="text-sm font-bold text-white">{project.qualities?.[0] || 'Working Prototype'}</span>
              </div>
            )}

            {/* Actual Qualities Overlay Chips on the Image */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950/85 backdrop-blur-md px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/50 shadow-lg">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>{project.qualities?.[0] || 'Working Hardware Prototype'}</span>
              </span>
              {project.qualities?.[1] && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-950/85 backdrop-blur-md px-2.5 py-1 text-xs font-mono font-medium text-indigo-200 border border-indigo-500/40 shadow-lg">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>{project.qualities[1]}</span>
                </span>
              )}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent flex items-end p-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-indigo-300 mb-2">
                  {project.tags.map((tag, idx) => (
                    <React.Fragment key={tag}>
                      <span>{tag}</span>
                      {idx < project.tags.length - 1 && <span className="text-slate-500">·</span>}
                    </React.Fragment>
                  ))}
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">
                  {project.title}
                </h1>
              </div>
            </div>
          </div>

          {/* Action Row & Author Info */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (onOpenAuthorProfile) onOpenAuthorProfile(project.author);
                }}
                className="group/author flex items-center gap-3 text-left hover:opacity-95 transition-opacity"
              >
                <img
                  src={project.author.avatarUrl}
                  alt={project.author.displayName}
                  referrerPolicy="no-referrer"
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-indigo-500/50 group-hover/author:ring-indigo-400"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white group-hover/author:text-indigo-300 flex items-center gap-1.5">
                      <span>{project.author.displayName}</span>
                      <VerifiedBadge
                        size="xs"
                        reputationScore={project.author.reputationScore}
                      />
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      @{project.author.handle}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Star className="h-3 w-3 text-amber-400 fill-amber-400/40" />
                    {project.author.reputationScore} Points
                  </span>
                </div>
              </button>

              {/* Follow Button */}
              {currentUser && currentUser.id !== project.author.id && onToggleFollowAuthor && (
                <button
                  type="button"
                  onClick={() => onToggleFollowAuthor(project.author.id)}
                  className={`ml-2 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    isFollowingAuthor
                      ? 'border border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
                      : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500'
                  }`}
                >
                  {isFollowingAuthor ? '✓ Following' : '+ Follow'}
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-700 transition-colors shadow-sm"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Live Demo</span>
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-700 transition-colors shadow-sm"
                >
                  <Github className="h-3.5 w-3.5 text-slate-300" />
                  <span>Source Code</span>
                </a>
              )}
              <button
                onClick={() => onOpenMessageWithAuthor(project.author)}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm shadow-indigo-600/30 cursor-pointer"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Message</span>
              </button>
            </div>
          </div>

          {/* Section Navigation Tabs - Generously spaced segmented bar */}
          <div className="my-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950/80 p-1">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <span>Overview</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('milestones')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'milestones'
                    ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <span>Milestones</span>
                {project.milestones && project.milestones.length > 0 && (
                  <span className="rounded-full bg-slate-700/80 px-1.5 py-0.2 text-[10px] font-mono text-slate-300">
                    {project.milestones.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'reviews'
                    ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <span>Reviews</span>
                {reviews.length > 0 && (
                  <span className="rounded-full bg-indigo-500/20 border border-indigo-500/30 px-1.5 py-0.2 text-[10px] font-mono text-indigo-300">
                    {reviews.length}
                  </span>
                )}
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1 text-slate-400">
                <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                <span>+25 pts / review</span>
              </span>
            </div>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Build Highlights */}
              <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-950 to-slate-900 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5 tracking-wide">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    Highlights & Qualities
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(project.qualities && project.qualities.length > 0
                    ? project.qualities
                    : ['Working Hardware Prototype', 'Open Source CAD', 'Field Tested Schematics', 'Clean Documentation']
                  ).map((quality, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg bg-slate-900/80 border border-slate-800 p-2 text-center"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mx-auto mb-1" />
                      <span className="text-[11px] font-medium text-slate-200 block leading-tight">
                        {quality}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-5">
                <h3 className="text-sm font-semibold text-slate-200 mb-2">About this project</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{project.tagline}</p>
              </div>

              <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
                <div className="whitespace-pre-wrap font-sans text-slate-300">
                  {project.contentMarkdown}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Milestones */}
          {activeTab === 'milestones' && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white">Project Milestones</h3>
              <div className="space-y-3">
                {project.milestones.map((milestone, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4"
                  >
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{milestone.title}</span>
                        <span className="text-xs font-mono text-slate-500">· {milestone.date}</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Existing Reviews List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    Reviews ({reviews.length})
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    Constructive Peer Rubrics
                  </span>
                </div>

                {reviews.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center text-slate-400 text-sm">
                    No peer reviews yet. Be the first to evaluate this project build!
                  </div>
                ) : (
                  reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-xl border border-slate-800 bg-slate-950/60 p-5 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={rev.reviewer.avatarUrl}
                            alt={rev.reviewer.displayName}
                            referrerPolicy="no-referrer"
                            className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-700"
                          />
                          <div>
                            <span className="text-xs font-medium text-white">
                              {rev.isBlindReview ? 'Anonymous Peer Reviewer' : rev.reviewer.displayName}
                            </span>
                            {!rev.isBlindReview && (
                              <span className="text-xs font-mono text-slate-500 ml-1.5">
                                @{rev.reviewer.handle}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-xs font-mono text-emerald-400">
                            Rubric: {rev.totalScore}/100
                          </div>
                          <div className="rounded-md bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 text-xs font-mono text-indigo-300 flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            AI Quality {rev.aiQualityScore}%
                          </div>
                        </div>
                      </div>

                      {/* Rubric Breakdown Grid */}
                      <div className="grid grid-cols-4 gap-2 rounded-lg bg-slate-900/80 p-2.5 text-center text-xs font-mono border border-slate-800/80">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Clarity</span>
                          <span className="text-white font-medium">{rev.rubric.clarity}/25</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Execution</span>
                          <span className="text-white font-medium">{rev.rubric.execution}/25</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Technicality</span>
                          <span className="text-white font-medium">{rev.rubric.technicality}/25</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Documentation</span>
                          <span className="text-white font-medium">{rev.rubric.documentation}/25</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {rev.feedbackText}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                        <button
                          onClick={() => onUpvoteReview(rev.id)}
                          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                          <span>Helpful ({rev.upvotesCount})</span>
                        </button>
                        <span className="text-slate-500 font-mono text-[11px]">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Review Submission Form with Live Gemini Quality Pre-Screen */}
              {!currentUser ? (
                <div className="rounded-xl border border-indigo-900/50 bg-indigo-950/20 p-6 text-center space-y-3">
                  <ShieldCheck className="h-8 w-8 text-indigo-400 mx-auto" />
                  <h4 className="text-sm font-semibold text-white">Sign In to Leave a Peer Review</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Sign in with Google to evaluate this build with our 4-part rubrics.
                  </p>
                  {onOpenGoogleLogin && (
                    <button
                      type="button"
                      onClick={onOpenGoogleLogin}
                      className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
                    >
                      Sign in with Google
                    </button>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-indigo-900/50 bg-indigo-950/20 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-indigo-400" />
                      <h4 className="text-sm font-semibold text-white">
                        Submit Peer Review
                      </h4>
                    </div>
                    <span className="text-xs font-mono text-indigo-300">
                      Rubric Total: {totalScore} / 100
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">
                    Reviews are uncapped, but each submission is pre-screened by Gemini AI for constructiveness and positive feedback before publishing.
                  </p>

                {/* 4-part Rubric Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-300">1. Clarity & Scope</span>
                      <span className="text-indigo-400">{rubric.clarity}/25</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="25"
                      value={rubric.clarity}
                      onChange={(e) => setRubric({ ...rubric, clarity: parseInt(e.target.value) })}
                      className="w-full accent-indigo-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-300">2. Execution & Reliability</span>
                      <span className="text-indigo-400">{rubric.execution}/25</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="25"
                      value={rubric.execution}
                      onChange={(e) => setRubric({ ...rubric, execution: parseInt(e.target.value) })}
                      className="w-full accent-indigo-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-300">3. Technicality & Depth</span>
                      <span className="text-indigo-400">{rubric.technicality}/25</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="25"
                      value={rubric.technicality}
                      onChange={(e) => setRubric({ ...rubric, technicality: parseInt(e.target.value) })}
                      className="w-full accent-indigo-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-300">4. Documentation & Proof</span>
                      <span className="text-indigo-400">{rubric.documentation}/25</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="25"
                      value={rubric.documentation}
                      onChange={(e) => setRubric({ ...rubric, documentation: parseInt(e.target.value) })}
                      className="w-full accent-indigo-500"
                    />
                  </div>
                </div>

                {/* Feedback Input */}
                <div>
                  <textarea
                    rows={4}
                    placeholder="Provide constructive, technical observations on build qualities, physical execution, documentation clarity, and actionable maker tips..."
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Blind Review Toggle */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="blind-review"
                    checked={isBlindReview}
                    onChange={(e) => setIsBlindReview(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-0"
                  />
                  <label htmlFor="blind-review" className="text-xs text-slate-300">
                    Submit as Blind Review (anonymizes your handle to prevent peer bias)
                  </label>
                </div>

                {/* Pre-Screen Evaluation Result */}
                <AnimatePresence>
                  {evalResult && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`rounded-lg p-3 text-xs border ${
                        evalResult.isApproved
                          ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                          : 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                          Gemini Quality Evaluation: {evalResult.qualityScore}/100
                        </span>
                        <span className="font-mono text-[10px] uppercase">
                          {evalResult.isApproved ? 'Approved for Publication' : 'Revision Required'}
                        </span>
                      </div>
                      <p className="mb-2 text-slate-300">{evalResult.constructivenessFeedback}</p>

                      {evalResult.strengths.length > 0 && (
                        <div className="mb-1 text-[11px] text-emerald-300">
                          <strong>Strengths:</strong> {evalResult.strengths.join(' · ')}
                        </div>
                      )}
                      {evalResult.critiqueGaps.length > 0 && (
                        <div className="text-[11px] text-amber-300">
                          <strong>Gaps to address:</strong> {evalResult.critiqueGaps.join(' · ')}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 justify-end">
                  <button
                    type="button"
                    onClick={handleEvaluate}
                    disabled={isEvaluating || !feedbackText.trim()}
                    className="flex items-center gap-1.5 rounded-lg border border-indigo-700 bg-indigo-900/40 px-3.5 py-1.5 text-xs font-semibold text-indigo-200 hover:bg-indigo-900/70 transition-colors disabled:opacity-50"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{isEvaluating ? 'Evaluating with Gemini...' : 'Run Gemini Pre-Screen'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmitReview}
                    disabled={!evalResult || !evalResult.isApproved}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors disabled:opacity-40 shadow-sm shadow-emerald-600/30"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Publish Review</span>
                  </button>
                </div>
              </div>
            )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
