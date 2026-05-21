# Project Brain - Icon Learning Website Redesign

**What this is:** the running state log for the Icon Learning redesign. Every PR updates this file. New agents read this first to get oriented in under two minutes.

**What this is NOT:** the spec. The spec is [DESIGN.md](DESIGN.md). Do not duplicate spec content here; point at the section.

---

## Status Snapshot

- **Phase:** PR 13 Bulk Content Review implemented for the current publishable course set; ready for review.
- **Last touched:** 2026-05-21.
- **Next action:** Review PR 13, then start PR 14 `/about-us` per [DESIGN.md Section 11 Phase 4](DESIGN.md).
- **Working tree:** Homepage remains complete through PR 8. PR 13 adds a repeatable course review script/report, fixes current related-course links, polishes two public-facing titles, and keeps all HRD statuses explicitly unconfirmed.

---

## What's Done

- **2026-05-21** - PR 13 bulk content review pass completed for the current 10 publishable course JSON files: added `npm run courses:review`, generated `src/content/courses/_curation/review-report.json`, fixed all broken `relatedSlugs`, corrected public-facing title polish, and verified zero hard review failures.
- **2026-05-21** - PR 12 course detail pages added: all ten course JSON records render at `/programs/[category]/[course]` with hero badges, Why this matters, Built for, outcomes, module-title-only workshop view, methodology bar, closer, sticky inquiry panel, and Course/Breadcrumb JSON-LD.
- **2026-05-21** - PR 11 program category pages added: all nine `/programs/[category]` routes render category hero, overview, available course list, audience, delivery formats, related categories, sticky inquiry panel, and BreadcrumbList/ItemList structured data.
- **2026-05-21** - PR 10 programs catalog added: `/programs` renders grouped and flat views from top-level course JSON, with `ProgramCard`, category/duration/language chips, HRD Corp claimable toggle, keyword search, URL state, empty state, and production build verification.
- **2026-05-21** - PR 9 course rewrite pipeline started: added `src/content/courses/schema.ts`, `npm run courses:inventory`, generated a tracked source inventory at `src/content/courses/_curation/inventory.json`, and created 10 representative summary-only course JSON drafts across all 9 categories plus Bahasa Malaysia and multi-day edge cases.
- **2026-05-21** - PR 8 homepage wiring and static QA completed: added the missing `ServicesBento` section at `#services`, wired services copy through `home.ts`, confirmed homepage anchors and production build, and kept unavailable workshop/category/testimonial assets out of the UI.
- **2026-05-21** - PR 7 global motion polish added: hero stack staggers on page load, section headings reveal once on scroll, same-page anchor clicks smooth-scroll for no-preference users, and reduced-motion users keep instant/static behavior.
- **2026-05-21** - PR 6 outcomes and testimonial components added: `ResultsGrid` renders verified-only proof points with reduced-motion-aware count-up, and `Testimonials` ships as a carousel component gated behind an empty approved-quotes list.
- **2026-05-21** - PR 5 approach sequence added: `ApproachSection` composes four alternating `FeatureStripe` rows for Discover, Customize, Deliver, and Reinforce, with honest CSS process media panels until approved workshop imagery arrives.
- **2026-05-20** - PR 4 CoursesTabbed added: six homepage categories, show/hide tab behavior after JS enhancement, desktop sidebar labels, mobile horizontal labels, no-JS readable fallback, keyboard tab navigation, and course/category links.
- **2026-05-20** - PR 3 bento masonry added: proof section after the hero, real client logo assets, verified-only "Since 2011" proof, HRD/ISO positioning cards, reduced-motion-aware parallax script, and static fallback layout.
- **2026-05-20** - PR 2 hero and CTA closer added: real homepage hero component, compact CTA closer, homepage content module, WhatsApp-first CTA wiring, and shared contact details in `src/content/site.ts`.
- **2026-05-20** - PR 1 foundation added: Astro config, package scripts, Tailwind/PostCSS setup, design tokens, global styles, `BaseLayout`, `Nav`, `Footer`, primitives (`Button`, `Card`, `SectionHeading`, `TabBar`, `LogoWall`), favicon, and temporary smoke homepage.
- **2026-05-20** - Asset library folders added under `assets/` for source originals and web-ready exports.
- **2026-05-20** - Three competing design drafts (Claude, Gemini, Codex) reconciled into a single [DESIGN.md](DESIGN.md). Originals archived under `archive/`.
- **2026-05-20** - `DESIGN.md` extended with full multi-page IA, course catalog scope, summary-only course detail pages, course content model, SEO strategy, scroll-spy `CoursesTabbed`, and homepage anchor IDs.

