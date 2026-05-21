# Icon Learning Website Redesign — Consolidated Design Doc

**Project:** Redesign `www.iconlearning.com.my`
**Reference feel:** `framer.com` homepage, adapted for Icon Learning's corporate training and ISO consultancy business
**Status:** Source of truth. Supersedes the three prior drafts in `archive/`.

This document reconciles three prior drafts:
- `archive/DESIGN_DOC_Codex.md` — product/IA spec; adopted as the umbrella.
- `archive/REDESIGN_SPEC_Claude.md` — implementation contract; adopted for the homepage.
- `archive/implementation_plan_Gemini.md` — early brainstorm; **superseded** (its dark-mode + glassmorphism + gradient-headline direction conflicts with the agreed visual language).

---

## 1. Goals

**Business**
1. Increase qualified inquiries for in-house training and consultancy.
2. Make HRD Corp claimable training prominent without making the site feel bureaucratic.
3. Improve trust and credibility for enterprise buyers.
4. Make program categories easier to browse.
5. Prepare the site for future content growth.

**User goals (HR, L&D, ops/quality/safety, business owners)**
- Understand what Icon Learning offers within 5 seconds.
- See whether training can be customized or HRD-claimed.
- Browse program categories.
- Trust the provider through proof, clients, experience.
- Contact someone quickly via WhatsApp / email / phone.

**Non-goals this pass**
- Dark mode (light theme only — see §4).
- Course detail pages beyond category-level templates.
- Blog / articles / lead magnets / i18n.

---

## 2. Information Architecture

### 2.1 Sitemap (MVP)

- `/` — Homepage
- `/programs` — Program catalog (search + filter across ~180 courses)
- `/programs/[category]` — Program category detail
- `/programs/[category]/[course]` — Individual course detail page (modules, objectives, audience, methodology, HRD claimable badge). Source content lives in `course/documents/*.pdf`; ingestion process per §7.5.
- `/about-us`
- `/clients`
- `/contact`
- `/accessibility-statement`

Future: `/resources`, `/case-studies/[slug]`.

### 2.2 Global navigation

Desktop: Logo · Programs · Solutions · About · Clients · Contact · **Request training** (primary CTA).
Mobile: Logo left · menu button right · sheet menu · sticky **WhatsApp us** CTA inside menu.

Behavior: sticky at top, transparent over hero, translucent warm-white + blur + 1px hairline after 80px scroll (sentinel-based, no scroll listener). Height 64–72px desktop, 56–64px mobile.

---

## 3. Tech Stack

- **Astro** static site (small interactive islands only).
- **Tailwind** for utility classes; `tokens.css` for CSS variables.
- Self-hosted **Inter Variable** via `@fontsource-variable/inter`.
- Deploy via existing GitHub PR workflow.
- Client JS budget: **< 50 KB gzip** for the whole homepage.

Islands are isolated to: mobile nav, program tabs, search/filter, optional carousel, optional bento parallax, form validation, count-up, reveal-on-scroll observer.

---

## 4. Visual System

### 4.1 Theme

**Light only.** Warm off-white background, near-black ink, purple as a sparse accent. **No dark mode.** No glassmorphism, no gradient mesh, no glowing orbs, no decorative gradient blobs.

If dark mode is added later, invert via `[data-theme="dark"]` on `:root`.

### 4.2 Color tokens

| Token | Value | Usage |
|---|---:|---|
| `--color-bg` | `#FBFAF8` | Main page background — warm off-white |
| `--color-surface` | `#FFFFFF` | Cards, panels, nav after scroll |
| `--color-surface-muted` | `#F2F0EB` | Alternate bands |
| `--color-ink` | `#0A0A0A` | Primary text and headlines |
| `--color-ink-muted` | `#666666` | Body paragraphs, secondary copy |
| `--color-ink-dim` | `#9A9A9A` | Meta, captions |
| `--color-ink-inverse` | `#FBFAF8` | Text on dark CTA fills |
| `--color-border` | `#E8E5DE` | Hairline borders |
| `--color-border-strong` | `#D8D4CA` | Strong separators (footer top, section ends) |
| `--color-accent` | `#7C3AED` | Sparse brand accent — focus rings, micro-accents |
| `--color-accent-soft` | `#F1ECFF` | Active tab background, subtle highlights |
| `--color-success-soft` | `#E9F8EF` | HRD claimable badge |
| `--color-warning-soft` | `#FFF3D8` | Certification / important note badges |
| `--shadow-sm` | `0 1px 2px rgba(10,10,10,0.04)` | Card resting |
| `--shadow-md` | `0 8px 24px rgba(10,10,10,0.08)` | Card hover |

**Rules**
- Primary CTAs are **black**, not purple. Purple is an accent, not the theme.
- Headlines render in a single colour. No gradient text. No two-tone splits. No inline accent words.
- Colour comes from photography, logos, and small accents — not from large decorative fills.

### 4.3 Typography

Self-hosted **Inter Variable**, weights 400/500/600/700/800.
Apply `font-feature-settings: 'cv11', 'ss01', 'ss03'` to nudge closer to Framer's quirks.
Fallback: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`.

| Token | Size / weight | Usage |
|---|---|---|
| `display-xl` | `clamp(2.5rem, 5vw, 4rem)` / 700 / -0.02em / 1.05 | Hero headline |
| `display-lg` | `clamp(2rem, 3.5vw, 3rem)` / 700 / -0.02em / 1.1 | Section headings |
| `display-md` | `clamp(1.5rem, 2.5vw, 2rem)` / 600 / -0.01em / 1.2 | Stripe / tab content title |
| `body-lg` | `1.125rem` / 400 / 1.55 | Hero subtitle, section intros |
| `body` | `1rem` / 400 / 1.6 | Paragraph copy |
| `body-sm` | `0.875rem` / 400 / 1.5 | Card meta, captions |
| `eyebrow` | `0.75rem` / 500 / 0.08em / uppercase | Tab labels, micro-headings |

Line lengths: ≤ 10–12 words for large headlines, 56–72 characters for body.

### 4.4 Layout

- Page max-width `1280px`, wide visual width `1440px`. Side gutters `clamp(1rem, 4vw, 4rem)`.
- Section padding `clamp(4rem, 8vw, 7.5rem)` top + bottom.
- Border radius: `12px` (small), `20px` (standard cards), `28px` (large feature surfaces / bento), `999px` (buttons).
- Breakpoints: `640px`, `1024px`, `1280px`, `1440px`.

### 4.5 Motion

Vocabulary: hover lifts, scroll-spy active states, reveal-on-scroll fades, sticky-nav backdrop, optional bento column parallax.

**Global rules**
- Gated behind `@media (prefers-reduced-motion: no-preference)`.
- Reduced-motion: no parallax, no count-up, no reveal fades, no smooth scroll, no scroll-spy label cross-fade (the active-class toggle still happens — just instantly). Bento collapses to a static grid.
- Animate only `transform`, `opacity`, occasionally `filter`.
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` (entrances); `cubic-bezier(0.4, 0, 0.2, 1)` (hover/state).
- Timing: hover 180ms; content reveal 500–650ms; tab transition 250–350ms.

