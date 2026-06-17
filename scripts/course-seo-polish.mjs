// Polish generated course summaries so course pages have more distinct SEO copy.
// The script only updates records that still contain the generic generated phrase.

import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const coursesDir = path.join("src", "content", "courses");
const generatedMarker = "helps participants turn course concepts into practical workplace habits";
const polishedMarker = "HRD Corp-claimable";

const topicOverrides = {
  "change-management-managing-mindset-for-peak-performance": "change management and peak-performance mindset",
  "statistical-process-control-course-outline": "statistical process control",
  "chemical-safe-and-right-use-of-ppe": "chemical safety and PPE use",
  "excel-functions-and-formulas": "Excel functions and formulas",
  "improving-negotiation": "negotiation",
  "credit-control-management": "credit control management",
  "ai-implementation-in-accounting-and-finance-from-strategy-to-optimization": "AI implementation in accounting and finance",
  "understanding-the-implication-and-the-impact-of-e-invoicing": "e-invoicing implementation",
  "iso-9001-2015-internal-quality-auditing-and-audit-report-writing": "ISO 9001 internal auditing and audit report writing",
  "ms-1514-2022-good-manufacturing-practices-gmp": "MS 1514:2022 good manufacturing practices",
  "fssc-22000-v6-training-outline": "FSSC 22000 version 6",
  "hazard-analysis-critical-control-point-haccp": "HACCP",
  "gmp-and-allergen-management-awareness": "GMP and allergen management",
  "gd-and-t-3days": "GD&T",
  "7qc-tools": "7QC tools",
  "6s-toward-a-quality-management-itinerary": "6S quality management",
  "5s-best-practices-for-organized": "5S workplace organization",
  "microsoft-excel-beginner-1-day": "Microsoft Excel beginner skills",
  "microsoft-excel-intermediate-level-1-day": "Microsoft Excel intermediate skills",
  "maximizing-microsoft-excel-tools-for-fast-and-accurate": "Microsoft Excel productivity tools",
  "microsoft-outlook": "Microsoft Outlook productivity",
  "ubs-accounting-and-billing": "UBS accounting and billing",
};

const categoryCopy = {
  "leadership-management-coaching": {
    noun: "leadership",
    subtitle: (duration, topic) => `A ${duration} HRD Corp-claimable leadership workshop for building practical ${topic} habits at work.`,
    why: (title, topic, modules) =>
      `${title} helps supervisors, managers, and team leads turn ${topic} into clearer expectations, better conversations, and practical follow-through. Participants work through ${modules} so they can lead people and workplace change with more confidence.`,
  },
  "quality-lean-food-safety": {
    noun: "quality and compliance",
    subtitle: (duration, topic) => `A ${duration} HRD Corp-claimable quality workshop for applying ${topic} requirements at work.`,
    why: (title, topic, modules) =>
      `${title} helps quality, operations, and process teams translate ${topic} into daily routines, evidence, and improvement habits. The session covers ${modules} so participants can support standards, audits, and process discipline with more confidence.`,
  },
  "safety-health-environment": {
    noun: "safety",
    subtitle: (duration, topic) => `A ${duration} HRD Corp-claimable safety programme for strengthening awareness and practice in ${topic}.`,
    why: (title, topic, modules) =>
      `${title} helps workplace teams recognize hazards, apply controls, and make ${topic} part of everyday operations. Participants explore ${modules} so safety expectations become easier to understand, discuss, and act on.`,
  },
  "hr-employment-law": {
    noun: "HR compliance",
    subtitle: (duration, topic) => `A ${duration} HRD Corp-claimable HR workshop for handling ${topic} more confidently.`,
    why: (title, topic, modules) =>
      `${title} helps HR teams, managers, and administrators make better workplace decisions around ${topic}. The workshop covers ${modules} so participants can connect legal or payroll requirements to clearer documentation and daily practice.`,
  },
  "microsoft-ai-digital-skills": {
    noun: "digital productivity",
    subtitle: (duration, topic) => `A ${duration} HRD Corp-claimable digital skills workshop for improving productivity with ${topic}.`,
    why: (title, topic, modules) =>
      `${title} helps office teams use ${topic} with more structure, accuracy, and confidence. Participants practise ${modules} so digital tools become easier to apply to reports, data, communication, and everyday work output.`,
  },
  "sales-marketing-customer-service": {
    noun: "customer-facing",
    subtitle: (duration, topic) => `A ${duration} HRD Corp-claimable customer-facing workshop for improving ${topic} performance.`,
    why: (title, topic, modules) =>
      `${title} helps sales, marketing, and service teams improve ${topic} through clearer conversations, stronger follow-through, and more consistent customer handling. Participants practise ${modules} so they can apply the skills in real customer situations.`,
  },
  "finance-taxation": {
    noun: "finance",
    subtitle: (duration, topic) => `A ${duration} HRD Corp-claimable finance workshop for applying ${topic} more confidently at work.`,
    why: (title, topic, modules) =>
      `${title} helps managers, finance support teams, and business users understand ${topic} in practical workplace terms. The session connects ${modules} to better financial decisions, controls, and business conversations.`,
  },
  "supply-chain-shipping-warehousing": {
    noun: "supply chain",
    subtitle: (duration, topic) => `A ${duration} HRD Corp-claimable supply chain workshop for strengthening ${topic} practice.`,
    why: (title, topic, modules) =>
      `${title} helps logistics, shipping, and warehouse teams improve ${topic} with clearer routines and shared operating language. Participants work through ${modules} so daily coordination, documentation, and control become more consistent.`,
  },
  "communication-personal-effectiveness": {
    noun: "workplace effectiveness",
    subtitle: (duration, topic) => `A ${duration} HRD Corp-claimable workplace effectiveness workshop for strengthening ${topic}.`,
    why: (title, topic, modules) =>
      `${title} helps employees and supervisors strengthen ${topic} through clearer communication, practical tools, and better everyday work habits. Participants explore ${modules} so the learning can be translated into immediate action at work.`,
  },
};

