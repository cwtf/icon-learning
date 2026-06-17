import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const markdownDir = path.join("course", "documents-markdown");
const coursesDir = path.join("src", "content", "courses");
const outputPath = path.join(markdownDir, "COURSE_CHECKLIST.md");
const ignoredMarkdownFiles = new Set([path.basename(outputPath).toLowerCase(), "readme.md"]);

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

function canonicalTitle(value) {
  return tidyName(value)
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

function comparable(value) {
  return canonicalTitle(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\bpersonnels\b/g, "personnel")
    .replace(/\bbegineer\b/g, "beginner")
    .replace(/\byur\b/g, "your")
    .replace(/\bcommitte\b/g, "committee")
    .replace(/\bint?he\b/g, "in the")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value) {
  return comparable(value).replaceAll(" ", "-");
}

function markdownLink(label, target) {
  const encodedTarget = target
    .replaceAll("\\", "/")
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `[${label}](${encodedTarget})`;
}

async function listTopLevelMarkdownFiles() {
  const entries = await readdir(markdownDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => name.toLowerCase().endsWith(".md"))
    .filter((name) => !ignoredMarkdownFiles.has(name.toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
}

async function listWebsiteCourses() {
  const entries = await readdir(coursesDir, { withFileTypes: true });
  const jsonFiles = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => name.toLowerCase().endsWith(".json"))
    .sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));

  const courses = [];

  for (const file of jsonFiles) {
    const data = JSON.parse(await readFile(path.join(coursesDir, file), "utf8"));
    const sourceName = data.sourceDoc ? path.basename(data.sourceDoc) : "";
    const keys = new Set([
      comparable(data.title),
      comparable(sourceName),
      comparable(withoutExtension(sourceName)),
      slugify(data.title),
      slugify(withoutExtension(sourceName)),
    ]);

    courses.push({
      file,
      slug: data.slug,
      title: data.title,
      categorySlug: data.categorySlug,
      sourceDoc: data.sourceDoc,
      keys,
    });
  }

  return courses;
}

function findWebsiteMatch(markdownFile, websiteCourses) {
  const title = withoutExtension(markdownFile);
  const keys = new Set([comparable(title), slugify(title)]);

  return websiteCourses.find((course) => {
    for (const key of keys) {
      if (course.keys.has(key)) return true;
    }
    return false;
  });
}

const markdownFiles = await listTopLevelMarkdownFiles();
const websiteCourses = await listWebsiteCourses();
const checklistItems = markdownFiles.map((file) => ({
  file,
  title: withoutExtension(file),
  match: findWebsiteMatch(file, websiteCourses),
}));

const matchedWebsiteSlugs = new Set(
  checklistItems.filter((item) => item.match).map((item) => item.match.slug)
);
const missingMarkdownWebsiteCourses = websiteCourses.filter(
  (course) => !matchedWebsiteSlugs.has(course.slug)
);

const availableCount = checklistItems.filter((item) => item.match).length;
const now = new Date().toISOString();
const lines = [
  "# Course Markdown Website Checklist",
  "",
  `Generated: ${now}`,
  "",
  `- Markdown course files: ${checklistItems.length}`,
  `- Already available on website: ${availableCount}`,
  `- Not yet available on website: ${checklistItems.length - availableCount}`,
  `- Website courses without a generated Markdown match: ${missingMarkdownWebsiteCourses.length}`,
  "",
  "## Markdown Courses",
  "",
  ...checklistItems.map((item) => {
    const checkbox = item.match ? "[x]" : "[ ]";
    const link = markdownLink(item.title, item.file);
    const website = item.match
      ? ` - website: \`${item.match.slug}\` (${item.match.title})`
      : "";
    return `- ${checkbox} ${link}${website}`;
  }),
  "",
  "## Website Courses Missing From Documents Markdown",
  "",
  ...missingMarkdownWebsiteCourses.map(
    (course) =>
      `- [ ] \`${course.slug}\` - ${course.title} (source: ${course.sourceDoc ?? "not set"})`
  ),
  "",
  "## Matching Rules",
  "",
  "- Checked items match a current `src/content/courses/*.json` record by normalized course title or source document name.",
  "- Normalization removes extension, itinerary/outline labels, simple duration labels, punctuation, and a few known filename typos.",
  "- Unchecked items may still have a related source document; they are just not represented as website course JSON yet.",
  "",
];

await writeFile(outputPath, `${lines.join("\n")}\n`);

console.log(`Wrote ${outputPath}`);
console.log(`${availableCount}/${checklistItems.length} Markdown course files are already on the website.`);
console.log(`${missingMarkdownWebsiteCourses.length} website course(s) do not have a generated Markdown match.`);
