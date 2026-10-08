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
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/30 backdrop-blur-sm flex min-h-screen items-center justify-center p-3 sm:p-6 cursor-pointer animate-in fade-in duration-150"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl border-2 border-sky-200 bg-white shadow-2xl relative overflow-hidden my-auto cursor-default text-slate-800"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sky-100 px-6 py-4 shrink-0 bg-sky-50/60 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 shadow-2xs">
              <Camera className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">Edit Creator Profile</h3>
              <p className="text-xs text-slate-500 font-medium">
                Customize how other young innovators see your profile.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={scrollToBottom}
              className="hidden sm:flex items-center gap-1 rounded-full border border-sky-200 bg-white px-3 py-1 text-[11px] font-bold text-sky-800 hover:bg-sky-50 transition-colors cursor-pointer"
              title="Jump down to account deletion"
            >
              <span>Scroll down</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={onClose}
              title="Close (Esc)"
              aria-label="Close (Esc)"
              className="flex items-center gap-1.5 rounded-full border border-sky-200 bg-white px-3 py-1 text-xs font-bold text-slate-600 hover:bg-sky-50 hover:text-slate-900 transition-all shadow-2xs cursor-pointer"
            >
              <X className="h-4 w-4" />
              <span className="text-[10px] font-mono text-slate-400">Esc</span>
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto px-6 py-5 space-y-5 pb-8 touch-pan-y"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {errorMessage && (
              <div className="flex items-center gap-2 rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-700 font-bold">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Profile Picture Upload */}
            <div className="rounded-3xl border-2 border-sky-100 bg-sky-50/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <Camera className="h-4 w-4 text-sky-600" />
                  Profile Picture
                </label>
                <span className="text-[10px] font-bold text-slate-400">
                  PNG, JPG, or WebP
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Avatar Preview */}
                <div className="relative group h-20 w-20 shrink-0 rounded-full overflow-hidden bg-white border-2 border-sky-300 shadow-md">
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white text-[10px] font-bold"
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
                      className="flex items-center gap-1.5 rounded-full border border-sky-200 bg-white px-4 py-1.5 text-xs font-bold text-sky-900 hover:bg-sky-50 transition-colors disabled:opacity-50 shadow-2xs cursor-pointer"
                    >
                      {uploadStatus === 'uploading' ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-sky-600" />
                      ) : (
                        <Upload className="h-3.5 w-3.5 text-sky-600" />
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
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-200"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold block">
                        Uploading... {uploadProgress}%
                      </span>
                    </div>
                  )}

                  {uploadStatus === 'success' && (
                    <span className="text-[10px] text-emerald-600 font-bold block">
                      ✓ Profile picture updated!
                    </span>
                  )}

                  {/* Preset Avatars */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-500 font-bold">Or pick preset:</span>
                    {AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatarUrl(preset)}
                        className={`h-7 w-7 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                          avatarUrl === preset
                            ? 'border-sky-500 ring-2 ring-sky-300 scale-105'
                            : 'border-slate-200 opacity-70 hover:opacity-100 hover:scale-105'
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
                <label className="block text-xs font-black text-slate-800 mb-1.5">
                  Display Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  placeholder="Your Name"
                  className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-900 font-bold focus:border-sky-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-800 mb-1.5">
                  Handle <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs text-sky-600 font-mono font-bold">@</span>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    required
                    placeholder="handle"
                    className="w-full rounded-2xl border-2 border-slate-200 bg-white pl-8 pr-4 py-2.5 text-xs text-slate-900 font-mono font-bold focus:border-sky-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Age & Bio */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1.5">
                  Age
                </label>
                <input
                  type="number"
                  min="13"
                  max="19"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 16)}
                  required
                  className="w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-900 font-mono font-bold focus:border-sky-400 focus:outline-none transition-colors"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-black text-slate-800 mb-1.5">
                  Bio / Innovation Mission
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="What are you building? (3D prints, web apps, robotics, games, hardware...)"
                  className="w-full rounded-2xl border-2 border-slate-200 bg-white p-3 text-xs text-slate-900 font-medium focus:border-sky-400 focus:outline-none leading-relaxed transition-colors"
                />
              </div>
            </div>

            {/* Tags / Interests */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-black text-slate-800">
                  Interests & Innovation Tags
                </label>
                <span className="text-[10px] font-bold text-slate-400">
                  Press Enter to add
                </span>
              </div>

              {/* Tag Chips */}
              <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2.5 rounded-2xl border-2 border-sky-100 bg-sky-50/30">
                {interestTags.length === 0 && (
                  <span className="text-xs text-slate-400 italic">No tags added yet.</span>
                )}
                {interestTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white border border-sky-200 px-3 py-1 text-xs font-bold text-sky-800 flex items-center gap-1.5 shadow-2xs"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-sky-500 hover:text-rose-500 transition-colors cursor-pointer text-sm font-bold"
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
                  placeholder="e.g. #3dprinting, #robotics, #react, #electronics"
                  className="flex-1 rounded-2xl border-2 border-slate-200 bg-white px-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-sky-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCustomTag}
                  className="rounded-full bg-sky-100 border border-sky-200 px-4 py-2 text-xs font-bold text-sky-800 hover:bg-sky-200 transition-colors cursor-pointer shadow-2xs"
                >
                  + Add
                </button>
              </div>

              {/* Popular tags suggestions */}
              <div className="flex flex-wrap items-center gap-1 pt-1">
                <span className="text-[10px] font-bold text-slate-400">Suggestions:</span>
                {POPULAR_TAGS.filter((t) => !interestTags.includes(t)).slice(0, 5).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setInterestTags([...interestTags, t])}
                    className="text-[10px] font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2.5 py-0.5 rounded-full cursor-pointer transition-colors"
                  >
                    +{t}
                  </button>
                ))}
              </div>
            </div>

            {/* Badges Preview */}
            <div className="rounded-3xl border-2 border-amber-200 bg-gradient-to-r from-amber-50/70 to-sky-50/60 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  Your Badges ({getUnlockedBadgesForUser(currentUser).length})
                </span>
                <span className="text-[11px] text-amber-800 font-black flex items-center gap-1">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-500" />
                  <span>{currentUser.reputationScore} Points</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {getUnlockedBadgesForUser(currentUser).length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-1">
                    No badges earned yet. Complete daily streaks and write peer reviews to unlock badges!
                  </p>
                ) : (
                  getUnlockedBadgesForUser(currentUser).map((b) => (
                    <span
                      key={b.id}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white border border-amber-200 px-3 py-1 text-[11px] font-bold text-slate-800 shadow-2xs"
                    >
                      <span className="text-amber-500">★</span>
                      <span>{b.name}</span>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Danger Zone: Delete Account */}
            <div className="rounded-3xl border-2 border-rose-200 bg-rose-50/40 p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h5 className="text-xs font-black text-rose-800 flex items-center gap-1.5">
                    <Trash2 className="h-3.5 w-3.5 text-rose-600" />
                    <span>Danger Zone: Delete Account</span>
                  </h5>
                  <p className="text-[11px] text-slate-600 mt-0.5 font-medium leading-snug">
                    Permanently delete @{currentUser.handle} and all your projects, drafts, and reviews.
                  </p>
                </div>

                {!isConfirmingDelete && (
                  <button
                    type="button"
                    onClick={() => setIsConfirmingDelete(true)}
                    className="rounded-full border border-rose-300 bg-white px-3.5 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer shrink-0 shadow-2xs"
                  >
                    Delete Account
                  </button>
                )}
              </div>

              {isConfirmingDelete && (
                <div className="rounded-2xl border-2 border-rose-300 bg-rose-100/60 p-3.5 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-start gap-2.5 text-xs text-rose-900 font-medium">
                    <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      Are you sure? This will permanently delete your account, projects, and points. You won't be able to recover them.
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-rose-200">
                    <button
                      type="button"
                      onClick={() => setIsConfirmingDelete(false)}
                      className="rounded-full px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
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
                      className="flex items-center gap-1.5 rounded-full bg-rose-600 px-4 py-1.5 text-xs font-black text-white hover:bg-rose-500 transition-colors shadow-sm cursor-pointer"
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
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-sky-100 bg-sky-50/70 backdrop-blur-sm shrink-0">
            <span className="text-[11px] text-slate-500 font-bold">
              Join the Fight for Innovation
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-400 via-emerald-300 to-amber-200 px-6 py-2.5 text-xs font-black text-slate-950 shadow-md shadow-sky-300/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                {isSaved ? <Check className="h-4 w-4 text-emerald-800" /> : <Check className="h-4 w-4" />}
                <span>{isSaved ? 'Saved!' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
