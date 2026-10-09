import React, { useState } from 'react';
import { Project, User, ProjectContributor } from '../types';
import {
  X,
  Users,
  Send,
  Sparkles,
  CheckCircle2,
  Briefcase,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DoodleFace } from './DoodleFaces';

const COMMON_ROLES = [
  'Frontend & UI Engineer',
  'Hardware & PCB Designer',
  'Firmware & Embedded Systems',
  '3D CAD & Prototyping',
  'Field Tester & QA',
  'Content & Technical Writer',
  'Co-Builder / General Maker',
];

interface CollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  currentUser: User | null;
  mode: 'request' | 'invite'; // 'request' = visitor applying to join; 'invite' = author inviting someone
  allUsers?: User[];
  onSendCollaboration: (data: {
    projectId: string;
    targetUser: User;
    role: string;
    pitch: string;
    type: 'REQUEST' | 'INVITE';
  }) => void;
  onOpenGoogleLogin?: () => void;
}

export const CollaborationModal: React.FC<CollaborationModalProps> = ({
  isOpen,
  onClose,
  project,
  currentUser,
  mode,
  allUsers = [],
  onSendCollaboration,
  onOpenGoogleLogin,
}) => {
  const [selectedRole, setSelectedRole] = useState(COMMON_ROLES[0]);
  const [customRole, setCustomRole] = useState('');
  const [pitch, setPitch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTargetUser, setSelectedTargetUser] = useState<User | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // If user is not logged in, prompt sign in
  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
        <div className="w-full max-w-md rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl text-center space-y-4">
          <div className="flex justify-center">
            <DoodleFace type="mismatched_mint" size="xl" />
          </div>
          <h3 className="text-lg font-black text-slate-900">Sign in to Collaborate</h3>
          <p className="text-xs text-slate-600 font-sans leading-relaxed">
            You need a maker account to send collaboration requests and team up on builds.
          </p>
          <div className="pt-2 flex gap-3 justify-center">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-full bg-slate-100 hover:bg-slate-200 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenGoogleLogin?.();
              }}
              className="px-5 py-2 text-xs font-black text-slate-950 rounded-full bg-gradient-to-r from-sky-400 via-emerald-300 to-amber-200 shadow-sm hover:scale-102 active:scale-98 transition-all cursor-pointer"
            >
              Sign In with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = currentUser.id === project.authorId;
  const effectiveMode = isOwner ? 'invite' : mode;

  // Filter available users to invite (excluding current user and existing contributors)
  const existingContributorIds = new Set(
    (project.contributors || []).map((c) => c.userId).concat([project.authorId])
  );

  const availableUsers = allUsers.filter(
    (u) =>
      !existingContributorIds.has(u.id) &&
      u.id !== currentUser.id &&
      (u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.handle.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalRole = customRole.trim() || selectedRole;

    if (effectiveMode === 'invite') {
      if (!selectedTargetUser) return;
      onSendCollaboration({
        projectId: project.id,
        targetUser: selectedTargetUser,
        role: finalRole,
        pitch: pitch.trim(),
        type: 'INVITE',
      });
    } else {
      // Visitor requesting to join
      onSendCollaboration({
        projectId: project.id,
        targetUser: project.author,
        role: finalRole,
        pitch: pitch.trim(),
        type: 'REQUEST',
      });
    }

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-lg rounded-3xl border-2 border-slate-200 bg-white p-6 shadow-2xl my-8 text-slate-800"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 h-8 w-8 rounded-full border border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="flex justify-center">
              <DoodleFace type="star_butter" size="xl" />
            </div>
            <h3 className="text-lg font-black text-slate-900">
              {effectiveMode === 'invite' ? 'Invitation Sent!' : 'Collaboration Request Sent!'}
            </h3>
            <p className="text-xs text-slate-600 font-sans max-w-sm mx-auto">
              {effectiveMode === 'invite'
                ? `We sent an invitation to @${selectedTargetUser?.handle} to join "${project.title}".`
                : `Your collaboration request has been delivered to @${project.author.handle}. They'll be notified right away!`}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-sky-100 border border-sky-300 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-sky-700" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  {effectiveMode === 'invite' ? 'Invite Contributor to Build' : 'Collaboration Request'}
                </h3>
                <p className="text-xs text-slate-500 font-medium truncate max-w-xs">
                  Project: <strong className="text-slate-800">{project.title}</strong>
                </p>
              </div>
            </div>

            {/* Mode: Author Inviting Someone */}
            {effectiveMode === 'invite' && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Select Maker to Invite
                </label>

                {selectedTargetUser ? (
                  <div className="flex items-center justify-between p-2.5 rounded-2xl bg-sky-50 border border-sky-200">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={selectedTargetUser.avatarUrl}
                        alt={selectedTargetUser.displayName}
                        className="h-8 w-8 rounded-full border border-sky-300 object-cover"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{selectedTargetUser.displayName}</div>
                        <div className="text-[10px] font-mono text-slate-500">@{selectedTargetUser.handle}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedTargetUser(null)}
                      className="text-xs text-slate-500 hover:text-rose-600 font-bold px-2 py-1 cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search makers by handle or name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-sky-400"
                      />
                    </div>
                    <div className="max-h-36 overflow-y-auto space-y-1 rounded-xl border border-slate-100 p-1">
                      {availableUsers.length > 0 ? (
                        availableUsers.slice(0, 5).map((user) => (
                          <button
                            key={user.id}
                            type="button"
                            onClick={() => setSelectedTargetUser(user)}
                            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 text-left cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <img
                                src={user.avatarUrl}
                                alt={user.displayName}
                                className="h-6 w-6 rounded-full object-cover border border-slate-200"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-800">{user.displayName}</span>
                                <span className="text-[10px] font-mono text-slate-400 ml-1.5">@{user.handle}</span>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                              +{user.reputationScore} pts
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="p-3 text-center text-xs text-slate-400">
                          No other registered makers found to invite.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mode: Visitor Requesting to Join */}
            {effectiveMode === 'request' && (
              <div className="rounded-2xl bg-sky-50/70 border border-sky-200 p-3 flex items-center gap-3">
                <DoodleFace type="blissful_peach" size="md" />
                <div className="text-xs text-slate-700 leading-relaxed font-sans">
                  You are applying to contribute to <strong>{project.title}</strong> by @{project.author.handle}. Tell them how you'd like to help!
                </div>
              </div>
            )}

            {/* Proposed Role */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                {effectiveMode === 'invite' ? 'Assigned Role' : 'Your Proposed Role'}
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 font-sans focus:outline-none focus:border-sky-400"
              >
                {COMMON_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
                <option value="Custom">Custom Role...</option>
              </select>

              {selectedRole === 'Custom' && (
                <input
                  type="text"
                  placeholder="e.g. Lead Roboticist, Audio Synthesis Engineer"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-sky-400 mt-1.5"
                  required
                />
              )}
            </div>

            {/* Pitch / Message */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                {effectiveMode === 'invite' ? 'Invitation Note (Optional)' : 'What would you like to build or help with?'}
              </label>
              <textarea
                rows={3}
                placeholder={
                  effectiveMode === 'invite'
                    ? "Hey! Loved your work and would love you to help us design the CAD parts."
                    : "Hey @author, I saw your build and have experience with this tech. I can help test the prototype and write docs!"
                }
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 font-sans focus:outline-none focus:border-sky-400 resize-none leading-relaxed"
                required={effectiveMode === 'request'}
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-full bg-slate-100 hover:bg-slate-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={effectiveMode === 'invite' && !selectedTargetUser}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-black text-slate-950 rounded-full bg-gradient-to-r from-sky-400 via-emerald-300 to-amber-200 shadow-sm hover:scale-102 active:scale-98 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{effectiveMode === 'invite' ? 'Send Invitation' : 'Send Collaboration Request'}</span>
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};
