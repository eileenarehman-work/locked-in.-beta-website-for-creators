import React from 'react';
import { motion } from 'motion/react';
import { Project } from '../types';
import {
  Sparkles,
  ArrowRight,
  Flame,
  MessageSquare,
  CheckCircle2,
  Code2,
} from 'lucide-react';
import { Logo } from './Logo';

interface IntroLandingProps {
  onEnterApp: () => void;
  onOpenGoogleLogin: (mode?: 'login' | 'signup') => void;
  featuredProjects: Project[];
}

export const IntroLanding: React.FC<IntroLandingProps> = ({
  onOpenGoogleLogin,
  featuredProjects,
}) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Symmetrical Background Gradients & Ambient Glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-indigo-600/20 via-indigo-950/10 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -left-48 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-48 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

      {/* Top Navigation */}
      <header className="relative z-20 mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Logo size="lg" />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onOpenGoogleLogin('login')}
            className="rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
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

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 pt-16 pb-20 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Symmetrical Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl leading-tight"
        >
          WE DON’T JUST SCROLL. <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
            WE CREATE THE FUTURE.
          </span>
        </motion.h1>

        {/* Symmetrical Centered Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto max-w-2xl text-base text-slate-300 sm:text-lg leading-relaxed text-center"
        >
          The best website for creators of all ages to showcase their projects in hardware, robotics, 3D prints, games, art, music, and more.
          Publish your projects, follow fellow creators, and collaborate in real-time.
        </motion.p>

        {/* Symmetrical Balanced CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md sm:max-w-xl mx-auto"
        >
          {/* Glowing Google OAuth Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onOpenGoogleLogin('signup')}
            className="group relative flex w-full sm:w-auto items-center justify-center gap-3 rounded-2xl bg-white px-7 py-3.5 text-sm font-bold text-slate-900 shadow-xl shadow-indigo-500/20 transition-all hover:bg-slate-100 cursor-pointer"
          >
            {/* Google G logo */}
            <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
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
            <span>Sign Up with Google</span>
            <div className="absolute inset-0 -z-10 rounded-2xl bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>

          {/* Log In to Explore CTA */}
          <button
            onClick={() => onOpenGoogleLogin('login')}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/90 px-7 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur-md hover:bg-slate-800 hover:text-white transition-all cursor-pointer"
          >
            <span>Explore Community</span>
            <ArrowRight className="h-4 w-4 text-indigo-400" />
          </button>
        </motion.div>

        {/* Symmetrical 4-Card Value Grid */}
        <div className="pt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto text-left">
          <div className="h-full flex flex-col justify-between rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-indigo-950/30 to-slate-900/40 p-4 space-y-3 shadow-sm hover:border-indigo-500/40 transition-colors">
            <div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 mb-2">
                <Code2 className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-white tracking-tight">Showcase Your Passion</h4>
              <p className="text-xs text-slate-400 leading-relaxed mt-1.5">
                Put your hardware, 3D prints, games, and code in front of makers who truly understand the craft.
              </p>
            </div>
          </div>

          <div className="h-full flex flex-col justify-between rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-950/30 to-slate-900/40 p-4 space-y-3 shadow-sm hover:border-amber-500/40 transition-colors">
            <div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 mb-2">
                <Flame className="h-5 w-5 fill-amber-400/30" />
              </div>
              <h4 className="text-sm font-bold text-white tracking-tight">Lock In & Level Up</h4>
              <p className="text-xs text-slate-400 leading-relaxed mt-1.5">
                Earn +2 streak points every day, unlock lovable creator badges from 'Friendly Star' to 'locked in', and climb the ranks.
              </p>
            </div>
          </div>

          <div className="h-full flex flex-col justify-between rounded-2xl border border-sky-500/20 bg-gradient-to-b from-sky-950/30 to-slate-900/40 p-4 space-y-3 shadow-sm hover:border-sky-500/40 transition-colors">
            <div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 mb-2">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-white tracking-tight">Build Squads & Chat</h4>
              <p className="text-xs text-slate-400 leading-relaxed mt-1.5">
                Direct message creators, share progress photos, hang out in channels, and collaborate on big ideas.
              </p>
            </div>
          </div>

          <div className="h-full flex flex-col justify-between rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-emerald-950/30 to-slate-900/40 p-4 space-y-3 shadow-sm hover:border-emerald-500/40 transition-colors">
            <div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-2">
                <Sparkles className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-white tracking-tight">Real Peer Feedback</h4>
              <p className="text-xs text-slate-400 leading-relaxed mt-1.5">
                Receive thoughtful, high-signal peer reviews on your builds so you can sharpen your skills and ship better.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Symmetrical Featured Projects Showcase */}
      <section className="relative z-10 border-t border-slate-800/80 bg-slate-950/70 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Centered Showcase Section Header */}
          <div className="mx-auto max-w-2xl text-center mb-10">
            <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">
              COMMUNITY SHOWCASE
            </span>
            <h2 className="mt-1 text-2xl font-bold text-white tracking-tight sm:text-3xl">
              Real Things Built by Real People
            </h2>
            <p className="mt-2 text-xs text-slate-400 max-w-md mx-auto">
              Hardware, robotics, 3D prints, games, art, and code crafted by passionate makers.
            </p>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {featuredProjects.slice(0, 3).map((project) => (
                <div
                  key={project.id}
                  onClick={() => onOpenGoogleLogin('login')}
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
                    <span className="text-slate-400 font-mono text-[11px]">
                      {project.viewsCount || 0} views
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-900/30 p-10 text-center space-y-4 max-w-lg mx-auto">
              <div className="mx-auto h-12 w-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white">The Stage is Ready for You</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Sign up with Google or your email to publish your very first project in art, 3D printing, game dev, robotics, code, and more!
              </p>
              <button
                onClick={() => onOpenGoogleLogin('signup')}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                <span>Sign Up & Share Your Build</span>
              </button>
            </div>
          )}

          {/* Centered Symmetrical Showcase Footer Button */}
          <div className="mt-10 text-center">
            <button
              onClick={() => onOpenGoogleLogin('login')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
            >
              <span>Explore all community builds</span>
              <ArrowRight className="h-3.5 w-3.5 text-indigo-400" />
            </button>
          </div>
        </div>
      </section>

      {/* Symmetrical Footer */}
      <footer className="border-t border-slate-900 py-10 text-center text-xs text-slate-500 font-mono space-y-1.5">
        <p className="font-semibold text-slate-400">locked in. — The Best Community for Creators</p>
        <p className="text-[11px] text-slate-600">
          Learn Something New · Follow Fellow Creators · Express Yourself
        </p>
      </footer>
    </div>
  );
};
