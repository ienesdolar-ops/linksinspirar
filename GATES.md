# ACCEPTANCE GATES — Bio no Link (Rede Completa: 37 Unidades)

## Gate 1: Asset Ingestion & Image Normalization
- All unit photos from `Fotos Unidades` are imported, sanitized, and stored under `assets/images/units/<slug>/` with web-safe lowercase filenames.
- Units with dedicated photos have their facades/covers and galleries mapped.
- CHECK: `node scripts/import-photos.js`
- EXPECT: `PHOTOS IMPORT COMPLETED` (exit 0)

## Gate 2: Full Catalog Validation (37 Unidades)
- Central catalog `data/units.json` contains all 37 units requested by the user with official links (`https://www.inspirar.com.br/...`), official states, regions, addresses, WhatsApp, Instagram, and courses.
- Curitiba content, texts, address, and links preserved.
- Validation script validates schema, unique slugs, and asset paths.
- CHECK: `node scripts/validate-data.js`
- EXPECT: `DATA VALIDATION PASSED (37 units)` (exit 0)

## Gate 3: Static Site Generation (Hub + 37 Dedicated Unit Pages)
- Build script `scripts/build.js` generates:
  - `index.html`: Central Hub with all 37 units searchable by name, state, and region.
  - 37 dedicated directories with standalone `index.html` files.
- Each dedicated page includes custom photos, interactive gallery modal, WhatsApp and Instagram quick actions, and auto-expiring events logic.
- CHECK: `node scripts/build.js`
- EXPECT: `BUILD SUCCESSFUL (37 units)` (exit 0)

## Gate 4: Auto-Expiring Events (Data de Início e Fim)
- Verifies that past events are automatically omitted, future events wait for start date, and active events display with dynamic client-side and build-side filters.
- CHECK: `node scripts/test-event-dates.js`
- EXPECT: `EVENT EXPIRATION TESTS PASSED` (exit 0)

## Gate 5: Broken Link Checker
- Audits all URLs across all 37 units and global links.
- Emits structured reports in `reports/link-audit.json` and `reports/link-audit.md`.
- CHECK: `node scripts/check-links.js --dry-run`
- EXPECT: `LINK CHECKER VALIDATION PASSED` (exit 0)

## Gate 6: Complete End-to-End Verification Suite
- Comprehensive test `scripts/verify-all.js` validates that all 37 unit index.html files exist, are properly structured, and Hub contains all 37 units.
- CHECK: `node scripts/verify-all.js`
- EXPECT: `ALL VERIFICATIONS PASSED (37 units)` (exit 0)
