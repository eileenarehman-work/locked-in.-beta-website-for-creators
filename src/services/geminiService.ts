import { GoogleGenAI } from '@google/genai';

// Initialize Gemini client if environment variable is available
const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) || '';

let genAiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    genAiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Failed to initialize Gemini client:', err);
  }
}

export interface ReviewQualityResult {
  qualityScore: number; // 0 - 100
  isApproved: boolean;
  strengths: string[];
  critiqueGaps: string[];
  constructivenessFeedback: string;
  wordCount: number;
}

export interface DraftingResult {
  readmeMarkdown: string;
  milestones: Array<{ title: string; description: string }>;
  elevatorPitch: string;
}

export interface SmartTagResult {
  assignedTags: string[];
  primarySpace: string;
  suggestedPeerSpecialties: string[];
  confidenceScore: number;
}

/**
 * MODULE 1: Drafting Assistant
 * Generates technical README, elevator pitch, and milestone roadmap
 */
export async function generateProjectDraft(
  title: string,
  rawNotes: string,
  category: string
): Promise<DraftingResult> {
  const prompt = `You are the We Did This Technical Drafting Assistant.
Analyze this creator project:
Title: "${title}"
Category: "${category}"
Creator Notes: "${rawNotes}"

Generate:
1. A concise, high-impact technical README in Markdown format with Overview, Architecture, Tech Stack, and Proof-of-Work Milestones.
2. 3 concrete milestones with concise descriptions.
3. A 2-sentence technical elevator pitch.

Output ONLY valid JSON with keys:
{
  "readmeMarkdown": "...",
  "milestones": [{"title": "...", "description": "..."}],
  "elevatorPitch": "..."
}`;

  if (genAiClient) {
    try {
      const response = await genAiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });
      const parsed = JSON.parse(response.text || '{}');
      if (parsed.readmeMarkdown && parsed.milestones && parsed.elevatorPitch) {
        return parsed;
      }
    } catch (err) {
      console.warn('Gemini Drafting API fallback triggered:', err);
    }
  }

  // Domain-specific intelligent drafting fallback for teen builds
  return {
    elevatorPitch: `${title} is a hands-on teen build in ${category.toLowerCase() || 'makers and coding'}. Documented with real tools, iterations, and lessons learned.`,
    milestones: [
      {
        title: 'Initial Design & Prototyping',
        description: 'Sketched concepts, gathered materials/software libraries, and created the first working iteration.',
      },
      {
        title: 'Testing & Fixing Bugs / Print Calibration',
        description: 'Iterated through multiple print settings, circuit breadboard wiring, or gameplay playtests to resolve edge cases.',
      },
      {
        title: 'Final Build Release & Documentation',
        description: 'Finished final assembly, polished aesthetics/code, and published build notes on We Did This for peer feedback.',
      },
    ],
    readmeMarkdown: `## About ${title}\nA hands-on project created in the **${category}** space.\n\n### How I Made It\n- **Tools & Tech**: Hands-on crafting, iteration, and design.\n- **What I Learned**: Troubleshooting problems and tuning settings.\n- **Future Upgrades**: Ideas for future updates or community remixing.\n\n### Try It Out / Recreate\nCheck out the photos and links above to see the build in action! Feel free to leave a peer review rubric below with tips or questions.`,
  };
}

/**
 * MODULE 2: Review Quality Evaluator
 * Pre-screens peer reviews for constructiveness, depth, effort, and tone before DB submission.
 * Zero synthetic reviews allowed; human reviews must meet high standards.
 */
