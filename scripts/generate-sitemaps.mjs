// Generate sitemap files from the current Astro content sources.
// This keeps the course sitemap aligned with src/content/courses/*.json.

import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const siteUrl = "https://www.iconlearning.com.my";
const coursesDir = path.join("src", "content", "courses");
const publicDir = "public";

const pageEntries = [
  { path: "/", priority: "1.0" },
  { path: "/programs/", priority: "0.9" },
  { path: "/about-us/", priority: "0.7" },
  { path: "/clients/", priority: "0.7" },
  { path: "/contact/", priority: "0.8" },
  { path: "/register/ai-implementation-in-accounting-and-finance-from-strategy-to-optimization/", priority: "0.8" },
  { path: "/accessibility-statement/", priority: "0.3" },
  { path: "/programs/leadership-management-coaching/", priority: "0.8" },
  { path: "/programs/quality-lean-food-safety/", priority: "0.8" },
  { path: "/programs/safety-health-environment/", priority: "0.8" },
  { path: "/programs/hr-employment-law/", priority: "0.8" },
  { path: "/programs/microsoft-ai-digital-skills/", priority: "0.8" },
  { path: "/programs/sales-marketing-customer-service/", priority: "0.8" },
  { path: "/programs/finance-taxation/", priority: "0.8" },
  { path: "/programs/supply-chain-shipping-warehousing/", priority: "0.8" },
  { path: "/programs/communication-personal-effectiveness/", priority: "0.8" },
];

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function absoluteUrl(routePath) {
  return `${siteUrl}${routePath}`;
}

function renderUrlset(entries) {
  const urls = entries
    .map(
      (entry) => `  <url>
    <loc>${escapeXml(absoluteUrl(entry.path))}</loc>
    <priority>${entry.priority}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

async function readCourseEntries() {
  const files = (await readdir(coursesDir)).filter((file) => file.endsWith(".json")).sort();
  const courses = [];

  for (const file of files) {
    const course = JSON.parse(await readFile(path.join(coursesDir, file), "utf8"));
    courses.push({
      path: `/programs/${course.categorySlug}/${course.slug}/`,
      priority: "0.7",
      title: course.title,
    });
  }

  return courses.sort((a, b) => a.title.localeCompare(b.title, "en", { sensitivity: "base" }));
}

const courseEntries = await readCourseEntries();
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${siteUrl}/sitemap-pages.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${siteUrl}/sitemap-courses.xml</loc>
  </sitemap>
</sitemapindex>
`;

await writeFile(path.join(publicDir, "sitemap.xml"), sitemapIndex);
await writeFile(path.join(publicDir, "sitemap-pages.xml"), renderUrlset(pageEntries));
await writeFile(path.join(publicDir, "sitemap-courses.xml"), renderUrlset(courseEntries));

console.log(`Generated sitemap files for ${pageEntries.length} site pages and ${courseEntries.length} courses.`);
