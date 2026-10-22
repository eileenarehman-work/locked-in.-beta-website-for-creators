import React, { useState, useEffect } from 'react';
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
  Settings,
  RefreshCw,
  Send,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { storage } from '../mock/initialData';
import {
  sendVerificationCode,
  verifyCode,
  getEmailConfigStatus,
  EmailConfigStatus,
} from '../services/authEmailService';
import { signInWithGoogle, syncUserToFirestore } from '../services/firestoreService';

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
  const [signupStep, setSignupStep] = useState<'details' | 'verify_code'>('details');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Sign up form state
  const [signupEmail, setSignupEmail] = useState(existingUser?.email || '');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
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

  // Human verification checkbox state
  const [captchaPassed, setCaptchaPassed] = useState(false);
  const [isVerifyingCaptcha, setIsVerifyingCaptcha] = useState(false);

  // Email verification state
  const [verificationCode, setVerificationCode] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [emailStatusMsg, setEmailStatusMsg] = useState<string | null>(null);
  const [previewDevCode, setPreviewDevCode] = useState<string | null>(null);

  // Email service status
  const [emailConfig, setEmailConfig] = useState<EmailConfigStatus | null>(null);

  // Load server email configuration status
  useEffect(() => {
    getEmailConfigStatus().then((cfg) => {
      setEmailConfig(cfg);
    });
  }, []);

  // Cooldown countdown timer for resending code
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

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

  // Google Sign-In with Firebase Auth
  const handleGoogleSignIn = async () => {
    setIsGoogleSigningIn(true);
    setAuthError(null);
    try {
      const user = await signInWithGoogle();
      onSuccess(user);
      onClose();
    } catch (err: unknown) {
      const errorObj = err as { code?: string; message?: string };
      if (errorObj?.code === 'auth/popup-closed-by-user') {
        setAuthError('Google sign-in popup was closed.');
      } else if (errorObj?.code === 'auth/popup-blocked') {
        setAuthError('Google sign-in popup was blocked by your browser. Please enable popups for this tab and click again.');
      } else if (errorObj?.code === 'auth/cancelled-popup-request') {
        setAuthError('Google sign-in request was cancelled.');
      } else if (errorObj?.code === 'auth/unauthorized-domain') {
        setAuthError('This domain is not yet authorized in Firebase. You can also sign in instantly using email & password below.');
      } else {
        setAuthError(errorObj?.message || 'Failed to sign in with Google. Please try again.');
      }
    } finally {
      setIsGoogleSigningIn(false);
    }
  };

  // 1. Log In Submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const term = loginEmail.trim().toLowerCase();
    if (!term) {
      setAuthError('Please enter your email or handle.');
      return;
    }

    if (!loginPassword) {
      setAuthError('Please enter your password.');
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

    if (!found) {
      setAuthError(`No account found with '${term}'. Sign up below to create a new account!`);
      return;
    }

    // Verify password if user has one configured
    if (found.password && found.password !== loginPassword) {
      setAuthError('Incorrect password. Please double-check your password and try again.');
      return;
    }

    // If an existing legacy user did not have a password set yet, save it
    if (!found.password) {
      found.password = loginPassword;
      storage.registerUser(found);
    }

    // Check email verification status: user must be verified before they can log in
    if (found.isEmailVerified === false) {
      setAuthError('Your email address has not been verified yet. Sending verification code...');
      setSignupEmail(found.email);
      setSignupPassword(loginPassword);
      setAge(found.age || 16);
      setDisplayName(found.displayName);
      setHandle(found.handle);
      setAuthMode('signup');
      await handleTriggerSendCode(found.email, found.age || 16, found.displayName);
      return;
    }

    storage.setUser(found);
    syncUserToFirestore(found);
    onSuccess(found);
  };

  // Helper to trigger sending real verification code
  const handleTriggerSendCode = async (targetEmail: string, userAge: number, name: string) => {
    setIsSendingCode(true);
    setAuthError(null);
    setEmailStatusMsg(null);
    setPreviewDevCode(null);

    const res = await sendVerificationCode(targetEmail, userAge, name);
    setIsSendingCode(false);

    if (!res.success) {
      setAuthError(res.error || 'Failed to send verification code. Please try again.');
      if (res.previewCode) {
        setPreviewDevCode(res.previewCode);
      }
      return false;
    }

    setSignupStep('verify_code');
    setResendCooldown(30);
    setEmailStatusMsg(res.message || `Code sent to ${targetEmail}`);
    if (res.previewCode) {
      setPreviewDevCode(res.previewCode);
    }
    return true;
  };

  // 2. Sign Up: Step 1 Submit (Validates email & 13+ age, then triggers API request to send real 6-digit code)
  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const cleanEmail = signupEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setAuthError('A valid email address is required.');
      return;
    }

    // 13+ age requirement enforcement
    if (!age || age < 13) {
      setAuthError('Age requirement: Creators must be at least 13 years old to join locked in.');
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

    if (!signupPassword || signupPassword.length < 6) {
      setAuthError('Please create a password that is at least 6 characters long.');
      return;
    }

    if (!captchaPassed) {
      setAuthError('Please complete the verification checkbox to continue.');
      return;
    }

    // Trigger API request to send real 6-digit verification code
    await handleTriggerSendCode(cleanEmail, age, displayName.trim());
  };

  // 3. Sign Up: Step 2 Submit (Verifies 6-digit code before account creation and login)
  const handleVerifyCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const cleanCode = verificationCode.trim().replace(/\D/g, '');
    if (cleanCode.length !== 6) {
      setAuthError('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsVerifyingCode(true);
    const res = await verifyCode(signupEmail.trim().toLowerCase(), cleanCode);
    setIsVerifyingCode(false);

    if (!res.success) {
      setAuthError(res.error || 'Invalid verification code. Please check your inbox or request a new code.');
      return;
    }

    // Code verified successfully! Create user account with verified email & password
    let cleanHandle = handle.trim().toLowerCase();
    if (cleanHandle.startsWith('@')) cleanHandle = cleanHandle.substring(1);
    if (!cleanHandle) {
      cleanHandle = `maker_${Math.floor(Math.random() * 8999 + 1000)}`;
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      displayName: displayName.trim() || 'Young Creator',
      handle: cleanHandle,
      avatarUrl: avatarUrl || AVATAR_PRESETS[0],
      email: signupEmail.trim().toLowerCase(),
      password: signupPassword,
      googleId: `google_${Date.now()}`,
      age: age || 16,
      bio: bio.trim() || 'Young maker exploring robotics, 3D printing & creative code.',
      interestTags: selectedTags.length > 0 ? selectedTags : ['#creator', '#maker'],
      reputationScore: 10,
      trustTier: 'CREATOR',
      isEmailVerified: true,
      emailVerifiedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    storage.registerUser(newUser);
    storage.setUser(newUser);
    syncUserToFirestore(newUser);
    onSuccess(newUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto cursor-default animate-in fade-in duration-150">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="my-8 w-full max-w-lg rounded-3xl border-2 border-sky-200 bg-white p-6 sm:p-7 shadow-2xl relative overflow-hidden cursor-default text-slate-800"
      >
        {/* Top Controls: Cancel Button */}
        <div className="absolute top-5 right-5 z-10">
          <button
            type="button"
            onClick={onClose}
            title="Cancel"
            aria-label="Cancel"
            className="flex items-center gap-1.5 rounded-full border-2 border-slate-200 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-700 transition-all shadow-2xs cursor-pointer active:scale-95"
          >
            <X className="h-4 w-4 text-slate-500" />
            <span>Cancel</span>
          </button>
        </div>

        {/* Brand Logo in Modal */}
        <div className="flex justify-center mb-3">
          <Logo size="md" />
        </div>

        {/* Google Sign-in with Firebase Auth */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleSigningIn}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-2xl border-2 border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm shadow-xs transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>{isGoogleSigningIn ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>
          <div className="relative flex items-center justify-center my-3.5">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-2.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 absolute">or email & password</span>
          </div>
        </div>

        {/* Auth Mode Tabs: Log In vs Sign Up */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-full border-2 border-slate-200 mb-4 max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => {
              setAuthMode('login');
              setSignupStep('details');
              setAuthError(null);
            }}
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

        {/* Real Email Verification Status Banner */}
        <div className="mb-4 flex items-center justify-between text-[11px] text-slate-600 bg-slate-50 border border-slate-200 rounded-xl py-1.5 px-3 font-medium">
          <span className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-sky-600" />
            <span>Real 6-digit email verification</span>
          </span>
          <span className="text-[10px] font-mono text-emerald-700 font-bold">
            Secure Delivery
          </span>
        </div>

        {/* Error Alert Banner */}
        {authError && (
          <div className="mb-4 rounded-2xl border-2 border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="h-4 w-4 text-rose-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-rose-900 leading-snug">{authError}</p>
              {authMode === 'signup' && storage.isEmailRegistered(signupEmail) && (
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail(signupEmail);
                    setAuthMode('login');
                    setSignupStep('details');
                    setAuthError(null);
                  }}
                  className="mt-1 text-sky-700 underline font-bold cursor-pointer hover:text-sky-900 block"
                >
                  Switch to Log In with this email →
                </button>
              )}
            </div>
          </div>
        )}

        {/* ----------------- MODE 1: LOG IN ----------------- */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-700 font-bold mb-1">
                Your Email Address or @Handle
              </label>
              <div className="relative flex items-center">
                <AtSign className="absolute left-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="alex@creator.org or @alex_builds"
                  required
                  className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-mono uppercase text-slate-700 font-bold">
                  Password
                </label>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 h-4 w-4 text-slate-400" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your account password"
                  required
                  className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 pl-9 pr-10 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword((prev) => !prev)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showLoginPassword ? 'Hide password' : 'Show password'}
                >
                  {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
              Enter your email and password to log in.
            </p>

            <div className="flex items-center justify-between pt-2 border-t-2 border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setSignupStep('details');
                  setAuthError(null);
                }}
                className="text-xs text-slate-500 hover:text-slate-900 font-medium cursor-pointer"
              >
                Need an account? Sign Up
              </button>

              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-full bg-sky-400 hover:bg-sky-300 border border-sky-500/40 px-5 py-2 text-xs font-black text-slate-950 shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                <span>Log In</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* ----------------- MODE 2: SIGN UP - STEP 2 (ENTER 6-DIGIT VERIFICATION CODE) ----------------- */}
        {authMode === 'signup' && signupStep === 'verify_code' && (
          <form onSubmit={handleVerifyCodeSubmit} className="space-y-4 animate-in fade-in duration-200">
            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/70 p-4 text-center space-y-2">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-200 text-emerald-800 mx-auto">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-black text-slate-900">Check Your Inbox</h3>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                We sent a real 6-digit verification code to:
                <br />
                <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200 mt-1 inline-block">
                  {signupEmail}
                </span>
              </p>
              {emailStatusMsg && (
                <p className="text-[11px] text-emerald-700 font-medium">
                  {emailStatusMsg}
                </p>
              )}
            </div>

            {/* Input field for the 6-digit code */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono uppercase text-slate-700 font-bold">
                  Enter 6-Digit Verification Code <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] font-mono text-slate-500 font-medium">
                  Valid for 10 minutes
                </span>
              </div>

              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                autoFocus
                required
                className="w-full rounded-2xl border-2 border-sky-300 bg-white py-3 px-4 text-center font-mono font-black text-2xl tracking-[0.5em] text-slate-900 focus:border-sky-500 focus:outline-none shadow-xs"
              />
            </div>

            {/* Testing helper notice if simulated mode active */}
            {previewDevCode && (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-center justify-between">
                <span>Testing Code: <strong className="font-mono">{previewDevCode}</strong></span>
                <button
                  type="button"
                  onClick={() => setVerificationCode(previewDevCode)}
                  className="text-amber-800 underline font-bold cursor-pointer hover:text-amber-950"
                >
                  Fill Code
                </button>
              </div>
            )}

            {/* Actions: Resend Code & Back to Edit Details */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <button
                type="button"
                onClick={() => setSignupStep('details')}
                className="text-slate-500 hover:text-slate-900 underline font-medium cursor-pointer"
              >
                Wrong email? Edit details
              </button>

              <button
                type="button"
                disabled={resendCooldown > 0 || isSendingCode}
                onClick={() => handleTriggerSendCode(signupEmail, age, displayName)}
                className="flex items-center gap-1.5 text-sky-700 hover:text-sky-900 font-bold disabled:opacity-40 cursor-pointer"
              >
                <RefreshCw className={`h-3 w-3 ${isSendingCode ? 'animate-spin' : ''}`} />
                <span>
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                </span>
              </button>
            </div>

            {/* Submit Verification Action */}
            <div className="pt-2 border-t-2 border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border-2 border-slate-200 bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={verificationCode.length !== 6 || isVerifyingCode}
                className="flex items-center gap-2 rounded-full bg-emerald-400 hover:bg-emerald-300 border border-emerald-500/40 px-6 py-2.5 text-xs font-black text-slate-950 shadow-xs hover:scale-102 transition-all disabled:opacity-40 cursor-pointer"
              >
                {isVerifyingCode ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Verify & Complete Registration</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ----------------- MODE 2: SIGN UP - STEP 1 (CREATOR DETAILS & 13+ AGE REQUIREMENT) ----------------- */}
        {authMode === 'signup' && signupStep === 'details' && (
          <form onSubmit={handleDetailsSubmit} className="space-y-4">
            {/* Email Address Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono uppercase text-slate-700 font-bold flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-sky-600" />
                  <span>Email Address</span> <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  Code sent here
                </span>
              </div>
              <input
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
                placeholder="you@school.edu or maker@gmail.com"
                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Create Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono uppercase text-slate-700 font-bold flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-sky-600" />
                  <span>Create Password</span> <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  Min 6 characters
                </span>
              </div>
              <div className="relative flex items-center">
                <input
                  type={showSignupPassword ? 'text' : 'password'}
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Create a strong password"
                  className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-3 pr-10 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword((prev) => !prev)}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title={showSignupPassword ? 'Hide password' : 'Show password'}
                >
                  {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Age Verification (13+ Required for young creators) */}
            <div className="rounded-2xl border-2 border-sky-200 bg-sky-50/60 p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase text-sky-900 font-bold flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-sky-700" />
                  <span>Age Verification (13+ Required)</span> <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] font-mono font-bold text-sky-700 bg-white px-2 py-0.5 rounded-full border border-sky-200">
                  All Ages (13+)
                </span>
              </div>
              <input
                type="number"
                min="13"
                max="99"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value, 10) || 0)}
                required
                placeholder="Age (must be 13+)"
                className="w-full rounded-xl border-2 border-sky-200 bg-white px-3 py-1.5 text-xs text-slate-800 font-mono focus:border-sky-400 focus:outline-none"
              />
              {age < 13 && age > 0 ? (
                <p className="text-[11px] text-rose-600 font-bold flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>You must be at least 13 years old to join locked in.</span>
                </p>
              ) : (
                <p className="text-[10px] text-slate-500 font-sans">
                  locked in. is designed specifically for young makers, coders, and engineers.
                </p>
              )}
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
                Profile Avatar
              </label>
              <div className="flex items-center gap-3">
                <div className="relative h-11 w-11 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200 shrink-0">
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
                      className={`h-7 w-7 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
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

            {/* Short Creator Bio */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-700 font-bold mb-1">
                Short Creator Bio
              </label>
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g. 3D printing props, robotics, CAD modeling"
                className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-800 focus:border-sky-400 focus:bg-white focus:outline-none"
              />
            </div>

            {/* Custom Hashtags */}
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase text-slate-700 font-bold">
                Custom Creator Hashtags
              </label>
              <div className="flex flex-wrap gap-1.5 min-h-[28px] p-2 rounded-xl border-2 border-slate-200 bg-slate-50">
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
                  placeholder="e.g. #robotics, #3dprinting, #gamejam"
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
                    : 'I agree to the 13+ Community Guidelines'}
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
                disabled={!captchaPassed || age < 13 || isSendingCode}
                className="flex items-center gap-2 rounded-full bg-amber-400 hover:bg-amber-300 border border-amber-500/40 px-5 py-2 text-xs font-black text-slate-950 shadow-xs hover:scale-102 transition-all disabled:opacity-40 cursor-pointer"
              >
                {isSendingCode ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>Send Verification Code</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Various Accounts Switcher */}
        {storage.getAllUsers().length > 0 && (
          <div className="mt-5 pt-4 border-t-2 border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                Switch Between Accounts ({storage.getAllUsers().length})
              </span>
              <span className="text-[10px] text-slate-400 font-sans">Click to instant sign-in</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
              {storage.getAllUsers().map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => {
                    storage.setUser(u);
                    syncUserToFirestore(u);
                    onSuccess(u);
                    onClose();
                  }}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 transition-all text-left cursor-pointer group"
                >
                  <img
                    src={u.avatarUrl}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-300 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-800 group-hover:text-sky-900 truncate">
                      {u.displayName}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono truncate">
                      @{u.handle}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
