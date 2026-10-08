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
import { Mascot } from './Mascot';

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
      ? { title: 'Friendly Star', goal: 50, icon: ShieldCheck, color: 'text-emerald-700' }
      : currentUserRep < 100
      ? { title: 'Crafty Bee', goal: 100, icon: Trophy, color: 'text-sky-700' }
      : currentUserRep < 250
      ? { title: 'Wonder Maker', goal: 250, icon: Sparkles, color: 'text-indigo-700' }
      : { title: 'locked in', goal: 500, icon: Star, color: 'text-amber-700' };

  const repRemaining = Math.max(0, nextTarget.goal - currentUserRep);
  const progressPercent = Math.min(100, Math.round((currentUserRep / nextTarget.goal) * 100));

  return (
    <AnimatePresence>
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/35 backdrop-blur-md overflow-y-auto cursor-pointer animate-in fade-in duration-150"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          onClick={(e) => e.stopPropagation()}
          className="my-6 w-full max-w-2xl rounded-3xl border-2 border-amber-200 bg-white p-5 sm:p-7 shadow-2xl relative overflow-hidden cursor-default space-y-5 text-slate-800"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 border border-amber-300 text-amber-700 shadow-2xs">
                <Mascot type="curious" size="sm" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>How Points & Streaks Work</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Points represent your authentic contributions to the community through building, sharing, and reviewing.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              title="Close (Esc)"
              className="rounded-full p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Current User Quick Stat Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 p-4 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 border border-amber-300 text-amber-700">
                <Star className="h-4 w-4 fill-amber-400" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Your Points</span>
                <span className="text-base font-black text-slate-900 font-mono">{currentUserRep} Points</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 border border-amber-300 text-amber-700">
                <Flame className="h-4 w-4 fill-amber-500 text-amber-500 animate-bounce" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Daily Streak</span>
                <span className="text-base font-black text-slate-900 font-mono">
                  {currentStreak} Day{currentStreak === 1 ? '' : 's'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 border-t sm:border-t-0 sm:border-l border-amber-200 pt-2 sm:pt-0 sm:pl-3">
              <div className="flex-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-600 mb-1 font-bold">
                  <span>Goal: {nextTarget.title}</span>
                  <span className="text-sky-700">{progressPercent}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 to-amber-400 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-[9px] text-slate-500 block mt-1 font-mono font-medium">
                  {repRemaining > 0 ? `${repRemaining} points to unlock` : 'Milestone achieved!'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-1.5 border-b-2 border-slate-100 pb-2">
            <button
              onClick={() => setActiveTab('earn')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'earn'
                  ? 'bg-sky-400 text-slate-950 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Earn Points</span>
            </button>

            <button
              onClick={() => setActiveTab('tiers')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'tiers'
                  ? 'bg-amber-300 text-slate-950 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Trophy className="h-3.5 w-3.5" />
              <span>Badge Tiers</span>
            </button>

            <button
              onClick={() => setActiveTab('streak')}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'streak'
                  ? 'bg-rose-300 text-slate-950 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Flame className="h-3.5 w-3.5 text-amber-600" />
              <span>Streak Rules</span>
            </button>
          </div>

          {/* Tab 1: Ways to Earn Points */}
          {activeTab === 'earn' && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Daily Login */}
                <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/50 p-4 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 border border-amber-300 text-amber-700">
                        <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
                      </span>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">1. Daily Login</span>
                        <span className="text-[10px] text-amber-700 font-mono font-bold">Starts streak</span>
                      </div>
                    </div>
                    <span className="rounded-full bg-amber-100 border border-amber-300 px-2.5 py-0.5 text-xs font-mono font-bold text-amber-900">
                      +10 PTS / DAY
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                    Simply log in to your account each day. Your streak starts on Day 1 and increases by +1 every day you show up, earning +10 points daily!
                  </p>
                </div>

                {/* 2. Daily Community Review Bonus */}
                <div className="rounded-2xl border-2 border-rose-200 bg-rose-50/50 p-4 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-100 border border-rose-300 text-rose-700">
                        <Star className="h-4 w-4 fill-rose-400" />
                      </span>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">2. Daily Review Bonus</span>
                        <span className="text-[10px] text-rose-700 font-mono font-bold">1st review of day</span>
                      </div>
                    </div>
                    <span className="rounded-full bg-rose-100 border border-rose-300 px-2.5 py-0.5 text-xs font-mono font-bold text-rose-900">
                      +15 BONUS PTS
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                    Earn an extra +15 daily bonus points on top of your normal +20 review points (+35 points total!) for completing your first community review each day.
                  </p>
                </div>

                {/* 3. Publish a Project */}
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 p-4 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-700">
                        <Plus className="h-4 w-4" />
                      </span>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">3. Drop a Build</span>
                        <span className="text-[10px] text-emerald-700 font-mono font-bold">Any category</span>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-xs font-mono font-bold text-emerald-900">
                      +25 PTS
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                    Publish what you made! Whether it’s code, a 3D print, robotics build, game demo, or art, each published build awards +25 points.
                  </p>
                </div>

                {/* 4. Peer Review */}
                <div className="rounded-2xl border-2 border-sky-200 bg-sky-50/50 p-4 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-100 border border-sky-300 text-sky-700">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">4. Peer Rubric Review</span>
                        <span className="text-[10px] text-sky-700 font-mono font-bold">Every review</span>
                      </div>
                    </div>
                    <span className="rounded-full bg-sky-100 border border-sky-300 px-2.5 py-0.5 text-xs font-mono font-bold text-sky-900">
                      +20 PTS
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                    Evaluate another creator's build using our 4-criteria rubric (Clarity, Execution, Technicality, Documentation).
                  </p>
                </div>

                {/* 5. Community Upvotes */}
                <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50/50 p-4 space-y-2 relative overflow-hidden sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 border border-indigo-300 text-indigo-700">
                        <ThumbsUp className="h-4 w-4" />
                      </span>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">5. Receive Likes & Upvotes</span>
                        <span className="text-[10px] text-indigo-700 font-mono font-bold">Peer appreciation</span>
                      </div>
                    </div>
                    <span className="rounded-full bg-indigo-100 border border-indigo-300 px-2.5 py-0.5 text-xs font-mono font-bold text-indigo-900">
                      +5 PTS
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
                    Earn +5 points whenever fellow creators like your project or mark your review as helpful. Authentic proof of appreciation.
                  </p>
                </div>
              </div>

              {/* Quick Math Example Callout */}
              <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/60 p-3.5 flex items-start gap-3">
                <Sparkles className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-700 leading-relaxed font-normal">
                  <strong className="text-slate-900 font-bold">Quick Example:</strong> Log in today (+10 pts) + complete your first daily community review (+35 pts) = <strong className="text-amber-800 font-bold">45 points in 1 day!</strong> You are already almost at the <strong className="text-emerald-800 font-bold">Friendly Star Badge</strong>!
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: What Points Unlock */}
          {activeTab === 'tiers' && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/60 p-3.5 text-center space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-center">
                    <Mascot type="friendly" size="md" />
                  </div>
                  <span className="text-xs font-black text-slate-900 block">Friendly Star</span>
                  <span className="text-[11px] font-mono font-bold text-emerald-800 block">50 Points</span>
                  <p className="text-[10px] text-slate-600 font-normal">Creator badge next to your handle on projects and comments.</p>
                </div>

                <div className="rounded-2xl border-2 border-sky-200 bg-sky-50/60 p-3.5 text-center space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-center">
                    <Mascot type="wavy" size="md" />
                  </div>
                  <span className="text-xs font-black text-slate-900 block">Crafty Bee</span>
                  <span className="text-[11px] font-mono font-bold text-sky-800 block">100 Points</span>
                  <p className="text-[10px] text-slate-600 font-normal">Bronze badge and featured in top creator highlights.</p>
                </div>

                <div className="rounded-2xl border-2 border-rose-200 bg-rose-50/60 p-3.5 text-center space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-center">
                    <Mascot type="cheerful" size="md" />
                  </div>
                  <span className="text-xs font-black text-slate-900 block">Wonder Maker</span>
                  <span className="text-[11px] font-mono font-bold text-rose-800 block">250 Points</span>
                  <p className="text-[10px] text-slate-600 font-normal">Silver badge and recognized contributor flair.</p>
                </div>

                <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/60 p-3.5 text-center space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-center">
                    <Mascot type="earth" size="md" />
                  </div>
                  <span className="text-xs font-black text-slate-900 block">locked in</span>
                  <span className="text-[11px] font-mono font-bold text-amber-800 block">500 Points</span>
                  <p className="text-[10px] text-slate-600 font-normal">Gold tier badge honoring dedicated community builders.</p>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-3.5 text-[11px] text-slate-600 space-y-1 font-normal">
                <span className="font-bold text-slate-900 block">Do points ever expire or decrease?</span>
                <p>
                  No! Points are permanent proof of your hard work and creativity. Once unlocked, your badges and status stay with you forever.
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Daily Streak Guide */}
          {activeTab === 'streak' && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/60 p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 border border-amber-300 text-amber-700">
                    <Flame className="h-5 w-5 fill-amber-500 text-amber-500 animate-bounce" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">How Daily Streaks Work</h4>
                    <p className="text-xs text-amber-800 font-medium">Earn +10 points every day you log in and keep your streak alive!</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 leading-relaxed border-t-2 border-amber-100 pt-3 font-normal">
                  <div className="flex items-start gap-2">
                    <span className="text-amber-800 font-bold">1.</span>
                    <span><strong>Starts on Day 1:</strong> The moment you log in or sign up, your daily streak starts at Day 1 and awards you your first streak badge.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-800 font-bold">2.</span>
                    <span><strong>Check In Daily:</strong> Each day you return and check in, your streak increments and gives you bonus points toward your creator reputation.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-800 font-bold">3.</span>
                    <span><strong>Missed a day?</strong> If you miss a day, don't worry! You can easily start fresh on your next check-in.</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5 text-center text-xs font-mono">
                <div className="rounded-2xl border-2 border-slate-200 bg-white p-2.5 shadow-2xs">
                  <span className="text-slate-500 block text-[10px] font-bold">3-Day Goal</span>
                  <span className="text-amber-800 font-bold">Little Spark</span>
                </div>
                <div className="rounded-2xl border-2 border-slate-200 bg-white p-2.5 shadow-2xs">
                  <span className="text-slate-500 block text-[10px] font-bold">7-Day Goal</span>
                  <span className="text-amber-800 font-bold">Crafty Bee</span>
                </div>
                <div className="rounded-2xl border-2 border-slate-200 bg-white p-2.5 shadow-2xs">
                  <span className="text-slate-500 block text-[10px] font-bold">14-Day Goal</span>
                  <span className="text-indigo-800 font-bold">Wonder Maker</span>
                </div>
              </div>
            </div>
          )}

          {/* Footer Action */}
          <div className="flex items-center justify-between border-t-2 border-slate-100 pt-3.5">
            <span className="text-xs text-slate-500 font-mono">
              Press <kbd className="rounded-lg bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] text-slate-700 font-bold">Esc</kbd> to exit
            </span>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-gradient-to-r from-sky-400 via-emerald-300 to-amber-200 px-6 py-2 text-xs font-black text-slate-950 shadow-md shadow-sky-300/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              Got It, Let's Lock In Now!
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
