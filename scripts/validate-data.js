/**
 * scripts/validate-data.js
 * Validates data/units.json schema, slugs, dates, and asset references.
 */
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT_DIR, 'data', 'units.json');

function validate() {
  console.log('--- Starting Data Validation: Bio no Link ---');

  if (!fs.existsSync(DATA_FILE)) {
    console.error(`ERROR: Data file not found at ${DATA_FILE}`);
    process.exit(1);
  }

  let data;
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    data = JSON.parse(raw);
  } catch (err) {
    console.error(`ERROR parsing ${DATA_FILE}:`, err.message);
    process.exit(1);
  }

  if (!data.project || !data.units || !Array.isArray(data.units)) {
    console.error('ERROR: data/units.json must have "project" and "units" array');
    process.exit(1);
  }

  console.log(`Found ${data.units.length} units configured.`);
  const slugs = new Set();
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  data.units.forEach((unit, idx) => {
    if (!unit.slug || typeof unit.slug !== 'string') {
      console.error(`ERROR in unit #${idx}: missing or invalid slug`);
      process.exit(1);
    }
    if (slugs.has(unit.slug)) {
      console.error(`ERROR: Duplicate slug "${unit.slug}" in unit #${idx}`);
      process.exit(1);
    }
    slugs.add(unit.slug);

    if (!unit.name || !unit.state) {
      console.error(`ERROR in unit "${unit.slug}": missing "name" or "state"`);
      process.exit(1);
    }

    if (!unit.whatsapp) {
      console.warn(`WARNING in unit "${unit.slug}": whatsapp is empty`);
    }

    if (!unit.instagram || !unit.instagram.includes('instagram.com')) {
      console.error(`ERROR in unit "${unit.slug}": missing or invalid instagram URL "${unit.instagram}"`);
      process.exit(1);
    }

    if (!unit.instagramUser || !unit.instagramUser.startsWith('@')) {
      console.error(`ERROR in unit "${unit.slug}": missing or invalid instagramUser "${unit.instagramUser}"`);
      process.exit(1);
    }

    // Check sections & events
    if (Array.isArray(unit.sections)) {
      unit.sections.forEach(sec => {
        if (Array.isArray(sec.items)) {
          sec.items.forEach(item => {
            if (item.startDate && !dateRegex.test(item.startDate)) {
              console.error(`ERROR in unit "${unit.slug}", item "${item.title}": invalid startDate "${item.startDate}" (expected YYYY-MM-DD)`);
              process.exit(1);
            }
            if (item.endDate && !dateRegex.test(item.endDate)) {
              console.error(`ERROR in unit "${unit.slug}", item "${item.title}": invalid endDate "${item.endDate}" (expected YYYY-MM-DD)`);
              process.exit(1);
            }
          });
        }
      });
    }

    // Check local coverImage
    if (unit.coverImage && !unit.coverImage.startsWith('http')) {
      const assetPath = path.join(ROOT_DIR, unit.coverImage);
      if (!fs.existsSync(assetPath)) {
        console.warn(`NOTICE: Cover image for "${unit.slug}" not found on disk at ${unit.coverImage}`);
      }
    }
  });

    if (data.units.length !== 37) {
      console.error(`ERROR: Expected 37 units, but found ${data.units.length}`);
      process.exit(1);
    }

    console.log(`All ${data.units.length} units validated successfully.`);
    console.log('DATA VALIDATION PASSED (37 units)');
    process.exit(0);
  }

validate();