---

## In Flight

_Nothing._

---

## Next Up - PR 14: About Us

Per [DESIGN.md Section 11 Phase 4](DESIGN.md):

> `/about-us`.

PR 14 should build the About page with verified company story, training philosophy, what Icon Learning does, values, and CTA without adding unverified claims.

---

## Blockers / Open Questions

Full list lives in [DESIGN.md Section 13](DESIGN.md). Status snapshot here:

| # | Question | Blocks | Status |
|---|---|---|---|
| 1 | Tech stack confirmation | PR 1 | CLOSED - Astro + Tailwind selected for PR 1 |
| 2 | Logo SVG | PR 1 | CLOSED - `BrandLogo` uses `assets/source/brand/icons/icon-logo-vector.svg` |
| 3 | Bento assets, at least 8 strong photos | PR 3 | PARTIAL - client logos available; workshop photos still missing |
| 4 | Course images per category | PR 4 | OPEN |
| 5 | HRD claimable per-course list | PR 9, PR 13 | OPEN |
| 6 | Primary inquiry destination: WhatsApp, email, or form | PR 2, PR 16 | CLOSED - WhatsApp first for homepage CTA; email secondary |
| 7 | Testimonials approved for public use | PR 6 | OPEN |
| 8 | Verified stats beyond "since 2011" | PR 6 | OPEN |
| 9 | Domain / deploy target | PR 18 | OPEN |
| 10 | Legacy URL redirects | PR 18 | OPEN |
| 11 | Accessibility page language: EN, BM, or both | PR 17 | OPEN |
| 12 | Canonical course outlines: PDF vs DOC dupes | PR 9 | PARTIAL - inventory groups 358 files into 175 course candidates; human curation still needed |
| 13 | HRD claimable status per course | PR 9 | OPEN - PR 13 report flags all current course JSON as unconfirmed |
| 14 | Bahasa Malaysia URL strategy | PR 9, PR 12 | PARTIAL - BM sample created as its own course JSON pending URL strategy |
| 15 | Itinerary documents: published download or internal only | PR 9 | OPEN |
| 16 | Course images per individual course | PR 12 | OPEN |
| 17 | Full-outline delivery on inquiry: auto-attach vs manual | PR 16 | OPEN |

---

## Decisions Log

### 2026-05-20 - PR 3 bento uses logos before photos

Workshop/photo assets are not available yet, so the bento uses real client logos plus verified proof and positioning cards. Photo cards can replace some proof/logo cards when approved workshop imagery lands.

### 2026-05-21 - PR 5 approach uses process media panels

Workshop photos are still unavailable, so `FeatureStripe` uses structured CSS panels that represent process artifacts instead of fabricated photography. Replace these with approved workshop images or slide previews when assets arrive.

### 2026-05-21 - PR 6 avoids fabricated outcomes and quotes

`ResultsGrid` only counts facts derived from the current catalog/site structure (`9` categories, `6` homepage families, `3` engagement lanes) plus a non-counted "Since 2011" card. `Testimonials` is implemented but gated by `approvedTestimonials`, which remains empty until Icon Learning confirms public-use quotes.

### 2026-05-21 - PR 7 motion is progressive enhancement

Global reveal/stagger styles only activate after `global-motion.ts` adds `data-motion-ready` to `<html>`, so no-JS users see fully visible content. The script exits entirely under `prefers-reduced-motion: reduce`; CSS also suppresses hover transforms in reduced-motion mode.

### 2026-05-21 - PR 8 services section completes homepage order

