/**
 * scripts/apply-contacts-and-teresina.js
 * Updates:
 * 1. Teresina address: "Av. Universitária, 750, Lojas 74 — Fátima (Ed. Diamond Center)"
 * 2. Campo Grande WhatsApp: (67) 98488-3987 (5567984883987)
 * 3. Belém WhatsApp: (91) 99100-7794 (5591991007794)
 * 4. Campinas WhatsApp: (19) 99704-1183 (5519997041183)
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const UNITS_FILE = path.join(ROOT_DIR, 'data', 'units.json');
const CATALOG_FILE = path.join(ROOT_DIR, 'scripts', 'generate-catalog.js');

const data = JSON.parse(fs.readFileSync(UNITS_FILE, 'utf8'));

// 1. Teresina
const teresina = data.units.find(u => u.slug === 'teresina');
if (teresina) {
  teresina.address = 'Av. Universitária, 750, Lojas 74 — Fátima (Ed. Diamond Center)';
  teresina.fullAddress = 'Av. Universitária, 750, Lojas 74 — Fátima, Teresina — PI';
  const teresinaCampus = (teresina.sections || []).find(s => s.id === 'campus');
  if (teresinaCampus) {
    teresinaCampus.bannerSub = teresina.fullAddress;
  }
}

// 2. Campo Grande
const cg = data.units.find(u => u.slug === 'campo-grande');
if (cg) {
  cg.whatsapp = '5567984883987';
  cg.whatsappDisplay = '(67) 98488-3987';
  const cgRapido = (cg.sections || []).find(s => s.id === 'acesso_rapido');
  if (cgRapido && cgRapido.items) {
    const item = cgRapido.items.find(i => i.icon === 'whatsapp');
    if (item) {
      item.desc = 'Fale com nossa equipe • (67) 98488-3987';
      item.url = 'https://api.whatsapp.com/send?phone=5567984883987&text=' + encodeURIComponent('Olá! Tenho interesse em saber mais sobre os cursos da Faculdade Inspirar - Campo Grande');
    }
  }
}

// 3. Belém
const belem = data.units.find(u => u.slug === 'belem');
if (belem) {
  belem.whatsapp = '5591991007794';
  belem.whatsappDisplay = '(91) 99100-7794';
  const belemRapido = (belem.sections || []).find(s => s.id === 'acesso_rapido');
  if (belemRapido && belemRapido.items) {
    const item = belemRapido.items.find(i => i.icon === 'whatsapp');
    if (item) {
      item.desc = 'Fale com nossa equipe • (91) 99100-7794';
      item.url = 'https://api.whatsapp.com/send?phone=5591991007794&text=' + encodeURIComponent('Olá! Tenho interesse em saber mais sobre os cursos da Faculdade Inspirar - Belém');
    }
  }
}

// 4. Campinas
const campinas = data.units.find(u => u.slug === 'campinas');
if (campinas) {
  campinas.whatsapp = '5519997041183';
  campinas.whatsappDisplay = '(19) 99704-1183';
  const campinasRapido = (campinas.sections || []).find(s => s.id === 'acesso_rapido');
  if (campinasRapido && campinasRapido.items) {
    const item = campinasRapido.items.find(i => i.icon === 'whatsapp');
    if (item) {
      item.desc = 'Fale com nossa equipe • (19) 99704-1183';
      item.url = 'https://api.whatsapp.com/send?phone=5519997041183&text=' + encodeURIComponent('Olá! Tenho interesse em saber mais sobre os cursos da Faculdade Inspirar - Campinas');
    }
  }
}

fs.writeFileSync(UNITS_FILE, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('Units updated successfully in data/units.json');

// Update generate-catalog.js
if (fs.existsSync(CATALOG_FILE)) {
  let catalog = fs.readFileSync(CATALOG_FILE, 'utf8');
  const terRegex = /(\{[^{}]*slug:\s*['"]teresina['"][^{}]*address:\s*['"])([^'"]*)(['"])/;
  if (terRegex.test(catalog)) {
    catalog = catalog.replace(terRegex, `$1${teresina.address}$3`);
    fs.writeFileSync(CATALOG_FILE, catalog, 'utf8');
    console.log('Teresina address updated in scripts/generate-catalog.js');
  }
}
