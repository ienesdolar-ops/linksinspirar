/**
 * scripts/verify-unit-photos-removal.js
 * Verifies that the 15 units with only city photos have the "Fotos da Unidade"
 * campus banner card removed, while the 22 units with actual facilities photos retain it.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT_DIR, 'data', 'units.json');

const CITY_SLUGS = [
  'dourados',
  'fortaleza',
  'goiania',
  'ipatinga',
  'joinville',
  'luanda',
  'maceio',
  'parauapebas',
  'porto-velho',
  'ribeirao-preto',
  'salvador',
  'santo-andre',
  'santos',
  'sao-jose-do-rio-preto',
  'teresina'
];

console.log('--- Verifying Unit Photos Configuration across 37 Units ---');

const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
assert.strictEqual(data.units.length, 37, 'Must have 37 units');

let cityCount = 0;
let realPhotoCount = 0;

data.units.forEach(unit => {
  const isCity = CITY_SLUGS.includes(unit.slug);
  const hasCampusSec = (unit.sections || []).some(s => s.id === 'campus' || s.type === 'campus_banner');

  const htmlPath = path.join(ROOT_DIR, unit.slug, 'index.html');
  assert(fs.existsSync(htmlPath), `Missing index.html for ${unit.slug}`);
  const html = fs.readFileSync(htmlPath, 'utf8');

  const hasCardHtml = html.includes('Fotos da Unidade');
  const hasTourBtn = html.includes('id="btn-open-gallery"');

  if (isCity) {
    cityCount++;
    assert(!hasCampusSec, `Unit ${unit.slug} with city photo should NOT have campus_banner in data/units.json`);
    assert(!hasCardHtml, `Unit ${unit.slug} with city photo should NOT render "Fotos da Unidade" card in HTML`);
    assert(!hasTourBtn, `Unit ${unit.slug} with city photo should NOT render "btn-open-gallery" in HTML`);
    assert(html.includes('has-3-items'), `Unit ${unit.slug} should have .has-3-items on quick-actions-bar`);
  } else {
    realPhotoCount++;
    assert(hasCampusSec, `Unit ${unit.slug} with real photos MUST have campus_banner in data/units.json`);
    assert(hasCardHtml, `Unit ${unit.slug} with real photos MUST render "Fotos da Unidade" card in HTML`);
    assert(hasTourBtn, `Unit ${unit.slug} with real photos MUST render "btn-open-gallery" in HTML`);
  }
});

assert.strictEqual(cityCount, 15, `Expected exactly 15 city-photo units without Fotos da Unidade, found ${cityCount}`);
assert.strictEqual(realPhotoCount, 22, `Expected exactly 22 real-photo units with Fotos da Unidade, found ${realPhotoCount}`);

console.log(`Validated: ${cityCount} city units cleanly stripped of unit photos, ${realPhotoCount} units preserved with full galleries.`);
console.log('unit photos removal verification passed');
process.exit(0);
