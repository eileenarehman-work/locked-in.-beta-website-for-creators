import React, { useState } from 'react';
import {
  Database,
  Shield,
  Layers,
  MessageSquare,
  Sparkles,
  Palette,
  Cloud,
  Copy,
  Check,
  Code2,
  Terminal,
} from 'lucide-react';

export const ArchitectureSpecViewer: React.FC = () => {
  const [activeSection, setActiveSection] = useState<number>(1);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sections = [
    { id: 1, label: '1. Architecture & Schema', icon: Database },
    { id: 2, label: '2. Auth & Verification', icon: Shield },
    { id: 3, label: '3. Project & Review Pipeline', icon: Layers },
    { id: 4, label: '4. Real-Time Messaging', icon: MessageSquare },
    { id: 5, label: '5. Gemini AI Modules', icon: Sparkles },
    { id: 6, label: '6. UI/UX & Animations', icon: Palette },
    { id: 7, label: '7. Cloud Deployment', icon: Cloud },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Blueprint Header */}
      <div className="mb-8 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono text-indigo-400">ENGINEERING SPECIFICATION</span>
          <span className="text-slate-600">·</span>
          <span className="text-xs font-mono text-emerald-400">PRODUCTION ARCHITECTURE</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          "We Did This" Technical Specification & Blueprint
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-3xl leading-relaxed">
          High-performance distributed system architecture for zero-synthetic proof-of-work project showcase, 100% human-verified peer review rubrics, and native Gemini AI internal quality copilots.
        </p>

        {/* Section Navigation Tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {sections.map((s) => {
            const Icon = s.icon;
            const isActive = activeSection === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 ring-1 ring-indigo-400'
                    : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="space-y-8">
        {/* Section 1 */}
        {activeSection === 1 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Database className="h-5 w-5 text-indigo-400" />
                ## 1. System Architecture & Database Schema
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                The platform utilizes Next.js 14 App Router for edge-rendered SSR showcase pages, a stateless Node.js WebSocket cluster backed by Redis Pub/Sub, a high-throughput PostgreSQL primary database managed via Drizzle ORM, and client-side Google OAuth paired with server-side Turnstile verification.
              </p>

              {/* Mermaid Dataflow Diagram */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5 font-mono text-xs text-slate-300">
                <div className="flex items-center justify-between text-slate-400 mb-2 border-b border-slate-800 pb-2">
                  <span>SYSTEM DATA FLOW & SEQUENCE DIAGRAM (MERMAID)</span>
                </div>
                <pre className="overflow-x-auto text-[11px] leading-relaxed text-indigo-300">
{`sequenceDiagram
    autonumber
    actor Human as Verified Human Creator
    participant Client as Next.js 14 Webapp (React 19)
    participant CF as Cloudflare Edge & Turnstile
    participant API as Next.js Server Actions / API Gateway
    participant Redis as Redis 7 (Rate Limit, Pub/Sub, View HLL)
    participant DB as PostgreSQL (Drizzle ORM)
    participant Gemini as Gemini AI (Internal Quality & Copilots)

    Human->>Client: Submit Review (Rubric Scores + Critique)
    Client->>CF: Execute Turnstile CAPTCHA challenge
    CF-->>Client: Verification Token
    Client->>Gemini: Pre-screen Review Quality (0-100 score & feedback)
    Gemini-->>Client: Quality: 92/100 (APPROVED, Actionable Critique)
    Client->>API: POST /api/reviews (Token, Rubric, Feedback, GeminiScore)
    API->>Redis: Check Sliding Window Token Bucket (Max 30 reviews/hr)
    Redis-->>API: Rate Limit Nominal
    API->>DB: INSERT INTO reviews (status: 'APPROVED', rubric_json, ...)
    DB-->>API: Stored Row (ID: rev_xyz)
    API->>Redis: PUBLISH project:{id}:reviews (New Review Event)
    API-->>Client: HTTP 201 Created (Instant UI State Update)`}
                </pre>
              </div>

              {/* Prisma ORM & PostgreSQL Schema */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                <div className="flex items-center justify-between text-slate-400 mb-3 border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                    <Code2 className="h-4 w-4" />
                    POSTGRESQL & PRISMA ORM SCHEMA (CONSTRAINTS & COMPOSITE INDEXES)
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(
                        'prisma_schema',
                        `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id              String         @id @default(uuid())
  email           String         @unique
  googleId        String         @unique @map("google_id")
  age             Int
  handle          String         @unique
  displayName     String         @map("display_name")
  avatarUrl       String         @map("avatar_url")
  bio             String         @default("")
  reputationScore Int            @default(0) @map("reputation_score")
  createdAt       DateTime       @default(now()) @map("created_at")

  projects        Project[]
  likes           ProjectLike[]
  reviews         Review[]
  sentFriends     Friendship[]   @relation("UserFriendships")
  receivedFriends Friendship[]   @relation("FriendToUser")
  chatMembers     ChatMember[]
  messages        ChatMessage[]

  @@map("users")
}`
                      )
                    }
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-white font-mono"
                  >
                    {copiedKey === 'prisma_schema' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedKey === 'prisma_schema' ? 'Copied' : 'Copy Prisma Schema'}</span>
                  </button>
                </div>

                <pre className="overflow-x-auto font-mono text-xs text-slate-300 leading-relaxed max-h-[420px]">
{`datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// 1. Users (Strict Zero-Bot Verified Humans)
model User {
  id              String         @id @default(uuid())
  email           String         @unique
  googleId        String         @unique @map("google_id")
  age             Int            // Enforced >= 13 for teen safety compliance
  handle          String         @unique
  displayName     String         @map("display_name")
  avatarUrl       String         @map("avatar_url")
  bio             String         @default("")
  reputationScore Int            @default(0) @map("reputation_score")
  createdAt       DateTime       @default(now()) @map("created_at")

  projects        Project[]
  likes           ProjectLike[]
  reviews         Review[]
  sentFriends     Friendship[]   @relation("UserFriendships")
  receivedFriends Friendship[]   @relation("FriendToUser")
  chatMembers     ChatMember[]
  messages        ChatMessage[]

  @@map("users")
}

// 2. Friendships (Social Connection Graph)
model Friendship {
  id        String           @id @default(uuid())
  userId    String           @map("user_id")
  friendId  String           @map("friend_id")
  status    FriendshipStatus @default(PENDING)
  createdAt DateTime         @default(now()) @map("created_at")

  user   User @relation("UserFriendships", fields: [userId], references: [id], onDelete: Cascade)
  friend User @relation("FriendToUser", fields: [friendId], references: [id], onDelete: Cascade)

  @@unique([userId, friendId], name: "unique_friendship")
  @@index([userId])
  @@index([friendId])
  @@map("friendships")
}

enum FriendshipStatus {
  PENDING
  ACCEPTED
  BLOCKED
}

// 3. Projects (Proof-of-Work Builds)
model Project {
  id              String        @id @default(uuid())
  authorId        String        @map("author_id")
  title           String
  slug            String        @unique
  contentMarkdown String        @map("content_markdown") @db.Text
  mediaUrls       String[]      @map("media_urls") // AWS S3 / Cloudflare R2 presigned URLs
  viewsCount      Int           @default(0) @map("views_count")
  likesCount      Int           @default(0) @map("likes_count")
  tags            String[]      // GIN-indexed custom hashtags (#space, #robotics)
  status          ProjectStatus @default(DRAFT)
  createdAt       DateTime      @default(now()) @map("created_at")
  updatedAt       DateTime      @updatedAt @map("updated_at")

  author User          @relation(fields: [authorId], references: [id], onDelete: Cascade)
  likes  ProjectLike[]
  reviews Review[]

  @@index([authorId])
  @@index([status])
  @@map("projects")
}

enum ProjectStatus {
  DRAFT
  PUBLISHED
}

// 4. Project Likes (1-Like-Per-User Constraint)
model ProjectLike {
  projectId String   @map("project_id")
  userId    String   @map("user_id")
  createdAt DateTime @default(now()) @map("created_at")

  project Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([projectId, userId])
  @@map("project_likes")
}

// 5. Human Reviews (4-Part Rubric + AI Quality Gatekeeper)
model Review {
  id             String       @id @default(uuid())
  projectId      String       @map("project_id")
  reviewerId     String       @map("reviewer_id")
  rubricJson     Json         @map("rubric_json") // {clarity, execution, technicality, documentation}
  feedbackText   String       @map("feedback_text") @db.Text
  aiQualityScore Int          @map("ai_quality_score") // Pre-screen score (0-100)
  status         ReviewStatus @default(APPROVED)
  createdAt      DateTime     @default(now()) @map("created_at")

  project  Project @relation(fields: [projectId], references: [id], onDelete: Cascade)
  reviewer User    @relation(fields: [reviewerId], references: [id], onDelete: Cascade)

  @@index([projectId])
  @@index([reviewerId])
  @@map("reviews")
}

enum ReviewStatus {
  APPROVED
  FLAGGED
}

// 6. Chat Rooms (1-on-1 Direct & Multi-User Groups)
model ChatRoom {
  id        String       @id @default(uuid())
  type      ChatRoomType @default(DIRECT)
  name      String?
  avatarUrl String?      @map("avatar_url")
  createdAt DateTime     @default(now()) @map("created_at")

  members  ChatMember[]
  messages ChatMessage[]

  @@map("chat_rooms")
}

enum ChatRoomType {
  DIRECT
  GROUP
}

// 7. Chat Members (Channel Roles)
model ChatMember {
  roomId   String         @map("room_id")
  userId   String         @map("user_id")
  role     ChatMemberRole @default(MEMBER)

  room ChatRoom @relation(fields: [roomId], references: [id], onDelete: Cascade)
  user User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([roomId, userId])
  @@map("chat_members")
}

enum ChatMemberRole {
  MEMBER
  ADMIN
}

// 8. Chat Messages (Inline S3 Images & Read Receipts)
model ChatMessage {
  id        String    @id @default(uuid())
  roomId    String    @map("room_id")
  senderId  String    @map("sender_id")
  content   String    @db.Text
  imageUrls String[]  @map("image_urls")
  readAt    DateTime? @map("read_at")
  createdAt DateTime  @default(now()) @map("created_at")

  room   ChatRoom @relation(fields: [roomId], references: [id], onDelete: Cascade)
  sender User     @relation(fields: [senderId], references: [id], onDelete: Cascade)

  @@index([roomId])
  @@index([senderId])
  @@map("chat_messages")
}`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Section 2 */}
        {activeSection === 2 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-indigo-400" />
                ## 2. Authentication & Human-Verification System
              </h2>
              <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <h3 className="font-semibold text-white text-sm">Google OAuth & Onboarding Lifecycle</h3>
                  <ol className="list-decimal pl-5 space-y-1.5 text-slate-300">
                    <li><strong>Google OAuth 2.0 PKCE Flow:</strong> Single-click authentication verifying user email domain and preventing credential stuffing.</li>
                    <li><strong>Mandatory Human Onboarding Modal:</strong> Immediately triggers on first login. Requires date of birth (enforcing 13+ age requirement), unique alphanumeric <code className="text-indigo-300">@handle</code> reservation, and interest space tags (<code className="text-indigo-300">#space</code>, <code className="text-indigo-300">#robotics</code>, <code className="text-indigo-300">#hardware</code>).</li>
                    <li><strong>Zero-Synthetic Account Invariant:</strong> No anonymous guest accounts. Only users authenticated with verified Google OAuth profiles and passed CAPTCHAs can publish projects or write reviews.</li>
                  </ol>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <h3 className="font-semibold text-white text-sm">Anti-Bot & Abuse Prevention (Redis Token-Bucket & Turnstile)</h3>
                  <pre className="overflow-x-auto font-mono text-[11px] text-emerald-300 bg-slate-900/80 p-3 rounded-lg">
{`// Cloudflare Turnstile Verification Utility
export async function verifyTurnstileToken(token: string, ip: string): Promise<boolean> {
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY,
      response: token,
      remoteip: ip,
    }),
  });
  const outcome = await res.json();
  return outcome.success === true;
}

// Redis Token-Bucket Rate Limiter (Max 100 likes/hr, 30 reviews/hr)
export async function checkRateLimit(userId: string, action: string, maxTokens = 100, intervalSec = 3600) {
  const key = \`rate_limit:\${action}:\${userId}\`;
  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, intervalSec);
  }
  return current <= maxTokens;
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 3 */}
        {activeSection === 3 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="h-5 w-5 text-indigo-400" />
                ## 3. Project Studio & Human Review Pipeline
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <h3 className="font-semibold text-white text-sm">Project State Machine</h3>
                  <p className="font-mono text-indigo-300">DRAFT → PENDING_MODERATION → PUBLISHED</p>
                  <ul className="list-disc pl-4 space-y-1 text-slate-400">
                    <li><strong>DRAFT:</strong> Editable by author; autosaved in browser/DB.</li>
                    <li><strong>PENDING_MODERATION:</strong> Automated safety scan for malicious payloads.</li>
                    <li><strong>PUBLISHED:</strong> Open for community discovery, likes, and peer reviews.</li>
                  </ul>
                </div>
 
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <h3 className="font-semibold text-white text-sm">4-Part Scoring Rubric</h3>
                  <ul className="list-disc pl-4 space-y-1 text-slate-400">
                    <li><strong>1. Clarity (0–25):</strong> Scope definition, problem formulation, and readability.</li>
                    <li><strong>2. Execution (0–25):</strong> Real-world performance, physical/code reproducibility.</li>
                    <li><strong>3. Technicality (0–25):</strong> Architectural depth, schematics, and algorithms.</li>
                    <li><strong>4. Documentation (0–25):</strong> Test benchmarks, telemetry, and schematics.</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                <h3 className="font-semibold text-white text-sm">Atomic Metrics Engine (Redis HyperLogLog & Optimistic Likes)</h3>
                <pre className="overflow-x-auto font-mono text-[11px] text-indigo-300 bg-slate-900/80 p-3 rounded-lg">
{`// Atomic View Count Deduplication via Redis HyperLogLog
export async function recordProjectView(projectId: string, ip: string, userId?: string) {
  const viewerHash = userId || ip;
  const hllKey = \`hll:views:\${projectId}\`;
  const added = await redis.pfadd(hllKey, viewerHash);
  if (added === 1) {
    // Increment persistent counter in write-behind batch
    await redis.hincrby("project_views_pending", projectId, 1);
  }
}

// Transactional Optimistic Like Toggle
export async function toggleProjectLike(projectId: string, userId: string) {
  return await db.transaction(async (tx) => {
    const existing = await tx.select().from(projectLikes).where(
      and(eq(projectLikes.projectId, projectId), eq(projectLikes.userId, userId))
    ).limit(1);

    if (existing.length > 0) {
      await tx.delete(projectLikes).where(and(eq(projectLikes.projectId, projectId), eq(projectLikes.userId, userId)));
      await tx.update(projects).set({ likesCount: sql\`likes_count - 1\` }).where(eq(projects.id, projectId));
      return { liked: false };
    } else {
      await tx.insert(projectLikes).values({ projectId, userId });
      await tx.update(projects).set({ likesCount: sql\`likes_count + 1\` }).where(eq(projects.id, projectId));
      return { liked: true };
    }
  });
}`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Section 4 */}
        {activeSection === 4 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-indigo-400" />
                ## 4. Real-Time Direct Messaging System
              </h2>
              <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                <p>
                  Built on a multi-node WebSocket architecture with a Redis Pub/Sub backplane. Ensures that real-time typing indicators, message deliveries, and interactive collaboration cards are routed across server instances without sticky sessions.
                </p>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <h3 className="font-semibold text-white text-sm">Socket.io Event Payloads (JSON Specifications)</h3>
                  <pre className="overflow-x-auto font-mono text-[11px] text-cyan-300 bg-slate-900/80 p-3 rounded-lg">
{`// 1. Send Message Payload (DMs & Group Channels with Inline S3 Media)
{
  "event": "chat:send_message",
  "data": {
    "id": "msg_01h8q28a",
    "roomId": "room_cubesat_dev",
    "senderId": "usr_alex_101",
    "content": "Attached our latest TVAC telemetry curves. GaN PA efficiency hit 48% at 2.45 GHz!",
    "imageUrls": [
      "https://s3.us-east-1.amazonaws.com/wedidthis-media/proofs/tvac_curve_8921.webp"
    ],
    "createdAt": "2026-03-29T14:10:00.000Z"
  }
}

// 2. Typing Indicator Broadcast
{
  "event": "chat:typing",
  "data": {
    "roomId": "room_cubesat_dev",
    "userId": "usr_alex_101",
    "handle": "alex_architect",
    "isTyping": true
  }
}

// 3. Friend Request Notification Payload
{
  "event": "friend:request_sent",
  "data": {
    "friendshipId": "fr_99214a",
    "senderId": "usr_alex_101",
    "senderHandle": "alex_architect",
    "senderDisplayName": "Alex Vance",
    "targetUserId": "usr_sora_03",
    "status": "PENDING",
    "createdAt": "2026-03-29T14:12:00.000Z"
  }
}

// 4. Group Invite User Payload
{
  "event": "group:invite_user",
  "data": {
    "roomId": "room_robotics_lab",
    "roomName": "🤖 RoboCup & Bipedal Dynamics",
    "inviterId": "usr_marcus_02",
    "invitedUserId": "usr_alex_101",
    "assignedRole": "MEMBER",
    "timestamp": "2026-03-29T14:15:00.000Z"
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 5 */}
        {activeSection === 5 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                ## 5. Gemini AI Integration Modules
              </h2>
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
                <strong>Strict Platform Policy:</strong> Gemini AI is strictly an internal assistant and quality evaluator. It NEVER fabricates peer reviews or creates synthetic accounts.
              </div>

              <div className="space-y-4 text-xs text-slate-300">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <h3 className="font-semibold text-white text-sm">Module A: Drafting Assistant System Prompt</h3>
                  <pre className="overflow-x-auto font-mono text-[11px] text-indigo-300 bg-slate-900/80 p-3 rounded-lg">
{`SYSTEM_PROMPT: "You are the We Did This Technical Drafting Assistant.
Analyze creator raw notes, architecture diagrams, and hardware benchmarks to generate a high-impact technical README in Markdown format, 3 concrete milestones, and a 2-sentence elevator pitch. Maintain rigorous engineering tone."

JSON_SCHEMA: {
  "readmeMarkdown": "string",
  "milestones": [{"title": "string", "description": "string"}],
  "elevatorPitch": "string"
}`}
                  </pre>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <h3 className="font-semibold text-white text-sm">Module B: Review Quality Evaluator System Prompt</h3>
                  <pre className="overflow-x-auto font-mono text-[11px] text-emerald-300 bg-slate-900/80 p-3 rounded-lg">
{`SYSTEM_PROMPT: "You are the We Did This Quality Evaluator. We guarantee 100% human-verified reviews.
Your goal is to evaluate the depth, technical specificity, and constructiveness of this HUMAN reviewer's critique before it gets written to PostgreSQL.
Assess:
1. Specificity (cites concrete hardware/software components).
2. Actionable Recommendations (suggests test cases or edge cases).
3. Professional, constructive tone.
Return qualityScore (0-100), isApproved (true if >= 60), and improvement feedback."`}
                  </pre>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <h3 className="font-semibold text-white text-sm">Module C: Smart Tagging & Peer Matcher</h3>
                  <pre className="overflow-x-auto font-mono text-[11px] text-cyan-300 bg-slate-900/80 p-3 rounded-lg">
{`SYSTEM_PROMPT: "Analyze the project title and technical specifications. Assign up to 4 canonical tags from [#space, #robotics, #hardware, #systems, #ai, #creative-code, #quantum, #webdev, #biotech] and match 2 verified human peer reviewer specialties."`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 6 */}
        {activeSection === 6 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Palette className="h-5 w-5 text-indigo-400" />
                ## 6. UI/UX, Animations & Engagement Mechanics
              </h2>
              <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                    <span className="text-[10px] font-mono text-slate-500 block">60% DOMINANT CANVAS</span>
                    <span className="font-semibold text-white text-sm">Deep Slate #0F172A</span>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                    <span className="text-[10px] font-mono text-slate-500 block">30% STRUCTURAL</span>
                    <span className="font-semibold text-indigo-400 text-sm">Electric Indigo #6366F1</span>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                    <span className="text-[10px] font-mono text-slate-500 block">10% ACCENT BUDGET</span>
                    <span className="font-semibold text-emerald-400 text-sm">Emerald #10B981</span>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <h3 className="font-semibold text-white text-sm">Framer Motion Micro-Animations & 3D Tilt Math</h3>
                  <pre className="overflow-x-auto font-mono text-[11px] text-pink-300 bg-slate-900/80 p-3 rounded-lg">
{`// 3D Perspective Tilt on Mouse Coordinates
const rotX = -((mouseY - cardCenterY) / cardCenterY) * 6; // Max 6 deg
const rotY = ((mouseX - cardCenterX) / cardCenterX) * 6;

// Like Spring Animation & Particle Explosion
<motion.button
  whileTap={{ scale: 0.9 }}
  whileHover={{ scale: 1.1 }}
>
  <motion.div animate={isLiked ? { scale: [1, 1.4, 1] } : { scale: 1 }}>
    <Heart className={isLiked ? "fill-rose-500 text-rose-500" : "text-slate-400"} />
  </motion.div>
</motion.button>`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 7 */}
        {activeSection === 7 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Cloud className="h-5 w-5 text-indigo-400" />
                ## 7. Deployment Pipeline and Cloud Infrastructure Configuration
              </h2>
              <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <h3 className="font-semibold text-white text-sm">Containerized Multi-Stage Dockerfile</h3>
                  <pre className="overflow-x-auto font-mono text-[11px] text-indigo-300 bg-slate-900/80 p-3 rounded-lg">
{`FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./
EXPOSE 3000
CMD ["npm", "start"]`}
                  </pre>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <h3 className="font-semibold text-white text-sm">Terraform / Cloud Run + Redis Cluster Topology</h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                    <li><strong>Google Cloud Run (Next.js 14 Web Nodes):</strong> Auto-scales from 2 to 50 instances based on concurrency (target 80 concurrent requests per container).</li>
                    <li><strong>Cloud SQL (PostgreSQL 16):</strong> Multi-AZ high availability with pgvector extension ready for semantic search, read replicas for discovery feed queries.</li>
                    <li><strong>Google Cloud Memorystore (Redis 7 Cluster):</strong> Powers token-bucket rate limiters, atomic HyperLogLog view deduplication, and WebSocket Pub/Sub backplane.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
