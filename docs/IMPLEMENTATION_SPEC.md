# Icon Learning — Design & Implementation Specification

> **Purpose of this document**: a single, self-contained spec from which the entire
> `www.iconlearning.com.my` website can be rebuilt from scratch, with no access to the
> original repository. It captures the tech stack, information architecture, content
> model, every route, every component contract, every client-side behavior, the SEO
> recipes, the build/QA tooling, and the editorial constraints.
>
> **Visual design is intentionally NOT specified.** The look and feel — color palette,
> typography, spacing, iconography, card styling, animation styling — is delegated to
> the implementer. Where this document describes what a page or component *contains*
> and *does*, the implementer decides how it *looks*. A short design brief with hard
> functional/accessibility requirements is in §3. Anything labeled *(reference)*
> describes how the original happened to do it and may be freely redesigned.
>
> **What is NOT in this document**: the bulk content payload — the ~100 course JSON
> files, client logo images, and photography. Their schemas, naming rules, and one
> full worked example are included so equivalent content can be authored or imported.

---

## 1. Project overview

**Client**: Icon Learning & Development Sdn Bhd — a Malaysian corporate training and ISO
consultancy provider (established 15 Dec 2011, reg. 0971709-M / 201101043589), based in
Sri Petaling, Kuala Lumpur.

**Deliverable**: a static marketing/catalog website deployed at
`https://www.iconlearning.com.my`. It is a redesign of a legacy site. Core jobs:

1. Present a browsable, filterable catalog of ~100 corporate training courses across 10
   program categories.
2. Convert visitors into training inquiries via WhatsApp, email, and a contact form.
3. Take registrations for featured public training runs (submitted to a Google Sheet).
4. Rank for Malaysian corporate-training searches — **"HRD Corp claimable"** is the
   primary commercial/search differentiator and must be treated as a first-class field
   everywhere courses appear (badges, filters, meta descriptions, structured data).

**Audience**: Malaysian B2B buyers — HR managers, department heads, business owners —
evaluating training providers. Tone: professional, practical, commercially clear.

**Non-negotiable product constraints** (these shaped the whole build):

- **Static output only.** No server, no client framework. Interactivity is small
  vanilla-TypeScript islands. Total client JS budget: **~50 KB gzip** for the homepage.
- **Progressive enhancement everywhere.** Every page must be fully readable and usable
  with JavaScript disabled. Motion only activates after JS marks the document ready.
- **No fabricated content.** No invented trainee counts, testimonial quotes, client
  stats, or outcome numbers. Sections that would need unverified claims are omitted or
  ship as empty placeholders until content is approved.
- **Course pages are summary-only by design.** Module *titles* only — never full
  topic-by-topic outlines from source PDFs. The "get the full outline" inquiry is the
  conversion mechanism.
- **`hrdClaimable` defaults to `false`** unless confirmed from the source PDF or an
  authoritative list. Never inferred.

---

## 2. Tech stack & project configuration

### 2.1 Stack

| Concern | Choice |
|---|---|
| Framework | Astro (static output, v6.x), `astro check` for typechecking |
| Styling | Implementer's choice. (Original used Tailwind v3 + CSS custom properties + scoped `<style>` blocks in `.astro` files — any approach is fine as long as it ships as plain CSS with no runtime.) |
| Font | Implementer's choice, but **self-hosted** (no external font CDN requests). |
| Client JS | Vanilla TypeScript islands (`*.client.ts` imported via `<script>` tags) |
| Content | Typed TS modules (`src/content/*.ts`) + one JSON file per course |
| Tooling | Plain Node `.mjs` scripts (no test runner) |
| Analytics | Google Analytics 4 (`G-HMHWTHZ724`) + Microsoft Clarity (`x9c45gfnat`) |
| Forms backend | Google Apps Script web app writing to a Google Sheet |

