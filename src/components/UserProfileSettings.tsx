import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import {
  X,
  Upload,
  Camera,
  Check,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Loader2,
  Trophy,
  Star,
  Trash2,
  ChevronDown,
} from 'lucide-react';
import { motion } from 'motion/react';
import { getUnlockedBadgesForUser } from '../utils/badgeSystem';
import { storage } from '../mock/initialData';

interface UserProfileSettingsProps {
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
  onClose: () => void;
  onDeleteAccount?: (userId: string) => void;
}

const AVATAR_PRESETS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=Rocket',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Circuit',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Gamer',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Artist',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=Spark',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=Neon',
];

const POPULAR_TAGS = [
  '#3dprinting',
  '#robotics',
  '#gamedev',
  '#coding',
  '#art',
  '#music',
  '#makers',
  '#arduino',
  '#blender',
];

export const UserProfileSettings: React.FC<UserProfileSettingsProps> = ({
  currentUser,
  onUpdateUser,
  onClose,
  onDeleteAccount,
}) => {
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [handle, setHandle] = useState(currentUser.handle);
  const [bio, setBio] = useState(currentUser.bio);
  const [age, setAge] = useState(currentUser.age);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);
  const [interestTags, setInterestTags] = useState<string[]>(currentUser.interestTags);
  const [tagInput, setTagInput] = useState('');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // File upload handler
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image exceeds 10MB limit. Please choose a smaller image.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (PNG, JPEG, GIF, or WebP).');
      return;
    }

    setErrorMessage(null);
    setUploadStatus('uploading');
    setUploadProgress(25);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      setUploadProgress(70);
      await new Promise((r) => setTimeout(r, 150));
      setUploadProgress(100);
      setAvatarUrl(dataUrl);
      setUploadStatus('success');

      setTimeout(() => {
        setUploadStatus('idle');
      }, 2000);
    };

    reader.readAsDataURL(file);
  };

  const handleAddCustomTag = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && 'key' in e && e.key !== 'Enter' && e.key !== ',') return;
    if (e && 'preventDefault' in e) e.preventDefault();
    const clean = tagInput.trim().replace(/^#+/, '').replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
    if (clean) {
      const formatted = `#${clean}`;
      if (!interestTags.includes(formatted)) {
        setInterestTags([...interestTags, formatted]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setInterestTags(interestTags.filter((t) => t !== tagToRemove));
  };

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanDisplayName = displayName.trim();
    const cleanHandle = handle.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();

    if (!cleanDisplayName) {
      setErrorMessage('Please provide a display name.');
      return;
    }

    if (!cleanHandle) {
      setErrorMessage('Please provide a handle.');
      return;
    }

    // Check if handle is taken by another user
    const allUsers = storage.getAllUsers();
    const isTaken = allUsers.some(
      (u) => u.id !== currentUser.id && u.handle.toLowerCase() === cleanHandle
    );
    if (isTaken) {
      setErrorMessage(`The handle @${cleanHandle} is taken. Try another.`);
      return;
    }

    const updatedUser: User = {
      ...currentUser,
      displayName: cleanDisplayName,
      handle: cleanHandle,
      bio: bio.trim(),
      age: Number(age) || currentUser.age,
      avatarUrl,
      interestTags,
    };

    storage.setUser(updatedUser);
    storage.registerUser(updatedUser);
    onUpdateUser(updatedUser);

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  // Close on Escape key
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
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex min-h-screen items-center justify-center p-3 sm:p-6 cursor-pointer animate-in fade-in duration-150"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl max-h-[88vh] flex flex-col rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl relative overflow-hidden my-auto cursor-default"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 shrink-0 bg-slate-900/95 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Edit Profile</h3>
              <p className="text-xs text-slate-400">
                Update your display name, photo, bio, and tags.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={scrollToBottom}
              className="hidden sm:flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-800/60 px-2.5 py-1 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Jump down to account deletion"
            >
              <span>Scroll down</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={onClose}
              title="Close (Esc)"
              aria-label="Close (Esc)"
              className="flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition-all shadow-sm cursor-pointer"
            >
              <X className="h-4 w-4" />
              <span className="text-[10px] font-mono text-slate-400">Esc</span>
            </button>
          </div>
        </div>

        {/* Scrollable Form Body - Smooth & easy scrolling */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto px-6 py-5 space-y-5 pb-8 touch-pan-y"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {errorMessage && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Profile Picture Upload */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Camera className="h-3.5 w-3.5 text-indigo-400" />
                  Profile Picture
                </label>
                <span className="text-[10px] text-slate-500">
                  PNG, JPG, or WebP
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Avatar Preview */}
                <div className="relative group h-20 w-20 shrink-0 rounded-2xl overflow-hidden bg-slate-900 border-2 border-indigo-500/40 shadow-inner">
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white text-[10px]"
                  >
                    <Camera className="h-4 w-4 mb-0.5" />
                    <span>Change</span>
                  </button>
                </div>

                {/* Upload Controls */}
                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadStatus === 'uploading'}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {uploadStatus === 'uploading' ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" />
                      ) : (
                        <Upload className="h-3.5 w-3.5 text-indigo-400" />
                      )}
                      <span>
                        {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload your own photo'}
                      </span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFileChange}
                      className="hidden"
                    />
                  </div>

                  {/* Progress Bar */}
                  {uploadStatus === 'uploading' && (
                    <div className="space-y-1">
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 transition-all duration-200"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        Uploading... {uploadProgress}%
                      </span>
                    </div>
                  )}

                  {uploadStatus === 'success' && (
                    <span className="text-[10px] text-emerald-400 block">
                      ✓ Profile picture updated!
                    </span>
                  )}

                  {/* Preset Avatars */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-500">Or pick an avatar:</span>
                    {AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatarUrl(preset)}
                        className={`h-6 w-6 rounded-md overflow-hidden border transition-all cursor-pointer ${
                          avatarUrl === preset
                            ? 'border-indigo-400 ring-2 ring-indigo-400/50'
                            : 'border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={preset} alt="preset" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Display Name & Handle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Display Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  placeholder="Your Name"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Handle <span className="text-rose-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs text-slate-500 font-mono">@</span>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    required
                    placeholder="handle"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-7 pr-3.5 py-2 text-xs text-white font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Age & Bio */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Age
                </label>
                <input
                  type="number"
                  min="13"
                  max="19"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 16)}
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white font-mono focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Bio
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="What kind of projects do you make? (3D prints, games, robotics, code...)"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none leading-relaxed"
                />
              </div>
            </div>

            {/* Tags / Interests */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-slate-300">
                  Interests & Tags
                </label>
                <span className="text-[10px] text-slate-500">
                  Press Enter to add
                </span>
              </div>

              {/* Tag Chips */}
              <div className="flex flex-wrap gap-1.5 min-h-[30px] p-2 rounded-xl border border-slate-800 bg-slate-950/70">
                {interestTags.length === 0 && (
                  <span className="text-xs text-slate-500 italic">No tags added yet.</span>
                )}
                {interestTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-indigo-600/20 border border-indigo-500/40 px-2.5 py-1 text-xs font-mono text-indigo-300 flex items-center gap-1.5"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-indigo-400 hover:text-white transition-colors cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              {/* Input & Quick Suggestions */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddCustomTag}
                  placeholder="e.g. #3dprinting, #bambu, #unity, #robotics"
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCustomTag}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  + Add
                </button>
              </div>

              {/* Popular tags suggestions */}
              <div className="flex flex-wrap items-center gap-1 pt-1">
                <span className="text-[10px] text-slate-500">Suggestions:</span>
                {POPULAR_TAGS.filter((t) => !interestTags.includes(t)).slice(0, 5).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setInterestTags([...interestTags, t])}
                    className="text-[10px] font-mono text-slate-400 hover:text-indigo-300 bg-slate-800/60 hover:bg-slate-800 px-2 py-0.5 rounded-md cursor-pointer transition-colors"
                  >
                    +{t}
                  </button>
                ))}
              </div>
            </div>

            {/* Badges Preview */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Trophy className="h-3.5 w-3.5 text-amber-400" />
                  Your Badges ({getUnlockedBadgesForUser(currentUser).length})
                </span>
                <span className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-400/40 text-amber-400" />
                  <span>{currentUser.reputationScore} Points</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {getUnlockedBadgesForUser(currentUser).length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-1">
                    No badges earned yet. Complete daily streaks and write reviews to unlock your first badge!
                  </p>
                ) : (
                  getUnlockedBadgesForUser(currentUser).map((b) => (
                    <span
                      key={b.id}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-200"
                    >
                      <span className="text-amber-400 font-mono">★</span>
                      <span>{b.name}</span>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Danger Zone: Delete Account */}
            <div className="rounded-2xl border border-rose-500/20 bg-rose-950/15 p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h5 className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                    <span>Danger Zone: Delete Account</span>
                  </h5>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                    Permanently delete @{currentUser.handle} and all your projects, drafts, and reviews.
                  </p>
                </div>

                {!isConfirmingDelete && (
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(true)}
                    className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/25 transition-colors cursor-pointer shrink-0"
                  >
                    Delete Account
                  </button>
                )}
              </div>

              {isConfirmingDelete && (
                <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 p-3.5 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-start gap-2.5 text-xs text-rose-200">
                    <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      Are you sure? This will permanently delete your account, projects, and points. You won't be able to recover them.
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-rose-500/20">
                    <button
                      type="button"
                      onClick={() => setIsConfirmingDelete(false)}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (onDeleteAccount) {
                          onDeleteAccount(currentUser.id);
                        } else {
                          storage.deleteUserAccount(currentUser.id);
                          onClose();
                        }
                      }}
                      className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-500 transition-colors shadow-sm shadow-rose-600/30 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Yes, Delete Account</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-800 bg-slate-900/95 backdrop-blur-sm shrink-0">
            <span className="text-[11px] text-slate-400">
              Save anytime
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all cursor-pointer"
              >
                {isSaved ? <Check className="h-4 w-4 text-emerald-300" /> : <Check className="h-4 w-4" />}
                <span>{isSaved ? 'Saved!' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
