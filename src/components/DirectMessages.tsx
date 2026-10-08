import React, { useState, useMemo, useEffect } from 'react';
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
import { Mascot } from './Mascot';

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
  onCreateGroupRoom?: (name: string, description: string, initialMembers?: User[]) => void;
  onAddGroupMember?: (roomId: string, user: User) => void;
  onRemoveGroupMember?: (roomId: string, userId: string) => void;
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
  onAddGroupMember,
  onRemoveGroupMember,
  onUpdateInviteStatus,
  onAcceptFriendRequest,
  onDeclineFriendRequest,
  onSendFriendRequest,
  selectedUserId,
  onSelectUser,
}) => {
  const [activeTab, setActiveTab] = useState<'dm' | 'group' | 'friends'>('dm');
  const [activeRoomId, setActiveRoomId] = useState<string>(chatRooms[0]?.id || '');

  // Keep activeRoomId in sync when rooms are created or deleted
  useEffect(() => {
    if (chatRooms.length === 0) {
      setActiveRoomId('');
    } else if (!chatRooms.some((r) => r.id === activeRoomId)) {
      setActiveRoomId(chatRooms[0].id);
    }
  }, [chatRooms, activeRoomId]);
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
  const [selectedInitialMembers, setSelectedInitialMembers] = useState<User[]>([]);

  // Group Member Management state
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [addMemberQuery, setAddMemberQuery] = useState('');
  const [groupActionToast, setGroupActionToast] = useState<string | null>(null);

  const showGroupToast = (msg: string) => {
    setGroupActionToast(msg);
    setTimeout(() => setGroupActionToast(null), 3500);
  };

  // Active Peer for DM
  const activePeer = conversations[selectedUserId] || Object.values(conversations)[0];
  const activePeerId = activePeer?.id;

  // Active Group Room
  const activeGroup = chatRooms.find((r) => r.id === activeRoomId) || chatRooms[0];
  const currentGroupMessages = activeGroup ? groupMessages[activeGroup.id] || [] : [];

  const addMemberCandidates = useMemo(() => {
    if (!activeGroup) return [];
    const query = addMemberQuery.trim().replace(/^@/, '').toLowerCase();
    return registeredCreators.filter((u) => {
      const handle = (u.handle || '').replace(/^@/, '').toLowerCase();
      const name = (u.displayName || '').toLowerCase();
      return !query || handle.includes(query) || name.includes(query);
    });
  }, [activeGroup, addMemberQuery, registeredCreators]);

  const handleAddMember = (targetUser: User) => {
    if (!activeGroup) return;
    if (onAddGroupMember) {
      onAddGroupMember(activeGroup.id, targetUser);
      showGroupToast(`Added @${targetUser.handle} to #${activeGroup.name}!`);
    }
  };

  const handleRemoveMember = (targetUserId: string, targetHandle: string) => {
    if (!activeGroup) return;
    if (onRemoveGroupMember) {
      onRemoveGroupMember(activeGroup.id, targetUserId);
      showGroupToast(`Removed @${targetHandle} from #${activeGroup.name}.`);
    }
  };

  const handleLeaveGroup = () => {
    if (!activeGroup) return;
    if (onRemoveGroupMember) {
      onRemoveGroupMember(activeGroup.id, currentUser.id);
      showGroupToast(`You left #${activeGroup.name}.`);
      setIsDrawerOpen(false);
    }
  };

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
      onCreateGroupRoom(newChannelName.trim(), newChannelDesc.trim(), selectedInitialMembers);
    }
    setNewChannelName('');
    setNewChannelDesc('');
    setSelectedInitialMembers([]);
    setIsCreatingChannel(false);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Social Center Header */}
      {groupActionToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-2xl shadow-indigo-600/40 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="h-4 w-4 text-emerald-300" />
          <span>{groupActionToast}</span>
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-sky-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Mascot type="cheerful" size="sm" />
            <h2 className="text-xl font-black text-slate-900 tracking-tight sm:text-2xl">
              Messages & Chat
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Chat directly with other creators, collaborate on projects, or join group channels.
          </p>
        </div>

        {/* Section Navigation Tabs & Create Group */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-full bg-sky-50 border-2 border-sky-200 p-1 text-xs">
            <button
              onClick={() => setActiveTab('dm')}
              className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                activeTab === 'dm'
                  ? 'bg-sky-400 text-slate-950 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              DMs
            </button>
            <button
              onClick={() => setActiveTab('group')}
              className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer ${
                activeTab === 'group'
                  ? 'bg-amber-300 text-slate-950 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Groups
            </button>
            <button
              onClick={() => setActiveTab('friends')}
              className={`px-3.5 py-1.5 rounded-full font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'friends'
                  ? 'bg-emerald-300 text-slate-950 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Friends</span>
              {myFriendships.incoming.length > 0 && (
                <span className="rounded-full bg-emerald-500 px-1.5 py-0.2 text-[10px] font-bold text-white animate-pulse">
                  {myFriendships.incoming.length}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={() => setIsCreatingChannel(true)}
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-sky-400 via-emerald-300 to-amber-200 px-4 py-2 text-xs font-black text-slate-950 shadow-md shadow-sky-300/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create Group</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 rounded-3xl border-2 border-sky-200 bg-white shadow-xl overflow-hidden min-h-[620px] text-slate-800">
        {/* Left Column: Channels / Peers / Friends List */}
        <div className="border-r border-sky-100 p-4 space-y-4 bg-sky-50/20">
          {activeTab === 'dm' && (
            <>
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-bold uppercase text-sky-800 tracking-wide">
                  Direct Chats ({Object.keys(conversations).length})
                </h3>
              </div>

              {Object.keys(conversations).length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-sky-200 p-6 text-center text-xs text-slate-500 space-y-2 bg-sky-50/30">
                  <MessageSquare className="h-6 w-6 text-sky-400 mx-auto" />
                  <p className="font-bold text-slate-700">No active 1-on-1 chats yet.</p>
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
                        className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all text-left cursor-pointer ${
                          isSelected
                            ? 'bg-sky-100 border-2 border-sky-300 text-slate-950 shadow-2xs font-bold'
                            : 'hover:bg-slate-50 text-slate-700 border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={peer.avatarUrl}
                              alt={peer.displayName}
                              referrerPolicy="no-referrer"
                              className="h-10 w-10 rounded-full object-cover ring-2 ring-sky-200"
                            />
                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
                          </div>
                          <div className="overflow-hidden">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black truncate text-slate-900">
                                {peer.displayName}
                              </span>
                              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            </div>
                            <span className="text-[11px] font-mono text-slate-400 block truncate">
                              @{peer.handle}
                            </span>
                          </div>
                        </div>
                        {hasUnread && <span className="h-2 w-2 rounded-full bg-sky-500" />}
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
                <h3 className="text-xs font-bold uppercase text-amber-800 tracking-wide">
                  Channels ({chatRooms.length})
                </h3>
                {onCreateGroupRoom && (
                  <button
                    onClick={() => setIsCreatingChannel(true)}
                    className="flex items-center gap-1 text-xs text-amber-800 hover:text-amber-950 font-bold cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>New</span>
                  </button>
                )}
              </div>

              {chatRooms.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-amber-200 p-6 text-center text-xs text-slate-500 space-y-3 bg-amber-50/20">
                  <Hash className="h-6 w-6 text-amber-500 mx-auto" />
                  <p className="font-bold text-slate-700">No group channels created yet.</p>
                  <button
                    onClick={() => setIsCreatingChannel(true)}
                    className="rounded-full bg-gradient-to-r from-sky-400 via-emerald-300 to-amber-200 px-4 py-2 text-xs font-black text-slate-950 hover:scale-105 active:scale-95 transition-all shadow-2xs cursor-pointer"
                  >
                    Create First Group Channel
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {chatRooms.map((room) => {
                    const isSelected = room.id === activeRoomId;
                    return (
                      <button
                        key={room.id}
                        onClick={() => setActiveRoomId(room.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all text-left cursor-pointer ${
                          isSelected
                            ? 'bg-amber-100 border-2 border-amber-300 text-slate-950 shadow-2xs font-bold'
                            : 'hover:bg-slate-50 text-slate-700 border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-2xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shadow-2xs">
                            {room.avatarUrl ? (
                              <img
                                src={room.avatarUrl}
                                alt={room.name}
                                referrerPolicy="no-referrer"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Hash className="h-5 w-5 text-amber-600" />
                            )}
                          </div>
                          <div className="overflow-hidden">
                            <span className="text-xs font-black truncate text-slate-900 block">
                              {room.name}
                            </span>
                            <span className="text-[10px] text-slate-500 font-bold">
                              {room.members?.length || 1} members
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
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
                <h3 className="text-xs font-bold uppercase text-emerald-800 px-2 mb-1.5 flex items-center justify-between">
                  <span>Add Friend (Registered Creators)</span>
                  <span className="text-[10px] text-emerald-700 font-bold lowercase">@handle or name</span>
                </h3>
                <form onSubmit={handleSendFriend} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search registered creator @handle..."
                      value={newFriendInput}
                      onChange={(e) => setNewFriendInput(e.target.value)}
                      className="w-full rounded-2xl border-2 border-slate-200 bg-white pl-8 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!newFriendInput.trim()}
                    className="rounded-full bg-emerald-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-300 disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                    title="Send Friend Request"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Add</span>
                  </button>
                </form>
              </div>

              {/* Status messages */}
              {friendSuccessMsg && (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-bold flex items-start gap-2 animate-in fade-in">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{friendSuccessMsg}</span>
                </div>
              )}

              {friendErrorMsg && (
                <div className="rounded-2xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800 font-bold flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{friendErrorMsg}</span>
                </div>
              )}

              {/* Live search matches */}
              {newFriendInput.trim() && (
                <div className="space-y-1.5 border-2 border-slate-100 rounded-2xl bg-white p-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase px-1 block">
                    Matching Registered Accounts ({searchResults.length})
                  </span>
                  {searchResults.length === 0 ? (
                    <div className="p-3 text-center space-y-1">
                      <p className="text-xs text-rose-600 font-bold">
                        No registered creator matches "@{newFriendInput.trim().replace(/^@/, '')}"
                      </p>
                      <p className="text-[10px] text-slate-500 font-medium">
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
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <img
                              src={user.avatarUrl}
                              alt={user.displayName}
                              referrerPolicy="no-referrer"
                              className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-300 shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-slate-900 block truncate">
                                {user.displayName}
                              </span>
                              <div className="flex items-center gap-1.5 text-[10px]">
                                <span className="font-mono text-slate-500 truncate">@{user.handle}</span>
                                <span className="text-amber-600 font-bold flex items-center gap-0.5">
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
                                className="flex items-center gap-1 rounded-full bg-sky-100 border border-sky-300 px-3 py-1 text-xs font-bold text-sky-900 hover:bg-sky-200 transition-colors shadow-2xs cursor-pointer"
                              >
                                <MessageSquare className="h-3 w-3 text-sky-700" />
                                Chat
                              </button>
                            ) : isOutgoing ? (
                              <span className="flex items-center gap-1 rounded-full bg-amber-50 border border-amber-300 px-2.5 py-1 text-[10px] font-bold text-amber-800">
                                <Clock className="h-3 w-3" />
                                Sent
                              </span>
                            ) : isIncoming ? (
                              <button
                                onClick={() => onAcceptFriendRequest(isIncoming.friendship.id)}
                                className="flex items-center gap-1 rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold text-slate-950 hover:bg-emerald-300 shadow-2xs cursor-pointer"
                              >
                                <Check className="h-3 w-3" />
                                Accept
                              </button>
                            ) : (
                              <button
                                onClick={() => handleQuickAddFriend(user)}
                                className="flex items-center gap-1 rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold text-slate-950 hover:bg-emerald-300 shadow-2xs transition-colors cursor-pointer"
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
                    <h4 className="text-xs font-bold uppercase text-emerald-800 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Incoming Requests ({myFriendships.incoming.length})
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {myFriendships.incoming.map(({ friendship, otherUser }) => (
                      <div
                        key={friendship.id}
                        className="flex items-center justify-between p-2.5 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 shadow-2xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={otherUser.avatarUrl}
                            alt={otherUser.displayName}
                            referrerPolicy="no-referrer"
                            className="h-8 w-8 rounded-full object-cover ring-2 ring-emerald-300 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-slate-900 block truncate">
                              {otherUser.displayName}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px]">
                              <span className="font-mono text-slate-500">@{otherUser.handle}</span>
                              <span className="text-amber-600 font-bold flex items-center gap-0.5">
                                <Star className="h-2.5 w-2.5 fill-amber-400" />
                                {otherUser.reputationScore}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          <button
                            onClick={() => onAcceptFriendRequest(friendship.id)}
                            className="flex items-center gap-1 rounded-full bg-emerald-400 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-300 transition-colors shadow-2xs cursor-pointer"
                            title="Accept Request"
                          >
                            <Check className="h-3 w-3" />
                            Accept
                          </button>
                          {onDeclineFriendRequest && (
                            <button
                              onClick={() => onDeclineFriendRequest(friendship.id)}
                              className="rounded-full border border-slate-200 bg-white p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
                  <h4 className="text-xs font-bold uppercase text-slate-500 px-2 mb-2 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-amber-500" />
                    Sent Requests ({myFriendships.outgoing.length})
                  </h4>
                  <div className="space-y-1.5">
                    {myFriendships.outgoing.map(({ friendship, otherUser }) => (
                      <div
                        key={friendship.id}
                        className="flex items-center justify-between p-2 rounded-2xl border border-slate-200 bg-slate-50/70"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={otherUser.avatarUrl}
                            alt={otherUser.displayName}
                            referrerPolicy="no-referrer"
                            className="h-7 w-7 rounded-full object-cover ring-1 ring-slate-300 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-slate-900 block truncate">
                              {otherUser.displayName}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 block truncate">
                              @{otherUser.handle}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                            Pending
                          </span>
                          {onDeclineFriendRequest && (
                            <button
                              onClick={() => onDeclineFriendRequest(friendship.id)}
                              className="text-slate-400 hover:text-rose-600 text-xs p-1 cursor-pointer"
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
                <h4 className="text-xs font-bold uppercase text-slate-600 px-2 mb-2 flex items-center justify-between">
                  <span>Connected Friends ({myFriendships.accepted.length})</span>
                  <span className="text-[10px] text-emerald-700 font-bold">Can Chat</span>
                </h4>

                {myFriendships.accepted.length === 0 ? (
                  <div className="rounded-2xl border-2 border-dashed border-slate-200 p-4 text-center space-y-2 bg-slate-50/40">
                    <p className="text-xs text-slate-600 font-bold">No friends connected yet.</p>
                    <p className="text-[11px] text-slate-500">
                      Search signed-up creators above to send a friend request so you can communicate!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {myFriendships.accepted.map(({ friendship, otherUser }) => (
                      <div
                        key={friendship.id}
                        className="flex items-center justify-between p-2.5 rounded-2xl border-2 border-slate-100 bg-white hover:border-sky-200 transition-colors shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative shrink-0">
                            <img
                              src={otherUser.avatarUrl}
                              alt={otherUser.displayName}
                              referrerPolicy="no-referrer"
                              className="h-8 w-8 rounded-full object-cover ring-2 ring-sky-200"
                            />
                            <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-white" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-black text-slate-900 block truncate">
                              {otherUser.displayName}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px]">
                              <span className="font-mono text-slate-500">@{otherUser.handle}</span>
                              <span className="text-amber-600 font-bold flex items-center gap-0.5">
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
                            className="flex items-center gap-1 rounded-full bg-sky-100 border border-sky-300 px-3 py-1.5 text-xs font-bold text-sky-900 hover:bg-sky-200 transition-colors shadow-2xs cursor-pointer"
                            title="Direct Message"
                          >
                            <MessageSquare className="h-3 w-3 text-sky-700" />
                            Message
                          </button>
                          {onDeclineFriendRequest && (
                            <button
                              type="button"
                              onClick={() => handleUnfriend(friendship.id, `@${otherUser.handle}`)}
                              className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-500 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition-colors cursor-pointer"
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
        <div className="md:col-span-2 flex flex-col justify-between p-4 bg-slate-50/40">
          {/* DM Active View */}
          {activeTab === 'dm' && (
            activePeer ? (
              <>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-sky-100 pb-3 mb-4 bg-sky-50/40 -mx-4 -mt-4 p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={activePeer.avatarUrl}
                      alt={activePeer.displayName}
                      referrerPolicy="no-referrer"
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-sky-300"
                    />
                    <div>
                      <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                        {activePeer.displayName}
                        <span className="font-mono text-xs text-sky-700 font-bold">(@{activePeer.handle})</span>
                      </h4>
                      <span className="text-xs text-slate-500 font-medium">
                        {activePeer.bio || 'Teen maker & innovator'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                      <Circle className="h-2 w-2 fill-emerald-500 text-emerald-500" />
                      Live Chat
                    </span>
                    {onDeclineFriendRequest && myFriendships.accepted.some((f) => f.otherUser.id === activePeer.id) && (
                      <button
                        type="button"
                        onClick={() => {
                          const f = myFriendships.accepted.find((fr) => fr.otherUser.id === activePeer.id);
                          if (f) handleUnfriend(f.friendship.id, `@${activePeer.handle}`);
                        }}
                        className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-500 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition-colors cursor-pointer"
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
                    <div className="flex h-full items-center justify-center text-xs text-slate-500 font-bold text-center p-6 bg-sky-50/20 rounded-2xl border-2 border-dashed border-sky-100">
                      Send a message to @{activePeer.handle} to discuss builds, collaborate on prototypes, or share ideas! 💡
                    </div>
                  ) : (
                    threadMessages.map((msg) => {
                      const isMe = msg.senderId === currentUser.id;
                      return (
                        <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-2xs ${
                              isMe
                                ? 'bg-gradient-to-r from-sky-400 via-emerald-300 to-sky-300 text-slate-950 font-bold rounded-br-xs'
                                : 'bg-white text-slate-800 rounded-bl-xs border-2 border-slate-100 font-medium'
                            }`}
                          >
                            {msg.text && <p>{msg.text}</p>}

                            {/* Inline Image Attachment */}
                            {msg.imageUrls && msg.imageUrls.length > 0 && (
                              <div className="mt-2.5 overflow-hidden rounded-xl border border-slate-200 max-h-56">
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
                              <div className="mt-3 rounded-2xl border-2 border-sky-200 bg-sky-50/90 p-3 text-slate-800">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-sky-800 uppercase mb-1">
                                  <Briefcase className="h-3 w-3 text-sky-600" />
                                  Project Collaboration Invite
                                </div>
                                <h5 className="font-black text-xs text-slate-900">
                                  {msg.inviteCard.projectTitle}
                                </h5>
                                <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
                                  Role: <span className="text-emerald-700 font-bold">{msg.inviteCard.role}</span>
                                </p>
                                <div className="mt-3 flex items-center gap-2">
                                  {msg.inviteCard.status === 'PENDING' ? (
                                    <>
                                      <button
                                        onClick={() => onUpdateInviteStatus(msg.inviteCard!.id, 'ACCEPTED')}
                                        className="flex items-center gap-1 rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold text-slate-950 hover:bg-emerald-300 shadow-2xs cursor-pointer"
                                      >
                                        <Check className="h-3 w-3" />
                                        Accept Invite
                                      </button>
                                      <button
                                        onClick={() => onUpdateInviteStatus(msg.inviteCard!.id, 'DECLINED')}
                                        className="flex items-center gap-1 rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-600 hover:bg-slate-300 cursor-pointer"
                                      >
                                        <X className="h-3 w-3" />
                                        Decline
                                      </button>
                                    </>
                                  ) : (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                                      Status: {msg.inviteCard.status}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          <span className="mt-1 text-[10px] font-mono text-slate-400 px-1 font-bold">
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
                <MessageSquare className="h-8 w-8 text-sky-300" />
                <h4 className="text-sm font-black text-slate-900">No Conversation Selected</h4>
                <p className="text-xs text-slate-500 max-w-xs font-medium">
                  Select a user or connect with friends to start innovating together!
                </p>
              </div>
            )
          )}

          {/* Group Active View */}
          {activeTab === 'group' && (
            activeGroup ? (
              <>
                {/* Group Header */}
                <div className="flex items-center justify-between border-b border-amber-100 pb-3 mb-4 bg-amber-50/40 -mx-4 -mt-4 p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-white border border-amber-200 overflow-hidden flex items-center justify-center shadow-2xs">
                      {activeGroup.avatarUrl ? (
                        <img
                          src={activeGroup.avatarUrl}
                          alt={activeGroup.name}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Hash className="h-5 w-5 text-amber-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{activeGroup.name}</h4>
                      <p className="text-xs text-slate-500 font-medium line-clamp-1">{activeGroup.description || 'Creator Channel'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAddMemberModalOpen(true)}
                      className="flex items-center gap-1.5 rounded-full border border-sky-300 bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-800 hover:bg-sky-100 transition-colors cursor-pointer shadow-2xs"
                      title="Add people to this group channel"
                    >
                      <UserPlus className="h-3.5 w-3.5 text-sky-600" />
                      <span>Add People</span>
                    </button>
                    <button
                      onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                      className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Users className="h-3.5 w-3.5 text-amber-600" />
                      <span>Members ({activeGroup.members?.length || 1})</span>
                    </button>
                  </div>
                </div>

                {/* Group Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                  {currentGroupMessages.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-xs text-slate-500 font-bold text-center p-6 bg-amber-50/20 rounded-2xl border-2 border-dashed border-amber-100">
                      Welcome to #{activeGroup.name}! Say hi to other creators and share what you are building. 🛠️
                    </div>
                  ) : (
                    currentGroupMessages.map((msg) => {
                      const isMe = msg.senderId === currentUser.id;
                      return (
                        <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-center gap-1.5 mb-1 px-1">
                            <span className="text-xs font-bold text-slate-800">{msg.sender.displayName}</span>
                            <span className="text-[10px] font-mono text-slate-400">@{msg.sender.handle}</span>
                          </div>
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-2xs ${
                              isMe
                                ? 'bg-gradient-to-r from-sky-400 via-emerald-300 to-sky-300 text-slate-950 font-bold rounded-br-xs'
                                : 'bg-white text-slate-800 rounded-bl-xs border-2 border-slate-100 font-medium'
                            }`}
                          >
                            {msg.content && <p>{msg.content}</p>}

                            {/* Inline Image Attachment */}
                            {msg.imageUrls && msg.imageUrls.length > 0 && (
                              <div className="mt-2.5 overflow-hidden rounded-xl border border-slate-200 max-h-56">
                                <img
                                  src={msg.imageUrls[0]}
                                  alt="Attachment"
                                  referrerPolicy="no-referrer"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                          <span className="mt-1 text-[10px] font-mono text-slate-400 px-1 font-bold">
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
                <Hash className="h-8 w-8 text-amber-300" />
                <h4 className="text-sm font-black text-slate-900">No Group Selected</h4>
                <p className="text-xs text-slate-500 font-medium">Create or select a channel on the left to start chatting!</p>
              </div>
            )
          )}

          {/* Friends Tab View */}
          {activeTab === 'friends' && (
            <div className="flex-1 flex flex-col p-4 sm:p-6 space-y-6 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-sky-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Users className="h-5 w-5 text-sky-600" />
                    <span>Creator Friends Network</span>
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Connect and collaborate with fellow young innovators.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800 flex items-center gap-1.5 shadow-2xs">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Real Creators
                  </span>
                </div>
              </div>

              {/* Network Stats Cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl border-2 border-sky-100 bg-sky-50/50 p-3.5 text-center shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Connected Friends
                  </span>
                  <span className="text-2xl font-black text-slate-900">
                    {myFriendships.accepted.length}
                  </span>
                </div>
                <div className="rounded-2xl border-2 border-emerald-100 bg-emerald-50/50 p-3.5 text-center shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Incoming Requests
                  </span>
                  <span className={`text-2xl font-black ${myFriendships.incoming.length > 0 ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {myFriendships.incoming.length}
                  </span>
                </div>
                <div className="rounded-2xl border-2 border-amber-100 bg-amber-50/50 p-3.5 text-center shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Sent Requests
                  </span>
                  <span className="text-2xl font-black text-slate-700">
                    {myFriendships.outgoing.length}
                  </span>
                </div>
              </div>

              {/* Highlight incoming requests if present */}
              {myFriendships.incoming.length > 0 && (
                <div className="rounded-3xl border-2 border-emerald-200 bg-emerald-50/70 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 font-black text-xs">
                    <AlertCircle className="h-4 w-4 text-emerald-600" />
                    <span>Action Required: {myFriendships.incoming.length} Creator(s) want to connect!</span>
                  </div>
                  <div className="space-y-2">
                    {myFriendships.incoming.map(({ friendship, otherUser }) => (
                      <div
                        key={friendship.id}
                        className="flex items-center justify-between p-3 rounded-2xl bg-white border border-emerald-200 shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={otherUser.avatarUrl}
                            alt={otherUser.displayName}
                            referrerPolicy="no-referrer"
                            className="h-8 w-8 rounded-full object-cover ring-2 ring-emerald-300"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">
                              {otherUser.displayName}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              @{otherUser.handle} • ⭐ {otherUser.reputationScore} Points
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onAcceptFriendRequest(friendship.id)}
                            className="flex items-center gap-1 rounded-full bg-emerald-400 px-3.5 py-1.5 text-xs font-black text-slate-950 hover:bg-emerald-300 shadow-2xs cursor-pointer"
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
                  <h4 className="text-xs font-bold uppercase text-slate-600">
                    Your Connected Friends ({myFriendships.accepted.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {myFriendships.accepted.map(({ friendship, otherUser }) => (
                      <div
                        key={friendship.id}
                        className="flex items-center justify-between p-3 rounded-2xl border-2 border-slate-100 bg-white hover:border-sky-200 transition-colors shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="relative shrink-0">
                            <img
                              src={otherUser.avatarUrl}
                              alt={otherUser.displayName}
                              referrerPolicy="no-referrer"
                              className="h-9 w-9 rounded-full object-cover ring-2 ring-sky-200"
                            />
                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-black text-slate-900 block truncate">
                              {otherUser.displayName}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 truncate block">
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
                            className="flex items-center gap-1.5 rounded-full bg-sky-100 border border-sky-300 px-3 py-1.5 text-xs font-bold text-sky-900 hover:bg-sky-200 shadow-2xs transition-all cursor-pointer"
                          >
                            <MessageSquare className="h-3.5 w-3.5 text-sky-700" />
                            <span>Chat</span>
                          </button>
                          {onDeclineFriendRequest && (
                            <button
                              type="button"
                              onClick={() => handleUnfriend(friendship.id, `@${otherUser.handle}`)}
                              className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-500 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition-colors cursor-pointer"
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
                <div className="rounded-3xl border-2 border-dashed border-sky-200 p-8 text-center space-y-4 bg-sky-50/20">
                  <div className="h-12 w-12 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center mx-auto text-sky-600 shadow-2xs">
                    <Users className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-slate-900">No Friends Connected Yet</h4>
                    <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
                      Search any registered creator on the left panel to send a friend request. Once accepted, you can collaborate in real time!
                    </p>
                  </div>

                  {registeredCreators.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block mb-2">
                        Signed-up Creators on wedidthis
                      </span>
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        {registeredCreators.slice(0, 4).map((c) => (
                          <button
                            key={c.id}
                            onClick={() => handleQuickAddFriend(c)}
                            className="flex items-center gap-1.5 rounded-full border border-sky-200 bg-white px-3 py-1.5 text-xs font-bold text-sky-900 hover:bg-sky-50 shadow-2xs transition-colors cursor-pointer"
                          >
                            <img
                              src={c.avatarUrl}
                              alt={c.displayName}
                              className="h-4 w-4 rounded-full"
                            />
                            <span>@{c.handle}</span>
                            <UserPlus className="h-3 w-3 text-sky-600 ml-1" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Real Friends Notice */}
              <div className="rounded-2xl border-2 border-emerald-100 bg-emerald-50/40 p-4 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Connecting with fellow innovators</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                  Send a friend request to any maker you want to collaborate with. Once they accept, you can exchange project insights and feedback.
                </p>
              </div>
            </div>
          )}

          {/* Input Bar (For DM & Group) */}
          {activeTab !== 'friends' && (activePeer || activeGroup) && (
            <form onSubmit={handleSend} className="mt-4 border-t border-sky-100 pt-3 space-y-2 bg-white -mx-4 -mb-4 p-4">
              {/* Media Preview chip */}
              {pendingImageUrl && (
                <div className="flex items-center gap-2 rounded-2xl bg-sky-50 border border-sky-200 p-2 text-xs">
                  <div className="h-8 w-8 rounded-lg overflow-hidden bg-white border border-sky-200">
                    <img src={pendingImageUrl} alt="attachment preview" className="h-full w-full object-cover" />
                  </div>
                  <span className="text-sky-900 font-bold text-xs truncate flex-1">
                    Photo attached
                  </span>
                  <button
                    type="button"
                    onClick={() => setPendingImageUrl(null)}
                    className="text-slate-400 hover:text-rose-600 font-bold px-1 cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <label
                  className="rounded-full border border-sky-200 bg-sky-50 p-2.5 text-sky-700 hover:bg-sky-100 cursor-pointer transition-colors shadow-2xs"
                  title="Upload an image from your device"
                >
                  <ImageIcon className="h-4 w-4 text-sky-600" />
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
                  className="flex-1 rounded-full border-2 border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 font-medium placeholder-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none transition-colors"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() && !pendingImageUrl}
                  className="rounded-full bg-gradient-to-r from-sky-400 via-emerald-300 to-amber-200 p-2.5 text-slate-950 font-black shadow-md shadow-sky-300/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 cursor-pointer"
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
              className="absolute right-0 top-0 bottom-0 w-72 bg-white border-l-2 border-sky-100 p-4 shadow-2xl z-30 flex flex-col justify-between text-slate-800"
            >
              <div>
                <div className="flex items-center justify-between border-b border-sky-100 pb-3 mb-4">
                  <h4 className="text-xs font-black uppercase text-slate-900 flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-sky-600" />
                    Channel Members
                  </h4>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    ×
                  </button>
                </div>

                {/* Quick Add People button at top of drawer */}
                <button
                  type="button"
                  onClick={() => setIsAddMemberModalOpen(true)}
                  className="w-full flex items-center justify-center gap-1.5 rounded-full border border-sky-300 bg-sky-50 py-2 px-3 text-xs font-bold text-sky-800 hover:bg-sky-100 transition-all mb-3 cursor-pointer shadow-2xs"
                >
                  <UserPlus className="h-3.5 w-3.5 text-sky-600" />
                  <span>+ Add People to Group</span>
                </button>

                <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                  {activeGroup.members?.map((member) => {
                    const isCurrentUser = member.userId === currentUser.id;
                    const isRoomAdmin = activeGroup.members?.some(
                      (m) => m.userId === currentUser.id && m.role === 'ADMIN'
                    );
                    const memberUser =
                      member.user ||
                      allRegisteredUsers?.find((u) => u.id === member.userId) ||
                      (isCurrentUser
                        ? currentUser
                        : {
                            id: member.userId,
                            displayName: 'Creator',
                            handle: 'maker',
                            avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Maker',
                          });

                    return (
                      <div
                        key={member.userId}
                        className="flex items-center justify-between p-2 rounded-2xl hover:bg-sky-50 transition-colors group"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <img
                            src={memberUser.avatarUrl}
                            alt={memberUser.displayName}
                            referrerPolicy="no-referrer"
                            className="h-8 w-8 rounded-full object-cover ring-2 ring-sky-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-slate-900 block truncate">
                              {memberUser.displayName} {isCurrentUser && <span className="text-[10px] text-slate-400 font-normal">(you)</span>}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 block truncate">
                              @{memberUser.handle}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 ml-2">
                          {member.role === 'ADMIN' ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                              <Crown className="h-3 w-3 text-amber-600" />
                              Admin
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400">Member</span>
                          )}

                          {/* Remove member button for Room Admin or Creator */}
                          {!isCurrentUser && (isRoomAdmin || currentUser.id === activeGroup.members[0]?.userId) && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(member.userId, memberUser.handle)}
                              title={`Remove @${memberUser.handle} from group`}
                              className="p-1 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <UserMinus className="h-3.5 w-3.5" />
                            </button>
                          )}

                          {/* Leave group option for current user */}
                          {isCurrentUser && (activeGroup.members?.length || 0) > 1 && (
                            <button
                              type="button"
                              onClick={handleLeaveGroup}
                              title="Leave this group channel"
                              className="p-1 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors text-[10px] font-bold cursor-pointer"
                            >
                              Leave
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-sky-100 pt-3 text-[11px] font-bold text-slate-400 flex items-center justify-center gap-1.5">
                <Mascot type="cheerful" size="xs" />
                <span>Group Channel</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add People to Group Modal */}
        <AnimatePresence>
          {isAddMemberModalOpen && activeGroup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm cursor-default">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md rounded-3xl border-2 border-sky-200 bg-white p-6 space-y-4 shadow-2xl text-slate-800"
              >
                <div className="flex items-center justify-between border-b border-sky-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700">
                      <UserPlus className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">Add People to #{activeGroup.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">Invite fellow creators to join this channel</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddMemberModalOpen(false);
                      setAddMemberQuery('');
                    }}
                    className="text-slate-400 hover:text-slate-700 rounded-full p-1 cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Search creator */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-3 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search creators by name or @handle..."
                    value={addMemberQuery}
                    onChange={(e) => setAddMemberQuery(e.target.value)}
                    className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 pl-9 pr-3.5 py-2 text-xs text-slate-900 focus:border-sky-400 focus:bg-white focus:outline-none transition-colors"
                  />
                </div>

                {/* Creator candidates list */}
                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {addMemberCandidates.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400 font-bold">
                      No matching creators found.
                    </div>
                  ) : (
                    addMemberCandidates.map((candidate) => {
                      const isAlreadyInGroup = activeGroup.members?.some(
                        (m) => m.userId === candidate.id
                      );
                      return (
                        <div
                          key={candidate.id}
                          className="flex items-center justify-between p-2.5 rounded-2xl border-2 border-slate-100 bg-white hover:border-sky-200 transition-colors shadow-2xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <img
                              src={candidate.avatarUrl}
                              alt={candidate.displayName}
                              referrerPolicy="no-referrer"
                              className="h-8 w-8 rounded-full object-cover ring-2 ring-sky-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-slate-900 block truncate">
                                {candidate.displayName}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 block truncate">
                                @{candidate.handle}
                              </span>
                            </div>
                          </div>

                          <div className="shrink-0 ml-2">
                            {isAlreadyInGroup ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-1 text-[11px] font-bold text-emerald-800 shadow-2xs">
                                <Check className="h-3 w-3" />
                                <span>In Group</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleAddMember(candidate)}
                                className="inline-flex items-center gap-1 rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold text-slate-950 hover:bg-emerald-300 transition-colors shadow-2xs cursor-pointer"
                              >
                                <Plus className="h-3.5 w-3.5" />
                                <span>Add</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="flex justify-end border-t border-sky-100 pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddMemberModalOpen(false);
                      setAddMemberQuery('');
                    }}
                    className="rounded-full bg-sky-100 border border-sky-300 px-5 py-2 text-xs font-bold text-sky-900 hover:bg-sky-200 cursor-pointer shadow-2xs"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Create Group Channel Modal */}
        <AnimatePresence>
          {isCreatingChannel && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md rounded-3xl border-2 border-amber-200 bg-white p-6 space-y-4 shadow-2xl text-slate-800"
              >
                <div className="flex items-center justify-between border-b border-amber-100 pb-3">
                  <h3 className="text-base font-black text-slate-900">Create Group Channel</h3>
                  <button onClick={() => setIsCreatingChannel(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateChannelSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-slate-800 mb-1">
                      Channel Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 🎨 3D Print & Prop Makers, 🎮 Unity Game Jam"
                      value={newChannelName}
                      onChange={(e) => setNewChannelName(e.target.value)}
                      required
                      className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 font-bold focus:border-amber-400 focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-800 mb-1">
                      Description / Topic
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Share slicing tips, print fails, and finished prints"
                      value={newChannelDesc}
                      onChange={(e) => setNewChannelDesc(e.target.value)}
                      className="w-full rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-2.5 text-xs text-slate-900 font-medium focus:border-amber-400 focus:bg-white focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Add Initial People */}
                  <div>
                    <label className="block text-xs font-black text-slate-800 mb-1">
                      Add People (Optional)
                    </label>
                    <div className="max-h-36 overflow-y-auto space-y-1.5 rounded-2xl border-2 border-slate-100 bg-slate-50 p-2.5">
                      {registeredCreators.length === 0 ? (
                        <p className="text-xs text-slate-400 p-2 font-medium">No other creators registered yet.</p>
                      ) : (
                        registeredCreators.map((creator) => {
                          const isSelected = selectedInitialMembers.some((m) => m.id === creator.id);
                          return (
                            <button
                              type="button"
                              key={creator.id}
                              onClick={() => {
                                if (isSelected) {
                                  setSelectedInitialMembers((prev) =>
                                    prev.filter((m) => m.id !== creator.id)
                                  );
                                } else {
                                  setSelectedInitialMembers((prev) => [...prev, creator]);
                                }
                              }}
                              className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                                isSelected
                                  ? 'bg-amber-100 border border-amber-300 text-amber-950 font-bold shadow-2xs'
                                  : 'hover:bg-white text-slate-700'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <img
                                  src={creator.avatarUrl}
                                  alt={creator.displayName}
                                  referrerPolicy="no-referrer"
                                  className="h-6 w-6 rounded-full object-cover"
                                />
                                <span className="truncate">
                                  {creator.displayName} (@{creator.handle})
                                </span>
                              </div>
                              {isSelected ? (
                                <Check className="h-3.5 w-3.5 text-amber-600" />
                              ) : (
                                <Plus className="h-3.5 w-3.5 text-slate-400" />
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>
                    {selectedInitialMembers.length > 0 && (
                      <p className="mt-1 text-xs text-amber-800 font-bold">
                        {selectedInitialMembers.length} creator{selectedInitialMembers.length > 1 ? 's' : ''} will be added
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatingChannel(false)}
                      className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!newChannelName.trim()}
                      className="rounded-full bg-gradient-to-r from-sky-400 via-emerald-300 to-amber-200 px-5 py-2.5 text-xs font-black text-slate-950 shadow-md shadow-amber-300/40 hover:scale-105 active:scale-95 transition-colors disabled:opacity-40 cursor-pointer"
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