### 2.2 npm scripts (contract)

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "prebuild": "node scripts/generate-sitemaps.mjs",
    "sitemaps:generate": "node scripts/generate-sitemaps.mjs",
    "courses:inventory": "node scripts/course-inventory.mjs",
    "courses:review": "node scripts/course-review.mjs",
    "documents:markdown": "node scripts/pandoc-documents.mjs",
    "qa:launch": "node scripts/launch-qa.mjs",
    "typecheck": "astro check"
  }
}
```

(The original also had `courses:draft` / `courses:checklist` / `courses:seo-polish`
authoring helpers — optional.)

### 2.3 Config essentials

**`astro.config.mjs`**
```js
import { defineConfig } from "astro/config";
export default defineConfig({
  site: "https://www.iconlearning.com.my",
  devToolbar: { enabled: false },
});
```

**`tsconfig.json`** — extends `astro/tsconfigs/strict` with path aliases
`@components/*`, `@content/*`, `@layouts/*`, `@styles/*` → the matching `src/` dirs.

**`.env`** (public, embedded at build time):
```
PUBLIC_GOOGLE_SHEET_REGISTRATION_ENDPOINT=https://script.google.com/macros/s/<deployment-id>/exec
```

### 2.4 Repository layout

```
/
├── astro.config.mjs, tsconfig.json, package.json  (+ styling config of your choice)
├── assets/                      # NOT in src/ — imported with relative paths
│   ├── source/brand/            # logo image + vector icon
│   ├── source/logos/clients/    # ~24 client logo PNGs
│   ├── source/logos/hrd/        # HRD Corp claimable badge image
│   └── web/photos/              # hero/section photography
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   ├── llms.txt
│   └── sitemap.xml, sitemap-pages.xml, sitemap-courses.xml   (generated)
├── scripts/                     # Node .mjs tooling + Apps Script source
└── src/
    ├── layouts/BaseLayout.astro
    ├── styles/                  # implementer-defined stylesheet(s)
    ├── scripts/global-motion.ts
    ├── content/
    │   ├── site.ts, home.ts, about.ts, clients.ts, contact.ts,
    │   │   testimonials.ts, navigation.ts, accessibility.ts,
    │   │   publicTraining.ts, programs.ts
    │   └── courses/
    │       ├── schema.ts, index.ts
    │       ├── *.json            (one per course, ~100 files)
    │       └── _curation/        (generated: inventory.json, review-report.json)
    ├── components/
    │   ├── layout/    Nav.astro, Footer.astro
    │   ├── primitives/ Button.astro, SectionHeading.astro, BrandLogo.astro, ...
    │   ├── sections/  homepage sections (each interactive one pairs .astro + .client.ts)
    │   ├── programs/  ProgramCard.astro, ProgramsCatalog.client.ts
    │   ├── contact/   ContactPanel.astro, ContactForm.client.ts
    │   └── register/  GoogleSheetRegistration.client.ts
    └── pages/
        ├── index.astro, about-us.astro, clients.astro, contact.astro,
        │   accessibility-statement.astro
        ├── programs/index.astro, programs/[category].astro,
        │   programs/[category]/[course].astro
        └── register/[course].astro
```

Convention: each interactive section pairs a `.astro` file (SSR markup, no-JS-safe)
with a `.client.ts` island of the same name, imported at the bottom of the `.astro`
file via `<script> import "./Name.client"; </script>`.

---

## 3. Design brief (look & feel delegated)

The implementer owns the visual system: palette, typography, spacing scale, card and
chip treatments, imagery style, iconography, and all animation styling. Design it as
one coherent system and apply it consistently. The following are the **hard
requirements** the visual design must satisfy — everything else is yours:

1. **Responsive from 320px up.** No horizontal page scroll at any width. Wide content
   (card grids, logo walls, tab strips) must adapt or scroll within its own container.
2. **Accessibility floor**: WCAG 2.2 AA contrast for text and UI states; a clearly
   visible focus indicator on every interactive element; tap targets ≥ 44px.
3. **HRD Corp claimable must be visually distinguished** wherever a course is shown —
   a badge/chip treatment that reads as a positive status and stands out from the
   other metadata chips (duration, language, formats).
4. **Text over photography must stay readable.** Several heroes place heading text
   over a photo; whatever treatment you choose (overlay, wash, split layout) must keep
   AA contrast on mobile and desktop.
5. **Client logos** render in a neutralized/uniform treatment (the originals are
   mixed-quality PNGs on white); interactive emphasis on hover is optional.
6. **Motion is progressive enhancement** (see §3.1) and every animated behavior needs
   a `prefers-reduced-motion` fallback.
7. **Performance**: styling must be plain CSS at runtime; self-hosted fonts; the
   homepage script payload stays within the ~50 KB gzip budget.
8. **One coherent theme.** Whatever direction you pick, don't mix systems page to
   page. (The original was a warm, light, minimal B2B look — you are free to depart
   from it.)

### 3.1 Motion architecture — `src/scripts/global-motion.ts` (required mechanism)

The *mechanism* below is required because markup across the site depends on it; the
*styling* of the animations (distances, durations, easings) is yours.

Loaded on every page from `BaseLayout`. Behavior:

1. If `prefers-reduced-motion: reduce` → do nothing at all. Content must be fully
   visible without JS or with reduced motion, so any "hidden initial state" CSS must
   be gated on `html[data-motion-ready]`.
2. Otherwise set `document.documentElement.dataset.motionReady = "true"`, then:
   - **Hero stagger**: elements marked `[data-hero-item]` animate in sequentially on
     page load (a per-index delay).
   - **Scroll reveals**: an IntersectionObserver adds `.is-visible` to each
     `[data-reveal]` element on first intersection, then unobserves. If
     IntersectionObserver is unavailable, mark everything visible immediately.
   - **Same-page anchor smooth-scroll**: delegated click handler for same-page hash
     links → `scrollIntoView({ behavior: "smooth" })` + push the hash.

Throughout this spec, `data-reveal` / `data-hero-item` attributes on markup indicate
elements that participate in this system.

### 3.2 Imagery inventory

- Photography: workshop/office photos at `assets/web/photos/` used in page heroes and
  one homepage feature image.
- Client logos: one PNG per client at `assets/source/logos/clients/`.
- Brand: a vector logo (nav/footer) and a raster logo (default OG image) under
  `assets/source/brand/`.
- HRD Corp badge image: `assets/source/logos/hrd/`.
- All `<img>` elements need `alt` (QA-enforced) and explicit width/height where
  available; purely decorative panels use `aria-hidden="true"`.

---

## 4. Content model

All page copy lives in typed TS modules under `src/content/` — never hard-coded in
`.astro` templates. This is a hard convention.

### 4.1 `site.ts` — single source of NAP (verbatim)

```ts
export const site = {
  name: "Icon Learning",
  legalName: "Icon Learning & Development Sdn Bhd",
  registrationNumber: "0971709-M (201101043589)",
  foundingDate: "2011-12-15",
  brandLine: "Transforming people. Powering performance. Delivering results.",
  title: "HRD Corp Claimable Training Provider Malaysia | Icon Learning",
  description:
    "Icon Learning helps Malaysian teams build practical skills through HRD-claimable programs, ISO consultancy, and customized in-house training.",
  url: "https://www.iconlearning.com.my",
  email: "info@iconlearning.com.my",
  emailHref: "mailto:info@iconlearning.com.my",
  phone: "+6012-3245 938",
  phoneHref: "tel:+60123245938",
  whatsappHref: "https://wa.me/60123245938",
  address: "No 1, Jalan Radin 5, 57000 Sri Petaling, Kuala Lumpur",
  openingHours: "Monday to Friday, 09:00-18:00",
};
```

**Invariant**: name/address/phone must stay in sync across footer, `/contact`, and the
`LocalBusiness` JSON-LD — all must consume this object (NAP drift hurts local SEO).

### 4.2 Course schema — `src/content/courses/schema.ts` (verbatim contract)

```ts
export const courseCategorySlugs = [
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
] as const;

export const courseLanguages = ["en", "ms", "en+ms"] as const;

export const deliveryFormats = [
  "Public", "In-house", "Workshop", "Certification", "Blended",
] as const;

export type CourseCategorySlug = (typeof courseCategorySlugs)[number];
export type CourseLanguage = (typeof courseLanguages)[number];
export type DeliveryFormat = (typeof deliveryFormats)[number];

export type CourseModule = { day?: number; title: string };

export type CourseMethodologyMix = {
  interactiveLectures?: number;
  handsOnExercises?: number;
  groupActivities?: number;
  demonstrations?: number;
  rolePlaying?: number;
  selfAssessment?: number;
};

export type Course = {
  slug: string;                 // must equal the JSON filename (minus .json)
  title: string;
  subtitle?: string;
  categorySlug: CourseCategorySlug;
  durationDays: 0.5 | 1 | 2 | 3;
  hrdClaimable: boolean;        // default false; only true when CONFIRMED
  language: CourseLanguage;
  deliveryFormats: DeliveryFormat[];
  whyThisMatters: string;       // ~40–60 words, one paragraph
  builtFor: string[];           // 3–5 audience phrases
  walkAwayWith: string[];       // 3–5 outcome bullets
  modules: CourseModule[];      // >= 3, TITLES ONLY, optional day grouping
  methodology?: CourseMethodologyMix;   // percentages summing ~100
  methodologyCaption?: string;
  sourceDoc: string;            // path to the raw source markdown (gitignored dir)
  relatedSlugs?: string[];      // >= 2 recommended; must exist; no self-link
};

export function isCourseCategorySlug(value: string): value is CourseCategorySlug {
  return courseCategorySlugs.includes(value as CourseCategorySlug);
}
```

### 4.3 Course catalog loader — `src/content/courses/index.ts`

```ts
import { programCategoryMap } from "../programs";
import type { Course } from "./schema";

// Non-recursive glob: files under _curation/ are intentionally excluded.
const courseModules = import.meta.glob("./*.json", { eager: true, import: "default" }) as Record<string, Course>;

export const courses = Object.values(courseModules).sort((a, b) =>
  a.title.localeCompare(b.title, "en", { sensitivity: "base" }));

export const coursesByCategory = courses.reduce<Record<string, Course[]>>((groups, course) => {
  groups[course.categorySlug] ??= [];
  groups[course.categorySlug].push(course);
  return groups;
}, {});

export function courseUrl(course: Course) {
  return `/programs/${course.categorySlug}/${course.slug}`;
}

// Lower-cased haystack used by the client-side catalog filter.
export function courseSearchText(course: Course) {
  return [course.title, course.subtitle, course.categorySlug,
    programCategoryMap.get(course.categorySlug)?.title, course.whyThisMatters,
    ...course.builtFor, ...course.walkAwayWith,
    ...course.modules.map((m) => m.title)]
    .filter(Boolean).join(" ").toLowerCase();
}
```

### 4.4 One course JSON file per course — worked example

Filename must equal the slug: `ai-implementation-in-accounting-and-finance-from-strategy-to-optimization.json`

```json
{
  "slug": "ai-implementation-in-accounting-and-finance-from-strategy-to-optimization",
  "title": "AI Implementation in Accounting & Finance: From Strategy to Optimization",
  "subtitle": "A 1-day HRD Corp-claimable finance workshop for applying AI implementation in accounting and finance more confidently at work.",
  "categorySlug": "ai",
  "durationDays": 1,
  "hrdClaimable": true,
  "language": "en",
  "deliveryFormats": ["Public", "In-house", "Workshop"],
  "whyThisMatters": "AI Implementation in Accounting & Finance ... helps managers, finance support teams, and business users understand AI implementation in practical workplace terms. The session connects Kickstart AI Implementation, System Development, and Workshop: Project Planning to better financial decisions, controls, and business conversations.",
  "builtFor": [
    "Managers, executives, and finance-facing teams",
    "Department heads responsible for budgets, records, or controls",
    "Business owners who want stronger financial awareness"
  ],
  "walkAwayWith": [
    "Understand the key financial concepts and business implications.",
    "Read information with clearer awareness of cost, risk, and performance.",
    "Ask better questions when reviewing records, reports, or decisions.",
    "Use finance thinking to support planning and follow-through."
  ],
  "modules": [
    { "title": "Kickstart AI Implementation" },
    { "title": "System Development" },
    { "title": "Workshop: Project Planning" },
    { "title": "Activity: System Integration" }
  ],
  "methodology": { "interactiveLectures": 35, "handsOnExercises": 35, "groupActivities": 20, "selfAssessment": 10 },
  "methodologyCaption": "The session uses practical business examples and guided exercises so participants can apply financial thinking to workplace decisions.",
  "sourceDoc": "course/documents-markdown/AI Implementation in Accounting ^0 Finance_ From Strategy to Optimization.md",
  "relatedSlugs": [
    "business-financial-skills-for-non-financial-personnel",
    "credit-control-management",
    "fundamental-analysis-for-stock-market"
  ]
}
```

Multi-day courses set `"day": 1|2|3` on each module; the course page groups modules
under "Day N" headings (`"Workshop"` when `day` is absent).

### 4.5 Program categories — `src/content/programs.ts`

`ProgramCategory` type:

```ts
export type ProgramCategory = {
  slug: CourseCategorySlug;
  title: string;            // "Leadership, Management & Coaching"
  shortTitle: string;       // "Leadership" — used in chips, breadcrumbs, SEO titles
  summary: string;          // one sentence, used on cards and category hero
  overview: string;         // one paragraph for the category page
  focusAreas: string[];     // ~5 pill labels
  audience: string[];       // ~5 "who should attend" bullets
  deliveryFormats: string[];// ~4 "how it can run" bullets
  relatedCategorySlugs: CourseCategorySlug[];  // exactly 3
};
```

The 10 categories (slug → title / shortTitle / summary):

| slug | title | shortTitle | summary (1 sentence) |
|---|---|---|---|
| `leadership-management-coaching` | Leadership, Management & Coaching | Leadership | Build sharper supervisors, managers, and leaders through practical people-management habits. |
| `quality-lean-food-safety` | Quality, Lean & Food Safety | Quality | Strengthen systems, audits, food safety, and continuous improvement across operations. |
| `safety-health-environment` | Safety, Health & Environment | Safety | Support safer workplaces with OSH, HIRARC, waste, fire, and emergency readiness. |
| `hr-employment-law` | HR & Employment Law | HR | Help managers and HR teams handle compliance, discipline, payroll, and workplace policy. |
| `ai` | AI | AI | Help teams apply AI tools, prompting, and implementation planning with practical workplace judgment. |
| `microsoft-ai-digital-skills` | Microsoft & Digital Skills | Digital | Upgrade everyday productivity with Excel, Power BI, Microsoft Office, and cyber awareness. |
| `sales-marketing-customer-service` | Sales, Marketing & Customer Service | Sales | Improve selling, service conversations, retail performance, and digital marketing execution. |
| `finance-taxation` | Finance & Taxation | Finance | Give non-finance teams the confidence to read numbers and make better business decisions. |
| `supply-chain-shipping-warehousing` | Supply Chain, Shipping & Warehousing | Supply chain | Sharpen the practical skills behind procurement, shipping, inventory, and warehouse control. |
| `communication-personal-effectiveness` | Communication & Personal Effectiveness | Communication | Improve the everyday habits behind clearer communication, teamwork, and personal productivity. |

Each category also carries a ~55-word `overview` paragraph naming its topics (e.g.
Quality: ISO 9001, ISO 14001, HACCP, GMP, halal/food handling, 5S/6S, 7QC, root cause,
lean), 5 `focusAreas` pills, 5 `audience` roles, 4 `deliveryFormats`, and 3
`relatedCategorySlugs` forming a cross-linking mesh (e.g. Leadership ↔ Communication,
HR, Sales; AI ↔ Digital, Finance, Communication).

The module also exports:

```ts
export const programCategoryMap = new Map(programCategories.map((c) => [c.slug, c]));

export const durationFilters = [
  { value: "all", label: "All durations" },
  { value: "0.5", label: "1/2 day" },
  { value: "1", label: "1 day" },
  { value: "2", label: "2 days" },
  { value: "3", label: "3 days" },
] as const;

export const languageFilters = [
  { value: "all", label: "All languages" },
  { value: "en", label: "English" },
  { value: "ms", label: "Bahasa Malaysia" },
  { value: "en+ms", label: "English + BM" },
];

export function formatDuration(days: number) {   // 0.5 → "1/2 day", 1 → "1 day", n → "n days"
  if (days === 0.5) return "1/2 day";
  if (days === 1) return "1 day";
  return `${days} days`;
}
export function formatLanguage(language: CourseLanguage) {
  if (language === "ms") return "Bahasa Malaysia";
  if (language === "en+ms") return "English + BM";
  return "English";
}
```

**Keep `courseCategorySlugs` (schema.ts) and `programCategories` (programs.ts) in
sync** — the former is the canonical slug list.

### 4.6 Other content modules (shape + key copy)

**`navigation.ts`**
```ts
export const navigationItems = [
  { label: "Programs", href: "/#categories",
    children: [{ label: "View Full Catalog", href: "/programs/?hrdClaimable=true" }] },
  { label: "Solutions", href: "/#services" },
  { label: "Clients", href: "/#home-clients" },
  { label: "About", href: "/about-us" },
  { label: "Contact", href: "/contact" },
];
export const footerGroups = [
  { title: "Explore", links: [Programs /programs, About us /about-us, Clients /clients, Contact /contact] },
  { title: "Programs", links: [HRD claimable programs /programs?hrdClaimable=true,
      Leadership & coaching, Quality & food safety, Safety & health, AI, Digital skills → category pages] },
  { title: "Company", links: [Accessibility /accessibility-statement, Email inquiry mailto, WhatsApp wa.me] },
];
```

**`home.ts`** — homepage copy. Exports:
- `homeHero`: eyebrow `"HRD Corp claimable training provider"`, headline
  `"Corporate training that moves work forward"`, sub = site.description copy,
  primaryCta `Request training → /contact`, secondaryCta
  `View programs → /programs?hrdClaimable=true`.
- `ctaCloser`: heading `"Ready to plan your next training?"` + WhatsApp/email CTAs.
- `proofBento`: eyebrow "Proof in practice", heading
  `"Built for teams that need training to work on Monday"`, 3 items: a `feature` card
  on HRD Corp claimability, a `quote` card carrying the brand line, and a `feature`
  card on ISO consultancy.
- `coursesShowcase`: eyebrow "Program categories", heading
  `"Find the training lane that fits the work"`, `browseAllCta`
  `"Browse all 10 categories" → /programs`, and 6 featured `categories` (leadership,
  quality, safety, HR, AI, sales) each with slug/title/summary/intro paragraph/4 topic
  pills/1–2 example course links `{ label, href }`.
- `trainingApproach`: eyebrow "Training approach", heading
  `"A practical path from need to follow-through"`, 4 `steps` — **Discover, Customize,
  Deliver, Reinforce** — each `{ eyebrow, heading, body, points[3], media: { eyebrow,
  title, items[4], footer } }` (the `media` panel is an abstract illustration card,
  not a photo).
- `serviceSolutions`: eyebrow "Services and solutions", heading
  `"Three ways to bring the training into the work"`, 3 items: Corporate Training
  Programs (→ /programs), ISO & Quality Management Solutions
  (→ /programs/quality-lean-food-safety), Technical & Safety Training
  (→ /programs/safety-health-environment); each with eyebrow/description/4 pills.

**`publicTraining.ts`** — one featured public run:
```ts
export const featuredPublicTraining = {
  eyebrow: "Public online training",
  title: "AI Implementation in Accounting & Finance: From Strategy to Optimization",
  shortTitle: "AI Implementation in Accounting & Finance",
  category: "AI",
  date: "13 August 2026",
  time: "9:00 AM - 5:00 PM",
  mode: "Online public programme",
  scheduleLabel: "13 Aug 2026, 9:00 AM - 5:00 PM",
  courseHref: "/programs/ai/ai-implementation-in-accounting-and-finance-from-strategy-to-optimization/",
  registrationHref: "/register/ai-implementation-in-accounting-and-finance-from-strategy-to-optimization/",
  summary: "A focused one-day session for accounting, finance, and business teams ...",
  points: [ /* 3 bullets */ ],
  sunsetAt: "2026-08-14T00:00:00+08:00",   // homepage section auto-hides after this
} as const;
```

**`testimonials.ts`** — `testimonialShowcase` header copy plus
`approvedTestimonials = [] as const`. **Deliberately empty**: the Testimonials section
renders nothing until real quotes are approved. Do not seed with fake quotes.

**`about.ts`** — `aboutPage` object: hero (heading "Practical training and consultancy
for teams that need work to move."), `story` (established 15 Dec 2011 + 3 facts),
`services` (3 items: corporate training / strategic consulting / ISO consultancy, each
with 3 tags), `philosophy` (4 principles), `expertise` (3 stats: 10 categories /
3 engagement lanes / brand promise "Results" — note these are *structural* facts, not
fabricated metrics), `values` (Practicality, Clarity, Fit, Follow-through), `cta`.

**`clients.ts`** — `clientsPage` (hero "Trusted by companies across Malaysia",
3 `engagementTypes` linking to /programs and two category pages, `cta`) and
`clientGroups`: 3 groups of logos with `{ name, src: imported image, meta }`:
- *Manufacturing, engineering and infrastructure*: Acer, DNP, Freescale Semiconductor,
  Kelington, Perodua, Proton, QL, Recron, Tanco, Tanjong Express, UAC Bhd, DBE, Zitron.
- *Consumer, food and retail*: Cuckoo, Foh San, Harumi, Indofood, Jin Xuan, Polo Club, Tesco.
- *Public, nonprofit and agency*: FFKR, IFRC, Jabatan Perumahan Negara, Publicis.

**`contact.ts`** — `contactPage`: hero, form config (`formats`: Public programme /
In-house workshop / Blended learning / ISO consultancy / Not sure yet; `teamSizes`:
1-5 / 6-15 / 16-30 / 31-50 / 50+), 5 `contactMethods` (WhatsApp, Email, Phone, Address
with Google Maps search href, Hours), 2 `quickActions`, and 5 `faqs` (HRD claimable?,
in-house?, team size?, EN/BM?, response time?) that feed the FAQPage JSON-LD.

**`accessibility.ts`** — `accessibilityPage`: WCAG 2.2 AA working-target statement,
`lastUpdated` date, 5 `measures`, 3 `knownLimitations`, feedback contacts, review
approach. Framed as a working commitment, not a compliance claim.

---

## 5. Layout shell

### 5.1 `src/layouts/BaseLayout.astro`

Every page routes through this layout. Props:
`{ title?, description?, lang?, image?, imageAlt? }` — defaults: `site.title`,
`site.description`, `"en-MY"`, the brand logo image, `"Icon Learning logo"`.

`<head>` renders, in order:
1. charset, viewport, `<title>`, meta description, canonical
   (`new URL(Astro.url.pathname, site.url)`), `favicon.svg`.
2. Open Graph: `og:title`, `og:description`, `og:url` (canonical), `og:type=website`,
   `og:image` (absolute), `og:image:alt`. Twitter: `summary_large_image` card + image + alt.
3. **Global JSON-LD** (one `application/ld+json` block, array of two objects):
   - `Organization`: name, legalName, url, logo, email, telephone, and a
     `ContactPoint` (contactType `"training inquiry"`, areaServed `"MY"`).
   - `WebSite` with a `SearchAction`:
     `target: "https://www.iconlearning.com.my/programs?q={search_term_string}"`.
4. GA4 loader (`gtag.js?id=G-HMHWTHZ724` async + inline config snippet).
5. Microsoft Clarity inline loader (project id `x9c45gfnat`).

`<body>`: `<Nav />` → `<main><slot /></main>` → `<Footer />` → global-motion script.

### 5.2 `Nav.astro`

Functional requirements:
- Fixed/sticky site header present on all pages. It should visually distinguish its
  "scrolled" state from its "at top of page" state *(reference: a 1px sentinel div +
  IntersectionObserver toggles a `data-scrolled` attribute; at top the header is
  transparent, scrolled it gains a solid/backdrop treatment and border)*.
- Left: brand logo linking home (`aria-label` "{site name} home").
- Desktop: the 5 `navigationItems` as links; "Programs" has a dropdown containing
  "View Full Catalog". The dropdown must open on hover **and** `focus-within`
  (keyboard accessible). Plus a "Request training" CTA button → `/contact`.
- Mobile: a disclosure menu that works with **zero JS** *(reference: a native
  `<details>` element with a hamburger `<summary>`)* listing all items (children
  indented) plus the CTA button.

### 5.3 `Footer.astro`

Brand logo + one-line description ("Practical corporate training, ISO consultancy,
and in-house learning support for Malaysian teams."), the 3 `footerGroups` link
columns, and a bottom strip: `Copyright {currentYear} Icon Learning. All rights
reserved.` + "Made with Astro" link.

---

## 6. Primitives (component contracts)

**`Button.astro`** — renders `<a>` when `href` is given, else `<button>` (default
`type="button"`). API:
```
variant: "filled-ink" | "filled-accent" | "outline" | "ghost"   (default "filled-ink")
size:    "md" | "lg"                                            (default "md")
```
plus passthrough attributes. Semantics: `filled-ink` = primary CTA, `filled-accent` =
brand-accent alternative, `outline` = secondary, `ghost` = tertiary/text. Visual
treatment of each is the implementer's; keep the four-variant/two-size API because
pages reference it. `min-height` ≥ 44px both sizes.

**`SectionHeading.astro`** — `{ eyebrow?, heading, description?, align?: "left"|"center", size?: "lg"|"xl" }`.
Renders an optional small "eyebrow" label, an `<h2>`, and an optional description
paragraph; wrapper carries `data-reveal`. ("Eyebrow" = a short uppercase-style kicker
label used above headings throughout the site — treatment is yours, but it must be a
`<p>`, not a heading, to keep the heading outline clean.)

**`BrandLogo.astro`** — the vector logo `<img>` with alt = site name.

**`ProgramCard.astro`** (in `components/programs/`) — the catalog card used on
/programs, category pages, and course-page "related" grids. Props
`{ course: Course, categoryTitle: string }`. It is an `<a>` to `courseUrl(course)`
carrying **filter metadata as data attributes** (contract with the catalog island):

```
data-program-card
data-course-id={slug}  data-category={categorySlug}  data-duration={durationDays}
data-language={language}  data-hrd={hrdClaimable}  data-search={courseSearchText(course)}
```

Content, in order: metadata chip row (category title, duration label, language label,
and — only when claimable — the highlighted "HRD Corp claimable" chip) → course title
(`<h3>`) + optional subtitle → `whyThisMatters` clamped to ~3 lines → up to 2
`builtFor` tags → a footer affordance ("View summary" + arrow). Cards sit in a
responsive auto-fit grid (~18rem min column).

**`ResultsGrid.astro`** is a **deliberate no-op placeholder** — the homepage
outcomes/stats segment was removed because verified numbers weren't available. Do not
resurrect it without approved data.

---

## 7. Routes & pages

### 7.1 Route map

| Route | Kind | JS island |
|---|---|---|
| `/` | static homepage | section islands + global-motion |
| `/programs` | full catalog | ProgramsCatalog.client.ts |
| `/programs/[category]` | 10 static category pages | none |
| `/programs/[category]/[course]` | ~100 static course pages | none |
| `/about-us`, `/clients`, `/contact`, `/accessibility-statement` | static | ContactForm.client.ts on /contact |
| `/register/[course]` | 1 static registration page (featured run only) | GoogleSheetRegistration.client.ts |

Shared inner-page hero pattern: breadcrumb row → eyebrow → `<h1>` → supporting
paragraph → CTAs/badges, with enough top padding to clear the fixed nav. Exactly
**one H1 per page** (QA-enforced).

### 7.2 Homepage `/`

```astro
<BaseLayout>                      <!-- default title/description from site.ts -->
  <Hero {...homeHero} backgroundImage={workshopHeroImage.src} />
  {showFeaturedTraining && <FeaturedPublicTraining training={featuredPublicTraining} />}
  <BentoMasonry {...proofBento} />
  <CoursesTabbed {...coursesShowcase} />
  <ServicesBento {...serviceSolutions} />
  <ApproachSection {...trainingApproach} />
  {approvedTestimonials.length > 0 && <Testimonials {...testimonialShowcase} items={approvedTestimonials} />}
  <HomeClients />
  <CtaCloser {...ctaCloser} />
