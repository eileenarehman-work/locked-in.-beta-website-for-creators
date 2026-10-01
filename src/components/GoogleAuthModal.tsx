import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { storage } from '../mock/initialData';
import {
  ShieldCheck,
  Upload,
  X,
  Sparkles,
  Camera,
  AtSign,
  Check,
  ArrowRight,
  Mail,
  Lock,
  Calendar,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GoogleAuthModalProps {
  initialMode?: 'login' | 'signup';
  onSuccess: (user: User) => void;
  onClose: () => void;
  existingUser?: User | null;
}

const AVATAR_PRESETS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=Rocket',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Circuit',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Gamer',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Artist',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=Spark',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=Neon',
];

const TEEN_SPACES = [
  '#art',
  '#3dprinting',
  '#robotics',
  '#gamedev',
  '#coding',
  '#music',
  '#makers',
  '#electronics',
  '#webdev',
];

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  initialMode = 'login',
  onSuccess,
  onClose,
  existingUser,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(initialMode);
  const [authError, setAuthError] = useState<string | null>(null);

  // Login state: Just email needed (empty by default, placeholder xxx@gmail.com)
  const [loginEmail, setLoginEmail] = useState('');

  // Sign up state: Full onboarding with age, handle, avatar, bio & tags
  const [signupEmail, setSignupEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [handle, setHandle] = useState('');
  const [age, setAge] = useState<number>(16);
  const [bio, setBio] = useState('Teen builder & creator. Building 3D prints, game modding & robotics.');
  const [avatarUrl, setAvatarUrl] = useState(AVATAR_PRESETS[0]);
  const [selectedTags, setSelectedTags] = useState<string[]>(['#3dprinting', '#robotics', '#coding']);
  const [tagInput, setTagInput] = useState('');
  const [captchaPassed, setCaptchaPassed] = useState(false);
  const [isVerifyingCaptcha, setIsVerifyingCaptcha] = useState(false);

  // Handle avatar upload via FileReader
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setAvatarUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddCustomTag = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && 'key' in e && e.key !== 'Enter' && e.key !== ',') return;
    if (e && 'preventDefault' in e) e.preventDefault();
    const clean = tagInput.trim().replace(/^#+/, '').replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
    if (clean) {
      const formatted = `#${clean}`;
      if (!selectedTags.includes(formatted)) {
        setSelectedTags([...selectedTags, formatted]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tagToRemove));
  };

  const handleTriggerCaptcha = () => {
    setIsVerifyingCaptcha(true);
    setTimeout(() => {
      setIsVerifyingCaptcha(false);
      setCaptchaPassed(true);
    }, 600);
  };

  // 1. SIMPLE LOGIN: Strictly 1 account per email
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const cleanLoginEmail = loginEmail.trim().toLowerCase();
    if (!cleanLoginEmail) return;

    // Check if an account exists for this email
    const registeredUser = storage.getUserByEmail(cleanLoginEmail);
    if (registeredUser) {
      storage.registerUser(registeredUser);
      onSuccess(registeredUser);
      return;
    }

    // Check currently active user in storage if matching
    const currentActiveUser = storage.getUser();
    if (currentActiveUser && currentActiveUser.email.toLowerCase() === cleanLoginEmail) {
      storage.registerUser(currentActiveUser);
      onSuccess(currentActiveUser);
      return;
    }

    // No account found: inform the user to sign up
    setAuthError(
      `No account found for "${loginEmail.trim()}". Accounts are restricted to 1 per email. Please sign up to create your account.`
    );
  };

  // 2. SIGN UP: Strictly 1 account per email enforcement
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const cleanSignupEmail = signupEmail.trim().toLowerCase();
    if (!cleanSignupEmail || !displayName.trim() || !handle.trim()) return;

    // Strict 1 account per email check:
    if (storage.isEmailRegistered(cleanSignupEmail)) {
      setAuthError(
        `An account is already registered with "${signupEmail.trim()}". Accounts are strictly restricted to 1 per email. Please log in instead.`
      );
      return;
    }

    // Also verify handle uniqueness across accounts
    const cleanHandle = handle.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
    const allExisting = storage.getAllUsers();
    if (allExisting.some((u) => u.handle.toLowerCase() === cleanHandle)) {
      setAuthError(`The handle @${cleanHandle} is already taken by another creator. Please pick a different handle.`);
      return;
    }

    if (!captchaPassed) {
      setAuthError('Please complete the human verification check before signing up.');
      return;
    }

    if (!age || age < 13) {
      setAuthError('You must be at least 13 years old to join locked in.');
      return;
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      email: cleanSignupEmail,
      googleId: `g_auth_${Math.random().toString(36).substring(2, 9)}`,
      age: Math.max(13, age),
      handle: cleanHandle,
      displayName: displayName.trim(),
      avatarUrl,
      bio: bio.trim(),
      reputationScore: 25,
      trustTier: 'VERIFIED_HUMAN',
      interestTags: selectedTags.length ? selectedTags : ['#makers'],
      createdAt: new Date().toISOString(),
    };

    // Save account globally so other creators can find and communicate with them
    storage.registerUser(newUser);

    onSuccess(newUser);
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto cursor-pointer animate-in fade-in duration-150"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="my-8 w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-7 shadow-2xl relative overflow-hidden cursor-default"
      >
        <button
          onClick={onClose}
          title="Close (Esc)"
          aria-label="Close (Esc)"
          className="absolute top-5 right-5 flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition-all shadow-sm z-10"
        >
          <X className="h-4 w-4" />
          <span className="text-[10px] font-mono text-slate-400">Esc</span>
        </button>

        {/* Auth Mode Tabs: Log In vs Sign Up */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800/80 mb-6 max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              authMode === 'login'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setAuthError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              authMode === 'signup'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* 1 Account Per Email Policy Notice */}
        <div className="mb-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 bg-slate-950/60 border border-slate-800/80 rounded-xl py-1.5 px-3">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Account Rule: Exactly <strong>one account per email address</strong></span>
        </div>

        {/* Error Alert Banner */}
        {authError && (
          <div className="mb-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300 flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="h-4 w-4 text-rose-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-rose-200 leading-snug">{authError}</p>
              {authMode === 'signup' && storage.isEmailRegistered(signupEmail) && (
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail(signupEmail);
                    setAuthMode('login');
                    setAuthError(null);
                  }}
                  className="mt-2 inline-flex items-center gap-1 rounded-lg bg-indigo-600/80 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-indigo-500 transition-colors"
                >
                  <span>Switch to Log In with this email</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              )}
              {authMode === 'login' && !storage.isEmailRegistered(loginEmail) && (
                <button
                  type="button"
                  onClick={() => {
                    setSignupEmail(loginEmail);
                    setAuthMode('signup');
                    setAuthError(null);
                  }}
                  className="mt-2 inline-flex items-center gap-1 rounded-lg bg-indigo-600/80 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-indigo-500 transition-colors"
                >
                  <span>Switch to Sign Up with this email</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>
            <button
              onClick={() => setAuthError(null)}
              className="text-rose-400 hover:text-white transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* 1. LOGIN MODE: Just email needed */}
        {authMode === 'login' && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-md">
                <svg className="h-6 w-6" viewBox="0 0 24 24">
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
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Log In to locked in.</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Returning creator? Just enter your email to log straight into your account.
              </p>
            </div>

            {/* Simple Email Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                  Your Google / Creator Email
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="xxx@gmail.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all active:scale-[0.98]"
              >
                <span>Continue / Log In</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className="text-xs text-slate-400 hover:text-indigo-300 transition-colors"
              >
                Don't have an account yet? <strong className="text-indigo-400">Sign Up</strong>
              </button>
            </div>
          </div>
        )}

        {/* 2. SIGN UP MODE: Full Onboarding with Age Verification & Avatar */}
        {authMode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-4.5">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white tracking-tight">
                Create Your Teen Creator Account
              </h3>
              <p className="text-xs text-slate-400">
                Age verification & profile setup for teen safety compliance.
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1">
                Google / Account Email <span className="text-rose-400">*</span>
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="e.g. xxx@gmail.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Age Verification (Mandatory for teens) */}
            <div className="rounded-2xl border border-indigo-900/60 bg-indigo-950/20 p-3.5 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase text-indigo-300 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                  Age Verification (13+ Required) <span className="text-rose-400">*</span>
                </label>
                <span className="text-[10px] font-mono text-emerald-400">Teen Safety Verified</span>
              </div>
              <input
                type="number"
                min="13"
                max="19"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 16)}
                required
                placeholder="Age (13-19)"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white font-mono focus:border-indigo-500 focus:outline-none"
              />
              <p className="text-[10px] text-slate-400">
                locked in. is built specifically for preteens and teens (13+).
              </p>
            </div>

            {/* Display Name & Handle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Display Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  placeholder="e.g. Alex Chen"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Unique @Handle <span className="text-rose-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs text-slate-500 font-mono">@</span>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    required
                    placeholder="alex_builds"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-7 pr-3 py-2 text-xs text-white font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Custom Avatar Upload */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                Profile Avatar (Upload image file or choose preset)
              </label>
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shrink-0">
                  <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                </div>
                <label className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:text-white cursor-pointer transition-colors">
                  <Upload className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Upload File</span>
                  <input type="file" accept="image/*" onChange={handleAvatarFileUpload} className="hidden" />
                </label>
                <div className="flex items-center gap-1">
                  {AVATAR_PRESETS.slice(0, 4).map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(p)}
                      className={`h-6 w-6 rounded-md overflow-hidden border ${
                        avatarUrl === p ? 'border-indigo-500 ring-2 ring-indigo-500/50' : 'border-slate-800 opacity-60'
                      }`}
                    >
                      <img src={p} alt="preset" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Short Creator Bio
              </label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g. 3D printing props, Unity games, building robot combat chassis"
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Custom Hashtags (YouTube / Instagram style) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-slate-400">
                Custom Creator Hashtags
              </label>
              <div className="flex flex-wrap gap-1.5 min-h-[30px] p-2 rounded-xl border border-slate-800 bg-slate-950">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-indigo-600/20 border border-indigo-500/40 px-2 py-0.5 text-xs font-mono text-indigo-300 flex items-center gap-1.5"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-indigo-400 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddCustomTag}
                  placeholder="e.g. #robotics, #3dprinting, #gamejam, #art"
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCustomTag}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700"
                >
                  + Add
                </button>
              </div>
            </div>

            {/* Human Verification Checkbox */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleTriggerCaptcha}
                  disabled={captchaPassed || isVerifyingCaptcha}
                  className={`h-5 w-5 rounded border flex items-center justify-center transition-all ${
                    captchaPassed
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-600 bg-slate-800 hover:border-indigo-500'
                  }`}
                >
                  {captchaPassed && <CheckCircle className="h-3.5 w-3.5" />}
                </button>
                <span className="text-xs text-slate-300">
                  {captchaPassed
                    ? 'Human verification confirmed'
                    : isVerifyingCaptcha
                    ? 'Verifying token...'
                    : 'I am a creator and agree to Community Guidelines'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Security Check</span>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-xs text-slate-400 hover:text-white"
              >
                Already have an account? Log In
              </button>

              <button
                type="submit"
                disabled={!captchaPassed}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all disabled:opacity-40"
              >
                <Check className="h-4 w-4" />
                <span>Create Verified Account</span>
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
