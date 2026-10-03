import React, { useState, useMemo } from 'react';
import {
  DirectMessage,
  User,
  CollaborationInvite,
  ChatRoom,
  GroupChatMessage,
  Friendship,
} from '../types';
import {
  Send,
  ShieldCheck,
  Check,
  X,
  Briefcase,
  Layers,
  Sparkles,
  Circle,
  Users,
  Image as ImageIcon,
  UserPlus,
  Hash,
  Crown,
  ChevronRight,
  Plus,
  MessageSquare,
  Upload,
  Search,
  Star,
  UserCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  Trash2,
  UserMinus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { storage } from '../mock/initialData';

interface DirectMessagesProps {
  currentUser: User;
  conversations: Record<string, User>;
  messages: DirectMessage[];
  chatRooms: ChatRoom[];
  groupMessages: Record<string, GroupChatMessage[]>;
  friendships: Record<string, Friendship>;
  allRegisteredUsers?: User[];
  onSendMessage: (recipientId: string, text: string, imageUrls?: string[]) => void;
  onSendGroupMessage: (roomId: string, content: string, imageUrls?: string[]) => void;
  onCreateGroupRoom?: (name: string, description: string) => void;
  onUpdateInviteStatus: (inviteId: string, status: 'ACCEPTED' | 'DECLINED') => void;
  onAcceptFriendRequest: (friendshipId: string) => void;
  onDeclineFriendRequest?: (friendshipId: string) => void;
  onSendFriendRequest: (friendHandleOrId: string) => { success: boolean; message?: string; error?: string } | void;
  selectedUserId: string;
  onSelectUser: (userId: string) => void;
}

export const DirectMessages: React.FC<DirectMessagesProps> = ({
  currentUser,
  conversations,
  messages,
  chatRooms,
  groupMessages,
  friendships,
  allRegisteredUsers,
  onSendMessage,
  onSendGroupMessage,
  onCreateGroupRoom,
  onUpdateInviteStatus,
  onAcceptFriendRequest,
  onDeclineFriendRequest,
  onSendFriendRequest,
  selectedUserId,
  onSelectUser,
}) => {
  const [activeTab, setActiveTab] = useState<'dm' | 'group' | 'friends'>('dm');
  const [activeRoomId, setActiveRoomId] = useState<string>(chatRooms[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [pendingImageUrl, setPendingImageUrl] = useState<string | null>(null);
  const [newFriendInput, setNewFriendInput] = useState('');
  const [friendSuccessMsg, setFriendSuccessMsg] = useState<string | null>(null);
  const [friendErrorMsg, setFriendErrorMsg] = useState<string | null>(null);

  // Categorize friendships relative to currentUser
  const myFriendships = useMemo(() => {
    const incoming: { friendship: Friendship; otherUser: User }[] = [];
    const outgoing: { friendship: Friendship; otherUser: User }[] = [];
    const accepted: { friendship: Friendship; otherUser: User }[] = [];

    const allUsers = allRegisteredUsers && allRegisteredUsers.length > 0 ? allRegisteredUsers : storage.getAllUsers();
    const userMap = new Map<string, User>();
    allUsers.forEach((u) => userMap.set(u.id, u));

    Object.values(friendships).forEach((fr) => {
      if (!fr) return;
      if (fr.userId === currentUser.id) {
        // Current user sent the request
        const other = userMap.get(fr.friendId) || fr.friend;
        if (!other || other.bio === 'Teen builder on We Did This' || other.email?.endsWith('@wedidthis.dev')) return;
        if (fr.status === 'PENDING') {
          outgoing.push({ friendship: fr, otherUser: other });
        } else if (fr.status === 'ACCEPTED') {
          accepted.push({ friendship: fr, otherUser: other });
        }
      } else if (fr.friendId === currentUser.id) {
        // Current user received the request
        const other = userMap.get(fr.userId) || fr.sender;
        if (!other || other.bio === 'Teen builder on We Did This' || other.email?.endsWith('@wedidthis.dev')) return;
        if (fr.status === 'PENDING') {
          incoming.push({ friendship: fr, otherUser: other });
        } else if (fr.status === 'ACCEPTED') {
          accepted.push({ friendship: fr, otherUser: other });
        }
      }
    });

    return { incoming, outgoing, accepted };
  }, [friendships, currentUser, allRegisteredUsers]);

  const registeredCreators = useMemo(() => {
    const list = (allRegisteredUsers && allRegisteredUsers.length > 0 ? allRegisteredUsers : storage.getAllUsers())
      .filter((u) => u && u.id && u.id !== currentUser.id && u.bio !== 'Teen builder on We Did This' && !u.email?.endsWith('@wedidthis.dev'));
    return list;
  }, [allRegisteredUsers, currentUser]);

  const searchResults = useMemo(() => {
    const query = newFriendInput.trim().replace(/^@/, '').toLowerCase();
    if (!query) return [];
    return registeredCreators.filter((u) => {
      const handle = (u.handle || '').replace(/^@/, '').toLowerCase();
      const name = (u.displayName || '').toLowerCase();
      return handle.includes(query) || name.includes(query);
    });
  }, [newFriendInput, registeredCreators]);

  // Create Channel Modal state
  const [isCreatingChannel, setIsCreatingChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDesc, setNewChannelDesc] = useState('');

  // Active Peer for DM
  const activePeer = conversations[selectedUserId] || Object.values(conversations)[0];
  const activePeerId = activePeer?.id;

  // Active Group Room
  const activeGroup = chatRooms.find((r) => r.id === activeRoomId) || chatRooms[0];
  const currentGroupMessages = activeGroup ? groupMessages[activeGroup.id] || [] : [];

  // Filter messages between currentUser and activePeer
  const threadMessages = activePeerId
    ? messages.filter(
        (m) =>
          (m.senderId === currentUser.id && m.recipientId === activePeerId) ||
          (m.senderId === activePeerId && m.recipientId === currentUser.id)
      )
    : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !pendingImageUrl) return;

    if (activeTab === 'dm' && activePeerId) {
      onSendMessage(activePeerId, inputText, pendingImageUrl ? [pendingImageUrl] : undefined);
    } else if (activeTab === 'group' && activeGroup) {
      onSendGroupMessage(activeGroup.id, inputText, pendingImageUrl ? [pendingImageUrl] : undefined);
    }

    setInputText('');
    setPendingImageUrl(null);
  };

  // Real file upload reader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setPendingImageUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSendFriend = (e: React.FormEvent) => {
    e.preventDefault();
    setFriendErrorMsg(null);
    setFriendSuccessMsg(null);

    const query = newFriendInput.trim().replace(/^@/, '');
    if (!query) return;

    const res = onSendFriendRequest(query);
    if (res && typeof res === 'object') {
      if (!res.success) {
        setFriendErrorMsg(res.error || 'Could not send friend request.');
        setTimeout(() => setFriendErrorMsg(null), 5000);
        return;
      }
      setFriendSuccessMsg(res.message || `Friend request sent to @${query}!`);
      setNewFriendInput('');
      setTimeout(() => setFriendSuccessMsg(null), 5000);
    } else {
      setFriendSuccessMsg(`Friend request sent to @${query}!`);
      setNewFriendInput('');
      setTimeout(() => setFriendSuccessMsg(null), 4000);
    }
  };

  const handleQuickAddFriend = (target: User) => {
    setFriendErrorMsg(null);
    setFriendSuccessMsg(null);
    const res = onSendFriendRequest(target.id);
    if (res && typeof res === 'object') {
      if (!res.success) {
        setFriendErrorMsg(res.error || 'Could not send friend request.');
        setTimeout(() => setFriendErrorMsg(null), 5000);
        return;
      }
      setFriendSuccessMsg(res.message || `Friend request sent to @${target.handle}!`);
      setNewFriendInput('');
      setTimeout(() => setFriendSuccessMsg(null), 5000);
    } else {
      setFriendSuccessMsg(`Friend request sent to @${target.handle}!`);
      setNewFriendInput('');
      setTimeout(() => setFriendSuccessMsg(null), 4000);
    }
  };

  const handleUnfriend = (friendshipId: string, handleOrName: string) => {
    if (onDeclineFriendRequest) {
      onDeclineFriendRequest(friendshipId);
      setFriendSuccessMsg(`Unfriended ${handleOrName}. You can add them back anytime.`);
      setTimeout(() => setFriendSuccessMsg(null), 4000);
    }
  };

  const handleCreateChannelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;
    if (onCreateGroupRoom) {
      onCreateGroupRoom(newChannelName.trim(), newChannelDesc.trim());
    }
    setNewChannelName('');
    setNewChannelDesc('');
    setIsCreatingChannel(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Social Center Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight sm:text-2xl">
            Messages & Groups
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Chat directly with creators, collaborate on builds, or start a group channel.
          </p>
        </div>

        {/* Section Navigation Tabs & Create Group */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-xl bg-slate-900 border border-slate-800 p-1 text-xs">
            <button
              onClick={() => setActiveTab('dm')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'dm' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              DMs
            </button>
            <button
              onClick={() => setActiveTab('group')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeTab === 'group' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Groups
            </button>
            <button
              onClick={() => setActiveTab('friends')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'friends' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Friends</span>
              {myFriendships.incoming.length > 0 && (
                <span className="rounded-full bg-emerald-500 px-1.5 py-0.2 text-[10px] font-bold text-slate-950 animate-pulse">
                  {myFriendships.incoming.length}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={() => setIsCreatingChannel(true)}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Create Group</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md overflow-hidden min-h-[620px]">
        {/* Left Column: Channels / Peers / Friends List */}
        <div className="border-r border-slate-800 p-4 space-y-4">
          {activeTab === 'dm' && (
            <>
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-mono uppercase text-slate-400">
                  Direct Chats ({Object.keys(conversations).length})
                </h3>
              </div>

              {Object.keys(conversations).length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-800 p-6 text-center text-xs text-slate-400 space-y-2">
                  <MessageSquare className="h-6 w-6 text-slate-500 mx-auto" />
                  <p>No active 1-on-1 chats yet.</p>
                  <p className="text-[11px] text-slate-500">
                    Send a friend request in the "Friends" tab or message a creator from their project page!
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {Object.values(conversations).map((peer) => {
                    const isSelected = peer.id === activePeerId;
                    const hasUnread = messages.some(
                      (m) => m.senderId === peer.id && m.recipientId === currentUser.id && !m.isRead
                    );

                    return (
                      <button
                        key={peer.id}
                        onClick={() => onSelectUser(peer.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left ${
                          isSelected
                            ? 'bg-indigo-600/20 border border-indigo-500/40 text-white'
                            : 'hover:bg-slate-800/60 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={peer.avatarUrl}
                              alt={peer.displayName}
                              referrerPolicy="no-referrer"
                              className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-700"
                            />
                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
                          </div>
                          <div className="overflow-hidden">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold truncate text-white">
                                {peer.displayName}
                              </span>
                              <ShieldCheck className="h-3 w-3 text-emerald-400 shrink-0" />
                            </div>
                            <span className="text-[11px] font-mono text-slate-400 block truncate">
                              @{peer.handle}
                            </span>
                          </div>
                        </div>
                        {hasUnread && <span className="h-2 w-2 rounded-full bg-indigo-500" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {activeTab === 'group' && (
            <>
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-mono uppercase text-slate-400">
                  Channels ({chatRooms.length})
                </h3>
                {onCreateGroupRoom && (
                  <button
                    onClick={() => setIsCreatingChannel(true)}
                    className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>New</span>
                  </button>
                )}
              </div>

              {chatRooms.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-800 p-6 text-center text-xs text-slate-400 space-y-3">
                  <Hash className="h-6 w-6 text-slate-500 mx-auto" />
                  <p>No group channels created yet.</p>
                  <button
                    onClick={() => setIsCreatingChannel(true)}
                    className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
                  >
                    Create First Group Channel
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {chatRooms.map((room) => {
                    const isSelected = room.id === activeRoomId;
                    return (
                      <button
                        key={room.id}
                        onClick={() => setActiveRoomId(room.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left ${
                          isSelected
                            ? 'bg-indigo-600/20 border border-indigo-500/40 text-white'
                            : 'hover:bg-slate-800/60 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
                            {room.avatarUrl ? (
                              <img
                                src={room.avatarUrl}
                                alt={room.name}
                                referrerPolicy="no-referrer"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Hash className="h-5 w-5 text-indigo-400" />
                            )}
                          </div>
                          <div className="overflow-hidden">
                            <span className="text-xs font-semibold truncate text-white block">
                              {room.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {room.members?.length || 1} members
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-500" />
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {activeTab === 'friends' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-mono uppercase text-slate-400 px-2 mb-1.5 flex items-center justify-between">
                  <span>Add Friend (Registered Creators)</span>
                  <span className="text-[10px] text-indigo-400 lowercase">@handle or name</span>
                </h3>
                <form onSubmit={handleSendFriend} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search registered creator @handle..."
                      value={newFriendInput}
                      onChange={(e) => setNewFriendInput(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!newFriendInput.trim()}
                    className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-40 transition-colors flex items-center gap-1"
                    title="Send Friend Request"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Add</span>
                  </button>
                </form>
              </div>

              {/* Status messages */}
              {friendSuccessMsg && (
                <div className="rounded-xl bg-emerald-950/40 border border-emerald-800/60 p-2.5 text-[11px] text-emerald-300 flex items-start gap-2 animate-in fade-in">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{friendSuccessMsg}</span>
                </div>
              )}

              {friendErrorMsg && (
                <div className="rounded-xl bg-rose-950/40 border border-rose-800/60 p-2.5 text-[11px] text-rose-300 flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{friendErrorMsg}</span>
                </div>
              )}

              {/* Live search matches */}
              {newFriendInput.trim() && (
                <div className="space-y-1.5 border border-slate-800/80 rounded-xl bg-slate-950/60 p-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase px-1 block">
                    Matching Registered Accounts ({searchResults.length})
                  </span>
                  {searchResults.length === 0 ? (
                    <div className="p-3 text-center space-y-1">
                      <p className="text-xs text-rose-300 font-medium">
                        No registered creator matches "@{newFriendInput.trim().replace(/^@/, '')}"
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Only creators who have completed the sign-up process can be found and friended.
                      </p>
                    </div>
                  ) : (
                    searchResults.map((user) => {
                      const isFriend = myFriendships.accepted.some((f) => f.otherUser.id === user.id);
                      const isOutgoing = myFriendships.outgoing.some((f) => f.otherUser.id === user.id);
                      const isIncoming = myFriendships.incoming.find((f) => f.otherUser.id === user.id);

                      return (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800/70"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <img
                              src={user.avatarUrl}
                              alt={user.displayName}
                              referrerPolicy="no-referrer"
                              className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-700 shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="text-xs font-semibold text-white block truncate">
                                {user.displayName}
                              </span>
                              <div className="flex items-center gap-1.5 text-[10px]">
                                <span className="font-mono text-slate-400 truncate">@{user.handle}</span>
                                <span className="text-amber-400 flex items-center gap-0.5">
                                  <Star className="h-2.5 w-2.5 fill-amber-400" />
                                  {user.reputationScore}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0 ml-2">
                            {isFriend ? (
                              <button
                                onClick={() => {
                                  onSelectUser(user.id);
                                  setActiveTab('dm');
                                }}
                                className="flex items-center gap-1 rounded-md bg-indigo-600/20 border border-indigo-500/30 px-2 py-1 text-[10px] font-semibold text-indigo-300 hover:bg-indigo-600 hover:text-white transition-colors"
                              >
                                <MessageSquare className="h-3 w-3" />
                                Chat
                              </button>
                            ) : isOutgoing ? (
                              <span className="flex items-center gap-1 rounded-md bg-amber-500/10 border border-amber-500/30 px-2 py-1 text-[10px] font-mono text-amber-400">
                                <Clock className="h-3 w-3" />
                                Sent
                              </span>
                            ) : isIncoming ? (
                              <button
                                onClick={() => onAcceptFriendRequest(isIncoming.friendship.id)}
                                className="flex items-center gap-1 rounded-md bg-emerald-600 px-2 py-1 text-[10px] font-semibold text-white hover:bg-emerald-500"
                              >
                                <Check className="h-3 w-3" />
                                Accept
                              </button>
                            ) : (
                              <button
                                onClick={() => handleQuickAddFriend(user)}
                                className="flex items-center gap-1 rounded-md bg-indigo-600 px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-indigo-500 transition-colors"
                              >
                                <UserPlus className="h-3 w-3" />
                                Add
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* 1. INCOMING FRIEND REQUESTS */}
              {myFriendships.incoming.length > 0 && (
                <div className="pt-1">
                  <div className="flex items-center justify-between px-2 mb-2">
                    <h4 className="text-xs font-mono uppercase text-emerald-400 font-bold flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Incoming Requests ({myFriendships.incoming.length})
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {myFriendships.incoming.map(({ friendship, otherUser }) => (
                      <div
                        key={friendship.id}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={otherUser.avatarUrl}
                            alt={otherUser.displayName}
                            referrerPolicy="no-referrer"
                            className="h-8 w-8 rounded-full object-cover ring-2 ring-emerald-500/40 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-semibold text-white block truncate">
                              {otherUser.displayName}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px]">
                              <span className="font-mono text-slate-400">@{otherUser.handle}</span>
                              <span className="text-amber-400 flex items-center gap-0.5">
                                <Star className="h-2.5 w-2.5 fill-amber-400" />
                                {otherUser.reputationScore}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <button
                            onClick={() => onAcceptFriendRequest(friendship.id)}
                            className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-500 transition-colors shadow-sm"
                            title="Accept Request"
                          >
                            <Check className="h-3 w-3" />
                            Accept
                          </button>
                          {onDeclineFriendRequest && (
                            <button
                              onClick={() => onDeclineFriendRequest(friendship.id)}
                              className="rounded-lg border border-slate-700 bg-slate-800 p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition-colors"
                              title="Decline Request"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. OUTGOING SENT REQUESTS */}
              {myFriendships.outgoing.length > 0 && (
                <div className="pt-1">
                  <h4 className="text-xs font-mono uppercase text-slate-400 px-2 mb-2 flex items-center gap-1.5">
                    <Clock className="h-3 w-3 text-amber-400" />
                    Sent Requests ({myFriendships.outgoing.length})
                  </h4>
                  <div className="space-y-1.5">
                    {myFriendships.outgoing.map(({ friendship, otherUser }) => (
                      <div
                        key={friendship.id}
                        className="flex items-center justify-between p-2 rounded-xl border border-slate-800 bg-slate-950/40"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={otherUser.avatarUrl}
                            alt={otherUser.displayName}
                            referrerPolicy="no-referrer"
                            className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-700 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-semibold text-white block truncate">
                              {otherUser.displayName}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 block truncate">
                              @{otherUser.handle}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                            Pending
                          </span>
                          {onDeclineFriendRequest && (
                            <button
                              onClick={() => onDeclineFriendRequest(friendship.id)}
                              className="text-slate-500 hover:text-rose-400 text-xs p-1"
                              title="Cancel Request"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. CONNECTED FRIENDS LIST */}
              <div className="pt-2">
                <h4 className="text-xs font-mono uppercase text-slate-400 px-2 mb-2 flex items-center justify-between">
                  <span>Connected Friends ({myFriendships.accepted.length})</span>
                  <span className="text-[10px] text-emerald-400">Can Chat</span>
                </h4>

                {myFriendships.accepted.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-slate-800 p-4 text-center space-y-2">
                    <p className="text-xs text-slate-400">No friends connected yet.</p>
                    <p className="text-[11px] text-slate-500">
                      Search signed-up creators above to send a friend request so you can communicate!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {myFriendships.accepted.map(({ friendship, otherUser }) => (
                      <div
                        key={friendship.id}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-950/40 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative shrink-0">
                            <img
                              src={otherUser.avatarUrl}
                              alt={otherUser.displayName}
                              referrerPolicy="no-referrer"
                              className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-700"
                            />
                            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-semibold text-white block truncate">
                              {otherUser.displayName}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px]">
                              <span className="font-mono text-slate-400">@{otherUser.handle}</span>
                              <span className="text-amber-400 flex items-center gap-0.5">
                                <Star className="h-2.5 w-2.5 fill-amber-400" />
                                {otherUser.reputationScore}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <button
                            onClick={() => {
                              onSelectUser(otherUser.id);
                              setActiveTab('dm');
                            }}
                            className="flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer"
                            title="Direct Message"
                          >
                            <MessageSquare className="h-3 w-3" />
                            Message
                          </button>
                          {onDeclineFriendRequest && (
                            <button
                              type="button"
                              onClick={() => handleUnfriend(friendship.id, `@${otherUser.handle}`)}
                              className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/60 px-2 py-1 text-[11px] font-medium text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-colors cursor-pointer"
                              title={`Unfriend @${otherUser.handle}`}
                            >
                              <UserMinus className="h-3 w-3" />
                              <span className="hidden xl:inline">Unfriend</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Columns: Active Chat Thread (2 cols) */}
        <div className="md:col-span-2 flex flex-col justify-between p-4 bg-slate-950/40">
          {/* DM Active View */}
          {activeTab === 'dm' && (
            activePeer ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={activePeer.avatarUrl}
                      alt={activePeer.displayName}
                      referrerPolicy="no-referrer"
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-emerald-500/30"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                        {activePeer.displayName}
                        <span className="font-mono text-xs text-slate-400">(@{activePeer.handle})</span>
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {activePeer.bio || 'Teen maker & builder'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                      <Circle className="h-2 w-2 fill-emerald-400" />
                      Live Chat
                    </span>
                    {onDeclineFriendRequest && myFriendships.accepted.some((f) => f.otherUser.id === activePeer.id) && (
                      <button
                        type="button"
                        onClick={() => {
                          const f = myFriendships.accepted.find((fr) => fr.otherUser.id === activePeer.id);
                          if (f) handleUnfriend(f.friendship.id, `@${activePeer.handle}`);
                        }}
                        className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title={`Unfriend @${activePeer.handle}`}
                      >
                        <UserMinus className="h-3 w-3" />
                        <span>Unfriend</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Thread Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                  {threadMessages.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-xs text-slate-500 font-mono text-center p-6">
                      Send a message to @{activePeer.handle} to discuss builds, collaborate on games, or share photos!
                    </div>
                  ) : (
                    threadMessages.map((msg) => {
                      const isMe = msg.senderId === currentUser.id;
                      return (
                        <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                              isMe
                                ? 'bg-indigo-600 text-white rounded-br-sm'
                                : 'bg-slate-800/90 text-slate-200 rounded-bl-sm border border-slate-700/60'
                            }`}
                          >
                            {msg.text && <p>{msg.text}</p>}

                            {/* Inline Image Attachment */}
                            {msg.imageUrls && msg.imageUrls.length > 0 && (
                              <div className="mt-2.5 overflow-hidden rounded-xl border border-white/10 max-h-56">
                                <img
                                  src={msg.imageUrls[0]}
                                  alt="Attachment"
                                  referrerPolicy="no-referrer"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}

                            {/* Embedded Collaboration Invite Card */}
                            {msg.inviteCard && (
                              <div className="mt-3 rounded-xl border border-indigo-400/30 bg-slate-950/80 p-3 text-slate-200">
                                <div className="flex items-center gap-1.5 text-[10px] font-mono text-indigo-300 uppercase mb-1">
                                  <Briefcase className="h-3 w-3" />
                                  Project Collaboration Invite
                                </div>
                                <h5 className="font-semibold text-xs text-white">
                                  {msg.inviteCard.projectTitle}
                                </h5>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  Role: <span className="text-emerald-400 font-mono">{msg.inviteCard.role}</span>
                                </p>
                                <div className="mt-3 flex items-center gap-2">
                                  {msg.inviteCard.status === 'PENDING' ? (
                                    <>
                                      <button
                                        onClick={() => onUpdateInviteStatus(msg.inviteCard!.id, 'ACCEPTED')}
                                        className="flex items-center gap-1 rounded-md bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-500"
                                      >
                                        <Check className="h-3 w-3" />
                                        Accept Invite
                                      </button>
                                      <button
                                        onClick={() => onUpdateInviteStatus(msg.inviteCard!.id, 'DECLINED')}
                                        className="flex items-center gap-1 rounded-md bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300 hover:bg-slate-700"
                                      >
                                        <X className="h-3 w-3" />
                                        Decline
                                      </button>
                                    </>
                                  ) : (
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                                      Status: {msg.inviteCard.status}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          <span className="mt-1 text-[10px] font-mono text-slate-500 px-1">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-2">
                <MessageSquare className="h-8 w-8 text-slate-600" />
                <h4 className="text-sm font-semibold text-white">No Conversation Selected</h4>
                <p className="text-xs text-slate-500 max-w-xs">
                  Select a user or add a friend to start chatting!
                </p>
              </div>
            )
          )}

          {/* Group Active View */}
          {activeTab === 'group' && (
            activeGroup ? (
              <>
                {/* Group Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center">
                      {activeGroup.avatarUrl ? (
                        <img
                          src={activeGroup.avatarUrl}
                          alt={activeGroup.name}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Hash className="h-4 w-4 text-indigo-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{activeGroup.name}</h4>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{activeGroup.description || 'Creator Channel'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                      className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200 hover:text-white"
                    >
                      <Users className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Members ({activeGroup.members?.length || 1})</span>
                    </button>
                  </div>
                </div>

                {/* Group Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                  {currentGroupMessages.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-xs text-slate-500 font-mono text-center p-6">
                      Welcome to #{activeGroup.name}! Say hi to other creators and share what you are working on.
                    </div>
                  ) : (
                    currentGroupMessages.map((msg) => {
                      const isMe = msg.senderId === currentUser.id;
                      return (
                        <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center gap-1.5 mb-1 px-1">
                            <span className="text-[11px] font-semibold text-slate-300">{msg.sender.displayName}</span>
                            <span className="text-[10px] font-mono text-slate-500">@{msg.sender.handle}</span>
                          </div>
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                              isMe
                                ? 'bg-indigo-600 text-white rounded-br-sm'
                                : 'bg-slate-800/90 text-slate-200 rounded-bl-sm border border-slate-700/60'
                            }`}
                          >
                            {msg.content && <p>{msg.content}</p>}

                            {/* Inline Image Attachment */}
                            {msg.imageUrls && msg.imageUrls.length > 0 && (
                              <div className="mt-2.5 overflow-hidden rounded-xl border border-white/10 max-h-56">
                                <img
                                  src={msg.imageUrls[0]}
                                  alt="Attachment"
                                  referrerPolicy="no-referrer"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                          <span className="mt-1 text-[10px] font-mono text-slate-500 px-1">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-2">
                <Hash className="h-8 w-8 text-slate-600" />
                <h4 className="text-sm font-semibold text-white">No Group Selected</h4>
                <p className="text-xs text-slate-500">Create or select a channel on the left to start chatting!</p>
              </div>
            )
          )}

          {/* Friends Tab View */}
          {activeTab === 'friends' && (
            <div className="flex-1 flex flex-col p-4 sm:p-6 space-y-6 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-400" />
                    <span>Creator Friends Network</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Connect and collaborate strictly with real creators who have signed up.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Real Creators
                  </span>
                </div>
              </div>

              {/* Network Stats Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                    Connected Friends
                  </span>
                  <span className="text-2xl font-bold text-white">
                    {myFriendships.accepted.length}
                  </span>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                    Incoming Requests
                  </span>
                  <span className={`text-2xl font-bold ${myFriendships.incoming.length > 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {myFriendships.incoming.length}
                  </span>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3.5 text-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1">
                    Sent Requests
                  </span>
                  <span className="text-2xl font-bold text-slate-300">
                    {myFriendships.outgoing.length}
                  </span>
                </div>
              </div>

              {/* Highlight incoming requests if present */}
              {myFriendships.incoming.length > 0 && (
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-300 font-semibold text-xs">
                    <AlertCircle className="h-4 w-4 text-emerald-400" />
                    <span>Action Required: {myFriendships.incoming.length} Creator(s) want to connect!</span>
                  </div>
                  <div className="space-y-2">
                    {myFriendships.incoming.map(({ friendship, otherUser }) => (
                      <div
                        key={friendship.id}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={otherUser.avatarUrl}
                            alt={otherUser.displayName}
                            referrerPolicy="no-referrer"
                            className="h-8 w-8 rounded-full object-cover ring-1 ring-emerald-500/50"
                          />
                          <div>
                            <span className="text-xs font-semibold text-white block">
                              {otherUser.displayName}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              @{otherUser.handle} • ⭐ {otherUser.reputationScore} Points
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onAcceptFriendRequest(friendship.id)}
                            className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 shadow-sm cursor-pointer"
                          >
                            <Check className="h-3.5 w-3.5" />
                            Accept Request
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Connected Friends Quick Chat Grid */}
              {myFriendships.accepted.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase text-slate-400">
                    Your Connected Friends ({myFriendships.accepted.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {myFriendships.accepted.map(({ friendship, otherUser }) => (
                      <div
                        key={friendship.id}
                        className="flex items-center justify-between p-3 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative shrink-0">
                            <img
                              src={otherUser.avatarUrl}
                              alt={otherUser.displayName}
                              referrerPolicy="no-referrer"
                              className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-700"
                            />
                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-semibold text-white block truncate">
                              {otherUser.displayName}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 truncate block">
                              @{otherUser.handle} • ⭐ {otherUser.reputationScore} Points
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <button
                            onClick={() => {
                              onSelectUser(otherUser.id);
                              setActiveTab('dm');
                            }}
                            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 shadow-sm transition-all cursor-pointer"
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>Chat</span>
                          </button>
                          {onDeclineFriendRequest && (
                            <button
                              type="button"
                              onClick={() => handleUnfriend(friendship.id, `@${otherUser.handle}`)}
                              className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-400 hover:border-rose-500/30 hover:bg-rose-500/10 transition-colors cursor-pointer"
                              title={`Unfriend @${otherUser.handle}`}
                            >
                              <UserMinus className="h-3.5 w-3.5" />
                              <span>Unfriend</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-800 p-6 text-center space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mx-auto text-indigo-400">
                    <Users className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-white">No Friends Connected Yet</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Search any registered creator on the left panel to send a friend request. Once accepted, you can chat in real time.
                    </p>
                  </div>

                  {registeredCreators.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[10px] font-mono text-slate-500 uppercase block mb-2">
                        Signed-up Creators on locked in.
                      </span>
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {registeredCreators.slice(0, 4).map((c) => (
                          <button
                            key={c.id}
                            onClick={() => handleQuickAddFriend(c)}
                            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-colors"
                          >
                            <img
                              src={c.avatarUrl}
                              alt={c.displayName}
                              className="h-4 w-4 rounded-full"
                            />
                            <span>@{c.handle}</span>
                            <UserPlus className="h-3 w-3 text-indigo-400 ml-1" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Anti-Fabrication Guarantee Notice */}
              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/40 p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-300 font-semibold text-xs">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Real Accounts Communication Policy</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Only accounts that have completed the sign-up process are saved globally in locked in. Non-existing accounts are strictly never generated or fabricated. When you add a creator, they receive your friend request upon sign-in and can accept to enable two-way instant messaging.
                </p>
              </div>
            </div>
          )}

          {/* Input Bar (For DM & Group) */}
          {activeTab !== 'friends' && (activePeer || activeGroup) && (
            <form onSubmit={handleSend} className="mt-4 border-t border-slate-800 pt-3 space-y-2">
              {/* Media Preview chip */}
              {pendingImageUrl && (
                <div className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 p-2 text-xs">
                  <div className="h-8 w-8 rounded-lg overflow-hidden bg-slate-950">
                    <img src={pendingImageUrl} alt="attachment preview" className="h-full w-full object-cover" />
                  </div>
                  <span className="text-slate-300 font-mono text-[11px] truncate flex-1">
                    Photo attached
                  </span>
                  <button
                    type="button"
                    onClick={() => setPendingImageUrl(null)}
                    className="text-slate-500 hover:text-rose-400 font-bold px-1"
                  >
                    ×
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <label
                  className="rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-400 hover:text-white hover:border-slate-700 cursor-pointer transition-colors"
                  title="Upload an image from your device"
                >
                  <ImageIcon className="h-4 w-4 text-indigo-400" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <input
                  type="text"
                  placeholder={
                    activeTab === 'dm'
                      ? `Message @${activePeer?.handle || ''}...`
                      : `Message #${activeGroup?.name || ''}...`
                  }
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() && !pendingImageUrl}
                  className="rounded-xl bg-indigo-600 p-2.5 text-white hover:bg-indigo-500 active:scale-95 transition-all disabled:opacity-40"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Group Member Drawer */}
        <AnimatePresence>
          {isDrawerOpen && activeGroup && (
            <motion.div
              initial={{ opacity: 0, x: 260 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 260 }}
              className="absolute right-0 top-0 bottom-0 w-64 bg-slate-900 border-l border-slate-800 p-4 shadow-2xl z-30 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <h4 className="text-xs font-mono uppercase text-white flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-indigo-400" />
                    Channel Members
                  </h4>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-2.5">
                  {activeGroup.members?.map((member) => (
                    <div key={member.userId} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={member.user.avatarUrl}
                          alt={member.user.displayName}
                          referrerPolicy="no-referrer"
                          className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-700"
                        />
                        <div>
                          <span className="text-xs font-semibold text-white block">
                            {member.user.displayName}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            @{member.user.handle}
                          </span>
                        </div>
                      </div>

                      {member.role === 'ADMIN' ? (
                        <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded">
                          <Crown className="h-3 w-3" />
                          Admin
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-500">Member</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-800 pt-3 text-[11px] font-mono text-slate-400 text-center">
                Real Teen Creators Only
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Create Group Channel Modal */}
        <AnimatePresence>
          {isCreatingChannel && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white">Create Group Channel</h3>
                  <button onClick={() => setIsCreatingChannel(false)} className="text-slate-400 hover:text-white">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateChannelSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                      Channel Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 🎨 3D Print & Prop Makers, 🎮 Unity Game Jam"
                      value={newChannelName}
                      onChange={(e) => setNewChannelName(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                      Description / Topic
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Share slicing tips, print fails, and finished prints"
                      value={newChannelDesc}
                      onChange={(e) => setNewChannelDesc(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatingChannel(false)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!newChannelName.trim()}
                      className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
                    >
                      Create Channel
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
