# PR 18 QA & Launch Report

Date: 2026-05-21

## Automated Checks

Run before handoff, all passing on 2026-05-21:

```bash
npm run courses:review
npm run build
npm run qa:launch
npm audit --omit=dev --audit-level=moderate
```

Results:
- `npm run courses:review`: 10 courses reviewed, 0 hard failures, 0 warnings.
- `npm run build`: 25 static pages built, 0 errors, 0 warnings, 0 hints.
- `npm run qa:launch`: 25 pages checked, 0 issues, 0 warnings, 22 KB total script gzip including inline enhancements.
- `npm audit --omit=dev --audit-level=moderate`: 0 vulnerabilities.

The launch QA script checks the built `dist/` output for:
- missing required metadata, canonical tags, OG/Twitter tags, and JSON-LD blocks
- invalid JSON-LD syntax
- H1 count per page
- broken internal links and anchors
- missing image alt text
- duplicate IDs
- `robots.txt`, `sitemap.xml`, `sitemap-pages.xml`, and `sitemap-courses.xml`
- total script gzip, including inline enhancement scripts

## Manual QA Matrix

| Area | Status | Notes |
|---|---|---|
| MVP routes | Pass | Home, `/programs`, 9 category pages, 10 course pages, `/about-us`, `/clients`, `/contact`, and `/accessibility-statement` build. |
| Internal links | Pass via `npm run qa:launch` | Includes query-string links such as `/programs?hrdClaimable=true` and anchor links. |
| Course content gate | Pass via `npm run courses:review` | Current 10 course JSON records pass hard validation. |
| Metadata | Pass via `npm run qa:launch` | Canonical, description, OG, Twitter image, and JSON-LD presence checked per page. |
| Crawl files | Pass | Static sitemap index plus pages/courses splits added under `public/`; `robots.txt` points to the sitemap index. |
| Accessibility baseline | Pass by static checks | One H1 per page, image alt presence, form labels, visible focus styles, reduced-motion CSS/scripts present. Full assistive-tech testing is still a launch-day manual task. |
| Performance budget | Pass by build asset audit | JS gzip budget is checked by `npm run qa:launch`; Lighthouse requires a browser environment. |
| Responsive QA | Partial | CSS uses responsive grids and no fixed overflow found in static audit. Visual checks at 375/768/1024/1280/1440 still need a browser-enabled preview environment. |
| Redirect planning | Pass | Seed redirect plan added in `docs/launch/redirect-plan.md`; final server syntax depends on host. |
| Production dependency audit | Pass | `npm audit --omit=dev --audit-level=moderate` is the launch dependency gate. |

## Launch Blockers / Owner Decisions

- Confirm deploy target and DNS cutover path for `www.iconlearning.com.my`.
- Confirm final redirect host syntax and install the redirect list before DNS cutover.
- Run Lighthouse/Rich Results tests in a browser-enabled environment against the final preview URL.
- Submit `https://www.iconlearning.com.my/sitemap.xml` to Google Search Console and Bing Webmaster Tools after launch.
- Replace sitemap seed lists with generated sitemap automation when the full course catalog expands beyond the current 10 course pages.
