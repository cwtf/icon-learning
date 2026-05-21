import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import zlib from "node:zlib";

const distDir = "dist";
const reportPath = path.join(distDir, "launch-qa-report.json");
const siteUrl = "https://www.iconlearning.com.my";
const externalProtocols = /^(https?:|mailto:|tel:|sms:|whatsapp:)/i;
const requiredMeta = [
  /<meta\s+name="description"\s+content="[^"]+"/i,
  /<link\s+rel="canonical"\s+href="[^"]+"/i,
  /<meta\s+property="og:title"\s+content="[^"]+"/i,
  /<meta\s+property="og:description"\s+content="[^"]+"/i,
  /<meta\s+property="og:url"\s+content="[^"]+"/i,
  /<meta\s+property="og:image"\s+content="[^"]+"/i,
  /<meta\s+name="twitter:card"\s+content="[^"]+"/i,
  /<meta\s+name="twitter:image"\s+content="[^"]+"/i,
];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function routeFromHtmlFile(file) {
  const relative = path.relative(distDir, file).replaceAll("\\", "/");
  if (relative === "index.html") return "/";
  return `/${relative.replace(/\/index\.html$/, "/")}`;
}

function stripHtml(value) {
  return value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function attrsFor(tag) {
  const attrs = {};
  for (const match of tag.matchAll(/([:\w-]+)\s*=\s*"([^"]*)"/g)) {
    attrs[match[1].toLowerCase()] = match[2];
  }
  return attrs;
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function normalizeInternalHref(href, fromRoute) {
  if (!href || href.startsWith("#") || externalProtocols.test(href)) return null;

  let url;
  try {
    url = href.startsWith("http")
      ? new URL(href)
      : new URL(href, `${siteUrl}${fromRoute}`);
  } catch {
    return { invalid: href };
  }

  if (url.origin !== siteUrl) return null;

  const pathname = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
  return {
    href,
    pathname,
    hash: url.hash.replace(/^#/, ""),
  };
}

function routeExists(routeSet, pathname) {
  if (pathname === "/") return routeSet.has("/");
  return routeSet.has(pathname);
}

const files = await walk(distDir);
const htmlFiles = files.filter((file) => file.endsWith(".html")).sort();
const jsFiles = files.filter((file) => file.endsWith(".js"));
const cssFiles = files.filter((file) => file.endsWith(".css"));
const assetFiles = files.filter((file) => !file.endsWith(".html"));
const routeSet = new Set(htmlFiles.map(routeFromHtmlFile));
const issues = [];
const warnings = [];
const pages = [];
let inlineScriptBytes = 0;
let inlineScriptGzipBytes = 0;

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const route = routeFromHtmlFile(file);
  const h1Count = [...html.matchAll(/<h1\b/gi)].length;
  const title = stripHtml(html.match(/<title>(.*?)<\/title>/i)?.[1] ?? "");
  const description = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1] ?? "";
  const lang = html.match(/<html\s+lang="([^"]+)"/i)?.[1] ?? "";
  const ids = [...html.matchAll(/\sid="([^"]+)"/gi)].map((match) => match[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  const anchors = new Set(ids);

  if (!lang) issues.push({ route, code: "missing-lang", message: "Page is missing html lang." });
  if (!title) issues.push({ route, code: "missing-title", message: "Page is missing title." });
  if (title.length > 70) warnings.push({ route, code: "long-title", message: `Title is ${title.length} chars.` });
  if (!description) issues.push({ route, code: "missing-description", message: "Page is missing meta description." });
  if (description.length > 155) {
    warnings.push({ route, code: "long-description", message: `Description is ${description.length} chars.` });
  }
  if (h1Count !== 1) issues.push({ route, code: "h1-count", message: `Expected 1 H1, found ${h1Count}.` });
  if (duplicateIds.length > 0) {
    issues.push({ route, code: "duplicate-id", message: `Duplicate ids: ${[...new Set(duplicateIds)].join(", ")}` });
  }

  for (const pattern of requiredMeta) {
    if (!pattern.test(html)) {
      issues.push({ route, code: "missing-meta", message: `Missing metadata matching ${pattern}.` });
    }
  }

  const scripts = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  const inlineScripts = [...html.matchAll(/<script(?![^>]+type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/gi)];
  for (const script of inlineScripts) {
    const source = script[1].trim();
    if (!source) continue;
    inlineScriptBytes += Buffer.byteLength(source);
    inlineScriptGzipBytes += zlib.gzipSync(source).length;
  }

  if (scripts.length === 0) {
    issues.push({ route, code: "missing-json-ld", message: "No JSON-LD structured data block found." });
  }
  for (const script of scripts) {
    try {
      JSON.parse(decodeEntities(script[1]));
    } catch (error) {
      issues.push({ route, code: "invalid-json-ld", message: error.message });
    }
  }

  for (const img of html.matchAll(/<img\b[^>]*>/gi)) {
    const attrs = attrsFor(img[0]);
    if (!("alt" in attrs)) {
      issues.push({ route, code: "missing-img-alt", message: `Image is missing alt: ${img[0].slice(0, 120)}` });
    }
    if (!("width" in attrs) || !("height" in attrs)) {
      warnings.push({ route, code: "missing-img-size", message: `Image has no explicit width/height: ${img[0].slice(0, 120)}` });
    }
  }

  for (const link of html.matchAll(/<a\b[^>]*href="([^"]*)"/gi)) {
    const normalized = normalizeInternalHref(decodeEntities(link[1]), route);
    if (!normalized) continue;
    if (normalized.invalid) {
      issues.push({ route, code: "invalid-href", message: `Invalid href: ${normalized.invalid}` });
      continue;
    }
    if (!routeExists(routeSet, normalized.pathname)) {
      issues.push({ route, code: "broken-link", message: `${normalized.href} resolves to missing ${normalized.pathname}` });
      continue;
    }
    if (normalized.hash) {
      const targetFile = normalized.pathname === route ? file : htmlFiles.find((item) => routeFromHtmlFile(item) === normalized.pathname);
      if (targetFile) {
        const targetHtml = targetFile === file ? html : await readFile(targetFile, "utf8");
        const targetIds = targetFile === file ? anchors : new Set([...targetHtml.matchAll(/\sid="([^"]+)"/gi)].map((match) => match[1]));
        if (!targetIds.has(normalized.hash)) {
          issues.push({ route, code: "broken-anchor", message: `${normalized.href} target #${normalized.hash} is missing.` });
        }
      }
    }
  }

  pages.push({
    route,
    title,
    titleLength: title.length,
    descriptionLength: description.length,
    h1Count,
    jsonLdBlocks: scripts.length,
  });
}

