/**
 * scripts/verify-v2.js
 * Comprehensive verification suite for Version 2 (Impeccable Craft Edition)
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT_DIR = path.resolve(__dirname, '..');
const V2_DIR = path.join(ROOT_DIR, 'v2');
const DATA_FILE = path.join(ROOT_DIR, 'data', 'units.json');

function runCheck(title, fn) {
  process.stdout.write(`Checking ${title}... `);
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
console.log('  Versão 2 (Impeccable Craft) Verification Suite');
console.log('====================================================\n');

// 1. Generation & Coverage
runCheck('V2 Coverage (Hub + 37 Units)', () => {
  assert(fs.existsSync(path.join(V2_DIR, 'index.html')), 'v2/index.html missing');
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  assert.strictEqual(data.units.length, 37);

  data.units.forEach(u => {
    const p = path.join(V2_DIR, u.slug, 'index.html');
    assert(fs.existsSync(p), `Missing v2 unit: ${u.slug}`);
    const html = fs.readFileSync(p, 'utf8');
    assert(html.includes(u.name), `Missing name in ${u.slug}`);
    assert(html.includes('style-v2.css'), `Missing style-v2.css link in ${u.slug}`);
    assert(html.includes('Versão 2 (Impeccable Craft)'), `Missing v2 banner in ${u.slug}`);
  });
});

// 2. Performance (WebP Asset Weight)
runCheck('V2 Performance & WebP Optimization', () => {
  const webpCover = path.join(ROOT_DIR, 'assets', 'images', 'webp', 'unidade-cwb-cover.webp');
  assert(fs.existsSync(webpCover), 'WebP cover missing');
  const webpSize = fs.statSync(webpCover).size;
  const originalCover = path.join(ROOT_DIR, 'assets', 'images', 'UNIDADE CWB sem gourmet.png');
  const originalSize = fs.statSync(originalCover).size;

  assert(webpSize < 150 * 1024, `WebP should be under 150 KB, got ${(webpSize/1024).toFixed(1)} KB`);
  assert(webpSize < originalSize * 0.2, 'WebP must be at least 80% lighter than original');
});

// 3. Accessibility & WCAG Compliance
runCheck('V2 Accessibility (Zoom, Headings, ARIA, Touch Targets)', () => {
  const cwbHtml = fs.readFileSync(path.join(V2_DIR, 'curitiba', 'index.html'), 'utf8');

  // Zoom not disabled
  assert(!cwbHtml.includes('user-scalable=no'), 'user-scalable=no must not exist in v2');
  assert(!cwbHtml.includes('maximum-scale'), 'maximum-scale must not exist in v2');
  assert(cwbHtml.includes('width=device-width, initial-scale=1.0'), 'Must have standard responsive viewport');

  // Heading hierarchy
  assert(cwbHtml.includes('<h1 class="hero-title">'), 'Must have H1');
  assert(cwbHtml.includes('<h2 class="sr-only">'), 'Must have intermediate H2 to prevent skipped headings');
  assert(cwbHtml.includes('<h3 class="link-title">'), 'Must have H3');

  // Modal ARIA & focus
  assert(cwbHtml.includes('role="dialog"'), 'Modal must have role=dialog');
  assert(cwbHtml.includes('aria-modal="true"'), 'Modal must have aria-modal=true');
  assert(cwbHtml.includes('aria-labelledby="gallery-modal-title"'), 'Modal must have aria-labelledby');
  assert(cwbHtml.includes('aria-label="Fechar galeria de fotos"'), 'Close button must have aria-label');

  // Reduced motion in CSS
  const css = fs.readFileSync(path.join(ROOT_DIR, 'assets', 'css', 'style-v2.css'), 'utf8');
  assert(css.includes('prefers-reduced-motion'), 'style-v2.css must include prefers-reduced-motion');
  assert(css.includes(':focus-visible'), 'style-v2.css must include :focus-visible');
});

// 4. Regional Isolation (Sul YouTube test link)
runCheck('V2 Sul Test Link Preservation', () => {
  const SUL_SLUGS = ['balneario-camboriu', 'blumenau', 'curitiba', 'florianopolis', 'joinville', 'londrina', 'porto-alegre'];
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

  data.units.forEach(u => {
    const html = fs.readFileSync(path.join(V2_DIR, u.slug, 'index.html'), 'utf8');
    const hasSulLink = html.includes('https://www.youtube.com/');
    if (SUL_SLUGS.includes(u.slug)) {
      assert(hasSulLink, `Sul unit ${u.slug} missing YouTube test link in v2`);
    } else {
      assert(!hasSulLink, `Non-Sul unit ${u.slug} must not have YouTube test link in v2`);
    }
  });
});

// 5. Impeccable Mechanical Detector (Zero Findings)
runCheck('V2 Impeccable Detector (Zero AI Slop Tells)', () => {
  const detectCmd = '.agents\\skills\\impeccable\\scripts\\impeccable.cmd detect --json v2/index.html assets/css/style-v2.css v2/curitiba/index.html';
  const out = execSync(detectCmd, { cwd: ROOT_DIR, encoding: 'utf8' });
  const findings = JSON.parse(out);
  assert.strictEqual(findings.length, 0, `Expected 0 findings in v2, got ${findings.length}`);
});

console.log('\n====================================================');
console.log('ALL V2 VERIFICATIONS PASSED (Zero Defect Craft)');
console.log('====================================================');
