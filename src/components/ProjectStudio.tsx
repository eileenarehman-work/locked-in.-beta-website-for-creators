import React, { useState, useEffect, useRef } from 'react';
import { Project, ProjectStatus, User } from '../types';
import { generateProjectDraft, assignSmartTags } from '../services/geminiService';
import { storage } from '../mock/initialData';
import {
  Sparkles,
  ShieldCheck,
  Send,
  Tag,
  CheckCircle,
  Image as ImageIcon,
  Upload,
  X,
  Palette,
  Bot,
  Box,
  Gamepad2,
  Code2,
  Music,
  Save,
  FileText,
  Trash2,
  Clock,
  PlusCircle,
  Check,
  FolderOpen,
  Cloud,
  RotateCcw,
} from 'lucide-react';

interface ProjectStudioProps {
  currentUser: User;
  onPublishProject: (project: Project) => void;
}

const TEEN_CATEGORIES = [
  { id: '3dprinting', label: '3D Printing & Physical Props', icon: Box, defaultTag: '#3dprinting' },
  { id: 'robotics', label: 'Robotics, RC & Arduino Circuits', icon: Bot, defaultTag: '#robotics' },
  { id: 'art', label: 'Digital Art, 3D Models & Animation', icon: Palette, defaultTag: '#art' },
  { id: 'gamedev', label: 'Game Dev & Modding (Unity/Roblox/Godot)', icon: Gamepad2, defaultTag: '#gamedev' },
  { id: 'coding', label: 'Websites, Discord Bots & Code Apps', icon: Code2, defaultTag: '#coding' },
  { id: 'music', label: 'Music Beats, Synth & Audio Projects', icon: Music, defaultTag: '#music' },
  { id: 'makers', label: 'Crafts, Custom Keyboards & Inventions', icon: Box, defaultTag: '#makers' },
];

