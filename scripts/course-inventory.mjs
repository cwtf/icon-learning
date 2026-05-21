import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const documentsDir = path.join("course", "documents");
const curationDir = path.join("src", "content", "courses", "_curation");
const outputPath = path.join(curationDir, "inventory.json");

const categoryRules = [
  {
    slug: "leadership-management-coaching",
    patterns: [
      "leadership",
      "leader",
      "management",
      "manager",
      "supervisor",
      "coaching",
      "mentoring",
      "motivation",
      "influence",
      "change management",
      "performance",
      "engaged team",
    ],
  },
  {
    slug: "quality-lean-food-safety",
    patterns: [
      "iso",
      "qms",
      "quality",
      "5s",
      "6s",
      "7qc",
      "six sigma",
      "lean",
      "haccp",
      "food",
      "halal",
      "sertu",
      "gmp",
      "fssc",
      "spc",
      "fmea",
      "audit",
    ],
  },
  {
    slug: "safety-health-environment",
    patterns: [
      "safety",
      "health",
      "osh",
      "hirarc",
      "chemical",
      "ppe",
      "emergency",
      "fire",
      "environment",
      "waste",
      "forklift",
      "ergonomic",
    ],
  },
  {
    slug: "hr-employment-law",
    patterns: [
      "human resource",
      "hr",
      "employment",
      "labour",
      "labor",
      "payroll",
      "discipline",
      "misconduct",
      "absenteeism",
      "domestic inquiry",
      "industrial relations",
    ],
  },
  {
    slug: "microsoft-ai-digital-skills",
    patterns: [
      "microsoft",
      "excel",
      "power bi",
      "powerpoint",
      "word",
      "ai",
      "prompt",
      "cyber",
      "digital",
      "social media",
      "marketing",
    ],
  },
  {
    slug: "sales-marketing-customer-service",
    patterns: [
      "sales",
      "selling",
      "customer",
      "service",
      "hospitality",
      "retail",
      "complaints",
      "automobile",
      "negotiation",
      "telemarketing",
    ],
  },
  {
    slug: "finance-taxation",
    patterns: ["finance", "financial", "account", "accounting", "tax", "budget", "costing"],
  },
  {
    slug: "supply-chain-shipping-warehousing",
    patterns: [
      "supply chain",
      "shipping",
      "warehouse",
      "warehousing",
      "inventory",
      "incoterms",
      "procurement",
      "logistic",
      "store",
    ],
  },
  {
    slug: "communication-personal-effectiveness",
    patterns: [
      "communication",
      "communicate",
      "presentation",
      "time management",
      "personal",
      "thinking",
      "problem solving",
      "decision",
      "teambuilding",
      "teamwork",
      "nlp",
      "habits",
      "work success",
    ],
  },
];

const extensionRank = new Map([
  [".pdf", 4],
  [".docx", 3],
  [".doc", 2],
  [".pptx", 1],
]);