The homepage was missing the `#services` solutions bento required by §6.1. PR 8 adds `ServicesBento` with three supported service lanes: Corporate Training Programs; ISO & Quality Management Solutions; Technical & Safety Training. No new unverified claims were introduced.

### 2026-05-21 - PR 9 keeps source curation separate from publishable course JSON

Raw course documents stay under ignored `course/documents/`. The tracked inventory lives at `src/content/courses/_curation/inventory.json` so future catalog imports can safely glob only top-level `src/content/courses/*.json` as publishable courses.

### 2026-05-21 - PR 9 defaults HRD claimable to false

All representative course JSON files use `hrdClaimable: false` until Icon Learning confirms claimable status from the source PDF/title page or an authoritative course list. The inventory generator does not infer HRD status.

### 2026-05-21 - PR 9 samples before bulk rewrite

The first rewrite batch covers all nine categories, plus Bahasa Malaysia (`Kursus Pengendalian Makanan`) and a multi-day programme (`Teambuilding for High Performance`). These are structured drafts for review before scaling to the remaining inventory.

### 2026-05-21 - PR 10 catalog imports only publishable course JSON

`src/content/courses/index.ts` uses a top-level `./*.json` glob, so `_curation/inventory.json` stays out of the public catalog. PR 10 renders only the ten representative course summaries until the bulk rewrite expands the JSON set.

### 2026-05-21 - PR 10 filters are progressive enhancement

The `/programs` page is readable as grouped HTML without JavaScript. `ProgramsCatalog.client.ts` adds search, category/duration/language filters, HRD toggle, grouped/flat view switching, result counts, and URL query state.

### 2026-05-21 - PR 11 category metadata lives with category content

`src/content/programs.ts` now carries category-page overview copy, focus areas, audience, delivery formats, and related-category relationships. The `/programs/[category]` route uses the same data for all nine static pages.

### 2026-05-21 - PR 11 category pages are static and no-JS

Category pages use `getStaticPaths()` from `programCategories`; no client script is needed. Each page includes BreadcrumbList and ItemList JSON-LD in the rendered HTML.

### 2026-05-21 - PR 12 course detail pages stay summary-only

The course detail route renders only the summary fields in each course JSON: rewritten positioning, audience, outcomes, module titles, methodology mix, and inquiry CTAs. It does not expose source PDF topic lists, activities, or time slots.

### 2026-05-21 - PR 12 uses contact query links until the contact form exists

`Get the full outline` links to `/contact?training={course title}` so PR 16 can prefill the future contact form. WhatsApp links include a prefilled text message as an immediate working fallback.

### 2026-05-21 - PR 12 supports per-page language

`BaseLayout` now accepts an optional `lang` prop. English and English+BM course pages render `en-MY`; standalone Bahasa Malaysia course pages render `ms-MY`.

### 2026-05-21 - PR 13 course review is a content gate

`npm run courses:review` validates publishable top-level course JSON for schema-adjacent content quality, valid `relatedSlugs`, explicit HRD confirmation, and summary-only module titles. Missing raw source docs are warnings because `course/documents/` is curation material and is not part of the shipped site.

### 2026-05-21 - PR 13 covers the current publishable batch

The bulk copy pass applies to the 10 current course JSON files from PR 9. The full ~180 course expansion still needs future import/rewrite work plus human review before those records become publishable.

### 2026-05-20 - CoursesTabbed changed to true tabs

The category showcase now hides inactive panels after JavaScript enhancement instead of scroll-spying through all panels. All panels remain in the HTML and visible without JavaScript for fallback and crawlability.

### 2026-05-20 - CoursesTabbed uses CSS slide-preview media

Category hero images are not available yet, so PR 4 uses structured CSS slide-preview panels with real category topics. Replace these with approved workshop photos or slide previews when assets arrive under `assets/source/programs/`.

### 2026-05-20 - Client scripts are modules

`BentoMasonry.client.ts` and `CoursesTabbed.client.ts` both end with `export {}` so Astro's typechecker treats them as isolated modules instead of merging top-level variable names globally.

