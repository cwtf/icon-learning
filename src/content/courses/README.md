# Course Content Pipeline

Course JSON files in this folder are the authoritative summary-only records for future `/programs` pages.

PR 9 starts with a representative reviewed-first batch, not the full catalog. The source inventory lives at `src/content/courses/_curation/inventory.json` and can be regenerated with:

```bash
npm run courses:inventory
```

Pipeline rules:

- Keep one top-level `*.json` file per publishable course.
- Keep the JSON shape aligned to `src/content/courses/schema.ts`.
- Use `hrdClaimable: false` unless Icon Learning has confirmed the course is HRD Corp claimable from the source PDF or an authoritative list.
- Keep detail pages summary-only: no topic-by-topic outline dumping from source PDFs.
- Use `sourceDoc` to point back to the canonical raw outline under `course/documents/`.