| Trigger | Element | Property | Duration |
|---|---|---|---|
| Page load | Hero stack | opacity 0→1, translateY(12px)→0 | 500ms, staggered 60ms/child |
| Scroll (threshold 0.15) | Section headings + body | opacity 0→1, translateY(16px)→0 | 600ms, one-shot |
| Continuous scroll | Bento columns | `transform: translateY()` driven by scroll progress | column 1 @ 0.85 up, column 2 @ 0.5 down, column 3 @ 0.7 up — use CSS Scroll-Driven Animations first, JS fallback only if unsupported |
| Scroll (threshold 0.4) | Stat numbers | count 0→target | 1200ms ease-out, rAF, fires once |
| Vertical scroll through `CoursesTabbed` right column | Sticky label (left col) | `color: --color-ink-dim → --color-ink`; supporting summary `opacity 0→1, translateY(4px)→0` | 250ms ease-out — IntersectionObserver toggles `.active`; reduced-motion users get instant class flip (no fade). |
| Click on sticky label | Window | `scrollIntoView({ behavior: 'smooth', block: 'start' })` on target block | native — `scroll-margin-top: var(--nav-height)` on each block; reduced-motion: instant. |
| Hover bento card | Card / image | translateY(-4px) scale(1.01) / image scale(1.03), shadow sm→md | 250ms / 400ms |
| Scroll past 80px | Nav | bg transparent → rgba(251,250,248,0.8) + backdrop-blur(12px) | 200ms |
| Nav anchor click | Window | `scrollTo({ behavior: 'smooth' })` | native, reduced-motion override |

**No custom cursor. No gradient text. No glassmorphism (translucent nav is the only blur surface).**

---

## 5. Component System

```
src/
  layouts/
    BaseLayout.astro
  components/
    layout/
      Nav.astro
      Footer.astro
    sections/
      Hero.astro
      BentoMasonry.astro
      BentoMasonry.client.ts          ← parallax island
      CoursesTabbed.astro
      CoursesTabbed.client.ts         ← tab switching island
      FeatureStripe.astro
      ApproachSection.astro
      ResultsGrid.astro
      ResultsGrid.client.ts           ← count-up island
      Testimonials.astro
      Testimonials.client.ts          ← carousel island
      CtaCloser.astro
    primitives/
      Button.astro
      Card.astro
      SectionHeading.astro
      TabBar.astro
      LogoWall.astro
    programs/
      ProgramCard.astro
    contact/
      ContactPanel.astro
  content/
    site.ts
    navigation.ts
    home.ts
    programs.ts
    clients.ts
    testimonials.ts
    contact.ts
  pages/
    index.astro
    programs/
      index.astro
      [category].astro
    about-us.astro
    clients.astro
    contact.astro
    accessibility-statement.astro
  styles/
    tokens.css
    global.css
```

### 5.1 Primitives

**`Button.astro`**
Variants: `filled-ink` (black fill, default primary — used on hero, nav CTA, closer), `filled-accent` (purple, used sparingly), `outline` (transparent + `--border-strong`), `ghost` (text + arrow).
Pill shape (`999px`), padding `0.65rem 1.25rem` (md) / `0.85rem 1.75rem` (lg). Focus-visible ring in `--color-accent`. Hover: shadow + scale `1.01`, 200ms.

**`Card.astro`**
Variants: `flat` (no shadow), `raised` (default — `--shadow-sm` resting, `--shadow-md` hover, `20px` radius), `media`, `proof`, `program`. Entire card clickable when `href` set; hover states require matching focus states.

**`SectionHeading.astro`**
Props: `eyebrow?`, `heading`, `description?`, `align: 'left' | 'center'` (default `left`), `size: 'lg' | 'xl'` (default `lg`). Eyebrow renders with small `--color-accent` dot prefix.

**`TabBar.astro`**
Tab buttons row, `body-sm` weight 500, padding `0.5rem 1rem`. Active tab marked by a single absolutely-positioned `<span>` with `--color-accent-soft` background that slides between positions via `translateX` (not per-button class toggle). `aria-selected="true"` on active; Arrow Left/Right cycle.

**`LogoWall.astro`**
List of logos with alt text, consistent tile sizes, grayscale by default, accessible names preserved.

### 5.2 Sections

**`Nav.astro`** — Sticky, sentinel-based backdrop transition. Logo left, 4–5 center links (`body-sm`, `--color-ink-muted` → `--color-ink` on hover with 1px underline at `6px` offset), `filled-ink` CTA right. Mobile: hamburger → `<details>` drawer with same links + WhatsApp sticky CTA.

**`Hero.astro`**
```
Props:
  eyebrow?: string
  headline: string         // single line, no colour-split
  sub: string              // 1–2 sentences, max 38ch
  primaryCta: { label, href }
  secondaryCta: { label, href }
```
Centred stack, plain `--color-bg`. Padding `clamp(5rem, 9vw, 8rem)` top / `clamp(3rem, 6vw, 5rem)` bottom. No background texture, no vignette. Optional 6px `--color-accent` dot above eyebrow as the single decorative element.

**`BentoMasonry.astro`** — combined trust + proof wall.
3-column masonry desktop / 2 tablet / 1 mobile. Items: `image | logo | quote | video`, with `columnHint` and `rowSpan` driving the irregular rhythm. Cards: `28px` radius, `--shadow-sm` resting → `--shadow-md` hover. Multi-column parallax via CSS Scroll-Driven Animations (JS fallback). At least 8 items needed to feel populated — fill gaps with quote and logo cards if assets are thin.

**`CoursesTabbed.astro`** — Program category showcase, **scroll-spy variant**. Adopts the Framer pattern: pinned vertical labels on the left, scroll-linked active state, tall content blocks on the right.

Outer `<section>` carries `id="categories"`. Each right-column block carries `id="category-{slug}"` (e.g. `#category-quality-lean-food-safety`) so marketing campaigns and external links can deep-link directly to a specific category within the showcase. Direct-URL navigation jumps (browser-default); internal clicks smooth-scroll per §4.5.

**Layout (desktop ≥ 1024px):**
- 2-column grid: left ~32% (sticky), right ~68% (scrollable).
- **Left column** (`position: sticky; top: calc(var(--nav-height) + 4rem)`): 6 category labels stacked vertically. Each label is a `<button>` with:
  - Category name in `display-md`, `--color-ink-dim` when inactive, `--color-ink` + weight 600 when active.
  - 1-sentence summary (~14–18 words) hidden when inactive (`opacity: 0; max-height: 0`), revealed when active (`opacity: 1`, full height, `--color-ink-muted` body copy). 250ms ease-out cross-fade.
  - A 4px-wide left rule in `--color-accent` fades in on active.
- **Right column**: 6 stacked content blocks, one per category. Each block is `min-height: 90vh` (so the active label has time to register before the next block starts) and contains:
  - Category hero image — workshop photo, slide preview, or representative media. `28px` radius, `--shadow-sm`.
  - Eyebrow + heading (`display-md`) + 2-sentence intro.
  - 3–5 sample course cards linking to `/programs/[category]/[course]`.
  - CTA: `Explore {category} →` linking to `/programs/[category]`.

**Behavior:**
- IntersectionObserver watches each right-column block with `rootMargin: '-30% 0px -60% 0px'` so the active label changes when a block crosses ~30% from the top of the viewport. Marks one and only one label as `.active` at any time.
- Click on a sticky label → `scrollIntoView({ behavior: 'smooth', block: 'start' })` on its block. `scroll-margin-top: var(--nav-height)` on each block handles the sticky-nav offset.
- Both interaction modes (scroll-driven and click-driven) toggle the same `.active` class, so the visual state stays unified.

**Mobile (< 1024px):**
- No sticky, no scroll-spy.
- Section collapses to a vertical stack of category cards: each block renders its own inline heading at the top (the left-column label content embeds inline).
- 1-sentence summary is always visible on mobile (no reveal).

