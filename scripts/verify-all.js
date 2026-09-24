/**
 * scripts/verify-all.js
 * End-to-end verification suite testing all gates:
 * 1. Data schema and validation
 * 2. Static generator build output
 * 3. Unit content fidelity (Curitiba preservation)
 * 4. Auto-expiring events logic
 * 5. Broken link checker
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT_DIR = path.resolve(__dirname, '..');

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
console.log('  Bio no Link — Full Verification Suite (Gates 1-5)');
console.log('====================================================\n');

// 1. Data Validation
runStep('Gate 1: Data Pipeline Validation', () => {
  execSync('node scripts/validate-data.js', { cwd: ROOT_DIR, stdio: 'pipe' });
});

// 2. Static Build
runStep('Gate 2: Static Generation (Hub + Units)', () => {
  execSync('node scripts/build.js', { cwd: ROOT_DIR, stdio: 'pipe' });
  const requiredFiles = [
    'index.html',
    'curitiba/index.html',
    'belem/index.html',
    'campogrande/index.html',
    'saopaulo/index.html',
    'florianopolis/index.html',
    'belohorizonte/index.html'
  ];
  requiredFiles.forEach(file => {
    const p = path.join(ROOT_DIR, file);
    assert(fs.existsSync(p), `File missing: ${file}`);
    const size = fs.statSync(p).size;
    assert(size > 2000, `File too small: ${file} (${size} bytes)`);
  });
});

// 3. Curitiba Fidelity
runStep('Content Fidelity (Curitiba data preserved)', () => {
  const cwbHtml = fs.readFileSync(path.join(ROOT_DIR, 'curitiba', 'index.html'), 'utf8');
  assert(cwbHtml.includes('Fisioterapia em Terapia Intensiva'), 'Must have Intensive Care course');
  assert(cwbHtml.includes('Amo Fisio'), 'Must have Amo Fisio event');
  assert(cwbHtml.includes('Jardim Schaffer'), 'Must have Jardim Schaffer address');
  assert(cwbHtml.includes('0800 602 2828'), 'Must have 0800 phone');
  assert(cwbHtml.includes('UNIDADE CWB sem gourmet.png'), 'Must have facade cover image');
});

// 4. Auto-expiring events
runStep('Gate 3: Auto-expiring Events', () => {
  execSync('node scripts/test-event-dates.js', { cwd: ROOT_DIR, stdio: 'pipe' });
});

// 5. Broken Link Checker
runStep('Gate 4: Broken Link Checker', () => {
  execSync('node scripts/check-links.js --dry-run', { cwd: ROOT_DIR, stdio: 'pipe' });
  assert(fs.existsSync(path.join(ROOT_DIR, 'reports', 'link-audit.json')), 'Report json missing');
  assert(fs.existsSync(path.join(ROOT_DIR, 'reports', 'link-audit.md')), 'Report md missing');
});

console.log('\n====================================================');
console.log('ALL VERIFICATIONS PASSED');
console.log('====================================================');
process.exit(0);
