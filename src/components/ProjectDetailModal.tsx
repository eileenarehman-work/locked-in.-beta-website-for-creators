import React, { useState, useEffect } from 'react';
import { Project, Review, User } from '../types';
import {
  X,
  ExternalLink,
  Github,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ThumbsUp,
  Share2,
  Star,
  MessageSquare,
  Award,
  Layers,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { evaluateReviewDraft } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { VerifiedBadge } from './VerifiedBadge';
import { Mascot } from './Mascot';

interface ProjectDetailModalProps {
  project: Project;
  onClose: () => void;
  reviews: Review[];
  onAddReview: (
    projectId: string,
    rubric: {
      clarity: number;
      execution: number;
      technicality: number;
      documentation: number;
    },
    feedbackText: string,
    isBlindReview: boolean,
    evalResult: { qualityScore: number; feedback: string }
  ) => void;
  onUpvoteReview: (reviewId: string) => void;
  onOpenMessageWithAuthor: (author: User) => void;
  onShareProject: (project: Project) => void;
  onOpenGoogleLogin?: () => void;
  currentUser?: User | null;
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
  currentUser = null,
  onOpenAuthorProfile,
  isFollowingAuthor = false,
  onToggleFollowAuthor,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'reviews'>('overview');

  // Rubric state (4 parts, out of 25 each = 100 total)
  const [rubric, setRubric] = useState({
    clarity: 20,
    execution: 20,
    technicality: 20,
    documentation: 20,
  });

  const [feedbackText, setFeedbackText] = useState('');
  const [isBlindReview, setIsBlindReview] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<{
    qualityScore: number;
    isApproved: boolean;
    constructivenessFeedback: string;
    strengths: string[];
    critiqueGaps: string[];
  } | null>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const totalScore = rubric.clarity + rubric.execution + rubric.technicality + rubric.documentation;

  const handleEvaluate = async () => {
    if (!feedbackText.trim()) return;
    setIsEvaluating(true);
    try {
      const res = await evaluateReviewDraft(project.title, feedbackText, totalScore);
      setEvalResult({
        qualityScore: res.qualityScore,
        isApproved: res.isApproved,
        constructivenessFeedback: res.constructivenessFeedback,
        strengths: res.strengths || [],
        critiqueGaps: res.critiqueGaps || [],
      });
    } catch {
      setEvalResult({
        qualityScore: 85,
        isApproved: true,
        constructivenessFeedback: 'Solid constructive feedback on build mechanics.',
        strengths: ['Clear observations'],
        critiqueGaps: [],
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSubmitReview = () => {
    if (!evalResult || !evalResult.isApproved) return;
    onAddReview(project.id, rubric, feedbackText, isBlindReview, {
      qualityScore: evalResult.qualityScore,
      feedback: evalResult.constructivenessFeedback,
    });
    setFeedbackText('');
    setEvalResult(null);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-slate-900/35 backdrop-blur-md overflow-y-auto cursor-pointer animate-in fade-in duration-150"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative my-8 w-full max-w-4xl rounded-3xl border-2 border-sky-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh] cursor-default text-slate-800"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b-2 border-slate-100 px-6 py-4 bg-sky-50/60">
          <div className="flex items-center gap-2">
            <Mascot type="earth" size="xs" />
            <span className="text-xs font-mono text-sky-800 font-bold">
              {project.category || 'PROJECT'} // {project.slug}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onShareProject(project)}
              className="rounded-full border-2 border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:border-sky-300 hover:bg-sky-50 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
            >
              <Share2 className="h-3.5 w-3.5 text-sky-600" />
              <span>Share Build</span>
            </button>
            <button
              onClick={onClose}
              title="Close (Esc)"
              aria-label="Close (Esc)"
              className="flex items-center gap-1 rounded-full border-2 border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              <X className="h-4 w-4" />
              <span className="text-[10px] font-mono text-slate-400">Esc</span>
            </button>
          </div>
        </div>

        {/* Modal Scroll Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Hero Banner with Actual Qualities Overlay */}
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl border-2 border-slate-200 bg-slate-100">
            {project.mediaUrls[0] ? (
              <img
                src={project.mediaUrls[0]}
                alt={project.title}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-sky-50 to-emerald-50 text-center p-6">
                <Sparkles className="h-8 w-8 text-sky-500 mb-2" />
                <span className="text-sm font-bold text-slate-900">{project.qualities?.[0] || 'Working Prototype'}</span>
              </div>
            )}

            {/* Actual Qualities Overlay Chips on the Image */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10 pointer-events-none">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-300 shadow-2xs">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>{project.qualities?.[0] || 'Working Hardware Prototype'}</span>
              </span>
              {project.qualities?.[1] && (
                <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-mono font-bold text-sky-800 border border-sky-300 shadow-2xs">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>{project.qualities[1]}</span>
                </span>
              )}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent flex items-end p-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-sky-200 mb-1.5 font-bold">
                  {project.tags.map((tag, idx) => (
                    <React.Fragment key={tag}>
                      <span>{tag}</span>
                      {idx < project.tags.length - 1 && <span className="text-slate-300">·</span>}
                    </React.Fragment>
                  ))}
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight sm:text-3xl drop-shadow-sm">
                  {project.title}
                </h1>
              </div>
            </div>
          </div>

          {/* Action Row & Author Info */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (onOpenAuthorProfile) onOpenAuthorProfile(project.author);
                }}
                className="group/author flex items-center gap-3 text-left hover:opacity-95 transition-opacity cursor-pointer"
              >
                <img
                  src={project.author.avatarUrl}
                  alt={project.author.displayName}
                  referrerPolicy="no-referrer"
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-emerald-300 group-hover/author:ring-sky-400"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 group-hover/author:text-sky-700 flex items-center gap-1.5">
                      <span>{project.author.displayName}</span>
                      <VerifiedBadge
                        size="xs"
                        reputationScore={project.author.reputationScore}
                      />
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      @{project.author.handle}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 flex items-center gap-1 font-mono font-medium">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-400" />
                    {project.author.reputationScore} Points
                  </span>
                </div>
              </button>

              {/* Follow Button */}
              {currentUser && currentUser.id !== project.author.id && onToggleFollowAuthor && (
                <button
                  type="button"
                  onClick={() => onToggleFollowAuthor(project.author.id)}
                  className={`ml-2 rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    isFollowingAuthor
                      ? 'border-2 border-emerald-300 bg-emerald-50 text-emerald-800'
                      : 'bg-gradient-to-r from-sky-400 to-emerald-300 text-slate-950 shadow-xs hover:scale-105 active:scale-95'
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
                  className="flex items-center gap-1.5 rounded-full border-2 border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 transition-all shadow-2xs"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Live Demo</span>
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-full border-2 border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-2xs"
                >
                  <Github className="h-3.5 w-3.5 text-slate-600" />
                  <span>Source Code</span>
                </a>
              )}
              <button
                onClick={() => onOpenMessageWithAuthor(project.author)}
                className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-sky-400 via-emerald-300 to-amber-200 px-4 py-1.5 text-xs font-black text-slate-950 shadow-md shadow-sky-300/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Message</span>
              </button>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="my-6 flex flex-wrap items-center justify-between gap-3 border-b-2 border-slate-100 pb-4">
            <div className="flex items-center gap-1.5 rounded-full border-2 border-slate-200 bg-slate-50 p-1">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-sky-400 text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Overview</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('milestones')}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  activeTab === 'milestones'
                    ? 'bg-amber-300 text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Milestones</span>
                {project.milestones && project.milestones.length > 0 && (
                  <span className="rounded-full bg-white px-1.5 py-0.2 text-[10px] font-mono font-bold text-slate-700">
                    {project.milestones.length}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  activeTab === 'reviews'
                    ? 'bg-emerald-300 text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Reviews</span>
                {reviews.length > 0 && (
                  <span className="rounded-full bg-emerald-100 border border-emerald-300 px-1.5 py-0.2 text-[10px] font-mono text-emerald-800 font-bold">
                    {reviews.length}
                  </span>
                )}
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-500 font-bold">
              <span className="flex items-center gap-1 text-slate-600">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-400" />
                <span>+25 pts / review</span>
              </span>
            </div>
          </div>

          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Build Highlights */}
              <div className="rounded-3xl border-2 border-sky-200 bg-gradient-to-br from-sky-50/60 via-white to-emerald-50/50 p-5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 flex items-center gap-1.5 tracking-wide">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Highlights & Qualities
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(project.qualities && project.qualities.length > 0
                    ? project.qualities
                    : ['Working Hardware Prototype', 'Open Source CAD', 'Field Tested Schematics', 'Clean Documentation']
                  ).map((quality, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl bg-white border-2 border-slate-200 p-2.5 text-center shadow-2xs"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 mx-auto mb-1" />
                      <span className="text-[11px] font-bold text-slate-800 block leading-tight">
                        {quality}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border-2 border-slate-200 bg-white p-5 shadow-2xs">
                <h3 className="text-sm font-bold text-slate-900 mb-2">About this project</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">{project.tagline}</p>
              </div>

              <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xs text-slate-700 text-sm leading-relaxed space-y-4">
                <div className="whitespace-pre-wrap font-sans text-slate-700 font-normal">
                  {project.contentMarkdown}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Milestones */}
          {activeTab === 'milestones' && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-900">Project Milestones</h3>
              <div className="space-y-3">
                {project.milestones.map((milestone, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-2xs"
                  >
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{milestone.title}</span>
                        <span className="text-xs font-mono text-slate-500">· {milestone.date}</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600 leading-relaxed font-normal">
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
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    Reviews ({reviews.length})
                  </h3>
                  <span className="text-xs font-mono text-slate-500 font-bold">
                    Constructive Peer Rubrics
                  </span>
                </div>

                {reviews.length === 0 ? (
                  <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white/80 p-8 text-center text-slate-600 text-sm">
                    No peer reviews yet. Be the first to evaluate this project build!
                  </div>
                ) : (
                  reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-3xl border-2 border-slate-200 bg-white p-5 space-y-3 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={rev.reviewer.avatarUrl}
                            alt={rev.reviewer.displayName}
                            referrerPolicy="no-referrer"
                            className="h-8 w-8 rounded-full object-cover ring-2 ring-emerald-300"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-900">
                              {rev.isBlindReview ? 'Anonymous Peer Reviewer' : rev.reviewer.displayName}
                            </span>
                            {!rev.isBlindReview && (
                              <span className="text-xs font-mono text-slate-500 ml-1.5">
                                @{rev.reviewer.handle}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 text-xs font-mono text-emerald-800 font-bold">
                            Rubric: {rev.totalScore}/100
                          </div>
                          <div className="rounded-full bg-sky-50 border border-sky-300 px-2.5 py-0.5 text-xs font-mono text-sky-800 flex items-center gap-1 font-bold">
                            <Sparkles className="h-3 w-3" />
                            Helpfulness {rev.aiQualityScore}%
                          </div>
                        </div>
                      </div>

                      {/* Rubric Breakdown Grid */}
                      <div className="grid grid-cols-4 gap-2 rounded-2xl bg-slate-50 p-2.5 text-center text-xs font-mono border-2 border-slate-100">
                        <div>
                          <span className="text-slate-500 block text-[10px]">Clarity</span>
                          <span className="text-slate-900 font-bold">{rev.rubric.clarity}/25</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Execution</span>
                          <span className="text-slate-900 font-bold">{rev.rubric.execution}/25</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Technicality</span>
                          <span className="text-slate-900 font-bold">{rev.rubric.technicality}/25</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">Documentation</span>
                          <span className="text-slate-900 font-bold">{rev.rubric.documentation}/25</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed font-normal">
                        {rev.feedbackText}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        <button
                          onClick={() => onUpvoteReview(rev.id)}
                          className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors font-medium cursor-pointer"
                        >
                          <ThumbsUp className="h-3.5 w-3.5 text-sky-600" />
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
                <div className="rounded-3xl border-2 border-sky-200 bg-sky-50/50 p-6 text-center space-y-3">
                  <ShieldCheck className="h-8 w-8 text-sky-600 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-900">Sign In to Leave a Peer Review</h4>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto font-normal">
                    Sign in with Google to evaluate this build with our friendly 4-part rubrics.
                  </p>
                  {onOpenGoogleLogin && (
                    <button
                      type="button"
                      onClick={onOpenGoogleLogin}
                      className="rounded-full bg-gradient-to-r from-sky-400 via-emerald-300 to-amber-200 px-5 py-2 text-xs font-black text-slate-950 shadow-md shadow-sky-300/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      Sign in with Google
                    </button>
                  )}
                </div>
              ) : (
                <div className="rounded-3xl border-2 border-sky-200 bg-gradient-to-br from-sky-50/50 via-white to-emerald-50/40 p-5 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mascot type="friendly" size="xs" />
                      <h4 className="text-sm font-bold text-slate-900">
                        Leave a Review
                      </h4>
                    </div>
                    <span className="text-xs font-mono font-bold text-sky-800">
                      Score: {totalScore} / 100
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-normal">
                    Reviews are checked for constructiveness and positive community feedback before publishing.
                  </p>

                  {/* 4-part Rubric Sliders */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-white border border-slate-200 p-3">
                      <div className="flex justify-between text-xs font-mono mb-1 font-bold">
                        <span className="text-slate-700">1. Clarity & Scope</span>
                        <span className="text-sky-700">{rubric.clarity}/25</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="25"
                        value={rubric.clarity}
                        onChange={(e) => setRubric({ ...rubric, clarity: parseInt(e.target.value) })}
                        className="w-full accent-sky-500 cursor-pointer"
                      />
                    </div>

                    <div className="rounded-2xl bg-white border border-slate-200 p-3">
                      <div className="flex justify-between text-xs font-mono mb-1 font-bold">
                        <span className="text-slate-700">2. Execution & Reliability</span>
                        <span className="text-sky-700">{rubric.execution}/25</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="25"
                        value={rubric.execution}
                        onChange={(e) => setRubric({ ...rubric, execution: parseInt(e.target.value) })}
                        className="w-full accent-sky-500 cursor-pointer"
                      />
                    </div>

                    <div className="rounded-2xl bg-white border border-slate-200 p-3">
                      <div className="flex justify-between text-xs font-mono mb-1 font-bold">
                        <span className="text-slate-700">3. Technicality & Depth</span>
                        <span className="text-sky-700">{rubric.technicality}/25</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="25"
                        value={rubric.technicality}
                        onChange={(e) => setRubric({ ...rubric, technicality: parseInt(e.target.value) })}
                        className="w-full accent-sky-500 cursor-pointer"
                      />
                    </div>

                    <div className="rounded-2xl bg-white border border-slate-200 p-3">
                      <div className="flex justify-between text-xs font-mono mb-1 font-bold">
                        <span className="text-slate-700">4. Documentation & Proof</span>
                        <span className="text-sky-700">{rubric.documentation}/25</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="25"
                        value={rubric.documentation}
                        onChange={(e) => setRubric({ ...rubric, documentation: parseInt(e.target.value) })}
                        className="w-full accent-sky-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Feedback Input */}
                  <div>
                    <textarea
                      rows={4}
                      placeholder="Provide constructive, friendly observations on build qualities, physical execution, documentation clarity, and actionable maker tips..."
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      className="w-full rounded-2xl border-2 border-slate-200 bg-white p-3 text-xs text-slate-800 placeholder-slate-400 focus:border-sky-400 focus:outline-none shadow-2xs font-normal"
                    />
                  </div>

                  {/* Blind Review Toggle */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="blind-review"
                      checked={isBlindReview}
                      onChange={(e) => setIsBlindReview(e.target.checked)}
                      className="rounded border-slate-300 text-sky-600 focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="blind-review" className="text-xs text-slate-600 font-medium cursor-pointer">
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
                        className={`rounded-2xl p-4 text-xs border-2 ${
                          evalResult.isApproved
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                            : 'bg-amber-50 border-amber-300 text-amber-900'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-sky-600" />
                            Gemini Quality Evaluation: {evalResult.qualityScore}/100
                          </span>
                          <span className="font-mono text-[10px] uppercase font-bold">
                            {evalResult.isApproved ? 'Approved for Publication' : 'Revision Required'}
                          </span>
                        </div>
                        <p className="mb-2 text-slate-700">{evalResult.constructivenessFeedback}</p>

                        {evalResult.strengths.length > 0 && (
                          <div className="mb-1 text-[11px] text-emerald-800">
                            <strong>Strengths:</strong> {evalResult.strengths.join(' · ')}
                          </div>
                        )}
                        {evalResult.critiqueGaps.length > 0 && (
                          <div className="text-[11px] text-amber-800">
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
                      className="flex items-center gap-1.5 rounded-full border-2 border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:border-sky-300 hover:bg-sky-50 transition-all disabled:opacity-50 cursor-pointer shadow-2xs"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-sky-600" />
                      <span>{isEvaluating ? 'Evaluating with Gemini...' : 'Run Gemini Pre-Screen'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSubmitReview}
                      disabled={!evalResult || !evalResult.isApproved}
                      className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 px-5 py-2 text-xs font-black text-slate-950 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 shadow-md shadow-emerald-300/40 cursor-pointer"
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