**Reduced-motion:**
- Click-to-scroll is instant (no smooth scroll).
- Active-label cross-fade is instant (class toggle still fires; the visual transition is suppressed).
- IntersectionObserver mechanic remains — it's a state toggle, not animation.

**No-JS fallback:**
- All 6 blocks render fully (they would anyway).
- Left column renders all 6 labels with their summaries always visible.
- No active-state changes; the section becomes a long catalog preview with stable section anchors.

**JS island:** `CoursesTabbed.client.ts`. IntersectionObserver setup + click-to-scroll handler. < 1 KB gzipped.

**Categories rendered (top 6 from §7.1):**
- Leadership, Management & Coaching
- Quality, Lean & Food Safety
- Safety, Health & Environment
- HR & Employment Law
- Microsoft, AI & Digital Skills
- Sales, Marketing & Customer Service

The remaining three categories (Finance & Taxation; Supply Chain & Shipping; Communication & Personal Effectiveness) are reachable via the `/programs` catalog. A `Browse all 9 categories →` CTA closes the section.

**Section height note:** the section is intentionally tall (~5–6 viewports on desktop). This is the editorial centrepiece of the homepage after the hero and bento — give it room. If the homepage feels too long after assembly, narrow to 4 marquee categories before reducing block heights.

**`ApproachSection.astro` / `FeatureStripe.astro`**
Composes 3 stripes alternating image left/right. Stripes for Icon: Discover → Customize → Deliver → Reinforce (combine 3–4 stripes; copy in §7). `display-md` headings, tighter padding rhythm between stripes so they read as a sequence. Mobile: image always above text.

**`ResultsGrid.astro`** — Outcomes / proof.
4 cards in `grid-cols-4` (desktop) / `grid-cols-2` (tablet) / `grid-cols-1` (mobile). White surface, `--color-border`, `20px` radius, `2rem` padding. Numbers in `display-md` weight 700, count up over 1200ms on viewport entry (threshold 0.4, one-shot, rAF). **Use verified-only values** (see §7) — do not fabricate trainee/client counts. Non-numeric proof renders without count-up.

**`Testimonials.astro`**
Heading left, prev/next 40px circle buttons right. Horizontal scroll track with `scroll-snap-type: x mandatory`, ~1.8 cards visible on desktop. Cards: `--color-surface`, `--color-border`, `20px` radius, `2rem` padding, avatar + name (weight 600) + role (`body-sm` muted) + quote (`body`). Hover lift 2px.

**`CtaCloser.astro`**
Compact centred card on `--color-surface-muted` band. Max 720px. White surface, `20px` radius, `3rem` padding. `display-lg` heading, `body-lg` sub, primary (WhatsApp) + secondary (email) CTAs. No heavy dark banner.

**`Footer.astro`**
Same `--color-bg` as page (or `--color-surface-muted`). Single `--color-border-strong` line at top. 4–5 columns of links (`eyebrow` titles + `body-sm` link stacks in `--color-ink-muted` → `--color-ink` on hover). Left column: logo + tagline + socials. Bottom row: copyright + "Made with Astro" link. No newsletter signup, no AI-summary helper.

---

## 6. Page Specifications

### 6.1 Homepage — section order

1. **Hero** — eyebrow `HRD Corp claimable training provider`, H1 `Corporate training that moves work forward`, sub `Icon Learning helps Malaysian teams build practical skills through HRD-claimable programs, ISO consultancy, and customized in-house training.`, primary `Request training`, secondary `View programs`.
2. **Trust/proof bento** — client logos + HRD Corp claimable badge + "Since 2011" proof card + ISO consultancy card + workshop photos + short testimonial quotes.
3. **Program category showcase** (`CoursesTabbed`) — scroll-spy section with sticky left labels and tall right-column content blocks (Framer-style). 6 categories from §5.2; section is ~5–6 viewports tall on desktop, collapses to a vertical card stack on mobile. Each block links through to `/programs/[category]`; section closes with a `Browse all 9 categories →` CTA.
4. **Services / solutions bento** — 3 cards: Corporate Training Programs · ISO & Quality Management Solutions · Technical & Safety Training. Bento (one large + two smaller), not equal cards.
5. **Training approach** (`ApproachSection`) — Discover · Customize · Deliver · Reinforce.
6. **Outcomes & proof stats** — verified only (§7).
7. **Testimonials** carousel (if approved quotes available — otherwise omit and lean on bento quotes).
8. **CTA closer** — heading `Ready to plan your next training?`, primary `WhatsApp us`, secondary `Email inquiry`.
9. **Footer**.

**Anchor IDs (homepage sections).** Every section carries a stable `id` so marketing campaigns, transactional emails, and external links can deep-link without ambiguity:

| Section | `id` |
|---|---|
| Hero | `hero` |
| Trust/proof bento | `proof` |
| Program category showcase (`CoursesTabbed`) | `categories` |
| Services / solutions bento | `services` |
| Training approach | `approach` |
| Outcomes & proof stats | No public anchor; `ResultsGrid` intentionally does not use `id="outcomes"` |
| Testimonials | `testimonials` |
| CTA closer | `contact-cta` |

The global nav's `Programs` link still routes to `/programs` (the full catalog) regardless of current page — anchor-scroll-on-homepage behavior is **not** mixed in, to keep the nav predictable. Deep links use `/#categories`, `/#approach`, etc., explicitly.

### 6.2 Programs catalog (`/programs`)
Top: page title, short explanation, search input across all course titles + topics, category filter chips, duration chips (`½ day`, `1 day`, `2 days`, `3 days`), `HRD Corp claimable` toggle, language toggle (English / Bahasa Malaysia), quick contact CTA.

Body: dense grid of ~180 `ProgramCard` instances. Each card shows course title, category, duration, HRD claimable badge (where confirmed), one-sentence overview, and audience tagline. Card click navigates to the course detail page (§6.4).

Two view modes: by **category** (default, grouped accordions of the nine categories from §7.1) and **flat list** (alphabetical). Search collapses both into a single filtered result list.

### 6.3 Program category detail (`/programs/[category]`)
Two-column desktop layout. Sections: category hero · overview · course list (grouped by sub-theme when the category has 15+ courses) · who should attend · delivery formats · related categories · sticky inquiry panel right.

Each course in the list renders as a `ProgramCard` linking through to its detail page (§6.4).

Example — **Supply Chain, Shipping & Warehousing**:
- Warehouse Management & Inventory Control
- Effective Store and Warehouse Management
- Mastering Incoterms 2020 Rulings
- Fundamentals of Shipping

Audience: supply chain professionals, logistics managers, import/export officers, procurement teams, business owners.

Example — **Quality, Lean & Food Safety** (large category, render with sub-headings):
- *ISO Management Systems:* ISO 9001 QMS, ISO 9001 Awareness, ISO 9001 Internal Quality Auditing, ISO 9001 Strategic Risk-Based Thinking, ISO 14001 Awareness, ISO 14001 Lead Auditor.
- *Food Safety & Halal:* HACCP, HACCP Internal Quality Audit, GMP / MS 1514-2022, FSSC 22000, Halal Certification, Food Handler Training (English + Bahasa Malaysia variants), Sertu Workshop.
- *Lean & Quality Tools:* 5S, 6S, 7QC Tools, Six Sigma Awareness, Statistical Process Control, FMEA, Lean Manufacturing, Total Productive Maintenance, Root Cause Analysis, GD&T.
- *Problem Solving:* Critical Thinking in Problem Solving & Decision Making, Synergized Problem Solving Using Analytical Methods.

