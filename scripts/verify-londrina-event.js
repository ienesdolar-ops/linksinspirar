/**
 * scripts/verify-londrina-event.js
 * Validates the new "+ Uma Oportunidade" Sympla event in Londrina.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT_DIR, 'data', 'units.json');
const HTML_FILE = path.join(ROOT_DIR, 'londrina', 'index.html');

const TARGET_URL = 'https://www.sympla.com.br/evento/-uma-oportunidade---da-agenda-cheia-ao-negocio-sustentavel---faculdade-inspirar--instituto-movenz/3604208';
const TARGET_BANNER = 'https://images.sympla.com.br/6abff44478666.png';
const TARGET_END = '2026-10-24T08:00:00-03:00';
const TARGET_START = '2026-09-01';

console.log('--- Checking Londrina Event in data/units.json ---');
const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const londrina = data.units.find(u => u.slug === 'londrina');
assert(londrina, 'Unit londrina must exist in data/units.json');

const eventosSec = (londrina.sections || []).find(s => s.id === 'eventos');
assert(eventosSec, 'Unit londrina must have an eventos section');

const eventItem = (eventosSec.items || []).find(i => i.url === TARGET_URL);
assert(eventItem, 'Londrina must contain the event item with URL: ' + TARGET_URL);
assert(eventItem.title && eventItem.title.includes('Uma Oportunidade'), 'Item title must mention Uma Oportunidade');
assert.strictEqual(eventItem.banner, TARGET_BANNER, 'Item banner must match Sympla image URL');
assert.strictEqual(eventItem.startDate, TARGET_START, 'Item startDate must be ' + TARGET_START);
assert.strictEqual(eventItem.endDate, TARGET_END, 'Item endDate must be ' + TARGET_END);

console.log('--- Checking Londrina generated HTML ---');
assert(fs.existsSync(HTML_FILE), 'londrina/index.html must exist');
const html = fs.readFileSync(HTML_FILE, 'utf8');

assert(html.includes(TARGET_URL), 'HTML must contain event URL');
assert(html.includes(TARGET_BANNER), 'HTML must contain event banner URL');
assert(html.includes(`data-end-date="${TARGET_END}"`), 'HTML must have data-end-date attribute');
assert(html.includes(`data-start-date="${TARGET_START}"`), 'HTML must have data-start-date attribute');
assert(html.includes('link-card has-banner'), 'HTML must render banner card class');

console.log('londrina event verification passed');
process.exit(0);