### 2026-05-20 - Bento parallax is progressive enhancement

`BentoMasonry.client.ts` only adjusts a CSS variable while the section is visible and exits under `prefers-reduced-motion`. The static masonry remains fully rendered without JavaScript.

### 2026-05-20 - WhatsApp-first homepage CTA

PR 2 uses WhatsApp as the primary CTA in `CtaCloser`, with email as secondary, matching [DESIGN.md Section 5.2](DESIGN.md). Shared contact details are centralized in `src/content/site.ts`.

### 2026-05-20 - Hero and CTA content moved to `home.ts`

Homepage copy now lives in `src/content/home.ts`, keeping the page composition thin and setting up the content-module pattern required by later homepage PRs.

### 2026-05-20 - Astro + Tailwind selected

PR 1 proceeds with Astro and Tailwind, matching [DESIGN.md Section 3](DESIGN.md). Tailwind is wired through PostCSS instead of `@tailwindcss/vite` because the current Tailwind v4 Vite plugin failed production build in this Windows/Node 25 environment.

### 2026-05-20 - Placeholder wordmark used

The nav/footer use an `IL` mark plus `Icon Learning` text until a confirmed logo asset is added under `assets/source/brand/logo/`.

### 2026-05-20 - Static-first foundation

PR 1 keeps all components static Astro except the tiny nav IntersectionObserver script for the sentinel-based sticky backdrop transition. No framework islands are introduced yet.

### 2026-05-20 - Prior design decisions

The consolidated spec remains authoritative for: light theme only, scroll-spy `CoursesTabbed`, summary-only course detail pages, expanded SEO strategy, course catalog ingestion plan, and homepage anchor IDs.

---

## Gotchas

- `npm run build` passes with Astro check and static build.
- `npm run courses:review` currently reports 0 hard failures and 10 warnings, all because HRD claimable status remains unconfirmed on the current course set.
- `src/content/courses/_curation/review-report.json` is generated review metadata. Treat `hrdClaimable: false` as unconfirmed/not claimable, not proof that a course is definitely ineligible.
- PR 13 changed the finance course public slug from `business-financial-skills-for-non-financial-personnels` to `business-financial-skills-for-non-financial-personnel`. No redirect is needed pre-launch; add one if the old URL was ever shared publicly.
- PR 12 builds ten `/programs/[category]/[course]/index.html` pages from the current course JSON set. The route will automatically scale as more top-level `src/content/courses/*.json` files are added.
- `Get the full outline` currently routes to `/contact?training=...`; the actual contact page/form behavior is still PR 16.
- PR 12 adds Course JSON-LD, but HRD credential schema is omitted unless `hrdClaimable === true`. Current sample courses all remain unclaimable/unconfirmed.
- PR 11 builds all nine `/programs/[category]/index.html` pages, and their course cards now land on PR 12 detail pages where a matching course JSON exists.
- Category page course grouping is currently flat because the PR 9 sample batch has 1-2 courses per category. Add sub-theme grouping when the bulk catalog creates categories with 15+ courses.
- PR 10 builds `/programs/index.html` and imports the catalog client from `src/components/programs/`. Keep browser-only scripts out of `src/pages/`; Astro treats files there as routes.
- The HRD Corp filter currently returns zero results because all PR 9 sample courses intentionally have `hrdClaimable: false` pending confirmation.
- PR 9 inventory currently reports 358 supported source files, 181 PDFs, and 175 course candidate groups. It still flags 7 non-PDF canonicals, 10 itinerary canonicals, and 136 courses with no duration inferred from filename; these need human curation before bulk import.
- `src/content/courses/_curation/inventory.json` is pipeline metadata. Do not treat it as a course in PR 10; import only top-level `src/content/courses/*.json`.
- The 10 PR 9 course JSON files are representative summary drafts, not final Icon Learning-approved copy. HRD claimable is intentionally false everywhere.
- PR 8 static QA confirms `#hero`, `#proof`, `#categories`, `#services`, `#approach`, `#outcomes`, and `#contact-cta` render in `dist/index.html`; `#testimonials` remains intentionally absent until approved quotes exist.
- Production dependency audit is clean via `npm audit --omit=dev --audit-level=moderate`.
- Lighthouse CLI is not installed in this workspace, so the PR 7 Lighthouse pass still needs to be run in an environment with Lighthouse/browser automation available.
- PR 6 adds `src/content/testimonials.ts` with an empty `approvedTestimonials` export; the homepage intentionally omits `#testimonials` until that array has approved entries.
- PR 5 static output includes `#approach`; local port 4321 is currently occupied by older Node preview processes in this workspace, so direct preview on that port may return stale 500s until those processes are cleared.
- PR 3 imports logo images directly from `assets/source/logos/clients/`; Astro fingerprints them into `dist/_astro`.
- There are no workshop photos in `assets/source/photos/` yet, so bento media cards are intentionally deferred.
- There are no category hero images in `assets/source/programs/` yet, so PR 4 uses CSS slide-preview panels as temporary representative media.
- Full `npm audit` still reports moderate advisories in dev-only `@astrojs/check` / language-server dependencies. Keep watching for an upstream fix.
- `npm run dev` currently fails in this sandboxed Windows environment with a Vite/esbuild dependency-optimization access error (`Cannot read directory "../../..": Access is denied`). The production build is unaffected.
- The in-app Browser plugin is installed, but this session did not expose its required Node REPL tool, so visual browser automation could not be completed here.
- The course catalog in `course/documents/` has many duplicate source formats. PDFs remain canonical for PR 9.
- HRD Corp claimable status is not safe to assume. Flag, do not guess.