Where a category covers multiple disciplines (Quality + Food Safety + Halal here), group courses under sub-headings inside the single category page rather than splitting the URL.

### 6.4 Course detail (`/programs/[category]/[course]`)

The marketing-led view of a single course. **Summary only, never the full outline** — the page publishes a punchy precis and converts visitors into inquiries; the full PDF is delivered as the inquiry reply. Source content lives in `course/documents/*.pdf` (see §7.5 for the ingestion + rewrite pass).

**Sections (vertical, in order):**

1. **Course hero** — title (`display-lg`), one-line positioning (`body-lg` muted, often rewritten from the PDF subtitle), badges row: `HRD Corp claimable` (where confirmed), duration (`1 day` / `2 days` / `3 days`), language, delivery formats. CTA pair: **`Get the full outline`** (primary, `filled-ink`) + `WhatsApp us` (secondary, `outline`).
2. **"Why this matters"** — eyebrow + one short punchy paragraph (~40–60 words). Distilled from the PDF overview but rewritten to lead with the *problem the course solves*, not the course itself.
3. **"Built for"** — 3–5 short audience pills, one phrase each (not full sentences). E.g. *HR teams onboarding new hires* · *Operations leads chasing ISO 9001 readiness* · *SME owners worried about phishing*.
4. **"What you'll walk away with"** — 3–5 outcome bullets, one line each, action-oriented and specific. E.g. *Spot a phishing email in under five seconds* · *Set up MFA on every account that matters* · *Run a PDPA-ready clean-desk policy from day one*.
5. **"Inside the workshop"** — **module titles only**, grouped by day for multi-day courses. Single line per module; catchy rewrite of the source PDF module title. **No topics, no activities, no time slots.** Example for *Human Firewall* — *Day 1 · Threats up close · Spotting phishing in the wild · Passwords that actually work · Safer browsing & email by default* — *Day 2 · Data protection without the legalese · Securing phones & remote work · When something goes wrong · Your first 30 days*.
6. **"How it runs"** — methodology mix as a single horizontal bar (Interactive / Hands-on / Group / Demo / Role-play / Self-assessment) with a one-line caption, e.g. *"Mostly hands-on (60%) — you do, then we discuss."* CSS only, no chart library.
7. **"Bring it to your team"** — closer card. Heading + one-sentence nudge (*"Tell us your team size and dates — we'll send the outline and a quote."*), `Get the full outline` primary, `WhatsApp us` secondary.

**Deliberately NOT on the page:**
- Topic-by-topic breakdown inside each module.
- Activity lists, role-play scripts, exercise specifics.
- Prerequisites detail and what-to-bring (those live in the PDF and the inquiry reply).
- Full Knowledge / Skills / Behaviors / Outcomes wall (compressed into "What you'll walk away with").

**Copy tone:** punchy, second-person, plain-language. Avoid corporate-training cliché ("unlock potential", "synergize"). Mirror the source PDFs' good phrasing where it already lands (Human Firewall's "Spot the Phish" is gold — keep it). Every course's rewritten summary needs a brief Icon Learning review to ensure it still represents the trainer's intent.

**Layout:** single column mobile; two columns desktop with a sticky inquiry panel in the right column. The inquiry panel re-surfaces badges, duration, HRD claimable status, and the `Get the full outline` button so the conversion path is always visible.

**Behavior:**
- No accordions, no day tabs, no print stylesheet — the page is short enough to scan in one scroll.
- Clicking `Get the full outline` opens the inquiry form with *Training interest* pre-filled with the course title. The reply from Icon Learning attaches `course/documents/[slug].pdf` (or its successor JSON-rendered equivalent). See §13 for the auto-attach vs. manual-send open question.
- No-JS fallback: identical layout (nothing to enhance).

### 6.5 About (`/about-us`)
Sections: hero · company story (established 15 December 2011) · what Icon Learning does (corporate training, strategic consulting, ISO management system consultancy) · training philosophy · trainer expertise · values · CTA. Brand line: *"Transforming people. Powering performance. Delivering results."*

### 6.6 Clients (`/clients`)
Hero `Trusted by teams across Malaysia` · logo wall grouped by industry where possible · engagement types (corporate training, ISO consultancy, safety/technical) · optional testimonials · CTA. Grayscale logos at consistent tile sizes; hover reveals industry/engagement type when available. Existing logos include Acer, Cuckoo, Perodua, Proton, Publicis, Tesco.

### 6.7 Contact (`/contact`)
Split layout: form left, contact cards right. Mobile: contact actions before form.
Form fields: Name · Company · Email · Phone/WhatsApp · Training interest · Team size · Preferred format · Message.
Contact cards: WhatsApp, email (`jane@iconlearning.com.my`), phone (`+6012-3245 938`), address (`No 1, Jalan Radin 5, 57000 Sri Petaling, Kuala Lumpur`), hours (`Monday–Friday, 09:00–18:00`).

### 6.8 Accessibility statement (`/accessibility-statement`)
Replace template placeholders with: WCAG 2.2 AA target, contact email, last-updated date.

---

## 7. Content

### 7.1 Program categories

Nine top-level categories, derived from the actual catalog in `course/documents/`:

