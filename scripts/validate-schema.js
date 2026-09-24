/**
 * scripts/validate-schema.js
 * Validates Schema.org JSON-LD structured data across Hub and all 37 units:
 * 1. Root index.html: EducationalOrganization (#organization), WebSite (#website), Services
 * 2. 37 Units: LocalBusiness, PostalAddress, parentOrganization (#organization), BreadcrumbList, Courses
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT_DIR, 'data', 'units.json');

function extractJsonLd(html, filePath) {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert(match, `No JSON-LD script found in ${filePath}`);
  try {
    return JSON.parse(match[1]);
  } catch (err) {
    throw new Error(`Invalid JSON-LD in ${filePath}: ${err.message}`);
  }
}

console.log('====================================================');
console.log('  Schema.org Structured Data Validation Suite');
console.log('====================================================\n');

// 1. Hub Validation
process.stdout.write('Checking Hub (index.html) Schema... ');
const hubHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
const hubSchema = extractJsonLd(hubHtml, 'index.html');
assert.strictEqual(hubSchema['@context'], 'https://schema.org');
assert(Array.isArray(hubSchema['@graph']), 'Hub must use @graph structure');

const org = hubSchema['@graph'].find(e => e['@type'] === 'EducationalOrganization');
assert(org, 'Hub must contain EducationalOrganization');
assert.strictEqual(org['@id'], 'https://linksinspirar.vercel.app/#organization');
assert.strictEqual(org.name, 'Faculdade Inspirar');
assert(Array.isArray(org.sameAs) && org.sameAs.length >= 3, 'Must contain verified sameAs profiles');

const site = hubSchema['@graph'].find(e => e['@type'] === 'WebSite');
assert(site, 'Hub must contain WebSite entity');
assert.strictEqual(site['@id'], 'https://linksinspirar.vercel.app/#website');
assert.deepStrictEqual(site.publisher, { '@id': 'https://linksinspirar.vercel.app/#organization' });

const services = hubSchema['@graph'].filter(e => e['@type'] === 'Service');
assert.strictEqual(services.length, 4, 'Hub must declare 4 core services (Graduação, Pós, Extensão, Eventos)');
console.log('✅ OK');

// 2. 37 Units Validation
const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
assert.strictEqual(data.units.length, 37);

let unitsTested = 0;
let coursesFound = 0;

data.units.forEach(unit => {
  const unitPath = path.join(ROOT_DIR, unit.slug, 'index.html');
  assert(fs.existsSync(unitPath), `Missing ${unit.slug}/index.html`);
  const unitHtml = fs.readFileSync(unitPath, 'utf8');
  const unitSchema = extractJsonLd(unitHtml, `${unit.slug}/index.html`);

  assert.strictEqual(unitSchema['@context'], 'https://schema.org');
  assert(Array.isArray(unitSchema['@graph']), `Unit ${unit.slug} must use @graph`);

  const business = unitSchema['@graph'].find(e => {
    const t = e['@type'];
    return Array.isArray(t) ? t.includes('LocalBusiness') : t === 'LocalBusiness';
  });
  assert(business, `Unit ${unit.slug} missing LocalBusiness`);
  assert.strictEqual(business['@id'], `https://linksinspirar.vercel.app/${unit.slug}/#business`);
  assert(business.name.includes(unit.name), `Unit ${unit.slug} business name mismatch`);
  assert.deepStrictEqual(business.parentOrganization, { '@id': 'https://linksinspirar.vercel.app/#organization' });

  // Address check
  assert(business.address, `Unit ${unit.slug} missing address`);
  assert.strictEqual(business.address['@type'], 'PostalAddress');
  assert.strictEqual(business.address.addressLocality, unit.name);
  assert.strictEqual(business.address.addressRegion, unit.state);

  // Social sameAs
  assert(Array.isArray(business.sameAs) && business.sameAs.includes(unit.instagram), `Unit ${unit.slug} missing Instagram in sameAs`);

  // BreadcrumbList check
  const breadcrumb = unitSchema['@graph'].find(e => e['@type'] === 'BreadcrumbList');
  assert(breadcrumb, `Unit ${unit.slug} missing BreadcrumbList`);
  assert.strictEqual(breadcrumb.itemListElement.length, 2);
  assert.strictEqual(breadcrumb.itemListElement[0].item, 'https://linksinspirar.vercel.app/');
  assert.strictEqual(breadcrumb.itemListElement[1].item, `https://linksinspirar.vercel.app/${unit.slug}/`);

  // Courses check
  const courses = unitSchema['@graph'].filter(e => e['@type'] === 'Course');
  if (courses.length > 0) {
    coursesFound += courses.length;
    courses.forEach(c => {
      assert(c.name, 'Course missing name');
      assert(c.url, 'Course missing url');
      assert.deepStrictEqual(c.provider, { '@id': `https://linksinspirar.vercel.app/${unit.slug}/#business` });
    });
  }

  unitsTested++;
});

console.log(`Checking All Units Schema (37/37)... ✅ OK (${unitsTested} units validated, ${coursesFound} course entities mapped)`);
console.log('\n====================================================');
console.log('ALL SCHEMA.ORG CHECKS PASSED PERFECTLY');
console.log('====================================================');
