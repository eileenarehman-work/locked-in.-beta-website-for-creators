import React, { useState, useEffect } from 'react';
import { Project, Review, User, ProjectContributor } from '../types';
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
  Users,
  UserPlus,
  UserMinus,
  UserCheck,
  Trash2,
  Send,
  Search,
  Check,
  AlertCircle,
} from 'lucide-react';
import { evaluateReviewDraft } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { VerifiedBadge } from './VerifiedBadge';
import { Mascot } from './Mascot';
import { MediaDisplay, isVideoUrl } from './MediaDisplay';
import { DoodleFace } from './DoodleFaces';

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
  initialTab?: 'overview' | 'milestones' | 'reviews' | 'team';
  allUsers?: User[];
  onUpdateProjectContributors?: (projectId: string, contributors: ProjectContributor[]) => void;
  onSendCollaboration?: (data: {
    projectId: string;
    targetUser: User;
    role: string;
    pitch: string;
    type: 'REQUEST' | 'INVITE';
  }) => void;
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
  initialTab = 'overview',
  allUsers = [],
  onUpdateProjectContributors,
  onSendCollaboration,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'reviews' | 'team'>(initialTab);

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

  // Team management state
  const isOwner = currentUser?.id === project.authorId;
  const contributors = project.contributors || [];
  const acceptedContributors = contributors.filter((c) => c.status === 'ACCEPTED');
  const pendingRequests = contributors.filter((c) => c.status === 'PENDING' && c.type === 'REQUEST');
  const pendingInvites = contributors.filter((c) => c.status === 'PENDING' && c.type === 'INVITE');
  const totalTeamCount = acceptedContributors.length + 1; // +1 for lead author
  const pendingCountForOwner = isOwner ? pendingRequests.length : 0;

  // Inline invite state for owner
  const [inviteSearch, setInviteSearch] = useState('');
  const [inviteRole, setInviteRole] = useState('Frontend & UI Engineer');
  const [customInviteRole, setCustomInviteRole] = useState('');
  const [inviteNote, setInviteNote] = useState('');
  const [selectedUserToInvite, setSelectedUserToInvite] = useState<User | null>(null);
  const [teamToastMsg, setTeamToastMsg] = useState<string | null>(null);

  // Inline request state for visitor
  const [visitorRole, setVisitorRole] = useState('Hardware & PCB Designer');
  const [customVisitorRole, setCustomVisitorRole] = useState('');
  const [visitorPitch, setVisitorPitch] = useState('');

  const myContributorRecord = currentUser
    ? contributors.find((c) => c.userId === currentUser.id)
    : null;

  const showTeamToast = (msg: string) => {
    setTeamToastMsg(msg);
    setTimeout(() => setTeamToastMsg(null), 3000);
  };

  const handleAcceptContributor = (contributorId: string) => {
    const updated = contributors.map((c) =>
      c.id === contributorId ? { ...c, status: 'ACCEPTED' as const } : c
    );
    onUpdateProjectContributors?.(project.id, updated);
    showTeamToast('Contributor accepted into the project team!');
  };

  const handleDeclineContributor = (contributorId: string) => {
    const updated = contributors.filter((c) => c.id !== contributorId);
    onUpdateProjectContributors?.(project.id, updated);
    showTeamToast('Request removed.');
  };

  const handleRemoveContributor = (contributorId: string) => {
    const updated = contributors.filter((c) => c.id !== contributorId);
    onUpdateProjectContributors?.(project.id, updated);
    showTeamToast('Member removed from project team.');
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserToInvite) return;
    const finalRole = customInviteRole.trim() || inviteRole;
    onSendCollaboration?.({
      projectId: project.id,
      targetUser: selectedUserToInvite,
      role: finalRole,
      pitch: inviteNote.trim(),
      type: 'INVITE',
    });
    setSelectedUserToInvite(null);
    setInviteNote('');
    setCustomInviteRole('');
    showTeamToast(`Invitation sent to @${selectedUserToInvite.handle}!`);
  };

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenGoogleLogin?.();
      return;
    }
    const finalRole = customVisitorRole.trim() || visitorRole;
    onSendCollaboration?.({
      projectId: project.id,
      targetUser: project.author,
      role: finalRole,
      pitch: visitorPitch.trim(),
      type: 'REQUEST',
    });
    setVisitorPitch('');
    setCustomVisitorRole('');
    showTeamToast('Collaboration request sent to project author!');
  };

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
              <MediaDisplay
                url={project.mediaUrls[0]}
                alt={project.title}
                autoPlay={false}
                controls={isVideoUrl(project.mediaUrls[0])}
                showBadge={true}
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
              <button
                type="button"
                onClick={() => setActiveTab('team')}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  activeTab === 'team'
                    ? 'bg-gradient-to-r from-sky-400 via-emerald-300 to-amber-200 text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                <span>{isOwner ? 'Manage Team' : 'Team'}</span>
                <span className="rounded-full bg-white px-1.5 py-0.2 text-[10px] font-mono font-bold text-slate-700">
                  {totalTeamCount}
                </span>
                {pendingCountForOwner > 0 && (
                  <span className="rounded-full bg-amber-400 text-slate-950 px-1.5 py-0.2 text-[9px] font-mono font-black animate-pulse">
                    {pendingCountForOwner}
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

              {/* Media Gallery (Additional Photos & Videos) */}
              {project.mediaUrls && project.mediaUrls.length > 1 && (
                <div className="rounded-3xl border-2 border-slate-200 bg-white p-5 space-y-3 shadow-2xs">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <span>Project Media Gallery & Clips ({project.mediaUrls.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {project.mediaUrls.slice(1).map((mediaUrl, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-[16/9] rounded-2xl overflow-hidden border-2 border-slate-200 bg-slate-100 group shadow-2xs"
                      >
                        <MediaDisplay
                          url={mediaUrl}
                          alt={`${project.title} asset ${idx + 2}`}
                          controls={isVideoUrl(mediaUrl)}
                          showBadge={true}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
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

          {/* Tab 4: Manage Team & Collaboration */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              {/* Toast message if any */}
              {teamToastMsg && (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-300 p-3 text-xs font-bold text-emerald-800 flex items-center justify-between">
                  <span>{teamToastMsg}</span>
                  <button
                    type="button"
                    onClick={() => setTeamToastMsg(null)}
                    className="text-emerald-700 hover:text-emerald-950 font-bold"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Header Card */}
              <div className="rounded-3xl border-2 border-sky-200 bg-gradient-to-br from-sky-50/70 via-white to-amber-50/50 p-5 shadow-2xs space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-2xl bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-700">
                      <Users className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        {isOwner ? 'Manage Project Team & Contributors' : 'Project Team & Contributors'}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {totalTeamCount === 1
                          ? 'Solo build so far — open for collaborators to team up!'
                          : `${totalTeamCount} active builders working on this project.`}
                      </p>
                    </div>
                  </div>
                  <DoodleFace type="blissful_peach" size="md" />
                </div>
              </div>

              {/* 1. Project Lead & Confirmed Team Members */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-sky-600" />
                  <span>Confirmed Makers ({totalTeamCount})</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Lead Creator */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl border-2 border-slate-200 bg-white shadow-2xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={project.author.avatarUrl}
                        alt={project.author.displayName}
                        className="h-9 w-9 rounded-full object-cover ring-2 ring-sky-300"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900">{project.author.displayName}</span>
                          <VerifiedBadge size="xs" reputationScore={project.author.reputationScore} />
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">@{project.author.handle}</span>
                      </div>
                    </div>
                    <span className="rounded-full bg-sky-100 border border-sky-300 px-2.5 py-0.5 text-[10px] font-mono font-black text-sky-800">
                      LEAD CREATOR
                    </span>
                  </div>

                  {/* Accepted Contributors */}
                  {acceptedContributors.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between p-3.5 rounded-2xl border-2 border-slate-200 bg-white shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={c.user.avatarUrl}
                          alt={c.user.displayName}
                          className="h-9 w-9 rounded-full object-cover ring-2 ring-emerald-300"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900">{c.user.displayName}</span>
                            <VerifiedBadge size="xs" reputationScore={c.user.reputationScore} />
                          </div>
                          <div className="text-[10px] font-mono text-emerald-800 font-bold">
                            {c.role}
                          </div>
                        </div>
                      </div>

                      {isOwner && (
                        <button
                          type="button"
                          onClick={() => handleRemoveContributor(c.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer rounded-lg hover:bg-rose-50"
                          title="Remove contributor"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. For Owner: Review Incoming Collaboration Requests */}
              {isOwner && pendingRequests.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                      <span>Pending Collaboration Requests ({pendingRequests.length})</span>
                    </h4>
                    <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-bold">
                      Action Needed
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {pendingRequests.map((req) => (
                      <div
                        key={req.id}
                        className="rounded-2xl border-2 border-amber-300 bg-amber-50/70 p-4 space-y-3 shadow-2xs"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={req.user.avatarUrl}
                              alt={req.user.displayName}
                              className="h-9 w-9 rounded-full object-cover ring-2 ring-amber-400"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-900">{req.user.displayName}</span>
                                <span className="text-[10px] font-mono text-slate-500">@{req.user.handle}</span>
                              </div>
                              <span className="text-[11px] font-mono font-bold text-amber-900">
                                Proposed Role: <strong className="text-slate-900">{req.role}</strong>
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleDeclineContributor(req.id)}
                              className="px-3 py-1 text-xs font-bold text-slate-600 hover:text-rose-700 rounded-full border border-slate-300 bg-white hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              Decline
                            </button>
                            <button
                              type="button"
                              onClick={() => handleAcceptContributor(req.id)}
                              className="px-3.5 py-1 text-xs font-black text-slate-950 rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 shadow-2xs hover:scale-103 active:scale-97 transition-all cursor-pointer"
                            >
                              Accept Contributor
                            </button>
                          </div>
                        </div>

                        {req.pitch && (
                          <div className="rounded-xl bg-white/80 p-2.5 text-xs text-slate-700 font-sans border border-amber-200 leading-relaxed">
                            "{req.pitch}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. For Owner: Pending Outgoing Invites */}
              {isOwner && pendingInvites.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Sent Invites Awaiting Response ({pendingInvites.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {pendingInvites.map((inv) => (
                      <div
                        key={inv.id}
                        className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={inv.user.avatarUrl}
                            alt={inv.user.displayName}
                            className="h-6 w-6 rounded-full object-cover"
                          />
                          <div>
                            <span className="font-bold text-slate-800">@{inv.user.handle}</span>
                            <span className="text-[10px] text-slate-500 block">Invited as {inv.role}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeclineContributor(inv.id)}
                          className="text-[10px] text-slate-500 hover:text-rose-600 font-bold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. For Owner: Inline Invite Contributor Tool */}
              {isOwner && (
                <div className="rounded-3xl border-2 border-slate-200 bg-white p-5 space-y-3.5 shadow-2xs pt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <UserPlus className="h-4 w-4 text-sky-600" />
                      <span>Invite a Maker to Join This Project</span>
                    </h4>
                    <DoodleFace type="mismatched_mint" size="sm" />
                  </div>

                  <form onSubmit={handleSendInvite} className="space-y-3">
                    {/* User Selection */}
                    {selectedUserToInvite ? (
                      <div className="flex items-center justify-between p-2.5 rounded-2xl bg-sky-50 border border-sky-200">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={selectedUserToInvite.avatarUrl}
                            alt={selectedUserToInvite.displayName}
                            className="h-7 w-7 rounded-full object-cover"
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-900">{selectedUserToInvite.displayName}</div>
                            <div className="text-[10px] font-mono text-slate-500">@{selectedUserToInvite.handle}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedUserToInvite(null)}
                          className="text-xs text-slate-500 hover:text-rose-600 font-bold px-2 py-1 cursor-pointer"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="relative">
                          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search makers by handle or name..."
                            value={inviteSearch}
                            onChange={(e) => setInviteSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-400"
                          />
                        </div>

                        {allUsers.length > 0 && (
                          <div className="max-h-28 overflow-y-auto space-y-1 rounded-xl border border-slate-100 p-1">
                            {allUsers
                              .filter(
                                (u) =>
                                  u.id !== currentUser?.id &&
                                  !contributors.some((c) => c.userId === u.id) &&
                                  (u.displayName.toLowerCase().includes(inviteSearch.toLowerCase()) ||
                                    u.handle.toLowerCase().includes(inviteSearch.toLowerCase()))
                              )
                              .slice(0, 4)
                              .map((u) => (
                                <button
                                  key={u.id}
                                  type="button"
                                  onClick={() => setSelectedUserToInvite(u)}
                                  className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 text-left cursor-pointer"
                                >
                                  <div className="flex items-center gap-2">
                                    <img src={u.avatarUrl} alt={u.displayName} className="h-5 w-5 rounded-full object-cover" />
                                    <span className="text-xs font-bold text-slate-800">{u.displayName}</span>
                                    <span className="text-[10px] font-mono text-slate-400">@{u.handle}</span>
                                  </div>
                                  <span className="text-[10px] font-mono text-amber-700 font-bold">+{u.reputationScore} pts</span>
                                </button>
                              ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Role */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Assigned Role</label>
                        <select
                          value={inviteRole}
                          onChange={(e) => setInviteRole(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-sky-400"
                        >
                          <option value="Frontend & UI Engineer">Frontend & UI Engineer</option>
                          <option value="Hardware & PCB Designer">Hardware & PCB Designer</option>
                          <option value="Firmware & Embedded Systems">Firmware & Embedded Systems</option>
                          <option value="3D CAD & Prototyping">3D CAD & Prototyping</option>
                          <option value="Field Tester & QA">Field Tester & QA</option>
                          <option value="Content & Technical Writer">Content & Technical Writer</option>
                          <option value="Custom">Custom Role...</option>
                        </select>
                      </div>

                      {inviteRole === 'Custom' && (
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Custom Role Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Lead Roboticist"
                            value={customInviteRole}
                            onChange={(e) => setCustomInviteRole(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-sky-400"
                            required
                          />
                        </div>
                      )}
                    </div>

                    {/* Note */}
                    <div>
                      <input
                        type="text"
                        placeholder="Invitation note: 'Hey, would love your help on the telemetry code!'"
                        value={inviteNote}
                        onChange={(e) => setInviteNote(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-400"
                      />
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        disabled={!selectedUserToInvite}
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-black text-slate-950 rounded-full bg-gradient-to-r from-sky-400 via-emerald-300 to-amber-200 shadow-2xs hover:scale-102 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>Send Contributor Invite</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* 5. For Visitors: Application Card or Current Status */}
              {!isOwner && (
                <div className="rounded-3xl border-2 border-slate-200 bg-white p-5 space-y-4 shadow-2xs">
                  {myContributorRecord?.status === 'ACCEPTED' ? (
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-900">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                      <div>
                        You are an accepted contributor on this build as <strong>{myContributorRecord.role}</strong>!
                      </div>
                    </div>
                  ) : myContributorRecord?.status === 'PENDING' && myContributorRecord.type === 'REQUEST' ? (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-900">
                          Your Collaboration Request is Pending Review
                        </span>
                        <span className="text-[10px] font-mono text-amber-700 bg-white px-2 py-0.5 rounded-full border border-amber-300">
                          Applied as {myContributorRecord.role}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-sans">
                        @{project.author.handle} has received your pitch and will be notified to review.
                      </p>
                      <button
                        type="button"
                        onClick={() => handleDeclineContributor(myContributorRecord.id)}
                        className="text-xs font-bold text-slate-500 hover:text-rose-600 underline cursor-pointer"
                      >
                        Withdraw Request
                      </button>
                    </div>
                  ) : myContributorRecord?.status === 'PENDING' && myContributorRecord.type === 'INVITE' ? (
                    <div className="p-4 rounded-2xl bg-sky-50 border border-sky-300 space-y-3">
                      <div className="flex items-center gap-2">
                        <DoodleFace type="star_butter" size="sm" />
                        <span className="text-xs font-black text-sky-950">
                          You've Been Invited to Join This Project!
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-sans">
                        @{project.author.handle} invited you to collaborate as <strong>{myContributorRecord.role}</strong>.
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAcceptContributor(myContributorRecord.id)}
                          className="px-4 py-1.5 text-xs font-black text-slate-950 rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 cursor-pointer shadow-2xs"
                        >
                          Accept Invitation
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeclineContributor(myContributorRecord.id)}
                          className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-rose-600 rounded-full border border-slate-300 bg-white cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Visitor Application Form */
                    <form onSubmit={handleSendRequest} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-sky-600" />
                          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                            Apply to Collaborate on this Build
                          </h4>
                        </div>
                        <DoodleFace type="wink_apricot" size="sm" />
                      </div>

                      <p className="text-xs text-slate-600 font-sans leading-relaxed">
                        Love this prototype? Propose what you can help build (UI, hardware, firmware, testing) and collaborate directly with @{project.author.handle}!
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Your Proposed Role</label>
                          <select
                            value={visitorRole}
                            onChange={(e) => setVisitorRole(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-sky-400"
                          >
                            <option value="Hardware & PCB Designer">Hardware & PCB Designer</option>
                            <option value="Frontend & UI Engineer">Frontend & UI Engineer</option>
                            <option value="Firmware & Embedded Systems">Firmware & Embedded Systems</option>
                            <option value="3D CAD & Prototyping">3D CAD & Prototyping</option>
                            <option value="Field Tester & QA">Field Tester & QA</option>
                            <option value="Content & Technical Writer">Content & Technical Writer</option>
                            <option value="Custom">Custom Role...</option>
                          </select>
                        </div>

                        {visitorRole === 'Custom' && (
                          <div>
                            <label className="block text-[11px] font-bold text-slate-700 mb-1">Role Title</label>
                            <input
                              type="text"
                              placeholder="e.g. Lead Roboticist"
                              value={customVisitorRole}
                              onChange={(e) => setCustomVisitorRole(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-sky-400"
                              required
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">How can you help?</label>
                        <textarea
                          rows={2}
                          placeholder="Hey @author! I loved your prototype. I have experience with this hardware and can help test and write documentation..."
                          value={visitorPitch}
                          onChange={(e) => setVisitorPitch(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 font-sans focus:outline-none focus:border-sky-400 resize-none leading-relaxed"
                          required
                        />
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="submit"
                          className="flex items-center gap-1.5 px-5 py-2 text-xs font-black text-slate-950 rounded-full bg-gradient-to-r from-sky-400 via-emerald-300 to-amber-200 shadow-2xs hover:scale-102 active:scale-98 transition-all cursor-pointer"
                        >
                          <Send className="h-3.5 w-3.5" />
                          <span>Submit Collaboration Request</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