1. **Leadership, Management & Coaching** — Leadership Boot Camp, Leadership + People Management, Leadership & Motivation for High Performance, Leaders of Tomorrow, Leadership Skills of Highly Effective Supervisors, Supervisory Development Program, Management Development Program, Key Competencies for Manager, What it Takes to be an Effective Manager, Coaching & Mentoring (Leadership Success / Organization Effectiveness), Coaching Skill – How to Develop Your People, Change Management, Embracing Change, Strategic Management & Execution, Strategic Planning Mission, Business Strategy in a VUCA World, Managing Business Focus, Performance Management, Performance Management via KRA and KPI, KPI Awareness, Motivation for High Performance, Mindset Change for High Performance, Leading & Managing the Whole New Self.
2. **HR & Employment Law** — HR for Non-HR Managers, Payroll Management & Compliances, Understanding the Labour Law, Application of Employment Act – Absenteeism & Misconduct, Understanding & Applications of Employment Act 1955, Legal Compliances for Employment Contract Stamping, New Quota Application & Recruitment Process, How to Conduct a Domestic Inquiry, Dealing with Disciplinary Action at Workplace, Employee Handbook, PDPA, Anti-Bribery & Anti-Corruption.
3. **Finance, Accounting & Taxation** — Business Financial Skills for Non-Finance Personnels, Credit Control Management, UBS Accounting & Billing, Understanding Transfer Pricing Fundamentals, Understanding the Implication & Impact of E-Invoicing, Fundamental Analysis for Stock Market.
4. **Supply Chain, Shipping & Warehousing** — Warehouse Management & Inventory Control, Effective Store & Warehouse Management, Mastering Incoterms 2020 Rulings, Fundamentals of Shipping.
5. **Quality, Lean & Food Safety** — ISO 9001 (QMS, Awareness, Internal Auditing & Report Writing, Strategic Risk-Based Thinking, "Awareness in the New QMS"), ISO 14001 (Awareness + Lead Auditor), HACCP, HACCP Internal Quality Audit, GMP, MS 1514-2022 GMP, FSSC 22000 V6, Halal Certification (Kursus Persijilan Halal), Halal Competency Training, Food Handler Training, Kursus Pengendalian Makanan (Bahasa Malaysia), Sertu Workshop, GMP & Allergen Management Awareness, 5S, 6S, 7QC Tools, Six Sigma Awareness, Statistical Process Control, FMEA, Lean Manufacturing, Total Productive Maintenance, Root Cause Analysis, GD&T, Critical Thinking in Problem Solving & Decision Making, Synergized Problem Solving.
6. **Safety, Health & Environment (OSH)** — Occupational Safety & Health at Workplace, OSH Coordinator (OSH-C), Safety & Health Committee, EHS Committee Workshop, Hazard Identification Risk Assessment & Risk Control (HIRARC), Schedule Waste Management, Hearing Loss Prevention, Noise & Hearing Conservation, Chemical Safe & Right Use of PPE, Safety Signage, Forklift Truck Safety, Overhead Crane Operation Safety, Fire Safety Training for Fire Squad, First Aid CPR at Work, Defensive Driving, Defensive Driving OSH Practice for Truck Drivers, Electrical Safety Awareness & Risk Management, Emergency Response Planning, Safety & Health Awareness, Healthy Workplace Happier Employees.
7. **Microsoft, AI & Digital Skills** — Microsoft Excel (Beginner, Intermediate 1D, Intermediate 2D, Functions & Formulas, Advanced Conditional Formatting, Visualize Dashboard, Maximizing Excel Tools), Microsoft Outlook, Power BI Desktop, **Work Smarter, Prompt Better** (AI / prompt engineering), **Human Firewall Initiative** (cybersecurity awareness), **Regex AI**, CyberSecurity Best Practices, Digital Transformation – IR4.0.
8. **Sales, Marketing & Customer Service** — High Impact Selling Skills, Automobile Sales Training (Realigning the Drive Mindset), Realigning the Drive Mindset, How Marketing Works to Build Business, Digital Marketing Zero to Hero, AI Marketing, Lead Generation Using Social Media Marketing, TikTok Marketing Training, Get More Retail & Walk-In Sales with the Power of TikTok, Customer Care Workshop, Customer-Centric Development Program, Complaints Management, 1st Class Hospitality Service, Telephone Courtesies & Effectiveness, Improving Negotiation.
9. **Communication, Teamwork & Personal Effectiveness** — The Power of Effective Communication, Excellent Interaction Skills, Communicate and Engage Using NLP, Reader-Centric Business Writing, Effective Reports Writing for Business, English for the Workplace, Conflict Management & Resolution, Power of Emotional Intelligence in Conflict Management, Developing Effective Time Management, Time/Stress/Anger Management, Teambuilding for High Performance (1/2/3-day variants), Teambuilding – Teamwork That Works, Team-Building Dynamic Team, Building an Engaged Team, Building Positive Influence, Positive Work Attitude, Stay Resilient & Bouncing Back, Transforming Your Life to a New Norm, Authentic, Dynamic Personal Development for Work Excellence, Corporate Image & Grooming, 10 Key Tools for Work Success, Managing Self and Others with DC Psychology, Trainer Skill Enhancement Workshop, Change Your Habits Change Your Life, Effective Filing, Record Filing, Effective Management & Office Administration.

**Homepage tab strip** (`CoursesTabbed`) surfaces the top 6: Leadership & Management · Quality, Lean & Food Safety · Safety, Health & Environment · HR & Employment Law · Microsoft, AI & Digital · Sales, Marketing & Service. The remaining three are reachable via the `/programs` catalog page and search.

**Language note:** several courses (Halal certification, food handler training) have Bahasa Malaysia variants. Surface via a `language: 'en' | 'ms' | 'en+ms'` field per the Course type (§7.4); the catalog filter exposes a language toggle. See §13 open questions for the URL strategy.

### 7.2 Stats — verified only

Use only what can be substantiated. Placeholder set until confirmed:
- `14+` years since establishment (since 15 December 2011).
- `HRD` claimable programs.
- `ISO` consultancy and training expertise.
- `Public & in-house` delivery formats.

**Do not fabricate** trainee counts, client counts, satisfaction scores, or training-hour totals. If numeric proof isn't available, render the card as qualitative text (no count-up).

### 7.3 Approach copy (placeholder, TODO confirm)
1. **Discover** — understand team needs and business context.
2. **Customize** — adapt content for public, in-house, or blended delivery.
3. **Deliver** — practical workshops led by experienced trainers.
4. **Reinforce** — post-training action plans, assessments, follow-up.

### 7.4 Content model

```ts
type ProgramCategory = {
  slug: string;
  title: string;
  summary: string;
  audience: string[];
  topics: string[];
  deliveryFormats: Array<'Public' | 'In-house' | 'Workshop' | 'Certification' | 'Blended'>;
  hrdClaimable?: boolean;
  relatedSlugs?: string[];
};

// Summary-only course model — see §6.4 for what's deliberately NOT rendered.
// The full outline lives in the source PDF and is delivered via the inquiry reply.

type CourseModule = {
  day?: number;                    // 1, 2, 3 for multi-day courses
  title: string;                   // CATCHY one-line rewrite of the source module title
};

type CourseMethodologyMix = {       // percentages sum to ~100; rendered as a single horizontal bar
  interactiveLectures?: number;
  handsOnExercises?: number;
  groupActivities?: number;
  demonstrations?: number;
  rolePlaying?: number;
  selfAssessment?: number;
};

type Course = {
  slug: string;
  title: string;
  subtitle?: string;               // one-line positioning, often rewritten from the PDF subtitle
  categorySlug: string;            // FK to ProgramCategory.slug
  durationDays: number;            // 0.5, 1, 2, 3
  hrdClaimable: boolean;           // surface badge only when confirmed
  language: 'en' | 'ms' | 'en+ms';
  deliveryFormats: Array<'Public' | 'In-house' | 'Workshop' | 'Certification' | 'Blended'>;
  whyThisMatters: string;          // 1 paragraph, ~40–60 words, rewritten — leads with the PROBLEM, not the course
  builtFor: string[];              // 3–5 audience pills, phrase-level (not full sentences)
  walkAwayWith: string[];          // 3–5 outcome bullets, one line each, action-oriented
  modules: CourseModule[];         // titles only
  methodology?: CourseMethodologyMix;
  methodologyCaption?: string;     // one-line summary, e.g. "Mostly hands-on (60%) — you do, then we discuss."
  sourceDoc: string;               // canonical PDF path, used as the inquiry reply attachment
  relatedSlugs?: string[];         // 3–4 related courses for cross-linking
};

type ClientLogo = {
  name: string;
  logoSrc: string;
  industry?: string;
  alt: string;
};

type Testimonial = {
  quote: string;
  name?: string;
  role?: string;
  company?: string;
};

type SiteContact = {
  address: string;
  email: string;
  phone: string;
  whatsapp: string;
  openingHours: string;
};
```

All copy lives in `src/content/*.ts`. Component files contain no hard-coded strings beyond accessibility labels. Course content is the exception — it lives in `src/content/courses/*.json` (one file per course), generated from the ingestion pass in §7.5.

### 7.5 Course ingestion

**Source:** `course/documents/` contains ~180 unique course outlines, with most courses present in multiple formats (`.pdf`, `.docx`, occasionally `.doc`). Some courses also have a matching `*_Itinerary.pdf` covering the per-time-slot schedule.

**Canonical format: PDF.** The DOC/DOCX variants are typically earlier drafts and should be treated as redundant. The `.pptx` outlier and the "Itinerary" documents are supplementary references, not the canonical outline.