function formatDuration(days) {
  if (days === 0.5) return "half-day";
  if (days === 1) return "1-day";
  return `${days}-day`;
}

function normalizeAcronyms(value) {
  return value
    .replace(/\bai\b/g, "AI")
    .replace(/\bbm\b/g, "BM")
    .replace(/\bdosh\b/g, "DOSH")
    .replace(/\bfssc\b/g, "FSSC")
    .replace(/\bgd&t\b/g, "GD&T")
    .replace(/\bgmp\b/g, "GMP")
    .replace(/\bhaccp\b/g, "HACCP")
    .replace(/\bhrd\b/g, "HRD")
    .replace(/\bir4\b/g, "IR4")
    .replace(/\biso\b/g, "ISO")
    .replace(/\bms\b/g, "MS")
    .replace(/\bnlp\b/g, "NLP")
    .replace(/\bosh\b/g, "OSH")
    .replace(/\bppe\b/g, "PPE")
    .replace(/\bqms\b/g, "QMS")
    .replace(/\bspc\b/g, "SPC")
    .replace(/\bexcel\b/g, "Excel")
    .replace(/\bmicrosoft\b/g, "Microsoft")
    .replace(/\btiktok\b/g, "TikTok")
    .replace(/\bvuca\b/g, "VUCA");
}

function titleToTopic(course) {
  if (topicOverrides[course.slug]) return topicOverrides[course.slug];

  const cleaned = course.title
    .replace(/\s*[-–]\s*\d+\s*days?\b/gi, "")
    .replace(/\s*\(\s*\d+\s*days?\s*\)/gi, "")
    .replace(/\s*\b\d+\s*days?\b/gi, "")
    .replace(/\s+course outline\b/gi, "")
    .replace(/\s+training outline\b/gi, "")
    .replace(/^improving\s+/i, "")
    .replace(/\s+/g, " ")
    .trim();

  return normalizeAcronyms(cleaned.toLowerCase());
}

function humanizeModuleTitle(value) {
  const cleaned = value.replace(/\s+/g, " ").replace(/[.!?]$/, "").trim();
  if (!cleaned) return "";
  const lettersOnly = cleaned.replace(/[^a-z]/gi, "");
  const isAllCaps = lettersOnly.length > 4 && cleaned === cleaned.toUpperCase();
  return isAllCaps ? normalizeAcronyms(cleaned.toLowerCase()) : cleaned;
}

function readableModules(course) {
  const topic = titleToTopic(course).toLowerCase();
  const modules = course.modules
    .map((module) => humanizeModuleTitle(module.title))
    .filter((title) => title.length > 0)
    .filter((title) => title.toLowerCase() !== topic)
    .filter((title) => !/^(course introduction|workplace context and personal effectiveness|core skills, tools, and techniques|practical application and action planning)$/i.test(title))
    .slice(0, 3);

  if (modules.length === 0) return "the core topic, practical exercises, and workplace action planning";
  if (modules.length === 1) return modules[0];
  if (modules.length === 2) return `${modules[0]} and ${modules[1]}`;
  return `${modules[0]}, ${modules[1]}, and ${modules[2]}`;
}

const files = (await readdir(coursesDir)).filter((file) => file.endsWith(".json")).sort();
let updated = 0;

for (const file of files) {
  const filePath = path.join(coursesDir, file);
  const course = JSON.parse(await readFile(filePath, "utf8"));
  const template = categoryCopy[course.categorySlug];

  const isGenerated = course.whyThisMatters?.includes(generatedMarker) || course.subtitle?.includes(polishedMarker);
  if (!template || !isGenerated) continue;

  const duration = formatDuration(course.durationDays);
  const topic = titleToTopic(course) || template.noun;
  const modules = readableModules(course);

  course.subtitle = template.subtitle(duration, topic);
  course.whyThisMatters = template.why(course.title, topic, modules);

  await writeFile(filePath, `${JSON.stringify(course, null, 2)}\n`);
  updated += 1;
}

console.log(`Polished SEO copy for ${updated} generated course records.`);
