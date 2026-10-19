import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types';
import {
  Flame,
  Sparkles,
  ArrowRight,
  Heart,
  Users,
  MessageCircle,
  Trophy,
  Star,
  Globe2,
  Compass,
  Play,
  Hammer,
  Share2,
} from 'lucide-react';
import { Logo } from './Logo';
import { MediaDisplay } from './MediaDisplay';
import { Mascot } from './Mascot';
import { DoodleFace } from './DoodleFaces';

interface IntroLandingProps {
  onEnterApp: () => void;
  onOpenGoogleLogin: (mode?: 'login' | 'signup') => void;
  featuredProjects: Project[];
}

// Sample interactive projects for the hero preview
const INTERACTIVE_HERO_BUILDS = [
  {
    id: 'hero-1',
    title: 'Autonomous Rover with LiDAR & Ultrasonic Sensors',
    category: 'Robotics',
    author: {
      name: 'Maya Chen',
      handle: 'maya_robotics',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      streak: 14,
    },
    mediaUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1000&q=80',
    tagline: 'Custom 3D-printed chassis, ROS2 controller, and real-time obstacle avoidance.',
    tags: ['#robotics', '#ros2', '#3dprinting'],
    likesCount: 142,
    commentsCount: 28,
  },
  {
    id: 'hero-2',
    title: 'Low-Poly Open World RPG in Godot 4',
    category: 'Game Dev',
    author: {
      name: 'Alex Rivera',
      handle: 'alex_gamecraft',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      streak: 21,
    },
    mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
    tagline: 'Custom toon shader, procedural dungeon generation, and playable web demo.',
    tags: ['#gamedev', '#godot', '#indiegame'],
    likesCount: 219,
    commentsCount: 39,
  },
  {
    id: 'hero-3',
    title: 'Bionic Prosthetic Hand with Servo Tendons',
    category: '3D Printing',
    author: {
      name: 'Sarah Kim',
      handle: 'sarah_makes',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      streak: 9,
    },
    mediaUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    tagline: 'Lightweight PLA frame with flexible TPU grip pads and Arduino nano controller.',
    tags: ['#3dprinting', '#biomedical', '#arduino'],
    likesCount: 388,
    commentsCount: 52,
  },
  {
    id: 'hero-4',
    title: 'Modular Macro Mechanical Keyboard',
    category: 'Electronics',
    author: {
      name: 'Kai Tanaka',
      handle: 'kai_keebs',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      streak: 33,
    },
    mediaUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80',
    tagline: 'Custom PCB with hotswap sockets, rotary encoder knob, and QMK firmware.',
    tags: ['#electronics', '#mechanicalkeyboard', '#pcb'],
    likesCount: 175,
    commentsCount: 19,
  },
];

