# ACCEPTANCE GATES — Bio no Link (Faculdade Inspirar)

## Gate 1: Asset & Data Pipeline
- All assets (AmpleSoft Pro fonts, Inspirar logos, Curitiba imagery) copied to root structure.
- Central configuration `data/units.json` contains complete data for Curitiba (matching original repo) plus pilot units (Belém, Campo Grande, São Paulo, Florianópolis) and global configuration.
- Validation script validates schema, required fields, slugs, and date formats.
- CHECK: `node scripts/validate-data.js`
- EXPECT: `DATA VALIDATION PASSED` (exit 0)

## Gate 2: Static Site Generation (Hub & Individual Unit Pages)
- Build script `scripts/build.js` renders:
  - Root `index.html`: Central Hub with search by city/state, unit cards, quick actions, and global links.
  - Dedicated pages: `curitiba/index.html`, `belem/index.html`, `campogrande/index.html`, `saopaulo/index.html`, `florianopolis/index.html`.
- Curitiba page contains identical content, links, gallery, and styling as original repository.
- Each page is fully standalone, with proper SEO tags, meta title, og:image, and mobile responsiveness.
- CHECK: `node scripts/build.js`
- EXPECT: `BUILD SUCCESSFUL` (exit 0)

## Gate 3: Auto-Expiring Events (Data de início e fim)
- Event items support `startDate` and `endDate` (ISO YYYY-MM-DD format).
- Build system and client-side JavaScript enforce visibility based on date range:
  - Expired events (`current_date > endDate`) are automatically omitted or hidden.
  - Future events (`current_date < startDate`) remain hidden until start date.
  - Ongoing events are rendered with badge / status.
- CHECK: `node scripts/test-event-dates.js`
- EXPECT: `EVENT EXPIRATION TESTS PASSED` (exit 0)

## Gate 4: Broken Link Checker Tool (Verificador de Links)
- Script `scripts/check-links.js` checks all URLs in `data/units.json`.
- Supports `--dry-run` (syntax & URL validity) and live check (HTTP status).
- Generates JSON and Markdown reports in `reports/`.
- CHECK: `node scripts/check-links.js --dry-run`
- EXPECT: `LINK CHECKER VALIDATION PASSED` (exit 0)

## Gate 5: Comprehensive Verification & Prompt Update Ready
- Single test script `scripts/verify-all.js` runs all validations and checks file integrity.
- Detailed `README.md` and `PROMPTS.md` with instructions on how to update bios via Antigravity prompts.
- CHECK: `node scripts/verify-all.js`
- EXPECT: `ALL VERIFICATIONS PASSED` (exit 0)