function tidyName(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/\^j|\^l?0/gi, " and ")
    .replace(/[\u0000-\u001f^]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function withoutExtension(filename) {
  return tidyName(filename.replace(/\.[^.]+$/, ""));
}

function baseTitle(filename) {
  return withoutExtension(filename)
    .replace(/\bconverted\b/gi, "")
    .replace(/\brev\b/gi, "")
    .replace(/\bitin(?:e|a)rary\b/gi, "")
    .replace(/\btraining outline\b/gi, "")
    .replace(/\bcourse outline\b/gi, "")
    .replace(/\boutline\b/gi, "")
    .replace(/\((?:\d+|[a-z])\)/gi, "")
    .replace(/\b(?:0\.5|1|2|3)\s*(?:d|day|days)\b/gi, "")
    .replace(/\b(?:4|8|16|24)\s*(?:hr|hrs|hour|hours)\b/gi, "")
    .replace(/\b\d+\s*-\s*day\b/gi, "")
    .replace(/^[\s()._-]+|[\s()._-]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value) {
  return tidyName(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inferDurationDays(filename) {
  const name = tidyName(filename).toLowerCase();
  const dayMatch = name.match(/\b(0\.5|1|2|3)\s*(?:days|day|d)\b/);
  if (dayMatch) return Number(dayMatch[1]);
  const hourMatch = name.match(/\b(4|8|16|24)\s*(?:hr|hrs|hour|hours)\b/);
  if (!hourMatch) return null;
  const hours = Number(hourMatch[1]);
  if (hours <= 4) return 0.5;
  return Math.min(3, Math.max(1, hours / 8));
}

function inferLanguage(filename) {
  const name = tidyName(filename).toLowerCase();
  if (/\b(kursus|pengendalian|makanan|persijilan|halal|sertu)\b/.test(name)) {
    return "ms";
  }
  return "en";
}

function inferCategorySlug(title) {
  const value = tidyName(title).toLowerCase();
  const match = categoryRules.find((category) =>
    category.patterns.some((pattern) => value.includes(pattern))
  );
  return match?.slug ?? "communication-personal-effectiveness";
}

function isItinerary(filename) {
  return /\bitin(?:e|a)rary\b/i.test(filename);
}

function candidateScore(file) {
  const extScore = extensionRank.get(file.extension) ?? 0;
  const sourceBoost = file.kind === "source" ? 10_000_000 : 0;
  return sourceBoost + extScore * 100_000_000 + file.size;
}

const entries = await readdir(documentsDir, { withFileTypes: true });
const files = entries
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .filter((name) => extensionRank.has(path.extname(name).toLowerCase()))
  .sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));

const groups = new Map();

for (const filename of files) {
  const fullPath = path.join(documentsDir, filename);
  const stat = await import("node:fs/promises").then(({ stat }) => stat(fullPath));
  const title = baseTitle(filename);
  const slug = slugify(title);
  const file = {
    filename,
    path: fullPath.replaceAll("\\", "/"),
    extension: path.extname(filename).toLowerCase(),
    kind: isItinerary(filename) ? "itinerary" : "source",
    size: stat.size,
    inferredDurationDays: inferDurationDays(filename),
    inferredLanguage: inferLanguage(filename),
  };

  if (!groups.has(slug)) {
    groups.set(slug, {
      slug,
      title,
      categorySlug: inferCategorySlug(title),
      files: [],
    });
  }

  groups.get(slug).files.push(file);
}

const courses = [...groups.values()]
  .map((group) => {
    const sortedFiles = [...group.files].sort((a, b) => candidateScore(b) - candidateScore(a));
    const canonical = sortedFiles[0];
    const duplicates = sortedFiles.slice(1).map((file) => file.path);
    const inferredDurationDays =
      canonical.inferredDurationDays ??
      sortedFiles.find((file) => file.inferredDurationDays !== null)?.inferredDurationDays ??
      null;

    return {
      slug: group.slug,
      title: group.title,
      categorySlug: group.categorySlug,
      canonicalSource: canonical.path,
      sourceFormat: canonical.extension.slice(1),
      reviewStatus: "needs-human-review",
      inferredDurationDays,
      inferredLanguage: canonical.inferredLanguage,
      duplicateOrSupportingSources: duplicates,
      flags: [
        ...(canonical.extension !== ".pdf" ? ["canonical-is-not-pdf"] : []),
        ...(canonical.kind === "itinerary" ? ["canonical-is-itinerary"] : []),
        ...(duplicates.length > 0 ? ["has-duplicates-or-supporting-sources"] : []),
        ...(inferredDurationDays === null ? ["duration-not-inferred"] : []),
      ],
    };
  })
  .sort((a, b) => a.title.localeCompare(b.title, "en", { sensitivity: "base" }));

const inventory = {
  schemaVersion: 1,
  sourceDirectory: documentsDir.replaceAll("\\", "/"),
  rules: {
    canonicalPreference: [
      "Prefer non-itinerary outlines over itinerary files.",
      "Prefer PDF over DOCX, then DOC, then PPTX.",
      "Within the same format, prefer the larger file as the richer outline.",
    ],
    hrdClaimable: "Not inferred here. Course JSON must stay false unless confirmed from source review.",
  },
  totals: {
    sourceFiles: files.length,
    courseGroups: courses.length,
    pdfFiles: files.filter((name) => path.extname(name).toLowerCase() === ".pdf").length,
  },
  courses,
};

await mkdir(curationDir, { recursive: true });
await writeFile(outputPath, `${JSON.stringify(inventory, null, 2)}\n`);

console.log(`Wrote ${outputPath} with ${courses.length} course groups from ${files.length} files.`);
