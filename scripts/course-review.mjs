// Validate all published course JSONs in src/content/courses/ against schema rules.
// Output: src/content/courses/_curation/review-report.json
// Exits with code 1 if any hard errors are found (run after adding or editing a course JSON).
//
// Usage:
//   npm run courses:review
//   node scripts/course-review.mjs

import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const coursesDir = path.join("src", "content", "courses");
const curationDir = path.join(coursesDir, "_curation");
const reportPath = path.join(curationDir, "review-report.json");

const allowedCategories = new Set([
  "leadership-management-coaching",
  "quality-lean-food-safety",
  "safety-health-environment",
  "hr-employment-law",
  "ai",
  "microsoft-ai-digital-skills",
  "sales-marketing-customer-service",
  "finance-taxation",
  "supply-chain-shipping-warehousing",
  "communication-personal-effectiveness",
]);

const allowedLanguages = new Set(["en", "ms", "en+ms"]);
const allowedDurations = new Set([0.5, 1, 2, 3]);
const allowedFormats = new Set(["Public", "In-house", "Workshop", "Certification", "Blended"]);

function wordCount(value) {
  return String(value).trim().split(/\s+/).filter(Boolean).length;
}

function pushIssue(target, code, message, severity = "error") {
  target.push({ code, severity, message });
}

const files = (await readdir(coursesDir))
  .filter((file) => file.endsWith(".json"))
  .sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));

const courses = [];

for (const file of files) {
  const fullPath = path.join(coursesDir, file);
  courses.push({
    file,
    path: fullPath.replaceAll("\\", "/"),
    data: JSON.parse(await readFile(fullPath, "utf8")),
  });
}

const slugs = new Set(courses.map((course) => course.data.slug));
const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  totals: {
    coursesReviewed: courses.length,
    hardFailures: 0,
    warnings: 0,
    hrdUnconfirmed: 0,
  },
  rules: {
    summaryOnly:
      "Review checks enforce concise summary fields, module titles only, valid relatedSlugs, and explicit HRD confirmation before badges/schema appear.",
    hrdClaimable:
      "false means unconfirmed or not claimable. Do not switch to true without source PDF/title-page or Icon Learning confirmation.",
  },
  courses: [],
};

for (const { file, path: coursePath, data } of courses) {
  const issues = [];
  const warnings = [];

  if (data.slug !== file.replace(/\.json$/, "")) {
    pushIssue(issues, "slug-file-mismatch", `Slug '${data.slug}' does not match filename '${file}'.`);
  }

  if (!allowedCategories.has(data.categorySlug)) {
    pushIssue(issues, "invalid-category", `Unknown categorySlug '${data.categorySlug}'.`);
  }

  if (!allowedDurations.has(data.durationDays)) {
    pushIssue(issues, "invalid-duration", `Unsupported duration '${data.durationDays}'.`);
  }

  if (!allowedLanguages.has(data.language)) {
    pushIssue(issues, "invalid-language", `Unsupported language '${data.language}'.`);
  }

  if (!Array.isArray(data.deliveryFormats) || data.deliveryFormats.length === 0) {
    pushIssue(issues, "missing-delivery-format", "Course needs at least one delivery format.");
  } else {
    for (const format of data.deliveryFormats) {
      if (!allowedFormats.has(format)) {
        pushIssue(issues, "invalid-delivery-format", `Unsupported delivery format '${format}'.`);
      }
    }
  }

  if (!existsSync(data.sourceDoc)) {
    pushIssue(
      warnings,
      "missing-source-doc",
      `sourceDoc does not exist locally: ${data.sourceDoc}`,
      "warning"
    );
  }

  if (wordCount(data.whyThisMatters) < 35 || wordCount(data.whyThisMatters) > 80) {
    pushIssue(warnings, "why-this-matters-length", "whyThisMatters should stay around 40-60 words.", "warning");
  }

  if (!Array.isArray(data.builtFor) || data.builtFor.length < 3 || data.builtFor.length > 5) {
    pushIssue(issues, "built-for-count", "builtFor should contain 3-5 audience phrases.");
  }

  if (!Array.isArray(data.walkAwayWith) || data.walkAwayWith.length < 3 || data.walkAwayWith.length > 5) {
    pushIssue(issues, "walk-away-count", "walkAwayWith should contain 3-5 outcome bullets.");
  }

  if (!Array.isArray(data.modules) || data.modules.length < 3) {
    pushIssue(issues, "module-count", "Course should contain at least 3 summary module titles.");
  }

  for (const module of data.modules ?? []) {
    if (String(module.title).length > 80) {
      pushIssue(warnings, "module-title-length", `Module title is long: '${module.title}'.`, "warning");
    }
    if (/[.;:]$/.test(module.title)) {
      pushIssue(warnings, "module-title-punctuation", `Module title should read as a title, not a sentence: '${module.title}'.`, "warning");
    }
  }

  const relatedSlugs = data.relatedSlugs ?? [];
  if (relatedSlugs.length < 2) {
    pushIssue(warnings, "related-count", "Add at least 2 relatedSlugs when enough reviewed courses exist.", "warning");
  }

  for (const relatedSlug of relatedSlugs) {
    if (relatedSlug === data.slug) {
      pushIssue(issues, "related-self-link", "relatedSlugs must not include the course itself.");
    } else if (!slugs.has(relatedSlug)) {
      pushIssue(issues, "related-missing", `relatedSlug does not exist in course JSON: ${relatedSlug}`);
    }
  }

  if (data.hrdClaimable !== true) {
    report.totals.hrdUnconfirmed += 1;
    pushIssue(warnings, "hrd-unconfirmed", "HRD Corp claimable status is not confirmed; badge/schema stays hidden.", "warning");
  }

  report.totals.hardFailures += issues.length;
  report.totals.warnings += warnings.length;
  report.courses.push({
    slug: data.slug,
    title: data.title,
    categorySlug: data.categorySlug,
    path: coursePath,
    sourceDoc: data.sourceDoc,
    hrdClaimable: data.hrdClaimable,
    relatedSlugs,
    status: issues.length > 0 ? "review-fail" : warnings.length > 0 ? "review-pass-with-warnings" : "review-pass",
    issues,
    warnings,
  });
}

await mkdir(curationDir, { recursive: true });
await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);

console.log(
  `Reviewed ${report.totals.coursesReviewed} courses: ${report.totals.hardFailures} hard failures, ${report.totals.warnings} warnings.`
);
console.log(`Wrote ${reportPath}.`);

if (report.totals.hardFailures > 0) {
  process.exitCode = 1;
}