const htmlBytes = await htmlFiles.reduce(async (sumPromise, file) => (await sumPromise) + (await stat(file)).size, Promise.resolve(0));
const cssBytes = await cssFiles.reduce(async (sumPromise, file) => (await sumPromise) + (await stat(file)).size, Promise.resolve(0));
const assetBytes = await assetFiles.reduce(async (sumPromise, file) => (await sumPromise) + (await stat(file)).size, Promise.resolve(0));
let jsGzipBytes = 0;

for (const file of jsFiles) {
  const source = await readFile(file);
  jsGzipBytes += zlib.gzipSync(source).length;
}

const expectedPublicFiles = ["robots.txt", "sitemap.xml", "sitemap-pages.xml", "sitemap-courses.xml"];
for (const publicFile of expectedPublicFiles) {
  if (!files.some((file) => path.relative(distDir, file).replaceAll("\\", "/") === publicFile)) {
    issues.push({ route: "/", code: "missing-public-file", message: `${publicFile} is missing from dist.` });
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  totals: {
    pages: pages.length,
    issues: issues.length,
    warnings: warnings.length,
    htmlBytes,
    cssBytes,
    assetBytes,
    jsFiles: jsFiles.length,
    jsGzipBytes,
    inlineScriptBytes,
    inlineScriptGzipBytes,
    totalScriptGzipBytes: jsGzipBytes + inlineScriptGzipBytes,
  },
  pages,
  issues,
  warnings,
};

await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);

console.log(`Launch QA checked ${pages.length} pages.`);
console.log(`${issues.length} issues, ${warnings.length} warnings.`);
console.log(`Script gzip total: ${Math.round((jsGzipBytes + inlineScriptGzipBytes) / 1024)} KB.`);
console.log(`Wrote ${reportPath}.`);

if (issues.length > 0) {
  process.exitCode = 1;
}
