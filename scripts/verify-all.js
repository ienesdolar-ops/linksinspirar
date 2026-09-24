/**
 * scripts/verify-all.js
 * End-to-end verification suite testing all 6 gates for 37 units:
 * 1. Asset Ingestion & Normalization
 * 2. Data schema and validation (37 units)
 * 3. Static generator build output (all 37 unit pages + Hub)
 * 4. Unit content fidelity (Curitiba preservation & custom unit photos)
 * 5. Auto-expiring events logic
 * 6. Broken link checker
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT_DIR, 'data', 'units.json');

function runStep(name, fn) {
  process.stdout.write(`Checking ${name}... `);
  try {
    fn();
    console.log('✅ OK');
  } catch (err) {
    console.log('❌ FAILED');
    console.error(err);
    process.exit(1);
  }
}

console.log('====================================================');
console.log('  Bio no Link — Full Verification Suite (37 Units)');
console.log('====================================================\n');

// 1. Photo Ingestion & Manifest
runStep('Gate 1: Photo Ingestion & Manifest', () => {
  const manifestPath = path.join(ROOT_DIR, 'assets', 'images', 'units', 'manifest.json');
  assert(fs.existsSync(manifestPath), 'manifest.json missing');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const unitFolders = Object.keys(manifest);
  assert(unitFolders.length >= 22, `Expected at least 22 photo folders, found ${unitFolders.length}`);
});

// 2. Data Validation
runStep('Gate 2: Data Pipeline Validation (37 units)', () => {
  execSync('node scripts/validate-data.js', { cwd: ROOT_DIR, stdio: 'pipe' });
});

// 3. Static Build & Coverage
runStep('Gate 3: Static Generation (Hub + 37 Units)', () => {
  execSync('node scripts/build.js', { cwd: ROOT_DIR, stdio: 'pipe' });

  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  assert.strictEqual(data.units.length, 37, 'Must have exactly 37 units in catalog');

  // Verify Hub
  const hubHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
  assert(hubHtml.includes('Todas (37)'), 'Hub must have region chip with 37 units');

  // Verify each unit folder and index.html
  data.units.forEach(unit => {
    const unitHtmlPath = path.join(ROOT_DIR, unit.slug, 'index.html');
    assert(fs.existsSync(unitHtmlPath), `Missing index.html for unit: ${unit.slug}`);
    const html = fs.readFileSync(unitHtmlPath, 'utf8');
    assert(html.includes(unit.name), `Unit page for ${unit.slug} must include name ${unit.name}`);
    assert(html.includes(unit.state), `Unit page for ${unit.slug} must include state ${unit.state}`);
  });
});

// 4. Curitiba Fidelity & Custom Photos
runStep('Gate 4: Content Fidelity & Custom Photos', () => {
  const cwbHtml = fs.readFileSync(path.join(ROOT_DIR, 'curitiba', 'index.html'), 'utf8');
  assert(cwbHtml.includes('Fisioterapia em Terapia Intensiva'), 'Must have Intensive Care course');
  assert(cwbHtml.includes('Amo Fisio'), 'Must have Amo Fisio event');
  assert(cwbHtml.includes('Jardim Schaffer'), 'Must have Jardim Schaffer address');
  assert(cwbHtml.includes('0800 602 2828'), 'Must have 0800 phone');
  assert(cwbHtml.includes('UNIDADE CWB sem gourmet.png'), 'Must have facade cover image');

  // Check units with custom photos
  const rioHtml = fs.readFileSync(path.join(ROOT_DIR, 'rio-de-janeiro', 'index.html'), 'utf8');
  assert(rioHtml.includes('assets/images/units/rio-de-janeiro'), 'Rio must use imported photo');

  const bsbHtml = fs.readFileSync(path.join(ROOT_DIR, 'brasilia', 'index.html'), 'utf8');
  assert(bsbHtml.includes('assets/images/units/brasilia'), 'Brasilia must use imported photo');
});

// 5. Auto-expiring events
runStep('Gate 5: Auto-expiring Events', () => {
  execSync('node scripts/test-event-dates.js', { cwd: ROOT_DIR, stdio: 'pipe' });
});

// 6. Broken Link Checker
runStep('Gate 6: Broken Link Checker (Dry Run)', () => {
  execSync('node scripts/check-links.js --dry-run', { cwd: ROOT_DIR, stdio: 'pipe' });
  assert(fs.existsSync(path.join(ROOT_DIR, 'reports', 'link-audit.json')), 'Report json missing');
  assert(fs.existsSync(path.join(ROOT_DIR, 'reports', 'link-audit.md')), 'Report md missing');
});

console.log('\n====================================================');
console.log('ALL VERIFICATIONS PASSED (37 units)');
console.log('====================================================');
process.exit(0);
