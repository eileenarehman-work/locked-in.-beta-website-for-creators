import React, { useState } from 'react';
import { Project, ProjectStatus, User } from '../types';
import { generateProjectDraft, assignSmartTags } from '../services/geminiService';
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

  // Cloudflare Turnstile CAPTCHA simulation
  const [captchaPassed, setCaptchaPassed] = useState(false);
  const [isVerifyingCaptcha, setIsVerifyingCaptcha] = useState(false);

  // Gemini AI Assistant state
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

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

  const handleGenerateDraft = async () => {
    if (!title.trim()) {
      setAiMessage('Please write a build title first before running the AI drafting copilot.');
      return;
    }
    setIsGeneratingDraft(true);
    setAiMessage(null);
    try {
      const draft = await generateProjectDraft(title, markdown || tagline, category);
      setMarkdown(draft.readmeMarkdown);
      if (!tagline) setTagline(draft.elevatorPitch);
      setAiMessage('Gemini Drafting Copilot organized your build overview, milestones, and how you made it!');
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  const handleSmartTag = async () => {
    if (!title.trim() && !markdown.trim()) {
      setAiMessage('Add a title or project notes to auto-detect creator hashtags.');
      return;
    }
    setIsGeneratingTags(true);
    try {
      const res = await assignSmartTags(title, markdown || category);
      setTags(res.assignedTags);
      setAiMessage(`Assigned hashtags: ${res.assignedTags.join(', ')}`);
    } finally {
      setIsGeneratingTags(false);
    }
  };

  const handleTriggerCaptcha = () => {
    setIsVerifyingCaptcha(true);
    setTimeout(() => {
      setIsVerifyingCaptcha(false);
      setCaptchaPassed(true);
    }, 700);
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !captchaPassed) return;

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
      tagline: tagline.trim() || 'Real teen creator build on We Did This.',
      contentMarkdown: markdown.trim() || '### About This Build\nMade with hands-on effort and real tools.',
      mediaUrls: uploadedImages.length ? uploadedImages : [],
      viewsCount: 1,
      likesCount: 0,
      tags: tags.length ? tags : ['#makers'],
      qualities: [
        'Working Prototype',
        category.split('&')[0].trim(),
        'Community Peer Reviewed',
      ],
      status: 'PUBLISHED',
      milestones: [
        {
          title: 'Initial Build Finished & Verified',
          date: new Date().toISOString().split('T')[0],
          description: 'Uploaded by creator to We Did This for peer evaluation.',
          completed: true,
        },
      ],
      demoUrl: demoUrl.trim() || undefined,
      repoUrl: repoUrl.trim() || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onPublishProject(newProject);
    setStatus('PUBLISHED');
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Studio Header */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight sm:text-2xl">
              Drop Your Build
            </h2>
            <span className="rounded-md bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 text-xs font-mono text-indigo-400">
              State: {status}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Upload any of your wonderful creations for the world to see!
          </p>
        </div>

        {/* AI Copilots */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleGenerateDraft}
            disabled={isGeneratingDraft || !title.trim()}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-700/80 bg-indigo-950/40 px-3.5 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-900/60 transition-colors disabled:opacity-40"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>{isGeneratingDraft ? 'Writing...' : 'AI README Assistant'}</span>
          </button>

          <button
            type="button"
            onClick={handleSmartTag}
            disabled={isGeneratingTags}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-700/80 bg-emerald-950/40 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/60 transition-colors disabled:opacity-40"
          >
            <Tag className="h-3.5 w-3.5 text-emerald-400" />
            <span>{isGeneratingTags ? 'Tagging...' : 'Auto-Tags'}</span>
          </button>
        </div>
      </div>

      {aiMessage && (
        <div className="mb-6 rounded-xl border border-indigo-800/60 bg-indigo-950/30 p-3 text-xs text-indigo-200 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-400 shrink-0" />
          <span>{aiMessage}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handlePublish} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2 cols) */}
          <div className="lg:col-span-2 space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                What did you build / make? <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 3D Printed Articulated Dragon, Discord Bot in Python, Custom Cyberpunk Desk Lamp"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Quick Tagline */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                One-Sentence Summary
              </label>
              <input
                type="text"
                placeholder="Short sentence describing how you made it or what it does..."
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                Creator Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
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
              <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5 flex justify-between">
                <span>Build Notes, Tools & How It Works</span>
                <span className="text-slate-500">Supports Markdown</span>
              </label>
              <textarea
                rows={9}
                placeholder="Tell other teen builders how you made this: What tools did you use (Blender, Bambu Studio, VS Code, Tinkercad, Unity, Soldering iron)? What was the hardest part? Any tips for someone making something similar?"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs text-slate-200 placeholder-slate-600 focus:border-indigo-500 focus:outline-none leading-relaxed font-sans"
              />
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                  Live Playable Link / Video / Demo
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
                <label className="block text-xs font-mono uppercase text-slate-300 mb-1.5">
                  Code Repo / STL Files / 3D Model Link
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
              <label className="block text-xs font-mono uppercase text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="h-3.5 w-3.5 text-indigo-400" />
                  Photos of Your Build
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Real Uploads</span>
              </label>

              {/* Upload Dropzone */}
              <label className="block border-2 border-dashed border-slate-700/80 hover:border-indigo-500 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-950/40">
                <Upload className="h-6 w-6 text-indigo-400 mx-auto mb-1.5" />
                <p className="text-xs font-semibold text-white">Click or drag photos of your project</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Upload multiple PNG, JPEG, GIF, or WebP</p>
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
                      Cover Image
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
                            className="absolute top-1 right-1 h-5 w-5 rounded-full bg-slate-950/80 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-800 p-4 text-center text-xs text-slate-500 font-mono">
                  No images uploaded yet. Upload a screenshot, 3D print photo, or robot video snapshot!
                </div>
              )}
            </div>

            {/* Custom Hashtags (YouTube / Instagram style) */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono uppercase text-slate-300">
                  Custom Hashtags
                </label>
                <span className="text-[10px] font-mono text-slate-500">
                  Type any tag & press Enter
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-xl border border-slate-800 bg-slate-950">
                {tags.length === 0 && (
                  <span className="text-xs text-slate-500 italic">No hashtags added yet.</span>
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
                  className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700"
                >
                  + Add
                </button>
              </div>
            </div>

            {/* Human Verification */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
              <label className="block text-xs font-mono uppercase text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Human Creator Verification
              </label>

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
                      ? 'Verified Human Creator'
                      : isVerifyingCaptcha
                      ? 'Checking token...'
                      : 'Verify I am a real person'}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">Cloudflare</span>
              </div>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={!captchaPassed || !title.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 active:scale-[0.98] transition-all disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
                <span>Publish to Feed</span>
              </button>
              <p className="mt-2 text-center text-[11px] text-slate-500 font-mono">
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