export const IntroLanding: React.FC<IntroLandingProps> = ({
  onEnterApp,
  onOpenGoogleLogin,
  featuredProjects,
}) => {
  const [selectedBuildIdx, setSelectedBuildIdx] = useState(0);
  const [likedBuilds, setLikedBuilds] = useState<Record<string, boolean>>({});
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({
    'hero-1': 142,
    'hero-2': 219,
    'hero-3': 388,
    'hero-4': 175,
  });
  const [showXpToast, setShowXpToast] = useState(false);

  const activeHeroBuild = INTERACTIVE_HERO_BUILDS[selectedBuildIdx];
  const isLiked = Boolean(likedBuilds[activeHeroBuild.id]);

  const handleHeroLike = () => {
    const nextState = !isLiked;
    setLikedBuilds((prev) => ({ ...prev, [activeHeroBuild.id]: nextState }));
    setLikeCounts((prev) => ({
      ...prev,
      [activeHeroBuild.id]: (prev[activeHeroBuild.id] || activeHeroBuild.likesCount) + (nextState ? 1 : -1),
    }));

    if (nextState) {
      setShowXpToast(true);
      setTimeout(() => setShowXpToast(false), 2200);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#faf7f2] text-slate-800 selection:bg-amber-200 selection:text-amber-950">
      {/* Symmetrical Candy Pastel Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[650px] w-[950px] -translate-x-1/2 rounded-full bg-gradient-to-b from-sky-200/50 via-emerald-200/35 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -left-48 h-[450px] w-[450px] rounded-full bg-amber-200/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-48 h-[450px] w-[450px] rounded-full bg-rose-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 h-80 w-[700px] rounded-full bg-emerald-200/35 blur-3xl" />

      {/* Top Navigation */}
      <header className="relative z-30 mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Logo size="lg" />
          <span className="hidden md:inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-300 px-2.5 py-0.5 text-[11px] font-bold text-amber-900">
            <Flame className="h-3 w-3 fill-amber-500 text-amber-600" />
            Social Builder Network
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onEnterApp}
            className="flex items-center gap-1.5 rounded-full border-2 border-slate-300 bg-white/90 px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 hover:border-sky-300 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <Compass className="h-3.5 w-3.5 text-sky-600" />
            <span>Explore Feed</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenGoogleLogin('login')}
            className="rounded-full border-2 border-slate-300 bg-white/90 px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => onOpenGoogleLogin('signup')}
            className="rounded-full bg-gradient-to-r from-amber-400 via-rose-300 to-sky-300 px-5 py-2 text-xs font-black text-slate-950 shadow-md shadow-amber-300/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Get Locked In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-20 mx-auto max-w-6xl px-4 pt-8 pb-16 sm:px-6 lg:px-8">
        {/* Unmistakable Value Prop Headline */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border-2 border-amber-300 bg-amber-50 px-3.5 py-1 text-xs font-black text-amber-900 shadow-xs"
          >
            <Flame className="h-4 w-4 fill-amber-500 text-amber-500 animate-pulse" />
            <span>Duolingo streaks meet Instagram builds</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-black tracking-tight text-slate-900 sm:text-6xl lg:text-7xl leading-[1.08]"
          >
            The social home for{' '}
            <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-sky-600 bg-clip-text text-transparent">
              people who build things.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="text-base text-slate-600 sm:text-lg leading-relaxed max-w-2xl mx-auto font-medium"
          >
            Share 3D prints, robots, games, electronics, art, and code. Earn daily maker streaks, team up with fellow creators, and get friendly feedback with zero toxic doomscrolling.
          </motion.p>

          {/* Quick Pillar Bullets (All Ages, Real Builds) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex flex-wrap items-center justify-center gap-3 pt-1 text-xs font-bold text-slate-600"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3 py-1 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Creators of All Ages
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3 py-1 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Daily Maker Streaks
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-slate-200 px-3 py-1 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              100% Real Working Builds
            </span>
          </motion.div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 max-w-md mx-auto"
          >
            <button
              type="button"
              onClick={() => onOpenGoogleLogin('signup')}
              className="flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-amber-400 via-rose-300 to-sky-300 px-7 py-3.5 text-sm font-black text-slate-950 shadow-lg shadow-amber-300/40 hover:scale-103 active:scale-97 transition-all cursor-pointer"
            >
              <span>Join with Google</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onEnterApp}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border-2 border-slate-300 bg-white px-7 py-3.5 text-sm font-bold text-slate-700 hover:border-sky-300 hover:text-slate-950 transition-all cursor-pointer shadow-xs active:scale-97"
            >
              <Compass className="h-4 w-4 text-sky-600" />
              <span>Explore Live App</span>
            </button>
          </motion.div>
        </div>

        {/* Interactive TikTok/Instagram/Duolingo Style Showcase Player */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-12 max-w-4xl mx-auto rounded-3xl border-3 border-slate-200 bg-white p-4 sm:p-6 shadow-2xl shadow-amber-100/70"
        >
          {/* Top Label & Active Status */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                Live Creator Feed
              </span>
              <span className="text-xs text-slate-400">· Tap creators to browse</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span>Streak XP Enabled</span>
            </div>
          </div>

          {/* Stories Tray with glowing gradient rings (Instagram/TikTok format) */}
          <div className="py-4 flex items-center gap-3 overflow-x-auto scrollbar-none select-none border-b border-slate-100">
            {INTERACTIVE_HERO_BUILDS.map((build, idx) => {
              const isActive = selectedBuildIdx === idx;
              return (
                <button
                  key={build.id}
                  type="button"
                  onClick={() => setSelectedBuildIdx(idx)}
                  className={`flex flex-col items-center gap-1 shrink-0 transition-transform active:scale-95 cursor-pointer ${
                    isActive ? 'scale-105' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <div
                    className={`h-15 w-15 rounded-full p-0.5 transition-all ${
                      isActive
                        ? 'bg-gradient-to-tr from-amber-400 via-rose-500 to-sky-400 ring-2 ring-amber-300 ring-offset-2'
                        : 'bg-slate-200 hover:bg-slate-300'
                    }`}
                  >
                    <img
                      src={build.author.avatar}
                      alt={build.author.name}
                      className="h-full w-full rounded-full object-cover border-2 border-white"
                    />
                  </div>
                  <span
                    className={`text-[11px] truncate max-w-18 ${
                      isActive ? 'font-black text-slate-900' : 'font-medium text-slate-600'
                    }`}
                  >
                    @{build.author.handle.replace(/_.*/, '')}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Build Showcase Card */}
          <div className="pt-4 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Visual Media with TikTok/Reels Play Feel */}
            <div className="md:col-span-7 relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 group">
              <img
                src={activeHeroBuild.mediaUrl}
                alt={activeHeroBuild.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

              {/* Category Pill */}
              <div className="absolute top-3 left-3 z-10">
                <span className="rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-xs font-black text-slate-900 border border-slate-200 shadow-xs">
                  {activeHeroBuild.category}
                </span>
              </div>

              {/* Duolingo XP Toast Pop-up */}
              <AnimatePresence>
                {showXpToast && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
                  >
                    <div className="flex items-center gap-2 rounded-full bg-amber-400 text-slate-950 px-5 py-2.5 font-black text-sm shadow-xl border-2 border-amber-200">
                      <Flame className="h-5 w-5 fill-slate-950" />
                      <span>+5 Streak XP! Locked In!</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom Quick Bar on Media */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold drop-shadow-sm">Working Prototype</span>
                </div>
                <span className="font-mono text-[11px] text-white/80">Interactive Demo</span>
              </div>
            </div>

            {/* Project Details & Social Controls */}
            <div className="md:col-span-5 flex flex-col justify-between space-y-4">
              <div>
                {/* Author Info */}
                <div className="flex items-center gap-2.5 mb-2">
                  <img
                    src={activeHeroBuild.author.avatar}
                    alt={activeHeroBuild.author.name}
                    className="h-8 w-8 rounded-full object-cover ring-2 ring-amber-300"
                  />
                  <div>
                    <h4 className="text-xs font-black text-slate-900">
                      {activeHeroBuild.author.name}
                    </h4>
                    <span className="text-[11px] text-slate-500 font-mono">
                      @{activeHeroBuild.author.handle} · {activeHeroBuild.author.streak}d streak
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-black text-slate-900 leading-snug">
                  {activeHeroBuild.title}
                </h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed font-normal">
                  {activeHeroBuild.tagline}
                </p>

                {/* Hashtags */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {activeHeroBuild.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 text-slate-700 px-2.5 py-0.5 text-[11px] font-bold font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons with tactile like and open */}
              <div className="pt-2 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center gap-2">
                  {/* Interactive Heart Button with spring feedback */}
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    whileHover={{ scale: 1.05 }}
                    type="button"
                    onClick={handleHeroLike}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-full py-2.5 px-4 text-xs font-bold transition-all cursor-pointer border ${
                      isLiked
                        ? 'bg-rose-50 text-rose-600 border-rose-300'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`}
                    />
                    <span>{likeCounts[activeHeroBuild.id] || activeHeroBuild.likesCount}</span>
                  </motion.button>

                  <button
                    type="button"
                    onClick={onEnterApp}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 py-2.5 px-4 text-xs font-bold transition-all cursor-pointer"
                  >
                    <MessageCircle className="h-4 w-4 text-sky-600" />
                    <span>{activeHeroBuild.commentsCount} Reviews</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={onEnterApp}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-2.5 px-4 text-xs transition-all shadow-xs cursor-pointer hover:scale-102 active:scale-98"
                >
                  <span>Open Build & Join Discussion</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4 Brand Mascots Value Grid */}
        <div className="pt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto text-left">
          {/* Card 1: Curious Star */}
          <div className="h-full flex flex-col justify-between rounded-3xl border-2 border-amber-200 bg-gradient-to-b from-amber-50/90 via-white to-amber-50/50 p-5 space-y-3.5 shadow-sm hover:border-amber-300 hover:-translate-y-1 transition-all group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 border border-amber-300 group-hover:scale-110 transition-transform">
                  <svg viewBox="0 0 100 100" className="h-8 w-8 drop-shadow-xs">
                    <ellipse cx="50" cy="50" rx="46" ry="45" fill="#ffea78" stroke="#1e293b" strokeWidth="6" />
                    <circle cx="31" cy="38" r="4.5" fill="#2aa6cb" />
                    <circle cx="69" cy="38" r="4.5" fill="#2aa6cb" />
                    <ellipse cx="50" cy="61" rx="14" ry="10" fill="#ebe3dc" stroke="#1e293b" strokeWidth="5" />
                  </svg>
                </div>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-300">
                  Curious Star
                </span>
              </div>
              <h4 className="text-sm font-black text-slate-900 tracking-tight">Show Off Real Builds</h4>
              <p className="text-xs text-slate-600 leading-relaxed mt-1.5 font-normal">
                Got a 3D print, game, robot, art piece, or code project? Put it on stage where fellow makers actually appreciate it.
              </p>
            </div>
          </div>

          {/* Card 2: Cozy Champ */}
          <div className="h-full flex flex-col justify-between rounded-3xl border-2 border-orange-200 bg-gradient-to-b from-orange-50/90 via-white to-orange-50/50 p-5 space-y-3.5 shadow-sm hover:border-orange-300 hover:-translate-y-1 transition-all group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 border border-orange-300 group-hover:scale-110 transition-transform">
                  <svg viewBox="0 0 100 100" className="h-8 w-8 drop-shadow-xs">
                    <ellipse cx="50" cy="50" rx="48" ry="45" fill="#ffcb95" stroke="#1e293b" strokeWidth="6" />
                    <path d="M 25 40 Q 35 36 44 40" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" fill="none" />
                    <path d="M 57 40 Q 66 36 76 40" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" fill="none" />
                    <path d="M 15 53 Q 23 46 25 55 Q 50 70 75 55 Q 77 46 85 53" stroke="#1e293b" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                </div>
                <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[10px] font-bold text-orange-800 border border-orange-300">
                  Cozy Champ
                </span>
              </div>
              <h4 className="text-sm font-black text-slate-900 tracking-tight">Duolingo Maker Streaks</h4>
              <p className="text-xs text-slate-600 leading-relaxed mt-1.5 font-normal">
                Earn daily streak XP every day you show up. Unlock cute builder badges from 'Curious Star' all the way to 'Locked In'!
              </p>
            </div>
          </div>

          {/* Card 3: Chat Buddy */}
          <div className="h-full flex flex-col justify-between rounded-3xl border-2 border-rose-200 bg-gradient-to-b from-rose-50/90 via-white to-rose-50/50 p-5 space-y-3.5 shadow-sm hover:border-rose-300 hover:-translate-y-1 transition-all group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 border border-rose-300 group-hover:scale-110 transition-transform">
                  <svg viewBox="0 0 100 100" className="h-8 w-8 drop-shadow-xs">
                    <ellipse cx="50" cy="50" rx="47" ry="46" fill="#ffadad" stroke="#1e293b" strokeWidth="6" />
                    <path d="M 24 28 Q 32 30 37 29" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" fill="none" />
                    <path d="M 60 23 Q 70 20 79 24" stroke="#1e293b" strokeWidth="5.5" strokeLinecap="round" fill="none" />
                    <circle cx="33" cy="38" r="4.5" fill="#1e293b" />
                    <circle cx="70" cy="38" r="4.5" fill="#1e293b" />
                    <path d="M 35 58 L 65 58 L 52 80 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold text-rose-800 border border-rose-300">
                  Chat Buddy
                </span>
              </div>
              <h4 className="text-sm font-black text-slate-900 tracking-tight">Direct Chat & Collabs</h4>
              <p className="text-xs text-slate-600 leading-relaxed mt-1.5 font-normal">
                Direct message creators, join project team channels, recruit co-builders, and share CAD files or schematics seamlessly.
              </p>
            </div>
          </div>

          {/* Card 4: Kind Helper */}
          <div className="h-full flex flex-col justify-between rounded-3xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50/90 via-white to-emerald-50/50 p-5 space-y-3.5 shadow-sm hover:border-emerald-300 hover:-translate-y-1 transition-all group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 border border-emerald-300 group-hover:scale-110 transition-transform">
                  <svg viewBox="0 0 100 100" className="h-8 w-8 drop-shadow-xs">
                    <ellipse cx="50" cy="50" rx="47" ry="46" fill="#ede0d7" stroke="#1e293b" strokeWidth="6" />
                    <circle cx="31" cy="38" r="5" fill="#22c55e" />
                    <circle cx="69" cy="38" r="4.5" fill="#1e293b" />
                    <path d="M 34 58 Q 50 76 66 58" stroke="#1e293b" strokeWidth="5.5" strokeLinecap="round" fill="none" />
                  </svg>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-300">
                  Kind Helper
                </span>
              </div>
              <h4 className="text-sm font-black text-slate-900 tracking-tight">Friendly Peer Feedback</h4>
              <p className="text-xs text-slate-600 leading-relaxed mt-1.5 font-normal">
                Thoughtful, constructive reviews from fellow makers who cheer your progress and help you level up with zero toxic drama.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Community Showcase */}
      <section className="relative z-20 border-t-2 border-slate-200/80 bg-white/80 py-16 backdrop-blur-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-sky-200 bg-sky-50 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-sky-800">
              <Globe2 className="h-3.5 w-3.5 text-emerald-600" />
              Community Showcase
            </span>
            <h2 className="mt-2 text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">
              Real Builds by Creators of All Ages
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-md mx-auto font-medium">
              Explore hardware, robotics, 3D prints, games, and code crafted by makers around the world.
            </p>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {featuredProjects.slice(0, 3).map((project) => (
                <div
                  key={project.id}
                  onClick={onEnterApp}
                  className="group cursor-pointer rounded-3xl border-2 border-slate-100 bg-white p-5 transition-all hover:border-sky-300 hover:shadow-xl hover:shadow-sky-100 hover:-translate-y-1 flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-100 mb-3.5 border border-slate-200 relative">
                      {project.mediaUrls[0] ? (
                        <MediaDisplay
                          url={project.mediaUrls[0]}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          autoPlayPreview={true}
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-sky-50 text-xs text-slate-600 font-medium p-4 text-center">
                          <Sparkles className="h-6 w-6 text-sky-500 mb-1" />
                          <span>{project.category || 'Maker Build'}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-sky-700 mb-1.5 flex-wrap">
                      {project.tags.slice(0, 2).map((t) => (
                        <span key={t} className="rounded-full bg-sky-50 border border-sky-200 px-2 py-0.5 font-bold">
                          {t}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-sky-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                      {project.tagline}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <img
                        src={project.author.avatarUrl}
                        alt={project.author.displayName}
                        className="h-5 w-5 rounded-full object-cover"
                      />
                      <span>@{project.author.handle}</span>
                    </span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      {project.viewsCount || 0} views
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white/80 p-10 text-center space-y-4 max-w-lg mx-auto">
              <div className="mx-auto h-12 w-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-600">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">The Stage is Ready for You</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Sign up with Google or your email to publish your first project in 3D printing, game dev, robotics, or code!
              </p>
              <button
                type="button"
                onClick={() => onOpenGoogleLogin('signup')}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-rose-300 to-sky-300 px-6 py-2.5 text-xs font-black text-slate-950 hover:scale-105 active:scale-95 transition-all shadow-md shadow-amber-300/40 cursor-pointer"
              >
                <span>Join & Share Your Build</span>
              </button>
            </div>
          )}

          {/* Enter App Footer CTA Button */}
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={onEnterApp}
              className="inline-flex items-center gap-2 rounded-full border-2 border-slate-300 bg-white px-7 py-3 text-xs font-bold text-slate-700 hover:text-slate-900 hover:border-sky-300 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <span>View all builds in the app</span>
              <ArrowRight className="h-3.5 w-3.5 text-sky-600" />
            </button>
          </div>
        </div>
      </section>

      {/* Symmetrical Cheerful Footer */}
      <footer className="border-t-2 border-slate-200/80 py-10 text-center text-xs text-slate-500 font-mono space-y-2 bg-[#faf7f2]">
        <div className="flex items-center justify-center gap-2 text-slate-700 font-bold">
          <span className="text-slate-900 font-black">locked in.</span>
          <span>·</span>
          <span>The social builder platform for creators of all ages</span>
        </div>
        <p className="text-[11px] text-slate-500">
          Learn, share, team up, and keep your maker streak burning.
        </p>
      </footer>
    </div>
  );
};