export const ProjectStudio: React.FC<ProjectStudioProps> = ({
  currentUser,
  onPublishProject,
}) => {
  const AUTOSAVE_STORAGE_KEY = `lockedin_studio_autosave_${currentUser.id}`;

  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [savedDrafts, setSavedDrafts] = useState<Project[]>([]);
  const [isDraftsModalOpen, setIsDraftsModalOpen] = useState(false);
  const [draftToast, setDraftToast] = useState<string | null>(null);

  // Auto-save & recovery states
  const [lastAutoSavedAt, setLastAutoSavedAt] = useState<Date | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [hasRecoveredAutoSave, setHasRecoveredAutoSave] = useState(false);
  const isInitialMount = useRef(true);

  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState(TEEN_CATEGORIES[0].label);
  const [markdown, setMarkdown] = useState('');
  const [tags, setTags] = useState<string[]>(['#3dprinting', '#makers']);
  const [tagInput, setTagInput] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [demoUrl, setDemoUrl] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('DRAFT');

  // Human verification check
  const [captchaPassed, setCaptchaPassed] = useState(false);
  const [isVerifyingCaptcha, setIsVerifyingCaptcha] = useState(false);

  // Gemini drafting helpers
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [helperMessage, setHelperMessage] = useState<string | null>(null);

  // Load user drafts and check for auto-saved cache on mount
  useEffect(() => {
    if (currentUser?.id) {
      setSavedDrafts(storage.getDrafts(currentUser.id));

      // Attempt to recover auto-saved project from localStorage
      try {
        const cached = localStorage.getItem(AUTOSAVE_STORAGE_KEY);
        if (cached) {
          const data = JSON.parse(cached);
          const hasData = Boolean(
            data &&
            (data.title ||
              data.markdown ||
              data.tagline ||
              (data.uploadedImages && data.uploadedImages.length > 0) ||
              data.demoUrl ||
              data.repoUrl)
          );

          if (hasData) {
            setTitle(data.title || '');
            setTagline(data.tagline || '');
            if (data.category) setCategory(data.category);
            setMarkdown(data.markdown || '');
            if (data.tags && data.tags.length) setTags(data.tags);
            if (data.uploadedImages && data.uploadedImages.length) setUploadedImages(data.uploadedImages);
            setDemoUrl(data.demoUrl || '');
            setRepoUrl(data.repoUrl || '');
            setCurrentDraftId(data.currentDraftId || null);
            const savedTime = data.savedAt ? new Date(data.savedAt) : new Date();
            setLastAutoSavedAt(savedTime);
            setHasRecoveredAutoSave(true);
          }
        }
      } catch (err) {
        console.error('Failed to load auto-saved cache', err);
      }
    }
  }, [currentUser?.id, AUTOSAVE_STORAGE_KEY]);

  // Prevent accidental navigation when form has uncommitted content
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (title.trim() || markdown.trim() || tagline.trim() || uploadedImages.length > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [title, markdown, tagline, uploadedImages.length]);

  // Periodic & Debounced Auto-Save: caches inputs to localStorage
  useEffect(() => {
    // Avoid re-saving immediately on the first render before hydration
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const hasContent = Boolean(
      title.trim() ||
      tagline.trim() ||
      markdown.trim() ||
      uploadedImages.length > 0 ||
      demoUrl.trim() ||
      repoUrl.trim()
    );

    if (!hasContent) {
      // If form is empty, clear auto-save
      try {
        localStorage.removeItem(AUTOSAVE_STORAGE_KEY);
      } catch {}
      setLastAutoSavedAt(null);
      return;
    }

    setIsAutoSaving(true);
    const timer = setTimeout(() => {
      try {
        const now = new Date();
        const autoSavePayload = {
          title,
          tagline,
          category,
          markdown,
          tags,
          uploadedImages,
          demoUrl,
          repoUrl,
          currentDraftId,
          savedAt: now.toISOString(),
        };
        localStorage.setItem(AUTOSAVE_STORAGE_KEY, JSON.stringify(autoSavePayload));
        setLastAutoSavedAt(now);
      } catch (err) {
        console.error('Auto-save write failed', err);
      } finally {
        setIsAutoSaving(false);
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [
    title,
    tagline,
    category,
    markdown,
    tags,
    uploadedImages,
    demoUrl,
    repoUrl,
    currentDraftId,
    AUTOSAVE_STORAGE_KEY,
  ]);

  const showToast = (msg: string) => {
    setDraftToast(msg);
    setTimeout(() => {
      setDraftToast(null);
    }, 3500);
  };

  // Real file upload handler using FileReader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setUploadedImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Save current project state as explicit named draft
  const handleSaveDraft = () => {
    const draftTitle = title.trim() || 'Untitled Draft';
    const draftId = currentDraftId || `draft_${Date.now()}`;
    const slug = draftTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const draftProject: Project = {
      id: draftId,
      authorId: currentUser.id,
      author: currentUser,
      title: draftTitle,
      slug: `${slug || 'draft'}-${Date.now().toString().slice(-4)}`,
      tagline: tagline.trim() || 'Work in progress build.',
      contentMarkdown: markdown.trim(),
      mediaUrls: uploadedImages,
      viewsCount: 0,
      likesCount: 0,
      tags: tags.length ? tags : ['#makers'],
      qualities: [category.split('&')[0].trim()],
      status: 'DRAFT',
      milestones: [
        {
          title: 'Draft in progress',
          date: new Date().toISOString().split('T')[0],
          description: 'Saved as draft in Project Studio.',
          completed: false,
        },
      ],
      demoUrl: demoUrl.trim() || undefined,
      repoUrl: repoUrl.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storage.saveDraft(draftProject);
    setCurrentDraftId(draftId);
    setSavedDrafts(storage.getDrafts(currentUser.id));
    setLastAutoSavedAt(new Date());
    showToast(`Draft "${draftTitle}" saved! You can resume editing anytime.`);
  };

  // Load a selected draft into the editor
  const handleLoadDraft = (draft: Project) => {
    setCurrentDraftId(draft.id);
    setTitle(draft.title === 'Untitled Draft' ? '' : draft.title);
    setTagline(draft.tagline || '');
    if (draft.qualities && draft.qualities[0]) {
      const matched = TEEN_CATEGORIES.find((c) =>
        c.label.toLowerCase().includes(draft.qualities![0].toLowerCase())
      );
      if (matched) setCategory(matched.label);
    }
    setMarkdown(draft.contentMarkdown || '');
    setUploadedImages(draft.mediaUrls || []);
    setTags(draft.tags && draft.tags.length ? draft.tags : ['#makers']);
    setDemoUrl(draft.demoUrl || '');
    setRepoUrl(draft.repoUrl || '');
    setStatus('DRAFT');
    setIsDraftsModalOpen(false);
    setHasRecoveredAutoSave(false);
    setLastAutoSavedAt(new Date());

    // Update auto-save cache immediately with loaded draft
    try {
      localStorage.setItem(
        AUTOSAVE_STORAGE_KEY,
        JSON.stringify({
          title: draft.title,
          tagline: draft.tagline,
          category: draft.qualities?.[0] || TEEN_CATEGORIES[0].label,
          markdown: draft.contentMarkdown,
          tags: draft.tags,
          uploadedImages: draft.mediaUrls,
          demoUrl: draft.demoUrl || '',
          repoUrl: draft.repoUrl || '',
          currentDraftId: draft.id,
          savedAt: new Date().toISOString(),
        })
      );
    } catch {}

    showToast(`Loaded "${draft.title}". Continue editing!`);
  };

  // Delete an explicit draft
  const handleDeleteDraft = (draftId: string, draftTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    storage.deleteDraft(draftId);
    setSavedDrafts(storage.getDrafts(currentUser.id));
    if (currentDraftId === draftId) {
      setCurrentDraftId(null);
    }
    showToast(`Deleted draft "${draftTitle}".`);
  };

  // Clear form and start a fresh blank project
  const handleStartFresh = () => {
    try {
      localStorage.removeItem(AUTOSAVE_STORAGE_KEY);
    } catch {}
    setHasRecoveredAutoSave(false);
    setLastAutoSavedAt(null);
    setCurrentDraftId(null);
    setTitle('');
    setTagline('');
    setCategory(TEEN_CATEGORIES[0].label);
    setMarkdown('');
    setTags(['#3dprinting', '#makers']);
    setUploadedImages([]);
    setDemoUrl('');
    setRepoUrl('');
    setStatus('DRAFT');
    setCaptchaPassed(false);
    showToast('Ready for a new project!');
  };

  const handleGenerateDraft = async () => {
    if (!title.trim()) {
      setHelperMessage('Type a project title first so the writing helper has something to go on!');
      return;
    }
    setIsGeneratingDraft(true);
    setHelperMessage(null);
    try {
      const draft = await generateProjectDraft(title, markdown || tagline, category);
      setMarkdown(draft.readmeMarkdown);
      if (!tagline) setTagline(draft.elevatorPitch);
      setHelperMessage('Draft generated! Edit any details to make it your own.');
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  const handleSmartTag = async () => {
    if (!title.trim() && !markdown.trim()) {
      setHelperMessage('Add a title or notes first to get tag suggestions.');
      return;
    }
    setIsGeneratingTags(true);
    try {
      const res = await assignSmartTags(title, markdown || category);
      setTags(res.assignedTags);
      setHelperMessage(`Added tags: ${res.assignedTags.join(', ')}`);
    } finally {
      setIsGeneratingTags(false);
    }
  };

  const handleTriggerCaptcha = () => {
    setIsVerifyingCaptcha(true);
    setTimeout(() => {
      setIsVerifyingCaptcha(false);
      setCaptchaPassed(true);
    }, 500);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please give your project a title before publishing.');
      return;
    }
    if (!captchaPassed) {
      showToast('Please check the quick verification box below.');
      return;
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const newProject: Project = {
      id: `proj_${Date.now()}`,
      authorId: currentUser.id,
      author: currentUser,
      title: title.trim(),
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      tagline: tagline.trim() || 'Built with curiosity and real maker effort.',
      contentMarkdown: markdown.trim() || '### About This Build\nMade with hands-on effort and real tools.',
      mediaUrls: uploadedImages.length ? uploadedImages : [],
      viewsCount: 1,
      likesCount: 0,
      tags: tags.length ? tags : ['#makers'],
      qualities: [
        'Working Prototype',
        category.split('&')[0].trim(),
        'Community Reviewed',
      ],
      status: 'PUBLISHED',
      milestones: [
        {
          title: 'Initial Build Published',
          date: new Date().toISOString().split('T')[0],
          description: 'Shared with the community for peer reviews and feedback.',
          completed: true,
        },
      ],
      demoUrl: demoUrl.trim() || undefined,
      repoUrl: repoUrl.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // If publishing an existing draft, clean it up from drafts
    if (currentDraftId) {
      storage.deleteDraft(currentDraftId);
      setSavedDrafts(storage.getDrafts(currentUser.id));
    }

    // Clear auto-save cache once published
    try {
      localStorage.removeItem(AUTOSAVE_STORAGE_KEY);
    } catch {}
    setLastAutoSavedAt(null);
    setHasRecoveredAutoSave(false);

    onPublishProject(newProject);
    setStatus('PUBLISHED');
    showToast('Your project is now live on the feed!');
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {draftToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-2xl shadow-indigo-600/40 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="h-4 w-4 text-emerald-300" />
          <span>{draftToast}</span>
        </div>
      )}

      {/* Recovered Auto-Save Banner */}
      {hasRecoveredAutoSave && (
        <div className="mb-6 rounded-2xl border border-indigo-500/40 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Cloud className="h-4 w-4" />
            </span>
            <div>
              <span className="font-semibold text-white text-sm block">
                Recovered in-progress work!
              </span>
              <span className="text-slate-300 text-xs">
                Auto-saved from your previous session (
                {lastAutoSavedAt
                  ? lastAutoSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : 'recently'}
                ). You can keep editing or start fresh.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setHasRecoveredAutoSave(false)}
              className="rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer"
            >
              Keep Editing
            </button>
            <button
              type="button"
              onClick={handleStartFresh}
              className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Discard & Start Fresh</span>
            </button>
          </div>
        </div>
      )}

      {/* Studio Header & Draft Controls */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-xl font-bold text-white tracking-tight sm:text-2xl">
              Project Studio
            </h2>
            {currentDraftId ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-xs font-medium text-amber-300">
                <FileText className="h-3 w-3" />
                Editing Draft
              </span>
            ) : (
              <span className="rounded-md bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 text-xs font-mono text-indigo-400">
                New Project
              </span>
            )}

            {/* Auto-save status indicator */}
            {isAutoSaving ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 px-2.5 py-0.5 text-[11px] font-mono text-indigo-300 animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping" />
                <span>Auto-saving...</span>
              </span>
            ) : lastAutoSavedAt ? (
              <span
                className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-mono text-emerald-300"
                title={`Saved to browser storage at ${lastAutoSavedAt.toLocaleTimeString()}`}
              >
                <Cloud className="h-3 w-3 text-emerald-400" />
                <span>
                  Auto-saved {lastAutoSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Showcase what you're making, save drafts to finish later, or post to the feed.
          </p>
        </div>

        {/* Action Controls: Drafts & AI Helpers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Saved Drafts Drawer Button */}
          <button
            type="button"
            onClick={() => setIsDraftsModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <FolderOpen className="h-3.5 w-3.5 text-amber-400" />
            <span>Saved Drafts</span>
            {savedDrafts.length > 0 && (
              <span className="ml-1 rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[10px] font-bold text-amber-300">
                {savedDrafts.length}
              </span>
            )}
          </button>

          {/* Save Draft Button */}
          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors cursor-pointer"
            title="Save your progress to edit later"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Draft</span>
          </button>

          {/* New blank project */}
          {(currentDraftId || title || markdown || lastAutoSavedAt) && (
            <button
              type="button"
              onClick={handleStartFresh}
              className="flex items-center gap-1 rounded-xl border border-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Start a fresh blank project"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>New</span>
            </button>
          )}

          {/* AI Drafting Helpers */}
          <button
            type="button"
            onClick={handleGenerateDraft}
            disabled={isGeneratingDraft || !title.trim()}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-700/80 bg-indigo-950/40 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-900/60 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>{isGeneratingDraft ? 'Writing...' : 'Help Me Write'}</span>
          </button>

          <button
            type="button"
            onClick={handleSmartTag}
            disabled={isGeneratingTags}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-700/80 bg-emerald-950/40 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/60 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <Tag className="h-3.5 w-3.5 text-emerald-400" />
            <span>{isGeneratingTags ? 'Tagging...' : 'Suggest Tags'}</span>
          </button>
        </div>
      </div>

      {helperMessage && (
        <div className="mb-6 rounded-xl border border-indigo-800/60 bg-indigo-950/30 p-3 text-xs text-indigo-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-400 shrink-0" />
            <span>{helperMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setHelperMessage(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handlePublish} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 cols) */}
          <div className="lg:col-span-2 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                What are you making? <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 3D Printed Articulated Dragon, Discord Bot in Python, Custom Keyboard Mod"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Quick Tagline */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                One-liner summary
              </label>
              <input
                type="text"
                placeholder="A short punchy sentence about what it does or how you made it..."
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none cursor-pointer"
              >
                {TEEN_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.label}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description & Build Notes */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5 flex justify-between">
                <span>Build notes, tools & how you made it</span>
                <span className="text-slate-500 text-[11px]">Supports markdown</span>
              </label>
              <textarea
                rows={9}
                placeholder="Tell other makers how you put this together: What tools did you use (Blender, Bambu Studio, VS Code, Tinkercad, Unity, Soldering iron)? What was tough? Any tips for someone building something similar?"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none leading-relaxed font-sans"
              />
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Playable demo or video link (optional)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Code repo or 3D files (optional)
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/... or Printables link"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Upload Photos & Tags */}
          <div className="space-y-6">
            {/* Real Image Uploader */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
              <label className="block text-xs font-medium text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="h-3.5 w-3.5 text-indigo-400" />
                  Photos & Screenshots
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Real Uploads</span>
              </label>

              {/* Upload Dropzone */}
              <label className="block border-2 border-dashed border-slate-700/80 hover:border-indigo-500 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-950/40">
                <Upload className="h-6 w-6 text-indigo-400 mx-auto mb-1.5" />
                <p className="text-xs font-semibold text-white">Click or drag photos of your project</p>
                <p className="text-[10px] text-slate-400 mt-0.5">PNG, JPEG, GIF, or WebP</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* Image Previews */}
              {uploadedImages.length > 0 ? (
                <div className="space-y-2">
                  <div className="aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800 relative group">
                    <img
                      src={uploadedImages[0]}
                      alt="Cover Preview"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute top-2 left-2 rounded-md bg-slate-950/80 px-2 py-0.5 text-[10px] font-mono text-emerald-400 backdrop-blur-md">
                      Cover Photo
                    </span>
                  </div>

                  {uploadedImages.length > 1 && (
                    <div className="grid grid-cols-3 gap-2">
                      {uploadedImages.slice(1).map((img, idx) => (
                        <div key={idx} className="relative aspect-[16/9] rounded-lg overflow-hidden border border-slate-800 group">
                          <img src={img} alt={`asset-${idx}`} className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx + 1)}
                            className="absolute top-1 right-1 h-5 w-5 rounded-full bg-slate-950/80 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-800 p-4 text-center text-xs text-slate-500">
                  No photos added yet. Upload a screenshot, 3D print photo, or bench test snapshot!
                </div>
              )}
            </div>

            {/* Custom Hashtags */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-slate-300">
                  Tags
                </label>
                <span className="text-[10px] text-slate-500">
                  Press Enter to add
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-xl border border-slate-800 bg-slate-950">
                {tags.length === 0 && (
                  <span className="text-xs text-slate-500 italic">No tags added yet.</span>
                )}
                {tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-lg bg-indigo-600/20 border border-indigo-500/40 px-2 py-0.5 text-xs font-mono text-indigo-300 flex items-center gap-1.5"
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => setTags(tags.filter((x) => x !== t))}
                      className="text-indigo-400 hover:text-white cursor-pointer"
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      const clean = tagInput.trim().replace(/^#+/, '').replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
                      if (clean) {
                        const formatted = `#${clean}`;
                        if (!tags.includes(formatted)) setTags([...tags, formatted]);
                        setTagInput('');
                      }
                    }
                  }}
                  placeholder="e.g. #arduino, #fpvdrone, #unity, #3dprint"
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    const clean = tagInput.trim().replace(/^#+/, '').replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
                    if (clean) {
                      const formatted = `#${clean}`;
                      if (!tags.includes(formatted)) setTags([...tags, formatted]);
                      setTagInput('');
                    }
                  }}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 cursor-pointer"
                >
                  + Add
                </button>
              </div>
            </div>

            {/* Quick Human Verification */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
              <label className="block text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Anti-bot check
              </label>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleTriggerCaptcha}
                    disabled={captchaPassed || isVerifyingCaptcha}
                    className={`h-5 w-5 rounded border flex items-center justify-center transition-all cursor-pointer ${
                      captchaPassed
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-600 bg-slate-800 hover:border-indigo-500'
                    }`}
                  >
                    {captchaPassed && <CheckCircle className="h-3.5 w-3.5" />}
                  </button>
                  <span className="text-xs text-slate-300">
                    {captchaPassed
                      ? "You're all set!"
                      : isVerifyingCaptcha
                      ? 'Checking...'
                      : 'I am a real builder'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Protected</span>
              </div>
            </div>

            {/* Bottom Actions: Save Draft & Publish */}
            <div className="space-y-2.5 pt-2">
              <button
                type="submit"
                disabled={!captchaPassed || !title.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 active:scale-[0.98] transition-all disabled:opacity-40 cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>Publish to Feed</span>
              </button>

              <button
                type="button"
                onClick={handleSaveDraft}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all cursor-pointer"
              >
                <Save className="h-3.5 w-3.5 text-amber-400" />
                <span>Save as Draft (Finish Later)</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Saved Drafts Drawer Modal */}
      {isDraftsModalOpen && (
        <div
          onClick={() => setIsDraftsModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm cursor-pointer animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4 cursor-default max-h-[85vh] flex flex-col"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <FolderOpen className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Your Saved Drafts</h3>
                  <p className="text-xs text-slate-400">Pick up right where you left off</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDraftsModalOpen(false)}
                className="text-slate-400 hover:text-white rounded-lg p-1 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {savedDrafts.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <FileText className="h-8 w-8 text-slate-600 mx-auto" />
                  <p className="text-sm font-semibold text-slate-300">No drafts yet</p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Click "Save Draft" anytime while working in the Studio to save your project here.
                  </p>
                </div>
              ) : (
                savedDrafts.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => handleLoadDraft(d)}
                    className={`rounded-2xl border p-3.5 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      currentDraftId === d.id
                        ? 'border-indigo-500/60 bg-indigo-950/40 ring-1 ring-indigo-500/30'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-950'
                    }`}
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white truncate">
                          {d.title || 'Untitled Draft'}
                        </h4>
                        {currentDraftId === d.id && (
                          <span className="rounded bg-indigo-500/20 text-indigo-300 text-[10px] px-1.5 py-0.2 font-mono">
                            active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate">
                        {d.tagline || d.contentMarkdown?.slice(0, 70) || 'No description yet.'}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono pt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(d.updatedAt || d.createdAt).toLocaleDateString()}
                        </span>
                        {d.mediaUrls && d.mediaUrls.length > 0 && (
                          <span>{d.mediaUrls.length} photo{d.mediaUrls.length > 1 ? 's' : ''}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLoadDraft(d);
                        }}
                        className="rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteDraft(d.id, d.title, e)}
                        className="rounded-xl p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Delete draft"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between border-t border-slate-800 pt-3">
              <button
                type="button"
                onClick={() => {
                  handleStartFresh();
                  setIsDraftsModalOpen(false);
                }}
                className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Start fresh blank project</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDraftsModalOpen(false)}
                className="rounded-xl bg-slate-800 px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