</BaseLayout>
```

`showFeaturedTraining = new Date() < new Date(featuredPublicTraining.sunsetAt)` —
the featured-training section removes itself after the event.

Section content specs (visual treatment is yours; ids matter — the nav links to
`/#categories`, `/#services`, `/#home-clients`):

- **Hero** (`#hero`): full-height-ish opening with eyebrow, H1 headline, sub, and two
  CTAs (primary + secondary), over/beside the workshop photo (readability rule §3.4).
  Elements carry `data-hero-item` for the load stagger.
- **FeaturedPublicTraining** (`#featured-training`): the featured run — cover image,
  eyebrow, shortTitle heading, summary, Date/Time/Format/Category fact list, 3 bullet
  points, CTAs "Register interest" + "View course outline".
- **BentoMasonry** (`#proof`): centered SectionHeading + a card collage of the 3
  `proofBento` items. Card types the component supports: `feature`
  (eyebrow/heading/body), `quote` (large quote + attribution, visually distinct),
  `logoCloud` (small logo grid). *(Reference: 3-column masonry with a subtle
  scroll-parallax per card via a `data-speed` attribute — optional flourish.)*
- **CoursesTabbed** (`#categories`): the 6-category showcase — see §8.2 for the
  required tab semantics and no-JS behavior.