export async function evaluateReviewQuality(
  feedbackText: string,
  projectTitle: string,
  rubricScores: { clarity: number; execution: number; technicality: number; documentation: number }
): Promise<ReviewQualityResult> {
  const wordCount = feedbackText.trim().split(/\s+/).filter(Boolean).length;

  const prompt = `You are the We Did This Quality Evaluator. We Did This guarantees 100% human-verified reviews.
Your goal is NOT to write reviews, but strictly to score the quality and constructiveness of this HUMAN reviewer's critique before it gets published.

Project: "${projectTitle}"
Rubric: Clarity=${rubricScores.clarity}/25, Execution=${rubricScores.execution}/25, Technicality=${rubricScores.technicality}/25, Documentation=${rubricScores.documentation}/25.
Reviewer Critique:
"${feedbackText}"

Evaluate for:
1. Specificity (cites concrete technical aspects rather than generic praise like 'looks good').
2. Actionable Feedback (provides tangible recommendations or edge-cases).
3. Constructive Tone (objective, professional, respectful).
4. Depth & Effort (sufficient elaboration).

Return ONLY valid JSON matching:
{
  "qualityScore": 88,
  "isApproved": true,
  "strengths": ["...", "..."],
  "critiqueGaps": ["..."],
  "constructivenessFeedback": "..."
}`;

  if (genAiClient && wordCount >= 10) {
    try {
      const response = await genAiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });
      const parsed = JSON.parse(response.text || '{}');
      if (typeof parsed.qualityScore === 'number') {
        return {
          qualityScore: Math.min(100, Math.max(0, parsed.qualityScore)),
          isApproved: parsed.qualityScore >= 60,
          strengths: parsed.strengths || ['Identified specific project components'],
          critiqueGaps: parsed.critiqueGaps || [],
          constructivenessFeedback: parsed.constructivenessFeedback || 'High quality constructive evaluation.',
          wordCount,
        };
      }
    } catch (err) {
      console.warn('Gemini Quality Evaluator fallback triggered:', err);
    }
  }

  // Heuristic rule engine simulating the Gemini evaluation contract
  const lower = feedbackText.toLowerCase();
  const hasTechnicalTerms = /(latency|architecture|schematic|telemetry|bandwidth|memory|async|interface|test|bench|circuit|payload|algorithm|packet|rubric|edge-case|docs)/.test(lower);
  const hasConstructivePointers = /(suggest|recommend|consider|improvement|enhance|caution|bottleneck|verify|ensure|potential)/.test(lower);
  const isTooShort = wordCount < 20;
  const isSuperficial = /^(looks good|nice job|cool project|awesome|great work|10\/10|bad|terrible)[.!]?$/i.test(feedbackText.trim());

  let score = 50;
  const strengths: string[] = [];
  const critiqueGaps: string[] = [];

  if (wordCount >= 50) {
    score += 20;
    strengths.push('Detailed, in-depth elaboration exceeding 50 words');
  } else if (wordCount >= 25) {
    score += 10;
    strengths.push('Adequate length for initial technical feedback');
  } else {
    critiqueGaps.push('Too brief; please provide at least 25 words of actionable observations');
  }

  if (hasTechnicalTerms) {
    score += 15;
    strengths.push('References domain-specific architectural concepts');
  } else {
    critiqueGaps.push('Lacks concrete architectural citations (e.g. latency, schematics, telemetry, error handling)');
  }

  if (hasConstructivePointers) {
    score += 15;
    strengths.push('Supplies actionable suggestions for creator iteration');
  } else {
    critiqueGaps.push('Consider adding specific recommendations to help the author improve the build');
  }

  if (isSuperficial) {
    score = 25;
    critiqueGaps.unshift('Superficial review detected. Please write substantive technical critique.');
  }

  const finalScore = Math.min(100, Math.max(15, score));
  const isApproved = finalScore >= 60;

  return {
    qualityScore: finalScore,
    isApproved,
    strengths: strengths.length ? strengths : ['Basic critique structure provided'],
    critiqueGaps,
    constructivenessFeedback: isApproved
      ? 'Verified high-constructiveness human review. Meets We Did This quality standards.'
      : 'Review needs additional technical specifics or actionable recommendations before approval.',
    wordCount,
  };
}

/**
 * MODULE 3: Smart Tagging & Peer Matcher
 * Analyzes project content to assign canonical tags (#space, #robotics, etc.)
 * and identifies verified human peer reviewers with matching specialty.
 */
export async function assignSmartTags(
  title: string,
  content: string
): Promise<SmartTagResult> {
  const prompt = `You are the We Did This Smart Tagging Engine for teen creators and builders.
Analyze this project:
Title: "${title}"
Content: "${content.slice(0, 1000)}"

Select up to 4 canonical tags from:
[#art, #3dprinting, #robotics, #gamedev, #coding, #music, #makers, #electronics, #webdev, #animation]
Assign the primary space and 2 suggested peer reviewer specialties.

Return valid JSON:
{
  "assignedTags": ["#3dprinting", "#makers"],
  "primarySpace": "#3dprinting",
  "suggestedPeerSpecialties": ["3D CAD Modeling", "Print Slicing"],
  "confidenceScore": 0.94
}`;

  if (genAiClient) {
    try {
      const response = await genAiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      });
      const parsed = JSON.parse(response.text || '{}');
      if (parsed.assignedTags && parsed.primarySpace) {
        return parsed;
      }
    } catch (err) {
      console.warn('Gemini Tagging API fallback triggered:', err);
    }
  }

  // Deterministic teen domain classification
  const combined = (title + ' ' + content).toLowerCase();
  const tags: string[] = [];
  let primary = '#makers';

  if (combined.includes('3d') || combined.includes('print') || combined.includes('pla') || combined.includes('filament') || combined.includes('blender') || combined.includes('cad') || combined.includes('stl')) {
    tags.push('#3dprinting');
    primary = '#3dprinting';
  }
  if (combined.includes('robot') || combined.includes('arduino') || combined.includes('motor') || combined.includes('sensor') || combined.includes('raspberry') || combined.includes('servo')) {
    tags.push('#robotics', '#electronics');
    if (primary === '#makers') primary = '#robotics';
  }
  if (combined.includes('art') || combined.includes('draw') || combined.includes('paint') || combined.includes('character') || combined.includes('comic') || combined.includes('pixel') || combined.includes('illustration')) {
    tags.push('#art');
    primary = '#art';
  }
  if (combined.includes('game') || combined.includes('unity') || combined.includes('godot') || combined.includes('roblox') || combined.includes('minecraft') || combined.includes('play')) {
    tags.push('#gamedev');
    primary = '#gamedev';
  }
  if (combined.includes('code') || combined.includes('bot') || combined.includes('discord') || combined.includes('python') || combined.includes('web') || combined.includes('react') || combined.includes('app')) {
    tags.push('#coding', '#webdev');
    if (primary === '#makers') primary = '#coding';
  }
  if (combined.includes('music') || combined.includes('beat') || combined.includes('audio') || combined.includes('synth') || combined.includes('song')) {
    tags.push('#music');
    primary = '#music';
  }

  if (tags.length === 0) {
    tags.push('#makers', '#coding');
  }

  return {
    assignedTags: Array.from(new Set(tags)).slice(0, 4),
    primarySpace: primary,
    suggestedPeerSpecialties: ['Project Design', 'Technical Execution'],
    confidenceScore: 0.92,
  };
}