**The web page is summary-only (§6.4), so ingestion is a *rewrite pass*, not a faithful extraction.** Topic lists, activity bullets, and the full Knowledge/Skills/Behaviors/Outcomes wall do **not** get extracted — they live on in the source PDF, which is the inquiry reply attachment.

**Ingestion approach** (one-shot, not a build step):

1. **Curation pass (manual review by Icon Learning).** For each course, confirm the canonical outline file. Resolve duplicate-with-variant filenames carefully — `Teambuilding For High Performance 2days` and `…3days` are *different courses* and both should be ingested with distinct slugs; whereas `Teambuilding For High Performance 3days.doc` and `Teambuilding For High Performance 3days .doc` differ only in trailing whitespace and should de-dupe to one canonical file.
2. **Rewrite pass.** For each canonical PDF, produce one `src/content/courses/[slug].json` per the `Course` type in §7.4. The job is *summarisation + rewriting*, not transcription:
   - `whyThisMatters` — write fresh (40–60 words), leading with the problem the course solves.
   - `builtFor` — pick 3–5 audience phrases from the PDF's "Target Audience" list, condensed.
   - `walkAwayWith` — pick 3–5 outcomes from the PDF's Objectives + Learning Outcomes, rewritten action-oriented and specific.
   - `modules` — one catchy one-liner per module (NOT the source module title verbatim; rewrite).
   - `methodology` + `methodologyCaption` — pull the percentages, write a one-line caption.
   - Everything else stays in the source PDF.
   An LLM-assisted first pass is sensible given the volume; **every extracted file must then be reviewed by Icon Learning** before publish for accuracy of intent and brand voice.
3. **Authoring layer.** After the first extraction, treat the JSON as authoritative. Future edits go to the JSON, not back to the source PDFs. Keep `sourceDoc` populated so the original is always one click away — and so the inquiry reply has a file to attach.

**Course slug convention:** kebab-case from title, with a duration suffix when multiple variants exist for the same title — e.g. `teambuilding-for-high-performance-2d`, `teambuilding-for-high-performance-3d`. Avoid appending language suffixes (`-bm`); the `language` field handles that. Stand-alone Bahasa Malaysia courses without an English equivalent keep their original-language slug (`kursus-pengendalian-makanan`).

**HRD claimable defaulting:** the canonical PDFs reliably mark `HRD Corp Claimable Course` on the title page when applicable. Where unmarked, do not assume — flag for Icon Learning to confirm. Surface the badge only when explicitly confirmed; otherwise omit.

**Out of scope for ingestion:** trainer bios, photos embedded in the PDFs (use the existing image library), and any company-specific case-study content present in older variants — those need a separate curation pass.

---

## 8. Accessibility

Target: **WCAG 2.2 AA**.

- Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`).
- Proper heading hierarchy, one H1 per page.
- Keyboard accessible menus, tabs, filters, carousel.
- Visible focus-visible rings in `--color-accent`.
- Meaningful alt text on content images; empty alt on decorative.
- AA contrast minimum.
- Reduced-motion support per §4.5.
- Forms with labels, validation messages, error summary, success/failure states.
- Tap targets ≥ 44×44px on mobile.
- Completed accessibility statement (no template placeholders).

---

## 9. SEO

Target audience is HR / L&D / operations leads searching for HRD Corp claimable corporate training in Malaysia. Strategy hinges on three things: (a) ~180 individual course pages all indexable and well-templated; (b) "HRD Corp claimable" treated as a primary search anchor, not a footnote; (c) recovering some of the long-tail depth that the summary-only choice (§6.4) gives up.

### 9.1 Page metadata recipe

Every page type uses a template, not artisan copy. The templates below are the source of truth; deviations must be deliberate.

**Title tag templates:**

| Page type | Template | Example |
|---|---|---|
| Home | `HRD Corp Claimable Training Provider Malaysia \| Icon Learning` | — |
| Programs catalog | `Corporate Training Programs Malaysia (HRD Claimable) \| Icon Learning` | — |
| Category | `{Category} Training Malaysia \| Icon Learning` | `Quality, Lean & Food Safety Training Malaysia \| Icon Learning` |
| Course | `{Course} – {Duration}{ · HRD Claimable?} \| Icon Learning` | `Human Firewall – 2 Days · HRD Claimable \| Icon Learning` |
| About | `About Icon Learning & Development` | — |
| Clients | `Trusted by Malaysian Teams – Icon Learning Clients` | — |
| Contact | `Contact Icon Learning – Request Corporate Training` | — |
| Accessibility | `Accessibility Statement \| Icon Learning` | — |

Keep titles ≤ 60 characters where practical. Long course titles drop the duration/HRD suffix before the brand suffix.

**Meta description templates:**

- **Home** — positioning + HRD claimable mention + breadth of categories + soft CTA. ≤ 155 chars.
- **Category** — one-sentence overview + HRD claimable + course count. *"15 HRD Corp claimable ISO, Lean & Food Safety courses for Malaysian operations and quality teams."*
- **Course** — trimmed `whyThisMatters` ending with duration + HRD badge. *"2-day HRD Corp claimable cybersecurity awareness training for Malaysian SMEs. Spot phishing, lock down accounts, and apply PDPA without the legal jargon."* ≤ 155 chars.
- **About / Clients / Contact / Accessibility** — hand-written, ≤ 155 chars.

**Other per-page elements:**
- One H1 per page.
- Canonical URL on every page.
- Open Graph (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`) and Twitter Card (`summary_large_image`).
- OG image: course hero or category fallback; 1200×630, reserved.

### 9.2 Structured data

Add JSON-LD blocks via `BaseLayout` for the global types, per-page for the page-specific ones. **All blocks must validate in Google's Rich Results test** before launch.

**Global (every page):**
- `Organization` — name, url, logo, `sameAs` (social profiles + Google Business Profile), contactPoint.
- `WebSite` — with `SearchAction` pointing at `/programs?q={search_term_string}`.

**Page-specific:**
- `/`, `/about-us`, `/contact`, `/clients` — `LocalBusiness` (or `ProfessionalService`) with full address, telephone, geo coords for the Sri Petaling office, `openingHoursSpecification` (Mon–Fri 09:00–18:00).
- `/programs` and category pages — `ItemList` (each course as a `ListItem`) + `BreadcrumbList`.
- `/programs/[category]/[course]` — `Course` with:
  - `name`, `description` (= `whyThisMatters`)
  - `provider` (nested `Organization`, links to Icon Learning)
  - `educationalCredentialAwarded`: `"HRD Corp Claimable Training"` when `hrdClaimable === true`
  - `inLanguage`: `"en"`, `"ms"`, or `["en", "ms"]`
  - `timeRequired`: ISO 8601 (`P1D`, `P2D`, `P3D`)
  - `audience` (mapped from `builtFor`)
  - `teaches` (mapped from `walkAwayWith`)
  - `coursePrerequisites`: `"No prerequisites"` for most
  - Plus `BreadcrumbList`.
  - Skip `hasCourseInstance` unless specific delivery dates are published — this is an in-house-focused catalog.
- `/contact` and category pages — `FAQPage` answering 3–5 obvious buyer questions: *Is this HRD Corp claimable?* · *Can it run in-house?* · *What's the team-size minimum?* · *Do you deliver in English and Bahasa Malaysia?* · *How long after inquiry will I hear back?*

### 9.3 Long-tail mitigation (summary-only constraint)