- **ServicesBento** (`#services`): the 3 `serviceSolutions` as linked cards — one
  primary (Corporate Training, featuring the HRD Corp claimable badge image) and two
  secondary; each with eyebrow, title, description, focus-area pills.
- **ApproachSection** (`#approach`): centered SectionHeading + the 4 approach steps,
  each rendered by **FeatureStripe**: a two-part article pairing an abstract "media"
  panel (step number, media eyebrow/title, 4 item pills, footer label) with a copy
  column (eyebrow, heading, body, 3 points). Steps alternate orientation.
  *(Reference: on desktop the original animated these as a scroll-driven "page flip"
  deck — optional; a plain stacked sequence is equally valid.)*
- **Testimonials** (`#testimonials`): horizontally browsable quote cards with
  prev/next buttons (see §8.4). **Renders nothing while the approved list is empty.**
- **HomeClients** (`#home-clients`): "Trusted By / Companies across Malaysia" heading
  + all client logos (flattened from `clientGroups`) in a browsable strip, plus a
  "View all clients" link to `/clients`. *(Reference: a CSS infinite marquee — logos
  duplicated once with `aria-hidden` on the duplicate set, pause on hover. Required
  regardless of treatment: under reduced motion it must degrade to a static or
  natively scrollable list with duplicates hidden.)*
