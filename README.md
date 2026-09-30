# We Did This 🚀
### Proof-of-Work Project Showcase & Creator Social Platform

**We Did This** is a high-engagement project showcase, social networking, and peer-review platform built for the next generation of builders, coders, roboticists, artists, and creators.

Instead of passive doomscrolling, creators turn their hands-on builds—3D prints, robotics, games, hardware, and art—into verifiable proof-of-work, follow fellow makers, and collaborate in real-time.

---

## ✨ Features

- **🎨 Multi-Discipline Build Showcase**: Showcase 3D prints, Arduino/Raspberry Pi robotics, Unity/Godot games, digital art, custom keyboards, and apps with multi-image carousels and markdown write-ups.
- **🏷️ Custom YouTube-Style Hashtags**: Freeform custom hashtags (`#3dprinting`, `#robotics`, `#bambu`, `#cyberpunk`, `#unity`, etc.). Type any custom tag, press Enter, and instantly filter and explore matching builds.
- **👥 Creator Profiles & Follow System**: Explore full creator profiles showing follower/following counts, published builds, given peer reviews, and an interactive **Follow / Unfollow** button.
- **💬 Real-Time Messaging & Multi-User Group Channels**: Direct 1-on-1 chats, group channels with custom naming and member picking, photo attachments, and embedded collaboration invite cards.
- **🛠️ Project Studio & S3 Asset Uploader**: Presigned S3/R2 direct media uploader supporting PNG, JPEG, GIF, and WebP images up to 10MB with instant preview and progress tracking.
- **🤖 Native Gemini AI Copilot**: Internal assistant for generating structured READMEs, technical summaries, and pre-publication review quality analysis without synthetic users or simulated accounts.
- **🔐 Universal Authentication**: Quick single-field email login for returning users, paired with a safe onboarding flow requiring age verification, unique `@handle`, custom avatar upload, and human verification checks.
- **⚙️ Profile Customization**: Dedicated `UserProfileSettings` component to update display name, bio, custom creator hashtags, and upload avatars to S3.
- **📊 Activity Heatmap**: Interactive 84-day contribution grid displaying builds, milestone updates, and reviews.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **AI Engine**: [@google/genai TypeScript SDK](https://github.com/google/generative-ai-js)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` (version 9 or higher)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/we-did-this.git
   cd we-did-this
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API Key if using AI drafting features:
   ```env
   GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📁 Project Structure

```
├── public/                 # Static assets
├── src/
│   ├── assets/             # Generated visuals and mock assets
│   ├── components/
│   │   ├── ActivityHeatmap.tsx       # 84-day builder activity grid
│   │   ├── CreatorProfileModal.tsx   # Creator profile view with Follow/Unfollow
│   │   ├── DirectMessages.tsx        # Direct messaging & group chat channels
│   │   ├── GoogleAuthModal.tsx       # Email login & age-verified signup
│   │   ├── IntroLanding.tsx          # High-converting landing page
│   │   ├── Logo.tsx                  # Maker spark crystal emblem
│   │   ├── Navbar.tsx                # Sticky navigation header
│   │   ├── ProjectCard.tsx           # 3D interactive project cards
│   │   ├── ProjectDetailModal.tsx    # Project inspection & peer review modal
│   │   ├── ProjectStudio.tsx         # Build studio with S3 uploader
│   │   ├── ShareProofCard.tsx        # Shareable social proof card generator
│   │   └── UserProfileSettings.tsx   # Profile & custom avatar upload modal
│   ├── mock/
│   │   └── initialData.ts            # Persistent storage helpers
│   ├── services/
│   │   └── geminiService.ts          # Gemini AI drafting & review quality evaluator
│   ├── types/
│   │   └── index.ts                  # TypeScript interfaces & types
│   ├── App.tsx                       # Main application shell & state orchestration
│   ├── index.css                     # Global Tailwind CSS imports & theme rules
│   └── main.tsx                      # App entry point
├── index.html                        # HTML template
├── package.json                      # Project dependencies & scripts
├── tsconfig.json                     # TypeScript configuration
└── vite.config.ts                    # Vite configuration
```

---

## 📜 License

Apache-2.0 License. Built for creators and builders everywhere.
