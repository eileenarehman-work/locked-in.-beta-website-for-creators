import React, { useEffect, useState } from 'react';
import {
  Star,
  Flame,
  CheckCircle2,
  Trophy,
  ShieldCheck,
  Plus,
  ThumbsUp,
  X,
  Sparkles,
  Zap,
  HelpCircle,
  TrendingUp,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PointsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRep?: number;
  currentStreak?: number;
}

export const PointsGuideModal: React.FC<PointsGuideModalProps> = ({
  isOpen,
  onClose,
  currentUserRep = 0,
  currentStreak = 0,
}) => {
  const [activeTab, setActiveTab] = useState<'earn' | 'tiers' | 'streak'>('earn');

  // Easy exit with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Calculate next badge progress
  const nextTarget =
    currentUserRep < 50
      ? { title: 'Friendly Star', goal: 50, icon: ShieldCheck, color: 'text-emerald-400' }
      : currentUserRep < 100
      ? { title: 'Crafty Bee', goal: 100, icon: Trophy, color: 'text-sky-400' }
      : currentUserRep < 250
      ? { title: 'Wonder Maker', goal: 250, icon: Sparkles, color: 'text-indigo-400' }
      : { title: 'Superstar', goal: 500, icon: Star, color: 'text-amber-400' };

  const repRemaining = Math.max(0, nextTarget.goal - currentUserRep);
  const progressPercent = Math.min(100, Math.round((currentUserRep / nextTarget.goal) * 100));

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto cursor-pointer animate-in fade-in duration-150"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          onClick={(e) => e.stopPropagation()}
          className="my-6 w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-5 sm:p-7 shadow-2xl relative overflow-hidden cursor-default space-y-5"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-inner">
                <Star className="h-6 w-6 fill-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  <span>How Points & Streaks Work</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  100% human proof-of-work. Points cannot be bought or faked — only authentic daily creation counts.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              title="Close (Esc)"
              className="rounded-full p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Current User Quick Stat Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Star className="h-4 w-4 fill-amber-400" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Your Points</span>
                <span className="text-base font-bold text-white font-mono">{currentUserRep} Points</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Flame className="h-4 w-4 fill-amber-500 text-amber-500 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Daily Streak</span>
                <span className="text-base font-bold text-white font-mono">
                  {currentStreak} Day{currentStreak === 1 ? '' : 's'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 border-t sm:border-t-0 sm:border-l border-slate-800/80 pt-2 sm:pt-0 sm:pl-3">
              <div className="flex-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span>Goal: {nextTarget.title}</span>
                  <span className="text-indigo-400 font-bold">{progressPercent}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-amber-400 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-[9px] text-slate-500 block mt-1 font-mono">
                  {repRemaining > 0 ? `${repRemaining} points to unlock` : 'Milestone achieved!'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          {/* Short, Clean Navigation Tabs */}
          <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('earn')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'earn'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Earn</span>
            </button>

            <button
              onClick={() => setActiveTab('tiers')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'tiers'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Trophy className="h-3.5 w-3.5" />
              <span>Badges</span>
            </button>

            <button
              onClick={() => setActiveTab('streak')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'streak'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Flame className="h-3.5 w-3.5 text-amber-400" />
              <span>Streak</span>
            </button>
          </div>

          {/* Tab 1: Ways to Earn Points */}
          {activeTab === 'earn' && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Daily Login */}
                <div className="rounded-2xl border border-amber-500/30 bg-amber-950/10 p-4 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                        <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
                      </span>
                      <div>
                        <span className="text-xs font-bold text-white block">1. Daily Login</span>
                        <span className="text-[10px] text-amber-400 font-mono">Starts streak</span>
                      </div>
                    </div>
                    <span className="rounded-lg bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-xs font-mono font-bold text-amber-300">
                      +10 PTS / DAY
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Simply log in to your account each day. Your streak starts on Day 1 and increases by +1 every day you show up, earning +10 points daily!
                  </p>
                </div>

                {/* 2. Daily Community Review Bonus */}
                <div className="rounded-2xl border border-rose-500/30 bg-rose-950/10 p-4 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                        <Star className="h-4 w-4 fill-rose-400" />
                      </span>
                      <div>
                        <span className="text-xs font-bold text-white block">2. Daily Review Bonus</span>
                        <span className="text-[10px] text-rose-400 font-mono">1st review of the day</span>
                      </div>
                    </div>
                    <span className="rounded-lg bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 text-xs font-mono font-bold text-rose-300">
                      +15 BONUS PTS
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Earn an extra +15 daily bonus points on top of your normal +20 review points (+35 points total!) for completing your first community review each day.
                  </p>
                </div>

                {/* 3. Publish a Project */}
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-4 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        <Plus className="h-4 w-4" />
                      </span>
                      <div>
                        <span className="text-xs font-bold text-white block">3. Drop a Build</span>
                        <span className="text-[10px] text-emerald-400 font-mono">Any project category</span>
                      </div>
                    </div>
                    <span className="rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-xs font-mono font-bold text-emerald-300">
                      +25 PTS
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Publish what you made! Whether it’s code, a 3D print, robotics build, game demo, or art, each published build awards +25 points.
                  </p>
                </div>

                {/* 4. Peer Review */}
                <div className="rounded-2xl border border-sky-500/30 bg-sky-950/10 p-4 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                      <div>
                        <span className="text-xs font-bold text-white block">4. Peer Rubric Review</span>
                        <span className="text-[10px] text-sky-400 font-mono">Every review</span>
                      </div>
                    </div>
                    <span className="rounded-lg bg-sky-500/20 border border-sky-500/40 px-2 py-0.5 text-xs font-mono font-bold text-sky-300">
                      +20 PTS
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Evaluate another teen creator's build using our 4-criteria rubric (Clarity, Execution, Technicality, Documentation).
                  </p>
                </div>

                {/* 5. Community Upvotes */}
                <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/10 p-4 space-y-2 relative overflow-hidden sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                        <ThumbsUp className="h-4 w-4" />
                      </span>
                      <div>
                        <span className="text-xs font-bold text-white block">5. Receive Likes</span>
                        <span className="text-[10px] text-indigo-400 font-mono">Peer appreciation</span>
                      </div>
                    </div>
                    <span className="rounded-lg bg-indigo-500/20 border border-indigo-500/40 px-2 py-0.5 text-xs font-mono font-bold text-indigo-300">
                      +5 PTS
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    Earn +5 points whenever fellow creators like your project or mark your review as helpful. Authentic proof of appreciation.
                  </p>
                </div>
              </div>

              {/* Quick Math Example Callout */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 flex items-start gap-3">
                <Sparkles className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-300 leading-relaxed">
                  <strong className="text-white">Quick Example:</strong> Log in today (+10 pts) + complete your first daily community review (+35 pts) = <strong className="text-amber-400">45 points in 1 day!</strong> You are just 5 points away from the <strong className="text-emerald-400">Verified Human Badge</strong>!
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: What Points Unlock */}
          {activeTab === 'tiers' && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 text-center space-y-1.5">
                  <div className="flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold text-white block">Friendly Star</span>
                  <span className="text-[11px] font-mono font-bold text-emerald-300 block">50 Points</span>
                  <p className="text-[10px] text-slate-400">Official verified creator seal next to your handle on all builds & chat.</p>
                </div>

                <div className="rounded-2xl border border-sky-500/30 bg-sky-950/20 p-3.5 text-center space-y-1.5">
                  <div className="flex items-center justify-center text-sky-400">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold text-white block">Crafty Bee</span>
                  <span className="text-[11px] font-mono font-bold text-sky-300 block">100 Points</span>
                  <p className="text-[10px] text-slate-400">Bronze tier badge + featured in Top Builders leaderboard.</p>
                </div>

                <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-3.5 text-center space-y-1.5">
                  <div className="flex items-center justify-center text-indigo-400">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold text-white block">Wonder Maker</span>
                  <span className="text-[11px] font-mono font-bold text-indigo-300 block">250 Points</span>
                  <p className="text-[10px] text-slate-400">Silver tier badge + high-points creator flair.</p>
                </div>

                <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-3.5 text-center space-y-1.5">
                  <div className="flex items-center justify-center text-amber-400">
                    <Star className="h-6 w-6 fill-amber-400" />
                  </div>
                  <span className="text-xs font-bold text-white block">Superstar</span>
                  <span className="text-[11px] font-mono font-bold text-amber-300 block">500 Points</span>
                  <p className="text-[10px] text-slate-400">Gold tier crown + recognized beloved creator of the workshop.</p>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-3.5 text-[11px] text-slate-300 space-y-1">
                <span className="font-semibold text-white block">Do points ever expire or decrease?</span>
                <p className="text-slate-400">
                  No! Points are permanent proof of your hard work and creativity. Once unlocked, your lovable badges and status stay with you forever.
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Daily Streak Guide */}
          {activeTab === 'streak' && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              <div className="rounded-2xl border border-amber-500/30 bg-amber-950/15 p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
                    <Flame className="h-5 w-5 fill-amber-500 text-amber-500 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">How Daily Streaks Work</h4>
                    <p className="text-xs text-amber-300/90">Streak points double & increase by +2 each login day!</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                  <div className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">1.</span>
                    <span><strong>Starts on Day 1:</strong> The moment you log into your account today, your streak flame begins at 1 Day (+2 Points).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">2.</span>
                    <span><strong>Streak Points Double & Grow by +2:</strong> Daily login points double for early streak milestones (Day 1: 2 pts, Day 2: 4 pts, Day 3: 8 pts, Day 4: 16 pts, Day 5: 32 pts), and continue climbing by +2 every single consecutive day you log in!</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">3.</span>
                    <span><strong>Missed a day?</strong> If you miss a day, your points and badges are safe! You just restart a fresh streak when you log in again.</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-center text-xs font-mono">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5">
                  <span className="text-slate-500 block text-[10px]">3-Day Goal</span>
                  <span className="text-amber-400 font-bold">Little Spark</span>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5">
                  <span className="text-slate-500 block text-[10px]">7-Day Goal</span>
                  <span className="text-amber-300 font-bold">Crafty Bee</span>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5">
                  <span className="text-slate-500 block text-[10px]">14-Day Goal</span>
                  <span className="text-indigo-400 font-bold">Wonder Maker</span>
                </div>
              </div>
            </div>
          )}

          {/* Footer Action */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-3.5">
            <span className="text-xs text-slate-500 font-mono">
              Press <kbd className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300">Esc</kbd> to exit
            </span>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/30"
            >
              Got It, Let's Build! 🚀
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