- **CtaCloser** (`#contact-cta`): a single centered closing card — eyebrow "Start a
  conversation", `ctaCloser` heading + sub, WhatsApp/email button pair.

### 7.3 Catalog `/programs`

Title: `Corporate Training Programs Malaysia | Icon Learning`.
Description: `Browse HRD Corp claimable corporate training programs in Malaysia by category, duration, language, and team need.`

Layout:
1. **Hero**: eyebrow "Programs catalog", H1 "Find the right training for your team",
   sub listing the 10 lanes; plus a small panel showing the big **total course count**
   with caption "course summaries available for team training conversations" and a
   "Request training" WhatsApp button.
2. **Toolbar** (`[data-programs-catalog]` wraps everything below): search input
   (`[data-program-search]`, labeled "Search programs", placeholder "Search by title,
   audience, outcome, or topic") + Grouped/Flat view toggle buttons (`[data-view-mode]`).
3. **Filter panel**: button groups for Category (All + 10 shortTitles,
   `[data-category-filter]`), Duration (`durationFilters`, `[data-duration-filter]`),
   Language (`languageFilters`, `[data-language-filter]`), plus an **"HRD Corp
   claimable" toggle** (`[data-hrd-filter]`, a real checkbox, **checked by default**).
   Filter buttons expose `aria-pressed` and a visible active state.
4. **Results bar**: `[data-results-count]` ("N courses") + hint text ("Need the full
   outline? Send us the course title and preferred delivery format."). Hidden empty
   state block (`[data-empty-state]`): "No matching programs / Try a broader search
   or clear one of the filters."
5. **Grouped view** (`[data-grouped-view]`, default): one section per category
   (`[data-category-group][data-category-slug]`) with the category title + summary,
   a "Category page →" link, and the ProgramCard grid.
6. **Flat view** (`[data-flat-view]`, initially `hidden`): all courses in one grid.

Server-rendered fully populated — without JS the page is a complete readable catalog
(filtering simply doesn't respond). Client behavior in §8.1.

### 7.4 Category pages `/programs/[category]`

`getStaticPaths()` maps `programCategories`. SEO:
- Title: `{ShortTitle} Training Malaysia | Icon Learning` (special case: "Supply
  chain" → "Supply Chain").
- Description: `{summary} Browse {n} course(s) for Malaysian teams.`

Page-level JSON-LD (single block, array):
1. `BreadcrumbList`: Programs → category.
2. `ItemList` named `"{title} training courses"` whose elements are `Course` objects
   (name, description = `whyThisMatters`, url, provider Organization, about = title).

Content, in order: breadcrumb (Programs / shortTitle) → hero (eyebrow "Program
category", H1 `"{title} training"`, summary; optionally a decorative panel showing
focus areas + course count) → main body:
- **Overview**: "What this category covers" + overview paragraph + all focusAreas as
  labeled pills.
- **Courses**: "Available programmes" ProgramCard grid + "Filter in catalog →" link
  to `/programs?category={slug}`.
- **Audience / Formats**: twin lists ("Who should attend" / "How it can run").
- **Related categories**: 3 linked cards (shortTitle, title, summary).
- **Inquiry aside** (kept visible/reachable; *reference: sticky sidebar on desktop*):
  "Plan training for your team" copy + facts list (Courses count, distinct Durations,
  Languages, "HRD Corp: Confirm during inquiry") + WhatsApp button + Email button
  (mailto with subject `Training inquiry: {title}`).

### 7.5 Course pages `/programs/[category]/[course]`

`getStaticPaths()` maps all `courses`; props carry the course + its category.
`lang` prop = `ms-MY` when `course.language === "ms"`, else `en-MY`.

**SEO title recipe** (`makePageTitle`): first apply a table of manual shortening
replacements for known long titles (e.g. "Business Financial Skills for Non-Financial
Personnel" → "Financial Skills for Non-Finance", "Occupational Safety and Health" →
"OSH", etc.), then pick the first candidate ≤ 70 chars from:
1. `{seoTitle} HRD Claimable Training Malaysia | Icon Learning` (only if claimable —
   otherwise the suffix is "Training Malaysia")
2. `{seoTitle} Training Malaysia | Icon Learning`
3. `{seoTitle} Training | Icon Learning`
4. `{seoTitle} | Icon Learning`
Fallback: clip to a sentence ≤ 54 chars + suffix.

**Meta description recipe** (`makeMetaDescription`): build
`"{title} is a {duration} [HRD Corp claimable ]{category shortTitle lowercase} training programme in Malaysia for {first builtFor phrase, lowercased}"`,
append `", covering {first 2 non-generic module titles joined with ' and '}."`
(skipping generic titles like "Course Introduction", "Workplace Context", "Core
Skills", "Practical Application"), then clip to ≤ 150 chars at a sentence/word
boundary with terminal punctuation (`clipSentence` helper).

**Page JSON-LD** (single block, array of three):
1. `BreadcrumbList` Programs → category → course.
2. `Course`: name, url, description = whyThisMatters, about = category title,
   provider Organization,
   `educationalCredentialAwarded: "HRD Corp Claimable Training"` **only when
   claimable**, `inLanguage` (`["en","ms"]` for en+ms), `timeRequired`
   (`PT4H` for half-day else `P{n}D`), `audience` (builtFor joined),
   `teaches` (walkAwayWith array), `coursePrerequisites: "No prerequisites"`.
3. `FAQPage` from **6 generated FAQs** (also rendered visibly as `<details>`
   disclosures): Who is it for? / How long? / What language? / Can it run in-house?
   (answer depends on `deliveryFormats.includes("In-house")`) / Is it HRD Corp
   claimable? (claimable → "Yes... marked as HRD Corp claimable."; else → "Please
   confirm... during inquiry...") / What will participants learn? (walkAwayWith joined).

Content, in order — hero: breadcrumb (Programs / shortTitle / title), category
eyebrow, H1 = course title, optional subtitle, **badge row** (highlighted HRD chip
when claimable + duration + language + each delivery format), CTAs "Get the full
outline" → `/contact?training={title}` and "WhatsApp us" →
`wa.me/...?text=Hi Icon Learning, I would like the full outline for {title}.`
Then the main sections:

1. *Why this matters* — "The work problem this helps solve" + the paragraph.
2. *Built for* — "Teams who will get the most from it" + audience pills.
3. *What you'll walk away with* — "Practical outcomes" + the outcome bullets.
4. *Inside the workshop* — heading literally **"Module titles only"**; modules
   grouped under `Day N` / `Workshop` headings as numbered lists.
5. *How it runs* (only if any methodology values > 0) — "Workshop mix": a
   proportional stacked bar (one segment per nonzero methodology key, sized by its
   percentage, each key getting a consistent distinguishable color of your choosing)
   + a legend of `{label} {value}%` pairs (labels: Interactive, Hands-on, Group,
   Demo, Role-play, Self-assessment) + optional caption. Mark the bar
   `aria-hidden` and keep the legend as the accessible representation.
6. *FAQ* — the 6 disclosures.
7. *Related courses* — up to **3** ProgramCards chosen in priority order:
   explicit `relatedSlugs` → same category → categories in
   `category.relatedCategorySlugs`; de-duplicated, self excluded.
8. *Closer* — "Want the full outline?" + CTA pair.
9. **Snapshot aside** (*reference: sticky on desktop*): course title + facts list
   (Duration, Language, Format list, `HRD Corp: Claimable | "Confirm during
   inquiry"`) + CTA stack + "Email inquiry" mailto link (subject
   `Training outline: {title}`).

### 7.6 Contact `/contact`

Title/description from `contactPage`. JSON-LD (one block, three objects):
`BreadcrumbList` (Home → Contact); **`LocalBusiness`** — name, legalName, url, email,
telephone, foundingDate, identifier (registration number), slogan (brand line),
`PostalAddress` (No 1 Jalan Radin 5 / 57000 / Sri Petaling / Kuala Lumpur / MY),
`OpeningHoursSpecification` (Mon–Fri 09:00–18:00), ContactPoint; **`FAQPage`** from
the 5 contact FAQs.

Content: hero with breadcrumb + quick-action buttons → main:
- Form area: note explaining it's a **mailto composer** ("This static form opens a
  prepared email draft..."), a promo card for the featured public training with an
  "Open registration form" button, a status line (`[data-contact-status]`,
  `aria-live="polite"`), and the form (`[data-contact-form]`,
  `data-email={site.email}`, action = mailto, method get — the no-JS fallback opens
  a blank mail draft). Fields: Name*, Company, Email*, Phone, Training interest
  (`[data-training-interest]`), Team size `<select>`, Preferred format `<select>`,
  Message textarea. Visible FAQ disclosures below.
- Aside: `ContactPanel` (below).

**`ContactForm.client.ts`**: on load, if `?training=` query param exists and the
field is empty, prefill it and announce via the status line. On submit: prevent
default, compose a `mailto:` URL with subject
`Training inquiry: {training || "Icon Learning"}` and a body of labeled lines
(Name/Company/Email/Phone/Training interest/Team size/Preferred format/Message), set
status "Opening your email client...", navigate to the mailto URL. **No server
involved.**

**`ContactPanel.astro`** — reusable aside card: eyebrow "Talk to Icon Learning",
heading (prop, default "Contact details"), short copy, WhatsApp + Email buttons, then
a definition list of the 5 contact methods (each with linked value + small note).

### 7.7 Registration `/register/[course]`

`getStaticPaths()` returns **only** the featured course slug. Endpoint =
`import.meta.env.PUBLIC_GOOGLE_SHEET_REGISTRATION_ENDPOINT` with a hard-coded
fallback deployment URL. JSON-LD: `BreadcrumbList` + **`Event`** (name,
`OnlineEventAttendanceMode`, `EventScheduled`, startDate/endDate with +08:00 offset,
`VirtualLocation` = page URL, organizer Organization, description).

Content: hero (title, summary, date/time/mode facts) → main:
- **Form area**: heading "Reserve a seat for this public run", status line
  (`[data-registration-status]` with three visual tones: neutral / success / error),
  and the form (`[data-registration-form]`, `data-sheet-endpoint`, POST action to the
  endpoint as no-JS fallback). Contents:
  - Hidden context fields: courseTitle, courseCategory, courseDate, courseTime,
    courseFormat, sourcePage, `submittedAt` (`[data-submitted-at]`),
    `registrationPayload` (`[data-registration-payload]`).
  - **Honeypot**: a visually-hidden off-screen text input `name="website"`
    (tabindex −1, autocomplete off).
  - Company* + **Number of seats** (number 1–50, `[data-seat-count]`).
  - `[data-participant-list]` (`aria-live="polite"`) with a Participant 1 fieldset:
    Full name*, NRIC* (placeholder `e.g. 900101-10-1234`), Email*, Phone/WhatsApp*.
  - Notes textarea; required consent checkbox ("I agree for Icon Learning to contact
    me about this registration."); submit button + WhatsApp help link.
- Aside: training-details facts card + `ContactPanel heading="Need help registering?"`.

**`GoogleSheetRegistration.client.ts`** behavior:
- Seat count input drives dynamic participant fieldsets: on input/blur, clamp 1–50,
  rebuild the fieldset list to match (preserving already-typed values); every
  participant input is required (autocomplete hints only on participant 1).
- On submit: prevent default; clamp seats; stamp `submittedAt` (ISO); serialize
  `registrationPayload` = `{ seats, participants[] }` JSON. If the honeypot has a
  value → fake success and reset (silent bot trap). If no endpoint → error status
  directing to WhatsApp. Otherwise disable submit, status "Sending...", POST the
  FormData as `URLSearchParams` with `mode: "no-cors"` (Apps Script cannot return
  readable CORS responses), then reset + success status; on throw → error status.
  Always re-enable the button.

**Apps Script receiver** (`scripts/google-sheet-registration-web-app.gs`, deployed as
a web app): `doPost` reads `event.parameter`/`event.parameters`, prefers the JSON
`registrationPayload`, falls back to the repeated `participantName/Nric/Email/Phone`
fields, and appends **one row per participant** (submittedAt, course fields, company,
seat count, participant details, notes, consent) to a sheet tab named
`Registrations`. `doGet` returns a version string for smoke-testing.

### 7.8 About `/about-us`, Clients `/clients`, Accessibility `/accessibility-statement`

All three are straightforward compositions of their content modules using the shared
hero + sectioned-page patterns:

- **About**: hero → story (with 3 facts) → 3 services cards → philosophy (principles
  list) → expertise (3 structural stats) → 4 values → CTA. Include a `BreadcrumbList`
  consistent with the global Organization block.
- **Clients**: hero → 3 engagement-type cards → the 3 logo groups as logo walls
  (client name in `alt`, meta caption) → CTA. No client counts or claims beyond the
  logos themselves.
- **Accessibility statement**: hero → commitment → measures list → known limitations →
  feedback contacts → review approach + `lastUpdated`.

---

## 8. Client-side islands — behavior specs

General pattern: every island is a plain top-level TS module, queries the DOM by
`data-*` hooks, no-ops if its root is absent, and sets `data-enhanced="true"` on its
root so CSS can gate JS-only presentation. All respect `prefers-reduced-motion` via
`matchMedia`.

### 8.1 `ProgramsCatalog.client.ts` (catalog search/filter) — required as specified

State: `{ q, category, duration, language, hrdOnly, view }`, initialized from URL
query params (`q`, `category`, `duration`, `language`, `hrdClaimable`, `view`) —
**`hrdOnly` defaults to `true` when the param is absent**; `view` defaults `grouped`.

`apply()` — the single render function:
1. For each `[data-program-card]`, compute visibility as the AND of: query substring
   match against `data-search`; category/duration/language equality (or "all"); and
   `!hrdOnly || data-hrd === "true"`. Toggle `hidden`.
2. Hide any `[data-category-group]` with no visible cards (or when view ≠ grouped).
3. Toggle grouped/flat containers; show empty state when 0 visible; update results
   count text ("N course(s)").
4. Sync `aria-pressed`/active styling on all filter button groups; sync input values.
5. `syncUrl()` — rebuild the query string (omit defaults; include `hrdClaimable=true`
   only when on) and `history.replaceState` so filters are shareable/bookmarkable.

Listeners: search `input`, filter-button `click`s, toggle `change` — each mutates
state and calls `apply()`. Initial `apply()` runs on load so deep links work
(`/programs?category=ai`, the footer's `?hrdClaimable=true`, and the JSON-LD
SearchAction's `?q=` all rely on this).

### 8.2 CoursesTabbed (homepage category showcase)

Required semantics:
- Markup: root `[data-courses-tabbed]`; a `role="tablist"` of `[data-course-label]`
  buttons (each `data-target="category-{slug}"`, `aria-controls`, showing the
  category title + summary); and one `[data-course-panel]` `role="tabpanel"` per
  category (`aria-labelledby` its tab) containing: eyebrow, title, 4 topic pills,
  summary + intro paragraphs, the example course links as cards, and an
  "Explore {category} →" link to the category page.
- **No-JS**: all panels render stacked and readable; labels are simple (e.g. a
  scrollable list) with no dead controls.
- **Enhanced**: exactly one active panel at a time; switching updates
  `aria-selected`/`aria-current` on tabs and `hidden`/`aria-hidden`/`inert` on
  panels. **Keyboard**: Arrow keys cycle (wrapping), Home/End jump, focus follows.
- Reduced motion: switches happen instantly.

*(Reference flourish, optional: on desktop the original turned this into a
scroll-driven section — the section pinned on screen while page scroll progressed
through the tabs, with an animated indicator and cross-fading panels; clicking a tab
scrolled the page to the matching offset. Reproduce, simplify to click-tabs, or
redesign as you see fit — the semantics above are what must hold.)*

### 8.3 ApproachSection

The 4 approach steps render as sequential FeatureStripe articles (§7.2). *(Reference
flourish, optional: the original added a desktop scroll-driven "page flip" animation
between steps. Below desktop and under reduced motion it was a plain stack — a plain
stack everywhere is acceptable.)*

### 8.4 Small islands

- **Testimonials**: prev/next buttons scroll the card track by one card width
  (`scrollBy`, smooth unless reduced motion). Buttons have `aria-label`s; the track
  is keyboard-focusable and natively scrollable.
- **BentoMasonry** *(optional)*: scroll parallax driven by per-card `data-speed`;
  rAF-throttled; disabled under reduced motion and on small screens.
- **Nav scrolled-state observer** — §5.2.
- **ContactForm / GoogleSheetRegistration** — §7.6 / §7.7.

---

## 9. SEO recipe (templated, not artisan)

### 9.1 Title / description patterns per page type

| Page | `<title>` | Meta description |
|---|---|---|
| Home | `HRD Corp Claimable Training Provider Malaysia \| Icon Learning` | site.description |
| /programs | `Corporate Training Programs Malaysia \| Icon Learning` | catalog blurb (see §7.3) |
| Category | `{ShortTitle} Training Malaysia \| Icon Learning` | `{summary} Browse {n} course(s) for Malaysian teams.` |
| Course | recipe in §7.5, ≤ 70 chars | recipe in §7.5, ≤ 150 chars |
| Contact / About / Clients / Accessibility | from their content modules | idem |
| Register | `{shortTitle} Registration \| Icon Learning` | date/time sentence |

Hard limits enforced by QA: title ≤ 70 chars (warning), description ≤ 155 (warning),
both non-empty (error).

### 9.2 JSON-LD matrix

| Block | Where |
|---|---|
| `Organization` + `WebSite`(+SearchAction) | every page (BaseLayout head) |
| `BreadcrumbList` | category, course, contact, register pages |
| `ItemList` of `Course` | category pages |
| `Course` (+conditional `educationalCredentialAwarded`) | course pages |
| `FAQPage` | course pages (6 generated FAQs), contact page (5 authored FAQs) |
| `LocalBusiness` (full NAP + hours) | contact page only |
| `Event` (VirtualLocation) | registration page |

All page-level blocks are emitted as **one** inline
`<script is:inline type="application/ld+json">` containing a JSON array.

### 9.3 Crawl files (in `public/`)

- **`robots.txt`**: `User-agent: * / Allow: /` + `Sitemap: {site}/sitemap.xml`.
- **`llms.txt`**: markdown company summary for LLM crawlers — who Icon Learning is,
  NAP, what it provides, key page URLs, course category list.
- **Sitemaps**: generated by `scripts/generate-sitemaps.mjs` (runs as `prebuild`):
  - `sitemap.xml` — index pointing at the two urlsets.
  - `sitemap-pages.xml` — hard-coded page list with priorities: `/` 1.0,
    `/programs/` 0.9, contact 0.8, register 0.8, about/clients 0.7, accessibility 0.3,
    each of the 10 category pages 0.8.
  - `sitemap-courses.xml` — one entry per course JSON at priority 0.7, path
    `/programs/{categorySlug}/{slug}/`, title-sorted. Regenerating from the JSON
    directory keeps it aligned with the catalog automatically.

### 9.4 Analytics

GA4 (`G-HMHWTHZ724`) + Microsoft Clarity (`x9c45gfnat`) wired directly into
`BaseLayout.astro`'s head — all pages must route through this layout.

---

## 10. Course content pipeline & validation tooling

Raw course PDFs/docs live under a **gitignored** `course/` directory (never expected
in a fresh checkout). Pipeline:

```
raw docs → documents:markdown (pandoc)        → course/documents-markdown/*.md
        → courses:inventory                    → _curation/inventory.json (groups/dedupes candidates)
        → HUMAN authors src/content/courses/*.json per schema
        → courses:review                       → _curation/review-report.json, exit 1 on hard errors
```

**Always run `courses:review` after adding or editing a course JSON.**

### 10.1 `courses:review` validation rules (scripts/course-review.mjs)

Hard **errors** (fail the run):
- `slug` ≠ filename; unknown `categorySlug`; `durationDays` ∉ {0.5, 1, 2, 3};
  `language` ∉ {en, ms, en+ms}; empty/invalid `deliveryFormats`
  (allowed: Public, In-house, Workshop, Certification, Blended);
- `builtFor` not 3–5 items; `walkAwayWith` not 3–5 items; `modules` < 3;
- `relatedSlugs` containing the course itself or a slug that doesn't exist.

**Warnings**: `sourceDoc` missing locally; `whyThisMatters` outside ~35–80 words
(target 40–60); module title > 80 chars or ending in `.;:`; fewer than 2
`relatedSlugs`; `hrdClaimable !== true` (tracked as "hrd-unconfirmed" — this is the
expected state until confirmed).

Report JSON records per-course status
(`review-pass` / `review-pass-with-warnings` / `review-fail`) and totals.

### 10.2 `qa:launch` post-build QA (scripts/launch-qa.mjs)

Run **after** `npm run build`; scans `dist/**` and writes
`dist/launch-qa-report.json`; exit 1 on any issue. Checks per HTML page:

- `html lang` present; `<title>` present (≤70 warn); meta description present
  (≤155 warn); **exactly one `<h1>`**; no duplicate `id`s.
- Required meta present: description, canonical, og:title/description/url/image,
  twitter:card/image.
- ≥1 JSON-LD block, all blocks parse as valid JSON.
- Every `<img>` has `alt` (error) and width/height (warning).
- Every internal `<a href>` resolves to a built route (broken-link error), and
  anchor hashes resolve to an existing `id` in the target page (broken-anchor error).
- `robots.txt` + all three sitemap files present in dist; every built course route is
  in `sitemap-courses.xml` and vice versa (no stale entries).
- Byte accounting: HTML/CSS/asset sizes, and **total script gzip bytes** (external JS
  files + inline scripts) — the budget target is ~50 KB gzip for the homepage-level
  script payload.

### 10.3 Correctness gates

There is **no test runner**. Correctness = `astro check` (types) + `courses:review`
(content) + `qa:launch` (built output). A change is "done" when all three pass.

---

## 11. Accessibility requirements (WCAG 2.2 AA working target)

- Semantic landmarks: single `<main>`, `<header>`/`<footer>`, labeled `<nav>`,
  `aria-label`ed asides.
- One H1 per page; logical heading order; eyebrow/kicker labels are `<p>`, not
  headings.
- All interactive patterns keyboard-operable: nav dropdown via `focus-within`; mobile
  menu works without JS; tabs implement `role=tablist/tab/tabpanel` +
  arrow/Home/End keys + `inert` on hidden panels; FAQ uses native
  `<details>/<summary>`; carousel buttons have `aria-label`s; catalog filter buttons
  expose `aria-pressed`; the HRD toggle is a real checkbox with a visible focus
  state; dynamic status lines use `aria-live="polite"`.
- Clearly visible focus indicator on every interactive element; ≥44px tap targets.
- Decorative panels/images: `aria-hidden="true"` or empty `alt`; meaningful images
  get real alt text (client names for logos).
- Full reduced-motion support at both CSS and JS levels (every island checks
  `matchMedia`); any auto-animating element (e.g. a logo marquee) degrades to a
  static or natively scrollable equivalent.
- `lang` per page: `en-MY` default, `ms-MY` for Bahasa Malaysia course pages.
- The public `/accessibility-statement` page documents the target, measures, known
  limitations, and a feedback channel.

---

## 12. Build, deploy & operations

1. `npm install`
2. `npm run build` → runs sitemap generation (prebuild), `astro check`, `astro build` → `dist/`
3. `npm run qa:launch` → must exit 0
4. Deploy `dist/` to static hosting behind `www.iconlearning.com.my` (any static host;
   no server runtime needed). Trailing-slash URLs are the canonical form
   (`/programs/{cat}/{slug}/`).
5. DNS/redirect migration from the legacy site is tracked separately: legacy URLs 301
   to the closest new route.

Operational notes:
- The featured-training block self-sunsets via `sunsetAt`; to feature a new run,
  update `publicTraining.ts`, add its slug to `register/[course].astro`'s
  `getStaticPaths`, update the Event JSON-LD dates, and rebuild.
- The registration Apps Script is deployed separately in Google Workspace; the site
  only needs its `/exec` URL in `.env`.
- Adding a course = drop a schema-valid JSON in `src/content/courses/`, run
  `courses:review`, rebuild (sitemap + catalog + course page + related links all
  derive automatically).

---

## 13. Editorial & product guardrails (carry these forward)

1. **Never fabricate**: no invented stats, counts, quotes, or outcomes. Empty is
   better than fake (see: empty testimonials, no-op ResultsGrid).
2. **HRD Corp claimable is confirm-only**: `false` until proven; the UI language for
   unconfirmed courses is always "Confirm during inquiry".
3. **Summary-only course pages**: module titles, never outline dumps — the outline is
   the conversion hook.
4. **Copy lives in `src/content/`**, templates in `.astro` — keep them separate.
5. **NAP consistency** via `site.ts` everywhere.
6. **JS budget** ~50 KB gzip; every new interactive feature must be an island with a
   working no-JS fallback and reduced-motion behavior.
7. **One coherent visual system**, applied consistently, meeting the §3 requirements —
   the specifics are the implementer's, but consistency and the AA floor are not
   optional.
8. **SEO is templated**: follow the title/description/JSON-LD recipes; deviations are
   deliberate decisions, not per-page creativity.

---

## 14. Suggested build order for a from-scratch implementation

1. Scaffold Astro + your styling setup + fonts; define your visual system against the
   §3 requirements.
2. `site.ts`, `BaseLayout` (head/meta/JSON-LD/analytics), `Nav`, `Footer`,
   `global-motion.ts` (§3.1, §5).
3. Primitives: Button, SectionHeading, BrandLogo (§6).
4. Content model: `schema.ts`, `programs.ts`, `courses/index.ts`, seed a handful of
   course JSONs (§4).
5. ProgramCard + `/programs` page + ProgramsCatalog island (§7.3, §8.1).
6. Category pages, then course pages with the SEO recipes and FAQ/JSON-LD generation
   (§7.4–7.5).
7. Contact page + ContactPanel + mailto island (§7.6).
8. Homepage sections (§7.2, §8.2–8.4).
9. About / Clients / Accessibility pages (§7.8).
10. FeaturedPublicTraining + registration page + Apps Script (§7.7).
11. Tooling: sitemap generator, courses:review, launch QA; robots/llms.txt (§9.3, §10).
12. Full content load (all course JSONs), `npm run build` + `qa:launch` green.
