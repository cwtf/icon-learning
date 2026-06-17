import { existsSync } from "node:fs";
import { mkdir, readdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";

const defaultSourceDir = path.join("course", "documents", "converted-to-markdown");
const defaultOutputDir = path.join("course", "documents-markdown");
const markdownExtensions = new Set([".md", ".markdown"]);
const pandocInputExtensions = new Set([
  ".csv",
  ".docbook",
  ".docx",
  ".epub",
  ".htm",
  ".html",
  ".ipynb",
  ".json",
  ".latex",
  ".md",
  ".markdown",
  ".mediawiki",
  ".odt",
  ".opml",
  ".org",
  ".rst",
  ".rtf",
  ".tex",
  ".textile",
  ".t2t",
  ".txt",
  ".wiki",
]);

const args = process.argv.slice(2);
const options = {
  sourceDir: defaultSourceDir,
  outputDir: defaultOutputDir,
  force: false,
  extractMedia: true,
};

function printUsage() {
  console.log(`Usage: npm run documents:markdown -- [options]

Converts files in course/documents/converted-to-markdown to Markdown with pandoc.

Options:
  --source <dir>       Source directory. Default: ${defaultSourceDir}
  --out <dir>          Output directory. Default: ${defaultOutputDir}
  --force              Overwrite existing .md files.
  --no-media           Do not extract embedded media from formats like .docx.
  --help               Show this help text.

Notes:
  Pandoc cannot read every file type directly. This script converts known
  pandoc-readable inputs and reports unsupported files such as .pdf and .pptx
  instead of deleting or changing them.`);
}

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];

  if (arg === "--help" || arg === "-h") {
    printUsage();
    process.exit(0);
  }

  if (arg === "--force") {
    options.force = true;
  } else if (arg === "--no-media") {
    options.extractMedia = false;
  } else if (arg === "--source") {
    options.sourceDir = args[++index];
  } else if (arg === "--out") {
    options.outputDir = args[++index];
  } else {
    console.error(`Unknown option: ${arg}`);
    printUsage();
    process.exit(1);
  }
}

const sourceRoot = path.resolve(options.sourceDir);
const outputRoot = path.resolve(options.outputDir);

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(fullPath)));
    } else if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function outputPathFor(sourcePath) {
  const relativePath = path.relative(sourceRoot, sourcePath);
  const parsed = path.parse(relativePath);
  return path.join(outputRoot, parsed.dir, `${parsed.name}.md`);
}

function runPandoc(inputPath, outputPath) {
  return new Promise((resolve) => {
    const args = [
      inputPath,
      "--from",
      path.extname(inputPath).slice(1),
      "--to",
      "gfm",
      "--wrap=none",
      "--output",
      outputPath,
    ];

    if (options.extractMedia) {
      const mediaDir = path.join(path.dirname(outputPath), `${path.basename(outputPath, ".md")}-media`);
      args.push("--extract-media", mediaDir);
    }

    const child = spawn("pandoc", args, { windowsHide: true });
    let stderr = "";

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", (error) => {
      resolve({ ok: false, message: error.message });
    });

    child.on("close", (code) => {
      resolve({
        ok: code === 0,
        message: stderr.trim() || `pandoc exited with code ${code}`,
      });
    });
  });
}

if (!existsSync(sourceRoot)) {
  console.error(`Source directory does not exist: ${sourceRoot}`);
  process.exit(1);
}

const files = (await listFiles(sourceRoot)).sort((a, b) =>
  a.localeCompare(b, "en", { sensitivity: "base" })
);

const results = {
  converted: 0,
  skippedExisting: 0,
  skippedMarkdown: 0,
  unsupported: [],
  failed: [],
};

await mkdir(outputRoot, { recursive: true });

for (const file of files) {
  const extension = path.extname(file).toLowerCase();
  const relativeFile = path.relative(sourceRoot, file);

  if (markdownExtensions.has(extension)) {
    results.skippedMarkdown += 1;
    continue;
  }

  if (!pandocInputExtensions.has(extension)) {
    results.unsupported.push(relativeFile);
    continue;
  }

  const markdownPath = outputPathFor(file);

  if (!options.force && existsSync(markdownPath)) {
    results.skippedExisting += 1;
    continue;
  }

  await mkdir(path.dirname(markdownPath), { recursive: true });
  const result = await runPandoc(file, markdownPath);

  if (result.ok) {
    results.converted += 1;
    console.log(`Converted: ${relativeFile}`);
  } else {
    results.failed.push({ file: relativeFile, message: result.message });
    console.error(`Failed: ${relativeFile}`);
    console.error(result.message);
  }
}

console.log("");
console.log(`Converted ${results.converted} file(s) to ${path.relative(process.cwd(), outputRoot) || outputRoot}.`);
console.log(`Skipped ${results.skippedExisting} existing Markdown file(s).`);
console.log(`Skipped ${results.skippedMarkdown} source Markdown file(s).`);
console.log(`Unsupported by pandoc input reader: ${results.unsupported.length} file(s).`);

if (results.unsupported.length > 0) {
  console.log("Unsupported extensions in this folder usually include .pdf, .doc, and .pptx.");
}

if (results.failed.length > 0) {
  console.error(`Pandoc failed on ${results.failed.length} file(s).`);
  process.exitCode = 1;
}