The summary-only choice (§6.4) loses ranking shots at topic-level queries — *"MFA training Malaysia"*, *"Incoterms 2020 course KL"*, *"phishing awareness Selangor"*. Mitigations:

- `walkAwayWith` outcomes already carry topic keywords by design — *"Spot phishing in five seconds. Set up MFA on the accounts that matter. Run a PDPA-ready clean-desk policy."* — they're written for humans but surface the terms.
- Course meta descriptions weave topic keywords from the source PDF that didn't make the page, kept natural-language.
- Each category page opens with a substantive 80–120 word paragraph listing key topics and standards covered, before the course list. Not stuffing — actual scannable copy.
- Internal linking density: every course's "Related courses" cross-links 3–4 siblings; category pages link sideways to adjacent categories (Quality ↔ Food Safety, OSH ↔ Compliance training).

### 9.4 HRD Corp claimable as a primary search anchor

This is Icon Learning's strongest commercial differentiator and a phrase Malaysian buyers actively type. Treatment:

- The catalog filter URL `/programs?hrdClaimable=true` is **explicitly indexable** (canonical-to-self) and treated as a marketing landing surface — linked from nav, footer, and homepage. Tailored H1 and meta description, not the generic catalog template.
- Every claimable course's meta description includes "HRD Corp claimable" verbatim.
- `educationalCredentialAwarded` in `Course` schema set to `"HRD Corp Claimable Training"` for claimable courses.
- Homepage hero eyebrow already reads `HRD Corp claimable training provider` (§6.1) — keep it in H1 prominence range.
- **Future option:** dedicated `/hrd-corp-claimable-training` landing page with a claim-process explainer + list of claimable courses + guide on filing claims. Pairs naturally with the future `/resources` route.

### 9.5 Local & language signals

- `<html lang="en-MY">` on every page (English is the primary delivery language).
- Bahasa Malaysia courses carry `<link rel="alternate" hreflang="ms-MY" href="…">` pointing to the BM variant where one exists; the English variant carries `hreflang="en-MY"` pointing back. Standalone BM courses with no English equivalent (e.g. *Kursus Pengendalian Makanan*, *Sertu Workshop*) get `<html lang="ms-MY">` and self-referencing `hreflang="ms-MY"`.
- `LocalBusiness` schema includes geo coords for the Sri Petaling office.
- NAP (Name, Address, Phone) identical across footer, `/contact`, and `LocalBusiness` schema. Any drift degrades local SEO.
- Google Business Profile linked via `Organization.sameAs`.

### 9.6 Crawl strategy: sitemap + filter URLs

- Split sitemap into `sitemap-pages.xml` (10–15 page entries) and `sitemap-courses.xml` (~180 course entries). Reference both from a `sitemap.xml` index.
- `lastmod` derived from the JSON file mtime per course.
- `robots.txt` allows everything and points at the sitemap index.
- Filter URLs on `/programs`: combinatorial filters (`?category=x&duration=2&language=en`) all carry `<link rel="canonical" href="/programs">` to avoid duplicate-content dilution. The **one exception** is `?hrdClaimable=true` — kept canonical-to-self and included in the sitemap as a tier-2 landing page.

### 9.7 Image SEO

- Filename convention: descriptive kebab-case. `hrd-claimable-iso-9001-training.webp`, not `IMG_1234.jpg`. The bento masonry and category hero assets need a naming pass during the asset wire-up (PR 8).
- Required alt text on every content image. Decorative images use empty `alt=""`.
- WebP/AVIF preferred; JPEG fallback.
- Reserved `width` and `height` on every image to prevent CLS.
- Lazy-load below-the-fold; eager + preloaded for the LCP hero image only.

### 9.8 Technical hygiene

- Descriptive meta descriptions per §9.1.
- XML sitemap per §9.6.
- Canonical URLs on every page.
- Clean 301 redirects from legacy `iconlearning.com.my` paths (see Open Questions §13).
- No trailing-slash inconsistency (pick one; redirect the other).
- Strip query strings from canonical URLs except `?hrdClaimable=true`.

### 9.9 Verification & monitoring

- **Google Search Console** verification via DNS or meta tag — done before launch; sitemap submitted on day one.
- **Bing Webmaster Tools** verification on the same schedule.
- Both ship as part of the launch checklist (PR 18).

---

## 10. Performance

Targets:
- Lighthouse Performance / Accessibility / SEO / Best Practices: **95+**
- LCP: **< 2.0s** on 4G (mobile target < 2.5s).
- CLS: < 0.05.
- INP: < 200ms.
- Total page weight HTML + CSS + fonts: **< 250 KB**.
- JS shipped: **< 50 KB gzip** for the whole homepage (parallax + tabs + carousel + count-up + reveal combined).

Implementation: static-first rendering, lazy-load below-the-fold images, reserved media dimensions, self-host fonts with `font-display: swap`, preload LCP image.

---

## 11. PR Plan

Homepage first (Phase 2 below), then site expansion (Phase 3+).

### Phase 1 — Foundation
- **PR 1** — Tokens, layout shell, `Nav`, `Footer`, primitives (`Button`, `Card`, `SectionHeading`, `TabBar`, `LogoWall`). Sticky-nav backdrop transition. Light footer.

### Phase 2 — Homepage
- **PR 2** — `Hero` + `CtaCloser`. Confirms typography/colour on real surfaces.
- **PR 3** — `BentoMasonry` + parallax island. Static masonry first, then layer parallax (CSS Scroll-Driven Animations first, JS fallback).
- **PR 4** — `CoursesTabbed` + tab island. No-JS stacked fallback first, then sliding indicator + crossfade.
- **PR 5** — `ApproachSection` + `FeatureStripe` (3–4 stripes, alternating).
- **PR 6** — `ResultsGrid` + count-up island; `Testimonials` + carousel island (ship together).
- **PR 7** — Global motion polish: reveal-on-scroll observer, page-load hero stagger, smooth anchor scroll, reduced-motion audit, Lighthouse pass.
- **PR 8** — Homepage content wiring: move copy to `src/content/*.ts`, wire real assets, final homepage QA.

### Phase 3 — Program System
- **PR 9** — Course rewrite pipeline. Curation pass on `course/documents/` (identify canonical PDFs, de-duplicate variants, assign category slugs). LLM-assisted rewrite pass produces `src/content/courses/*.json` per the summary-only `Course` type — `whyThisMatters` / `builtFor` / `walkAwayWith` / catchy module titles / methodology caption. Hand-review at least 10 representative courses (one per category plus edge cases like Bahasa Malaysia and multi-day variants) for tone and accuracy before scaling to the full ~180. One-shot, not a build step — JSON becomes authoritative after first import.
- **PR 10** — `/programs` catalog with `ProgramCard`, search across title + topics, filter chips (category, duration, HRD claimable, language), view-mode toggle (grouped vs flat alphabetical).
- **PR 11** — `/programs/[category]` template; populate the 9 category pages with grouped course lists, audience, related categories, sticky inquiry panel.
- **PR 12** — `/programs/[category]/[course]` summary template. Hero, "Why this matters", "Built for" pills, "What you'll walk away with", "Inside the workshop" (module titles only, grouped by day), "How it runs" methodology bar + caption, "Bring it to your team" closer, sticky inquiry panel. Inquiry CTA pre-fills *Training interest* with course title. No accordions, no day tabs, no print stylesheet — page is short enough to scan in one scroll.
- **PR 13** — Bulk content review and copy pass: walk through all ~180 rewritten summaries, ensure tone is consistent and on-brand, populate `relatedSlugs`, flag any course with missing/unconfirmed HRD claimable status.

