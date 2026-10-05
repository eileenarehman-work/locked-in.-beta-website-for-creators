import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Project } from '../types';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Flame,
  Users,
  Compass,
  Zap,
  Lock,
  MessageSquare,
  CheckCircle2,
  Code2,
  Cpu,
  Layers,
  Award,
  ChevronRight,
  Send,
  Boxes,
  Activity,
  Heart,
  Eye,
} from 'lucide-react';
import { Logo } from './Logo';

interface IntroLandingProps {
  onEnterApp: () => void;
  onOpenGoogleLogin: (mode?: 'login' | 'signup') => void;
  featuredProjects: Project[];
}

export const IntroLanding: React.FC<IntroLandingProps> = ({
  onEnterApp,
  onOpenGoogleLogin,
  featuredProjects,
}) => {
  const [activePreviewTab, setActivePreviewTab] = useState<'feed' | 'studio' | 'groups'>('feed');

  // Curated showcase projects if fewer than 3 projects exist to guarantee perfect 3-column visual symmetry
  const displayProjects: Project[] = (featuredProjects && featuredProjects.length >= 3)
    ? featuredProjects.slice(0, 3)
    : [
        ...(featuredProjects || []),
        {
          id: 'proj_curated_1',
          title: 'Autonomous Quad-LiDAR Rover',
          slug: 'autonomous-quad-lidar-rover',
          tagline: 'Custom 3D-printed chassis powered by Raspberry Pi 5 and SLAM navigation.',
          contentMarkdown: 'A custom indoor mapping rover equipped with 2D LiDAR, ultrasonic sensors, and motor encoders.',
          description: 'A custom indoor mapping rover equipped with 2D LiDAR, ultrasonic sensors, and motor encoders.',
          authorId: 'usr_curated_1',
          author: {
            id: 'usr_curated_1',
            email: 'kai@wedidthis.dev',
            googleId: 'g_curated_1',
            handle: 'kai_robotics',
            displayName: 'Kai Vance',
            avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
            age: 17,
            bio: 'Robotics builder & firmware hacker',
            interestTags: ['#robotics', '#hardware'],
            reputationScore: 54,
            trustTier: 'VERIFIED_HUMAN' as const,
            createdAt: new Date().toISOString(),
          },
          tags: ['#robotics', '#hardware', '#3dprinting'],
          qualities: ['Custom CAD Design', 'ROS2 Navigation', 'Dual Battery Cell'],
          milestones: [],
          mediaUrls: [
            'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1000&q=80',
          ],
          likesCount: 38,
          viewsCount: 340,
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'PUBLISHED' as const,
        },
        {
          id: 'proj_curated_2',
          title: 'Neon Drift: Raymarched Shader Jam',
          slug: 'neon-drift-raymarched-shader-jam',
          tagline: 'Procedural neon city and cyber drift physics made entirely in GLSL and Three.js.',
          contentMarkdown: 'An open-source interactive raymarching simulation featuring volumetric fog, bloom, and synthesized engine audio.',
          description: 'An open-source interactive raymarching simulation featuring volumetric fog, bloom, and synthesized engine audio.',
          authorId: 'usr_curated_2',
          author: {
            id: 'usr_curated_2',
            email: 'maya@wedidthis.dev',
            googleId: 'g_curated_2',
            handle: 'maya_codes',
            displayName: 'Maya Chen',
            avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
            age: 16,
            bio: 'Creative coder & indie shader enthusiast',
            interestTags: ['#gamedev', '#shaders'],
            reputationScore: 68,
            trustTier: 'VERIFIED_HUMAN' as const,
            createdAt: new Date().toISOString(),
          },
          tags: ['#gamedev', '#shaders', '#coding'],
          qualities: ['60 FPS WebGL', 'Procedural Audio', 'Custom GLSL Shaders'],
          milestones: [],
          mediaUrls: [
            'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
          ],
          likesCount: 52,
          viewsCount: 512,
          createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'PUBLISHED' as const,
        },
        {
          id: 'proj_curated_3',
          title: 'Carbon-Fiber Honeycomb Core Drone',
          slug: 'carbon-fiber-honeycomb-core-drone',
          tagline: 'Sub-250g ultra-lightweight racing frame with custom ESC firmware.',
          contentMarkdown: 'Designed in Fusion 360, CNC milled carbon-fiber plates and 3D-printed TPU shock dampeners.',
          description: 'Designed in Fusion 360, CNC milled carbon-fiber plates and 3D-printed TPU shock dampeners.',
          authorId: 'usr_curated_3',
          author: {
            id: 'usr_curated_3',
            email: 'liam@wedidthis.dev',
            googleId: 'g_curated_3',
            handle: 'liam_maker',
            displayName: 'Liam Brooks',
            avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
            age: 17,
            bio: 'Drone pilot, CAD modeller and FPV builder',
            interestTags: ['#3dprinting', '#electronics'],
            reputationScore: 42,
            trustTier: 'VERIFIED_HUMAN' as const,
            createdAt: new Date().toISOString(),
          },
          tags: ['#3dprinting', '#electronics', '#makers'],
          qualities: ['Carbon Fiber CNC', 'Sub-250g Frame', 'Custom PID Tuning'],
          milestones: [],
          mediaUrls: [
            'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1000&q=80',
          ],
          likesCount: 29,
          viewsCount: 290,
          createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'PUBLISHED' as const,
        },
      ].slice(0, 3);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Symmetrical Ambient Lighting & Subtle Grid Texture */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#3341550c_1px,transparent_1px),linear-gradient(to_bottom,#3341550c_1px,transparent_1px)] bg-[size:3.5rem_3.5rem]" />
      
      {/* Centered Top Spotlight */}
      <div className="pointer-events-none absolute -top-48 left-1/2 -translate-x-1/2 h-[550px] w-[1000px] rounded-full bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-3xl" />
      
      {/* Bilateral Symmetrical Spotlights */}
      <div className="pointer-events-none absolute top-1/4 -left-48 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[130px]" />
      <div className="pointer-events-none absolute top-1/4 -right-48 h-[500px] w-[500px] rounded-full bg-indigo-500/15 blur-[130px]" />
      <div className="pointer-events-none absolute top-2/3 -left-48 h-[450px] w-[450px] rounded-full bg-indigo-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute top-2/3 -right-48 h-[450px] w-[450px] rounded-full bg-emerald-500/10 blur-[140px]" />

      {/* Symmetrical Top Navigation */}
      <header className="relative z-20 mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-slate-800/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Logo size="lg" />
        </div>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-wider text-slate-400">
          <button onClick={() => onOpenGoogleLogin('signup')} className="hover:text-white transition-colors cursor-pointer">
            Showcase
          </button>
          <button onClick={() => onOpenGoogleLogin('signup')} className="hover:text-white transition-colors cursor-pointer">
            Project Studio
          </button>
          <button onClick={() => onOpenGoogleLogin('signup')} className="hover:text-white transition-colors cursor-pointer">
            Squad Channels
          </button>
          <button onClick={() => onOpenGoogleLogin('signup')} className="hover:text-white transition-colors cursor-pointer">
            Streaks & Badges
          </button>
        </nav>

        {/* Right CTA Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={() => onOpenGoogleLogin('login')}
            className="rounded-xl border border-slate-700/80 bg-slate-900/90 px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
          >
            Log In
          </button>
          <button
            onClick={() => onOpenGoogleLogin('signup')}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition-all cursor-pointer"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pt-16 pb-16 sm:px-6 lg:px-8 text-center space-y-7">
        {/* Animated Symmetrical Kicker */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-mono text-indigo-300 backdrop-blur-md shadow-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="tracking-wide">THE HOMEPAGE FOR TEEN BUILDERS & MAKERS</span>
        </motion.div>

        {/* Symmetrical Hero Headline with Gradient Impact */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }}
          className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.08]"
        >
          WE DON’T JUST SCROLL. <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
            WE CREATE THE FUTURE.
          </span>
        </motion.h1>

        {/* Balanced Centered Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
          className="mx-auto max-w-2xl text-base text-slate-300 sm:text-lg leading-relaxed"
        >
          The dedicated platform for creators to document hardware, robotics, 3D prints, indie games, code, and art. 
          Save drafts, earn daily streak points, and collaborate with real builders across the globe.
        </motion.p>

        {/* Balanced CTA Button Group */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3"
        >
          {/* Glowing Google OAuth Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onOpenGoogleLogin('signup')}
            className="group relative flex w-full sm:w-auto items-center justify-center gap-3 rounded-2xl bg-white px-7 py-3.5 text-sm font-bold text-slate-900 shadow-2xl shadow-indigo-500/25 transition-all hover:bg-slate-100 cursor-pointer"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Sign Up / Log In with Google</span>
            <div className="absolute inset-0 -z-10 rounded-2xl bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>

          {/* Explore Community CTA */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onOpenGoogleLogin('login')}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-slate-700/80 bg-slate-900/90 px-6 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur-md hover:bg-slate-800 hover:text-white transition-all cursor-pointer shadow-sm"
          >
            <span>Explore Community Builds</span>
            <ArrowRight className="h-4 w-4 text-indigo-400" />
          </motion.button>
        </motion.div>

        {/* HERO CENTERPIECE SHOWCASE DECK (Symmetrical Bilateral Layout) */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="pt-8 max-w-5xl mx-auto"
        >
          <div className="relative rounded-3xl border border-slate-800/90 bg-slate-900/40 p-4 sm:p-6 backdrop-blur-xl shadow-2xl shadow-indigo-950/20">
            {/* Interactive Preview Switcher */}
            <div className="flex items-center justify-center gap-1.5 p-1 rounded-2xl bg-slate-950/80 border border-slate-800/80 max-w-xs mx-auto mb-6">
              <button
                type="button"
                onClick={() => setActivePreviewTab('feed')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  activePreviewTab === 'feed'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Live Feed
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewTab('studio')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  activePreviewTab === 'studio'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Project Studio
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewTab('groups')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  activePreviewTab === 'groups'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Squads & DMs
              </button>
            </div>

            {/* Symmetrical 3-Card Bilateral Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {/* Left Card: Hardware & Robotics Build */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-cyan-400">#robotics · #hardware</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 font-mono">
                      ● Prototype
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    Mars Autonomous Rover v2
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    Custom differential steering chassis, OpenCV color tracker, and ESP32 telemetry.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <div className="h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] flex items-center justify-center font-bold">
                      K
                    </div>
                    <span>@kai_robotics</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
                    <Eye className="h-3.5 w-3.5" />
                    <span>340</span>
                  </div>
                </div>
              </motion.div>

              {/* Center Card: Auto-Save Studio Experience */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-indigo-950/40 to-slate-950/90 p-4 space-y-3 flex flex-col justify-between ring-1 ring-indigo-500/20"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-indigo-300">PROJECT STUDIO</span>
                    <span className="text-[10px] text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full font-mono">
                      ✓ Auto-saved
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-indigo-400" />
                    <span>Drafts & Instant Autosave</span>
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    Work peacefully without fear of losing progress. Save drafts, add photos, and publish whenever ready.
                  </p>
                </div>
                <div className="pt-2 border-t border-indigo-500/20 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-indigo-300">Draft #31 · 4 photos attached</span>
                  <span className="text-xs font-semibold text-white bg-indigo-600 px-2.5 py-1 rounded-lg">
                    Ready to Ship
                  </span>
                </div>
              </motion.div>

              {/* Right Card: Gamified Streaks & Squads */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-amber-400">#streaks · #community</span>
                    <span className="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30 font-mono flex items-center gap-1">
                      <Flame className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                      <span>+2 pts/day</span>
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    Daily Streaks & Real Squads
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    Log in every day for +2 points, climb the badge leaderboard, and chat in creator channels.
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="text-[11px] font-mono text-amber-400">🔥 7-day streak · locked in</span>
                  <span className="text-[11px] font-mono text-slate-400">Group Channels</span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* 4 VALUE PILLARS (Symmetrical 4-Column Grid with Staggered Slide-Ins) */}
        <div className="pt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto text-left">
          {/* Card 1: Slide from Left */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-indigo-950/30 to-slate-900/50 p-5 space-y-2 shadow-sm hover:border-indigo-500/50 hover:bg-slate-900/70 transition-all"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 mb-2">
              <Code2 className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white tracking-tight">Showcase Your Passion</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Put your hardware, 3D prints, games, and code in front of makers who truly understand the craft.
            </p>
          </motion.div>

          {/* Card 2: Slide from Bottom */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-950/30 to-slate-900/50 p-5 space-y-2 shadow-sm hover:border-amber-500/50 hover:bg-slate-900/70 transition-all"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 mb-2">
              <Flame className="h-5 w-5 fill-amber-400/30" />
            </div>
            <h4 className="text-sm font-bold text-white tracking-tight">Lock In & Level Up</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Earn 2 points everyday you check in. Unlock lovable badges from 'just a baby' to 'locked in'.
            </p>
          </motion.div>

          {/* Card 3: Slide from Bottom */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-2xl border border-sky-500/20 bg-gradient-to-b from-sky-950/30 to-slate-900/50 p-5 space-y-2 shadow-sm hover:border-sky-500/50 hover:bg-slate-900/70 transition-all"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 mb-2">
              <Users className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white tracking-tight">Build Squads & Channels</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Create squad channels, add and remove people effortlessly, and collaborate in real-time.
            </p>
          </motion.div>

          {/* Card 4: Slide from Right */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-950/30 to-slate-900/50 p-5 space-y-2 shadow-sm hover:border-emerald-500/50 hover:bg-slate-900/70 transition-all"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-2">
              <Sparkles className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-white tracking-tight">Real Peer Reviews</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Exchange thoughtful feedback on actual build qualities to level up your maker skills and ship better.
            </p>
          </motion.div>
        </div>
      </section>

      {/* BILATERAL DEEP DIVE SECTION (Symmetrical 2-Column Feature Cards) */}
      <section className="relative z-10 border-t border-slate-800/80 bg-slate-950/60 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-mono uppercase text-indigo-400 tracking-wider">
              BUILT DIFFERENTLY
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">
              Engineered for Real Building
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Designed from the ground up to support long-term creative projects and genuine maker friendships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature Left: Studio, Drafts & Auto-Save */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-4 relative overflow-hidden"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
                <Boxes className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Project Studio with Auto-Save & Drafts
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Never lose your progress again. Forms automatically cache to localStorage every few seconds, and you can save complete project drafts to return and refine before publishing to the community.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <span className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-1 text-slate-300 font-mono text-[11px]">
                  ✓ Periodic autosave
                </span>
                <span className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-1 text-slate-300 font-mono text-[11px]">
                  ✓ Unlimited local drafts
                </span>
                <span className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-1 text-slate-300 font-mono text-[11px]">
                  ✓ Tag discovery
                </span>
              </div>
            </motion.div>

            {/* Feature Right: Squads & Real-time Collaboration */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-4 relative overflow-hidden"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-600/10 text-cyan-400 border border-cyan-500/20">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Squad Channels with Add / Remove Members
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect with creators you admire. Form project squads, invite creators by handle, add or remove members as your team evolves, and chat directly with progress photos and code snippets.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <span className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-1 text-slate-300 font-mono text-[11px]">
                  ✓ Creator squads
                </span>
                <span className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-1 text-slate-300 font-mono text-[11px]">
                  ✓ Direct messaging
                </span>
                <span className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-1 text-slate-300 font-mono text-[11px]">
                  ✓ Photo & file sharing
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* COMMUNITY SHOWCASE (Symmetrical 3-Card Grid) */}
      <section className="relative z-10 border-t border-slate-800/80 bg-slate-950/80 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
                COMMUNITY SHOWCASE
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">
                Real Things Built by Real People
              </h2>
            </div>
            <button
              onClick={() => onOpenGoogleLogin('login')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Log in to view all builds</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Symmetrical 3-Card Showcase Grid with Viewport Slide-In */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                onClick={() => onOpenGoogleLogin('login')}
                className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/60 p-4 transition-all hover:border-slate-700 hover:shadow-xl hover:shadow-indigo-500/5 flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-950 mb-3 border border-slate-800 relative">
                    {project.mediaUrls[0] ? (
                      <img
                        src={project.mediaUrls[0]}
                        alt={project.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-300"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-950/50 text-xs text-slate-300 font-medium p-4 text-center">
                        <Sparkles className="h-5 w-5 text-indigo-400 mb-1" />
                        <span>{project.qualities?.[0] || 'Working Prototype'}</span>
                      </div>
                    )}
                    {/* Qualities Overlay Tag */}
                    <div className="absolute top-2 left-2 z-10">
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-950/85 backdrop-blur-md px-2 py-0.5 text-[9px] font-semibold text-emerald-300 border border-emerald-500/40 shadow-sm">
                        <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />
                        <span>{project.qualities?.[0] || 'Working Prototype'}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-mono text-indigo-400 mb-1">
                    {project.tags.slice(0, 2).join(' · ')}
                  </div>
                  <h3 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-indigo-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {project.tagline}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-2.5 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 font-medium text-slate-300">
                    <img
                      src={project.author.avatarUrl}
                      alt={project.author.displayName}
                      referrerPolicy="no-referrer"
                      className="h-5 w-5 rounded-full object-cover ring-1 ring-slate-700"
                    />
                    <span>@{project.author.handle}</span>
                  </span>
                  <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{project.viewsCount || 0}</span>
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Symmetrical Animated Ribbon Ticker */}
      <div className="relative border-y border-slate-800/80 bg-slate-950/90 py-4 overflow-hidden">
        <div className="flex items-center justify-around gap-8 text-xs font-mono text-slate-400 tracking-wider">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>0 AI Slop Policy</span>
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-indigo-400" />
            <span>Hardware & Robotics</span>
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="flex items-center gap-1.5">
            <Flame className="h-3.5 w-3.5 text-amber-400" />
            <span>+2 Daily Streak Points</span>
          </span>
          <span className="hidden sm:inline">·</span>
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-cyan-400" />
            <span>Real Squad Channels</span>
          </span>
        </div>
      </div>

      {/* Symmetrical Centered Footer */}
      <footer className="border-t border-slate-900 py-10 text-center text-xs text-slate-500 font-mono space-y-2">
        <p className="font-semibold text-slate-400">locked in. — The Creative Network for Teen Builders</p>
        <p>Learn Something New · Follow Fellow Creators · Build the Future</p>
      </footer>
    </div>
  );
};
