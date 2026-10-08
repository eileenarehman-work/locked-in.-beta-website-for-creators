import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User } from '../types';
import { Logo } from './Logo';
import {
  X,
  Mail,
  ShieldCheck,
  Calendar,
  Upload,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  AtSign,
  Check,
} from 'lucide-react';
import { storage } from '../mock/initialData';

interface GoogleAuthModalProps {
  initialMode?: 'login' | 'signup';
  onSuccess: (user: User) => void;
  onClose: () => void;
  existingUser?: User | null;
}

// Official Hand-Drawn Mascot Avatars from Logo
const AVATAR_PRESETS = [
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="46" ry="45" fill="%23ffea78" stroke="%231e293b" stroke-width="6"/><circle cx="31" cy="38" r="4.5" fill="%232aa6cb"/><circle cx="69" cy="38" r="4.5" fill="%232aa6cb"/><ellipse cx="50" cy="61" rx="14" ry="10" fill="%23ebe3dc" stroke="%231e293b" stroke-width="5"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="47" ry="46" fill="%23ffadad" stroke="%231e293b" stroke-width="6"/><path d="M 24 28 Q 32 30 37 29" stroke="%231e293b" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M 60 23 Q 70 20 79 24" stroke="%231e293b" stroke-width="5.5" stroke-linecap="round" fill="none"/><circle cx="33" cy="38" r="4.5" fill="%231e293b"/><circle cx="70" cy="38" r="4.5" fill="%231e293b"/><path d="M 35 58 L 65 58 L 52 80 Z" fill="%23ffffff" stroke="%231e293b" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="48" ry="45" fill="%23ffcb95" stroke="%231e293b" stroke-width="6"/><path d="M 25 40 Q 35 36 44 40" stroke="%231e293b" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M 57 40 Q 66 36 76 40" stroke="%231e293b" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M 15 53 Q 23 46 25 55 Q 50 70 75 55 Q 77 46 85 53" stroke="%231e293b" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><ellipse cx="50" cy="50" rx="47" ry="46" fill="%23ede0d7" stroke="%231e293b" stroke-width="6"/><circle cx="31" cy="38" r="5" fill="%2322c55e"/><circle cx="69" cy="38" r="4.5" fill="%231e293b"/><path d="M 34 58 Q 50 76 66 58" stroke="%231e293b" stroke-width="5.5" stroke-linecap="round" fill="none"/></svg>',
];

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  initialMode = 'signup',
  onSuccess,
  onClose,
  existingUser,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(initialMode);
  const [authError, setAuthError] = useState<string | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');

  // Sign up form state
  const [signupEmail, setSignupEmail] = useState(existingUser?.email || '');
  const [displayName, setDisplayName] = useState(existingUser?.displayName || '');
  const [handle, setHandle] = useState(existingUser?.handle || '');
  const [age, setAge] = useState<number>(16);
  const [bio, setBio] = useState(existingUser?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(existingUser?.avatarUrl || AVATAR_PRESETS[0]);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    existingUser?.interestTags && existingUser.interestTags.length > 0
      ? existingUser.interestTags
      : ['#robotics', '#3dprinting', '#gamedev']
  );
  const [tagInput, setTagInput] = useState('');

  // Human verification simulation state
  const [captchaPassed, setCaptchaPassed] = useState(false);
  const [isVerifyingCaptcha, setIsVerifyingCaptcha] = useState(false);

  const handleAddCustomTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter' && e.key !== ',') return;
    if ('preventDefault' in e) e.preventDefault();

    let clean = tagInput.trim();
    if (!clean) return;
    if (!clean.startsWith('#')) clean = `#${clean}`;
    clean = clean.toLowerCase();

    if (!selectedTags.includes(clean)) {
      setSelectedTags([...selectedTags, clean]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tagToRemove));
  };

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTriggerCaptcha = () => {
    setIsVerifyingCaptcha(true);
    setTimeout(() => {
      setIsVerifyingCaptcha(false);
      setCaptchaPassed(true);
    }, 600);
  };

  // 1. Log In Submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const term = loginEmail.trim().toLowerCase();
    if (!term) {
      setAuthError('Please enter your email or handle.');
      return;
    }

    const cleanHandle = term.startsWith('@') ? term.substring(1) : term;
    const users = storage.getAllUsers();
    const found = users.find(
      (u) =>
        (u.email || '').toLowerCase() === term ||
        (u.handle || '').toLowerCase() === cleanHandle ||
        (u.handle || '').toLowerCase() === term
    );

    if (found) {
      storage.setUser(found);
      onSuccess(found);
    } else {
      setAuthError(`No account found with '${term}'. Sign up below to create a new account!`);
    }
  };

  // 2. Sign Up Submission
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const cleanEmail = signupEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setAuthError('Email address is required.');
      return;
    }

    const users = storage.getAllUsers();
    if (users.some((u) => (u.email || '').toLowerCase() === cleanEmail)) {
      setAuthError(
        'An account already exists for this email! Only 1 account per email is allowed. Please switch to Log In.'
      );
      return;
    }

    let cleanHandle = handle.trim().toLowerCase();
    if (cleanHandle.startsWith('@')) cleanHandle = cleanHandle.substring(1);
    if (!cleanHandle) {
      cleanHandle = `maker_${Math.floor(Math.random() * 8999 + 1000)}`;
    }

    if (users.some((u) => (u.handle || '').replace(/^@/, '').toLowerCase() === cleanHandle)) {
      setAuthError(`@${cleanHandle} is already claimed. Pick another handle!`);
      return;
    }

    if (!captchaPassed) {
      setAuthError('Please complete the verification checkbox to continue.');
      return;
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      displayName: displayName.trim() || 'Young Creator',
      handle: cleanHandle,
      avatarUrl: avatarUrl || AVATAR_PRESETS[0],
      email: cleanEmail,
      googleId: `google_${Date.now()}`,
      age: age || 16,
      bio: bio.trim() || 'Young maker exploring robotics, 3D printing & creative code.',
      interestTags: selectedTags.length > 0 ? selectedTags : ['#creator', '#maker'],
      reputationScore: 10,
      trustTier: 'CREATOR',
      createdAt: new Date().toISOString(),
    };

    storage.registerUser(newUser);
    storage.setUser(newUser);
    onSuccess(newUser);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-sm overflow-y-auto cursor-default animate-in fade-in duration-150"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="my-8 w-full max-w-lg rounded-3xl border-2 border-sky-200 bg-white p-6 sm:p-7 shadow-2xl relative overflow-hidden cursor-default text-slate-800"
      >
        {/* Cancel Button in top right */}
        <button
          type="button"
          onClick={onClose}
          title="Cancel"
          aria-label="Cancel"
          className="absolute top-5 right-5 flex items-center gap-1.5 rounded-full border-2 border-slate-200 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-700 transition-all shadow-2xs z-10 cursor-pointer active:scale-95"
        >
          <X className="h-4 w-4 text-slate-500" />
          <span>Cancel</span>
        </button>

        {/* Brand Logo in Modal */}
        <div className="flex justify-center mb-4">
          <Logo size="md" />
        </div>

        {/* Auth Mode Tabs: Log In vs Sign Up */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-full border-2 border-slate-200 mb-5 max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
              authMode === 'login'
                ? 'bg-sky-400 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
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
            className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer ${
              authMode === 'signup'
                ? 'bg-emerald-300 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* 1 Account Per Email Policy Notice */}
        <div className="mb-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-600 bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 font-medium">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>One account per email policy</span>
        </div>

        {/* Error Alert Banner */}
        {authError && (
          <div className="mb-5 rounded-2xl border-2 border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="h-4 w-4 text-rose-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-rose-900 leading-snug">{authError}</p>
              {authMode === 'signup' && storage.isEmailRegistered(signupEmail) && (
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail(signupEmail);
                    setAuthMode('login');
                    setAuthError(null);
                  }}
                  className="mt-2 inline-flex items-center gap-1 rounded-full bg-sky-500 px-3 py-1 text-[11px] font-bold text-white hover:bg-sky-600 transition-colors"
                >
                  <span>Switch to log in with this email</span>
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
                  className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-bold text-white hover:bg-emerald-600 transition-colors"
                >
                  <span>Create an account with this email</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              )}
            </div>
            <button
              onClick={() => setAuthError(null)}
              className="text-rose-500 hover:text-rose-800 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* 1. LOGIN MODE: Just email or handle needed */}
        {authMode === 'login' && (
          <div className="space-y-6">
            <div className="text-center space-y-1.5">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white border-2 border-slate-200 shadow-xs">
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
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Welcome Back</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Type your handle or email to jump back into the lounge.
              </p>
            </div>

            {/* Simple Handle or Email Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-700 font-bold mb-1.5">
                  Handle or Email
                </label>
                <div className="relative flex items-center">
                  <AtSign className="absolute left-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="xxx@gmail.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-full border-2 border-slate-300 bg-slate-100 px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-all cursor-pointer shadow-2xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[2] flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-400 via-emerald-300 to-amber-200 px-4 py-3 text-xs font-black text-slate-950 shadow-md shadow-sky-300/40 hover:scale-102 transition-all active:scale-[0.98] cursor-pointer"
                >
                  <span>Log In</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className="text-xs text-slate-500 hover:text-sky-700 transition-colors"
              >
                Don't have an account yet? <strong className="text-sky-600 font-bold">Sign up</strong>
              </button>
            </div>
          </div>
        )}

        {/* 2. SIGN UP MODE: Friendly Onboarding */}
        {authMode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div className="border-b-2 border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Create Your Account
              </h3>
              <p className="text-xs text-slate-500">
                A quick profile so other builders know who you are and what you make.
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-700 font-bold mb-1">
                Account Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="e.g. xxx@gmail.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 pl-9 pr-3.5 py-2 text-xs text-slate-800 focus:border-sky-400 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Age Verification (Mandatory for teens) */}
            <div className="rounded-2xl border-2 border-sky-200 bg-sky-50/60 p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase text-sky-900 font-bold flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-sky-700" />
                  Age Verification (13+ Required) <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] font-mono font-bold text-sky-700 bg-white px-2 py-0.5 rounded-full border border-sky-200">
                  Young Creators
                </span>
              </div>
              <input
                type="number"
                min="13"
                max="19"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 16)}
                required
                placeholder="Age (13-19)"
                className="w-full rounded-xl border-2 border-sky-200 bg-white px-3 py-1.5 text-xs text-slate-800 font-mono focus:border-sky-400 focus:outline-none"
              />
              <p className="text-[10px] text-slate-500">
                locked in. is built specifically for preteens, teens, and young creators.
              </p>
            </div>

            {/* Display Name & Handle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-700 font-bold mb-1">
                  Display Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  placeholder="e.g. Alex Chen"
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-sky-400 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-700 font-bold mb-1">
                  Unique @Handle <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs text-slate-400 font-mono font-bold">@</span>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    required
                    placeholder="alex_builds"
                    className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 pl-7 pr-3 py-1.5 text-xs text-slate-800 font-mono focus:border-sky-400 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Custom Avatar Upload */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-700 font-bold mb-1.5">
                Profile Avatar (Upload image file or choose mascot)
              </label>
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200 shrink-0">
                  <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                </div>
                <label className="flex items-center gap-1.5 rounded-full border-2 border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors shadow-2xs">
                  <Upload className="h-3.5 w-3.5 text-sky-600" />
                  <span>Upload Pic</span>
                  <input type="file" accept="image/*" onChange={handleAvatarFileUpload} className="hidden" />
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {AVATAR_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(p)}
                      title={`Select Mascot ${idx + 1}`}
                      className={`h-8 w-8 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                        avatarUrl === p
                          ? 'border-sky-400 ring-2 ring-sky-300 scale-110'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
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
              <label className="block text-xs font-mono uppercase text-slate-700 font-bold mb-1">
                Short Creator Bio
              </label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g. 3D printing props, Unity games, building robot combat chassis"
                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-sky-400 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Custom Hashtags */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-slate-700 font-bold">
                Custom Creator Hashtags
              </label>
              <div className="flex flex-wrap gap-1.5 min-h-[30px] p-2 rounded-xl border-2 border-slate-200 bg-slate-50">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-sky-100 border border-sky-300 px-2.5 py-0.5 text-xs font-mono text-sky-800 font-bold flex items-center gap-1.5"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-sky-600 hover:text-sky-900"
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
                  className="flex-1 rounded-xl border-2 border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCustomTag}
                  className="rounded-full border-2 border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  + Add
                </button>
              </div>
            </div>

            {/* Human Verification Checkbox */}
            <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleTriggerCaptcha}
                  disabled={captchaPassed || isVerifyingCaptcha}
                  className={`h-5 w-5 rounded-lg border-2 flex items-center justify-center transition-all ${
                    captchaPassed
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-300 bg-white hover:border-sky-400'
                  }`}
                >
                  {captchaPassed && <CheckCircle className="h-3.5 w-3.5" />}
                </button>
                <span className="text-xs text-slate-700 font-medium">
                  {captchaPassed
                    ? 'Creator verification confirmed'
                    : isVerifyingCaptcha
                    ? 'Verifying token...'
                    : 'I am a creator and agree to Community Guidelines'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 font-bold">Safety Check</span>
            </div>

            {/* Submit & Cancel Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t-2 border-slate-100">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border-2 border-slate-300 bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-all cursor-pointer shadow-2xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="text-xs text-slate-500 hover:text-slate-900 transition-colors cursor-pointer font-medium"
                >
                  Already have an account? Log In
                </button>
              </div>

              <button
                type="submit"
                disabled={!captchaPassed}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-400 via-emerald-300 to-amber-200 px-5 py-2 text-xs font-black text-slate-950 shadow-md shadow-sky-300/40 hover:scale-102 transition-all disabled:opacity-40 cursor-pointer"
              >
                <Check className="h-4 w-4" />
                <span>Create Account</span>
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
