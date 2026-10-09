import React from 'react';
import { motion } from 'motion/react';
import { Project } from '../types';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Globe2,
} from 'lucide-react';
import { Logo } from './Logo';
import { MediaDisplay } from './MediaDisplay';

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
    <div className="relative min-h-screen overflow-hidden bg-[#faf7f2] text-slate-800 selection:bg-sky-200 selection:text-sky-900">
      {/* Symmetrical Bubbly Pastel Ambient Glows (Sky Blue, Mint Green, Peach & Butter Yellow) */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[650px] w-[950px] -translate-x-1/2 rounded-full bg-gradient-to-b from-sky-200/50 via-emerald-200/35 to-transparent blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -left-48 h-[450px] w-[450px] rounded-full bg-amber-200/40 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-48 h-[450px] w-[450px] rounded-full bg-rose-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 h-80 w-[700px] rounded-full bg-emerald-200/35 blur-3xl" />

      {/* Top Navigation */}
      <header className="relative z-20 mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Logo size="lg" />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onOpenGoogleLogin('login')}
            className="rounded-full border-2 border-slate-300 bg-white/90 px-5 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 hover:border-sky-300 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            Log In
          </button>
          <button
            onClick={() => onOpenGoogleLogin('signup')}
            className="rounded-full bg-gradient-to-r from-sky-400 via-emerald-300 to-amber-200 px-5 py-2 text-xs font-black text-slate-900 shadow-md shadow-sky-300/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            Join the Community
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 pt-14 pb-20 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Bubbly Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-auto max-w-4xl text-4xl font-black tracking-tight text-slate-900 sm:text-6xl lg:text-7xl leading-tight"
        >
          JOIN THE FIGHT FOR INNOVATION. <br />
          <span className="bg-gradient-to-r from-sky-600 via-emerald-500 to-amber-500 bg-clip-text text-transparent">
            WE ARE NOT THEIR PAWNS.
          </span>
        </motion.h1>

        {/* Informally Friendly Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg leading-relaxed text-center font-medium"
        >
          The friendliest website for creators of all ages to share their projects in 3D prints, games, robotics, code, and art.
          Connect with builders all over the world, chat directly, and make cool things together!
        </motion.p>

        {/* Bubbly Pastel CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md sm:max-w-xl mx-auto"
        >
          {/* Glowing Google OAuth Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onOpenGoogleLogin('signup')}
            className="group relative flex w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-white border-2 border-slate-200 px-8 py-4 text-sm font-black text-slate-800 shadow-lg shadow-sky-200/50 hover:border-sky-300 hover:bg-slate-50 transition-all cursor-pointer"
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
            <div className="absolute inset-0 -z-10 rounded-full bg-sky-200/40 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>

          {/* View Feed CTA */}
          <button
            onClick={() => onOpenGoogleLogin('login')}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border-2 border-slate-300 bg-white/80 px-8 py-4 text-sm font-bold text-slate-700 backdrop-blur-md hover:bg-white hover:border-emerald-300 hover:text-slate-900 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <span>View the Feed</span>
            <ArrowRight className="h-4 w-4 text-sky-600" />
          </button>
        </motion.div>

        {/* Symmetrical 4-Card Value Grid featuring the 4 Official Mascots */}
        <div className="pt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto text-left">
          {/* Card 1: Curious Star (Yellow Mascot) */}
          <div className="h-full flex flex-col justify-between rounded-3xl border-2 border-amber-200 bg-gradient-to-b from-amber-50/90 via-white to-amber-50/50 p-5 space-y-3.5 shadow-sm hover:border-amber-300 hover:-translate-y-1 transition-all group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 border border-amber-300 group-hover:scale-110 transition-transform">
                  <svg viewBox="0 0 100 100" className="h-8 w-8 drop-shadow-xs">
                    <ellipse cx="50" cy="50" rx="46" ry="45" fill="#ffea78" stroke="#1e293b" strokeWidth="6"/>
                    <circle cx="31" cy="38" r="4.5" fill="#2aa6cb"/>
                    <circle cx="69" cy="38" r="4.5" fill="#2aa6cb"/>
                    <ellipse cx="50" cy="61" rx="14" ry="10" fill="#ebe3dc" stroke="#1e293b" strokeWidth="5"/>
                  </svg>
                </div>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-300">
                  Curious Star
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 tracking-tight">Show Off Your Builds</h4>
              <p className="text-xs text-slate-600 leading-relaxed mt-1.5 font-normal">
                Got a 3D print, game, robot, art piece, or code project? Put it on stage where fellow makers actually appreciate it!
              </p>
            </div>
          </div>

          {/* Card 2: Cozy Champ (Peach Mascot) */}
          <div className="h-full flex flex-col justify-between rounded-3xl border-2 border-orange-200 bg-gradient-to-b from-orange-50/90 via-white to-orange-50/50 p-5 space-y-3.5 shadow-sm hover:border-orange-300 hover:-translate-y-1 transition-all group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 border border-orange-300 group-hover:scale-110 transition-transform">
                  <svg viewBox="0 0 100 100" className="h-8 w-8 drop-shadow-xs">
                    <ellipse cx="50" cy="50" rx="48" ry="45" fill="#ffcb95" stroke="#1e293b" strokeWidth="6"/>
                    <path d="M 25 40 Q 35 36 44 40" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" fill="none"/>
                    <path d="M 57 40 Q 66 36 76 40" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" fill="none"/>
                    <path d="M 15 53 Q 23 46 25 55 Q 50 70 75 55 Q 77 46 85 53" stroke="#1e293b" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </div>
                <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[10px] font-bold text-orange-800 border border-orange-300">
                  Cozy Champ
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 tracking-tight">Lock In & Level Up</h4>
              <p className="text-xs text-slate-600 leading-relaxed mt-1.5 font-normal">
                Earn +2 streak points every single day you show up. Unlock cute badges from 'Friendly Star' to 'locked in'!
              </p>
            </div>
          </div>

          {/* Card 3: Chat Buddy (Coral Mascot) */}
          <div className="h-full flex flex-col justify-between rounded-3xl border-2 border-rose-200 bg-gradient-to-b from-rose-50/90 via-white to-rose-50/50 p-5 space-y-3.5 shadow-sm hover:border-rose-300 hover:-translate-y-1 transition-all group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 border border-rose-300 group-hover:scale-110 transition-transform">
                  <svg viewBox="0 0 100 100" className="h-8 w-8 drop-shadow-xs">
                    <ellipse cx="50" cy="50" rx="47" ry="46" fill="#ffadad" stroke="#1e293b" strokeWidth="6"/>
                    <path d="M 24 28 Q 32 30 37 29" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" fill="none"/>
                    <path d="M 60 23 Q 70 20 79 24" stroke="#1e293b" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
                    <circle cx="33" cy="38" r="4.5" fill="#1e293b"/>
                    <circle cx="70" cy="38" r="4.5" fill="#1e293b"/>
                    <path d="M 35 58 L 65 58 L 52 80 Z" fill="#ffffff" stroke="#1e293b" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold text-rose-800 border border-rose-300">
                  Chat Buddy
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 tracking-tight">Hang Out & Group Chat</h4>
              <p className="text-xs text-slate-600 leading-relaxed mt-1.5 font-normal">
                Direct message creators, join group channels, share progress photos, and collaborate on new projects!
              </p>
            </div>
          </div>

          {/* Card 4: Kind Helper (Mint Mascot) */}
          <div className="h-full flex flex-col justify-between rounded-3xl border-2 border-emerald-200 bg-gradient-to-b from-emerald-50/90 via-white to-emerald-50/50 p-5 space-y-3.5 shadow-sm hover:border-emerald-300 hover:-translate-y-1 transition-all group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 border border-emerald-300 group-hover:scale-110 transition-transform">
                  <svg viewBox="0 0 100 100" className="h-8 w-8 drop-shadow-xs">
                    <ellipse cx="50" cy="50" rx="47" ry="46" fill="#ede0d7" stroke="#1e293b" strokeWidth="6"/>
                    <circle cx="31" cy="38" r="5" fill="#22c55e"/>
                    <circle cx="69" cy="38" r="4.5" fill="#1e293b"/>
                    <path d="M 34 58 Q 50 76 66 58" stroke="#1e293b" strokeWidth="5.5" strokeLinecap="round" fill="none"/>
                  </svg>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-300">
                  Kind Helper
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 tracking-tight">Friendly Peer Feedback</h4>
              <p className="text-xs text-slate-600 leading-relaxed mt-1.5 font-normal">
                Thoughtful, positive reviews from fellow builders who cheer you on and help you sharpen your craft with zero toxic vibes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Symmetrical Featured Projects Showcase */}
      <section className="relative z-10 border-t-2 border-slate-200/80 bg-white/70 py-16 backdrop-blur-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Centered Showcase Section Header */}
          <div className="mx-auto max-w-2xl text-center mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-sky-200 bg-sky-50 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-sky-800">
              <Globe2 className="h-3 w-3 text-emerald-600" />
              Community Showcase
            </span>
            <h2 className="mt-2 text-2xl font-black text-slate-900 tracking-tight sm:text-3xl">
              Real Things Built by Real Friends Worldwide
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-md mx-auto font-medium">
              Hardware, robotics, 3D prints, games, art, and code crafted by passionate makers around the globe.
            </p>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {featuredProjects.slice(0, 3).map((project) => (
                <div
                  key={project.id}
                  onClick={() => onOpenGoogleLogin('login')}
                  className="group cursor-pointer rounded-3xl border-2 border-slate-100 bg-white p-4 transition-all hover:border-sky-300 hover:shadow-xl hover:shadow-sky-100 hover:-translate-y-1 flex flex-col justify-between shadow-xs"
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
                          <span>{project.qualities?.[0] || 'Working Prototype'}</span>
                        </div>
                      )}
                      {/* Qualities Overlay Tag */}
                      <div className="absolute top-2.5 left-2.5 z-10">
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-300 shadow-xs">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          <span>{project.qualities?.[0] || 'Working Prototype'}</span>
                        </span>
                      </div>
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
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <span>@{project.author.handle}</span>
                      {project.author.reputationScore >= 50 && (
                        <span className="text-sky-600 font-bold">✓</span>
                      )}
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
              <div className="mx-auto h-12 w-12 rounded-2xl bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-600">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">The Stage is Ready for You</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Sign up with Google or your email to publish your very first project in art, 3D printing, game dev, robotics, code, and more!
              </p>
              <button
                onClick={() => onOpenGoogleLogin('signup')}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-400 via-emerald-300 to-amber-200 px-6 py-2.5 text-xs font-black text-slate-950 hover:scale-105 active:scale-95 transition-all shadow-md shadow-sky-300/40 cursor-pointer"
              >
                <span>Join & Share Your Build</span>
              </button>
            </div>
          )}

          {/* Centered Bubbly Showcase Footer Button */}
          <div className="mt-10 text-center">
            <button
              onClick={() => onOpenGoogleLogin('login')}
              className="inline-flex items-center gap-2 rounded-full border-2 border-slate-300 bg-white px-7 py-3 text-xs font-bold text-slate-700 hover:text-slate-900 hover:border-sky-300 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <span>View all community builds</span>
              <ArrowRight className="h-3.5 w-3.5 text-sky-600" />
            </button>
          </div>
        </div>
      </section>

      {/* Symmetrical Bubbly Footer */}
      <footer className="border-t-2 border-slate-200/80 py-10 text-center text-xs text-slate-500 font-mono space-y-2 bg-[#faf7f2]">
        <div className="flex items-center justify-center gap-2 text-slate-700 font-bold">
          <span className="text-slate-900">locked in.</span>
          <span>·</span>
          <span>Made with ❤️ for young creators worldwide</span>
        </div>
        <p className="text-[11px] text-slate-500">
          Learn Something New · Follow Fellow Builders · Express Yourself
        </p>
      </footer>
    </div>
  );
};