---

## Key Files & Locations

| Path | What | Editable? |
|---|---|---|
| `DESIGN.md` | The spec and source of truth. | Yes - update when scope/architecture changes |
| `PROJECT_BRAIN.md` | Running state log. | Yes - update every PR |
| `assets/` | Source and web-ready asset library. | Yes |
| `src/layouts/BaseLayout.astro` | Global HTML shell and metadata. | Yes |
| `src/components/layout/` | `Nav` and `Footer`. | Yes |
| `src/components/primitives/` | Shared PR 1 primitives. | Yes |
| `src/components/programs/` | Catalog cards and catalog client enhancement. | Yes |
| `src/components/sections/` | Homepage sections. | Yes |
| `scripts/course-review.mjs` | Course JSON review gate and report generator. | Yes |
| `src/pages/programs/index.astro` | Programs catalog route. | Yes |
| `src/pages/programs/[category].astro` | Program category detail route for all 9 categories. | Yes |
| `src/pages/programs/[category]/[course].astro` | Summary-only course detail route. | Yes |
| `src/styles/tokens.css` | Design tokens. | Yes |
| `src/styles/global.css` | Tailwind entry and global styles. | Yes |
| `src/content/` | Site/navigation content. | Yes |
| `src/content/courses/` | Summary-only course JSON, schema, and tracked curation metadata. | Yes |
| `src/content/courses/_curation/review-report.json` | Latest generated course review report. | Yes |
| `course/documents/*.pdf` | Canonical raw course outlines. | No - source material only |

---

## Commands

- `npm install` - install dependencies.
- `npm run dev` - Astro dev server. Currently blocked in this sandbox by the Vite/esbuild access issue noted above.
- `npm run build` - Astro check + production build.
- `npm run preview` - Astro preview server for the built site.
- `npm run courses:inventory` - regenerate `src/content/courses/_curation/inventory.json` from ignored raw course documents.
- `npm run courses:review` - validate publishable course JSON and regenerate `src/content/courses/_curation/review-report.json`.
- `npm audit --omit=dev --audit-level=moderate` - production dependency audit.

---

## Hand-Off Checklist

Before merging each PR:

1. Move the PR from `In Flight` to `What's Done` with a one-line summary.
2. Update `Status Snapshot`.
3. Update `Next Up`.
4. Add decisions for non-obvious choices.
5. Add gotchas if something will bite the next pass.
6. Resolve any closed open questions.
7. Surface new open questions.
