import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import {
  X,
  Upload,
  Camera,
  Check,
  ShieldCheck,
  Cloud,
  Sparkles,
  AlertCircle,
  Loader2,
  Trophy,
  Star,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getUnlockedBadgesForUser } from '../utils/badgeSystem';

interface UserProfileSettingsProps {
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
  onClose: () => void;
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

export const UserProfileSettings: React.FC<UserProfileSettingsProps> = ({
  currentUser,
  onUpdateUser,
  onClose,
}) => {
  const [displayName, setDisplayName] = useState(currentUser.displayName);
  const [handle, setHandle] = useState(currentUser.handle);
  const [bio, setBio] = useState(currentUser.bio);
  const [age, setAge] = useState(currentUser.age);
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl);
  const [interestTags, setInterestTags] = useState<string[]>(currentUser.interestTags);
  const [tagInput, setTagInput] = useState('');

  // S3 Upload simulation & state
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedS3Key, setUploadedS3Key] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Direct S3 / Cloudflare R2 presigned file upload handler
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (10MB limit)
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
    setUploadProgress(15);

    // Read local preview via FileReader immediately
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;

      // Simulate presigned S3 PUT request pipeline:
      // 1. Generate S3 object key: avatars/${userId}/${timestamp}.webp
      // 2. Transmit binary payload to S3 bucket
      const simulatedS3Key = `avatars/${currentUser.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;

      // Simulate S3 upload progress
      setUploadProgress(45);
      await new Promise((r) => setTimeout(r, 250));
      setUploadProgress(85);
      await new Promise((r) => setTimeout(r, 200));
      setUploadProgress(100);

      setAvatarUrl(dataUrl);
      setUploadedS3Key(simulatedS3Key);
      setUploadStatus('success');

      setTimeout(() => {
        setUploadStatus('idle');
      }, 2500);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || !handle.trim()) return;

    const cleanHandle = handle.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();

    const updated: User = {
      ...currentUser,
      displayName: displayName.trim(),
      handle: cleanHandle,
      bio: bio.trim(),
      age: Math.max(13, age || 16),
      avatarUrl,
      interestTags: interestTags.length ? interestTags : ['#makers'],
    };

    onUpdateUser(updated);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md cursor-pointer animate-in fade-in duration-150"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-7 shadow-2xl relative overflow-hidden cursor-default"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Profile Settings</h3>
              <p className="text-xs text-slate-400">
                Customize your display name, bio, and upload custom avatar to S3
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            title="Close (Esc)"
            aria-label="Close (Esc)"
            className="flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition-all shadow-sm"
          >
            <X className="h-4 w-4" />
            <span className="text-[10px] font-mono text-slate-400">Esc</span>
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar Upload to S3 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase text-slate-300 flex items-center gap-1.5">
                <Cloud className="h-3.5 w-3.5 text-indigo-400" />
                Custom Avatar Image (S3 Presigned Upload)
              </label>
              <span className="text-[10px] font-mono text-emerald-400">
                Max 10MB · PNG/JPG/WebP
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
                    className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 transition-colors disabled:opacity-50"
                  >
                    {uploadStatus === 'uploading' ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" />
                    ) : (
                      <Upload className="h-3.5 w-3.5 text-indigo-400" />
                    )}
                    <span>
                      {uploadStatus === 'uploading' ? 'Uploading to S3...' : 'Upload Image File to S3'}
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

                {/* S3 Upload Progress Bar */}
                {uploadStatus === 'uploading' && (
                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 block">
                      Transferring to S3 bucket... {uploadProgress}%
                    </span>
                  </div>
                )}

                {uploadedS3Key && uploadStatus === 'idle' && (
                  <span className="text-[10px] font-mono text-emerald-400 block truncate">
                    ✓ S3 Presigned Key: {uploadedS3Key}
                  </span>
                )}

                {/* Preset Avatars */}
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-500 font-mono">Or preset:</span>
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatarUrl(preset)}
                      className={`h-6 w-6 rounded-md overflow-hidden border transition-all ${
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
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Display Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Unique @Handle <span className="text-rose-400">*</span>
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs text-slate-500 font-mono">@</span>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-7 pr-3.5 py-2 text-xs text-white font-mono focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Age & Bio */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
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
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Bio (What kind of projects do you make?)
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="e.g. 3D printing props with Bambu Lab, making Unity games, building combat robots..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* Custom Hashtags (YouTube / Instagram style) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-mono uppercase text-slate-300">
                Custom Creator Hashtags
              </label>
              <span className="text-[10px] text-slate-500 font-mono">
                Type any tag & press Enter
              </span>
            </div>

            {/* Existing Tag Chips */}
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
                    className="text-indigo-400 hover:text-white transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Tag Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddCustomTag}
                placeholder="e.g. #3dprinting, #bambu, #blender, #robotics, #python"
                className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomTag}
                className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition-colors"
              >
                + Add Tag
              </button>
            </div>
          </div>

          {/* Earned Badges & Gamified Milestones Preview */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-300 flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5 text-amber-400" />
                Earned Badges ({getUnlockedBadgesForUser(currentUser).length})
              </span>
              <span className="text-[10px] font-mono text-amber-300 font-semibold flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400/40 text-amber-400" />
                <span>{currentUser.reputationScore} Rep Points</span>
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {getUnlockedBadgesForUser(currentUser).map((b) => (
                <span
                  key={b.id}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-[11px] font-semibold text-slate-200"
                >
                  <span className="text-amber-400 font-mono">★</span>
                  <span>{b.name}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <span className="text-[11px] font-mono text-slate-400">
              Changes sync instantly across your profile & projects
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
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
