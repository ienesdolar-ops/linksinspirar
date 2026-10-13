/**
 * scripts/verify-vila-mariana-event.js
 * Validates the new "DNA MED + Inspirar" Sympla event in São Paulo - Vila Mariana.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT_DIR, 'data', 'units.json');
const HTML_FILE = path.join(ROOT_DIR, 'sao-paulo-vila-mariana', 'index.html');

const TARGET_URL = 'https://www.sympla.com.br/evento/dna-med--inspirar--tecnologia-inovacao-e-pratica-na-estetica/3609154';
const TARGET_BANNER = 'https://images.sympla.com.br/6ac554d65e22c.png';
const TARGET_END = '2026-10-17T09:00:00-03:00';
const TARGET_START = '2026-09-01';

console.log('--- Checking Vila Mariana Event in data/units.json ---');
const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
const vm = data.units.find(u => u.slug === 'sao-paulo-vila-mariana');
assert(vm, 'Unit sao-paulo-vila-mariana must exist in data/units.json');

const eventosSec = (vm.sections || []).find(s => s.id === 'eventos');
assert(eventosSec, 'Unit sao-paulo-vila-mariana must have an eventos section');

const eventItem = (eventosSec.items || []).find(i => i.url === TARGET_URL);
assert(eventItem, 'Vila Mariana must contain the event item with URL: ' + TARGET_URL);
assert(eventItem.title && eventItem.title.includes('DNA MED'), 'Item title must mention DNA MED');
assert.strictEqual(eventItem.banner, TARGET_BANNER, 'Item banner must match Sympla image URL');
assert.strictEqual(eventItem.startDate, TARGET_START, 'Item startDate must be ' + TARGET_START);
assert.strictEqual(eventItem.endDate, TARGET_END, 'Item endDate must be ' + TARGET_END);

console.log('--- Checking Vila Mariana generated HTML ---');
assert(fs.existsSync(HTML_FILE), 'sao-paulo-vila-mariana/index.html must exist');
const html = fs.readFileSync(HTML_FILE, 'utf8');

assert(html.includes(TARGET_URL), 'HTML must contain event URL');
assert(html.includes(TARGET_BANNER), 'HTML must contain event banner URL');
assert(html.includes(`data-end-date="${TARGET_END}"`), 'HTML must have data-end-date attribute');
assert(html.includes(`data-start-date="${TARGET_START}"`), 'HTML must have data-start-date attribute');
assert(html.includes('link-card has-banner'), 'HTML must render banner card class');

console.log('vila mariana event verification passed');
process.exit(0);
