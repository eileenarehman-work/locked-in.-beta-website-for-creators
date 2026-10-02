import React from 'react';
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
  Share2,
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
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background Gradients & Ambient Glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-indigo-600/20 via-indigo-950/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -left-48 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

      {/* Top Navigation */}
      <header className="relative z-20 mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onEnterApp}
            className="flex items-center gap-3 hover:opacity-90 transition-opacity cursor-pointer text-left"
            title="Return to Feed"
          >
            <Logo size="lg" />
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onEnterApp}
            className="rounded-xl border border-slate-700 bg-slate-900/80 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-1.5"
          >
            <Compass className="h-3.5 w-3.5 text-indigo-400" />
            <span>Feed</span>
          </button>
          <button
            onClick={() => onOpenGoogleLogin('login')}
            className="rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-all"
          >
            Log In
          </button>
          <button
            onClick={() => onOpenGoogleLogin('signup')}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pt-12 pb-20 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Creator Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-4 py-1.5 text-xs font-mono text-indigo-300 backdrop-blur-md shadow-inner"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>PROJECT SHOWCASE & CREATOR NETWORK</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl leading-tight"
        >
          WE DON’T JUST SCROLL. <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
            WE CREATE THE FUTURE.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto max-w-2xl text-base text-slate-300 sm:text-lg leading-relaxed"
        >
          The best website for creators of all ages to showcase their projects in hardware, robotics, 3D prints, games, art, music, and more.
          Publish your projects, follow fellow creators, and collaborate in real-time.
        </motion.p>

        {/* High-Converting CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          {/* Glowing Google OAuth Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onOpenGoogleLogin('signup')}
            className="group relative flex items-center justify-center gap-3 rounded-2xl bg-white px-7 py-3.5 text-sm font-bold text-slate-900 shadow-2xl shadow-indigo-500/30 transition-all hover:bg-slate-100"
          >
            {/* Google G logo */}
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

          {/* Quick Enter Sandbox */}
          <button
            onClick={onEnterApp}
            className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur-md hover:bg-slate-800 hover:text-white transition-all"
          >
            <span>Explore Live Builds & Chat</span>
            <ArrowRight className="h-4 w-4 text-indigo-400" />
          </button>
        </motion.div>

        {/* Value Proposition Pills */}
        <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4">
            <ShieldCheck className="h-5 w-5 text-emerald-400 mb-2" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Zero Synthetic Bots</h4>
            <p className="text-[11px] text-slate-400 mt-1">100% human creators. Even if starting with 1 user, zero fake filler profiles.</p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4">
            <Users className="h-5 w-5 text-indigo-400 mb-2" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Real Social Hub</h4>
            <p className="text-[11px] text-slate-400 mt-1">DMs, friend requests, group chat channels, and drag-and-drop S3 media uploads.</p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4">
            <CheckCircle2 className="h-5 w-5 text-cyan-400 mb-2" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">4-Part Rubrics</h4>
            <p className="text-[11px] text-slate-400 mt-1">Clarity, Execution, Technicality, and Documentation peer reviews.</p>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4">
            <Sparkles className="h-5 w-5 text-amber-400 mb-2" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Gemini Copilots</h4>
            <p className="text-[11px] text-slate-400 mt-1">Strictly internal AI assistants for README drafting and review quality pre-screening.</p>
          </div>
        </div>
      </section>

      {/* Featured Projects Teaser */}
      <section className="relative z-10 border-t border-slate-800/80 bg-slate-950/70 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono text-indigo-400">COMMUNITY SHOWCASE</span>
              <h2 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">
                Real Things Built by Real People
              </h2>
            </div>
            <button
              onClick={onEnterApp}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>Explore all builds</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.slice(0, 3).map((project) => (
                <div
                  key={project.id}
                  onClick={onEnterApp}
                  className="group cursor-pointer rounded-2xl border border-slate-800 bg-slate-900/50 p-4 transition-all hover:border-slate-700 hover:shadow-xl hover:shadow-indigo-500/5"
                >
                  <div className="aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-950 mb-3 border border-slate-800 relative">
                    {project.mediaUrls[0] ? (
                      <img
                        src={project.mediaUrls[0]}
                        alt={project.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-950/50 text-xs text-slate-300 font-medium p-4 text-center">
                        <Sparkles className="h-5 w-5 text-indigo-400 mb-1" />
                        <span>{project.qualities?.[0] || 'Verified Proof-of-Work'}</span>
                      </div>
                    )}
                    {/* Actual Qualities Overlay Tag */}
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
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                    {project.tagline}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-2.5 text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-medium text-slate-300">
                      <span>@{project.author.handle}</span>
                      {project.author.reputationScore >= 50 && (
                        <span className="text-sky-400 font-bold">✓</span>
                      )}
                    </span>
                    <span className="text-emerald-400 font-mono flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      Verified Human
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 p-10 text-center space-y-4">
              <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">The Stage is Ready for You</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Sign up with Google or your email to publish your very first project in art, 3D printing, game dev, robotics, code, and more!
              </p>
              <button
                onClick={() => onOpenGoogleLogin('signup')}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30"
              >
                <span>Sign Up & Share Your Build </span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-600 font-mono">
        <p>locked in. — The Best Community for Creators.</p>
        <p className="mt-1">Learn Something New · Follow Fellow Creators · Express Yourself </p>
      </footer>
    </div>
  );
};