### Phase 4 — Trust & Contact Pages
- **PR 14** — `/about-us`.
- **PR 15** — `/clients` (`LogoWall`).
- **PR 16** — `/contact` + form behavior + `ContactPanel`.
- **PR 17** — `/accessibility-statement` cleanup; structured data + metadata pass.

### Phase 5 — QA & Launch
- **PR 18** — Responsive QA, a11y audit, perf audit, SEO audit, redirect plan from legacy URLs, content proofread.

Each PR independently reviewable. Update `PROJECT_BRAIN.md` after each.

---

## 12. Acceptance Criteria

The redesign is launch-ready when:

1. All MVP pages from §2.1 implemented (homepage, programs catalog, program category, individual course detail, about, clients, contact, accessibility statement).
2. Visual system matches §4: warm light background, single-colour black headlines (no gradient text), rounded media cards, bento layouts, restrained motion, dense light footer (no dark colour break).
3. Sticky nav: transparent over hero, translucent-blur after 80px scroll, mobile drawer works without JS errors.
4. Bento masonry parallax runs at 60fps mid-range laptop; CSS Scroll-Driven Animations preferred, JS fallback only if needed; static single-column stack on mobile and under reduced-motion.
5. **Program category showcase scroll-spy** (`CoursesTabbed`): on desktop, sticky left labels track scroll position via IntersectionObserver and exactly one label is `.active` at any time; clicking a label smooth-scrolls to that block with sticky-nav offset; mobile collapses to a vertical card stack with no sticky behavior; works with JS disabled (all blocks + labels render fully with summaries visible); reduced-motion disables smooth scroll and label cross-fade while keeping the active-class mechanic.
6. Approach stripes alternate image position; image stacks above text on mobile.
7. Stats: count up over ~1.2s on viewport entry threshold 0.4, one-shot, reduced-motion users see final values immediately. **No fabricated metrics.**
8. Testimonials carousel: prev/next steps one card; keyboard scrollable.
9. CTA closer: small centred card on subtle band, no dark bookend.
10. Footer: same theme as page; ≥ 4 columns desktop; collapses cleanly mobile.
11. Section headings fade-up on entry (one-shot); hero stack staggers on load; nav anchors smooth-scroll.
12. Lighthouse ≥ 95 across all four categories.
13. Page weight + JS budgets met (§10).
14. No console errors or warnings.
15. All site copy sourced from `src/content/*.ts`; course copy sourced from `src/content/courses/*.json`.
16. Reduced-motion audit: no parallax, no count-up, no reveal fades, no smooth scroll, no tab crossfade (instant swap), no card hover lifts.
17. **Course detail pages** render the seven summary sections in §6.4 from the JSON content model. No section reproduces the source PDF's topic-by-topic detail. Sticky inquiry panel on desktop. `Get the full outline` button pre-fills the inquiry form with the course title.
18. **Course rewrite complete:** every course in `course/documents/` has either a canonical entry in `src/content/courses/` or an explicit "skip — superseded" mark. Rewrites have been reviewed by Icon Learning for tone and accuracy. HRD claimable badge surfaces only on courses where Icon Learning has confirmed claimable status.
19. **Catalog search and filters** return correct results across title and topic text; category, duration, HRD claimable, and language filters compose independently and in combination; results count is shown.
20. Forms include validation, success and failure states.
21. No horizontal overflow on mobile; no text overlap or clipped labels.
22. Real contact info and verified company claims only.
23. Accessibility statement completed (no template placeholders).
24. Responsive at 375 / 768 / 1024 / 1280 / 1440px.
25. **Per-page metadata** renders from the §9.1 templates; titles ≤ 60 chars where practical; meta descriptions ≤ 155 chars; OG image and Twitter Card present on every page.
26. **Structured data** per §9.2 (`Organization` + `WebSite`+`SearchAction` global; `LocalBusiness` on home/about/contact/clients; `Course` with full property set on course pages; `BreadcrumbList` on every sub-page; `ItemList` on `/programs` and category pages; `FAQPage` on `/contact` and category pages) all validate in Google's Rich Results test.
27. **HRD Corp claimable surfaces as a SEO landing.** `/programs?hrdClaimable=true` is indexable with tailored title / H1 / meta; the phrase appears verbatim in meta description and `educationalCredentialAwarded` on every claimable course.
28. **Local + language signals.** `<html lang="en-MY">` site-wide; BM courses carry `hreflang` annotations; NAP identical across footer, `/contact`, and `LocalBusiness` schema; Google Business Profile linked via `Organization.sameAs`.
29. **Image SEO.** Descriptive kebab-case filenames; required alt on content images, empty alt on decorative; below-fold lazy-loaded; LCP hero eager + preloaded; WebP/AVIF preferred with JPEG fallback.
30. **Crawl strategy.** Sitemap index references `sitemap-pages.xml` + `sitemap-courses.xml`; combinatorial filter URLs canonical to `/programs` except `?hrdClaimable=true`; `robots.txt` published.
31. **Search Console + Bing Webmaster Tools** verified; sitemap submitted; no crawl errors at launch.

---

## 13. Open Questions

1. Confirm **tech stack** — Astro + Tailwind assumed; flag if the existing repo uses something else.
2. **Logo** — wordmark "Icon Learning" placeholder OK, or is there an SVG mark?
3. **Bento assets** — are there ≥ 8 strong photos (workshops, slide previews, certificates), or fill heavily with quote + logo cards?
4. **Course images** — slide deck preview per category, or workshop photos as the tab image?
5. **Which programs are HRD Corp claimable today?** — needed for accurate badging.
6. **Primary inquiry destination** — WhatsApp first, email first, or form first?
7. **Testimonials approved for public use?**
8. **Verified stats beyond "since 2011"** — anything else publishable without fabrication?
9. **Domain / deploy** — replace `iconlearning.com.my` directly, or stage first?
10. **Legacy URL redirects** — list of old paths to redirect into the new IA.
11. **Accessibility page language** — Malay, English, or both?
12. **Canonical course outlines** — confirm which file is canonical where duplicates exist (PDF vs DOC vs DOCX, or near-duplicate filenames). Identify any superseded outlines we should *not* publish.
13. **HRD Corp claimable status per course** — provide an authoritative list. Several PDFs declare it on the title page; the rest default to "not shown" until confirmed.
14. **Bahasa Malaysia courses** — do BM variants warrant separate URLs (e.g. `/programs/quality-lean-food-safety/kursus-pengendalian-makanan`), or should they be language-toggled siblings on a shared English-default URL? Some BM courses (Halal certification, Sertu Workshop) appear to have no English equivalent and would always need their own URL.
15. **Itinerary documents** — since the page is summary-only, are itineraries part of the inquiry reply attachment, or kept internal only?
16. **Course images** — does each course have a representative image (workshop photo or slide preview)? Without one, the course hero falls back to a category-level image plus an icon.
17. **Full-outline delivery** — when a visitor clicks `Get the full outline`, should Icon Learning's reply auto-attach the source PDF, or should a real person send it manually with a personalised note? Auto-attach is faster and scales; manual-send may convert better but requires staffing.

---

## 14. Reference

- Framer reference: <https://www.framer.com/>
- Current Icon Learning homepage: <https://www.iconlearning.com.my/>
- Current About: <https://www.iconlearning.com.my/about-us>
- Current Supply Chain Management: <https://www.iconlearning.com.my/programs/supply-chain-management>

---

**End of consolidated design doc.**
