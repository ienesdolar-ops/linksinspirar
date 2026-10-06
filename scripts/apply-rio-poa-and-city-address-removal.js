/**
 * scripts/apply-rio-poa-and-city-address-removal.js
 * 1. Rio de Janeiro WhatsApp: (21) 99048-1463 (5521990481463)
 * 2. Porto Alegre WhatsApp: (51) 98948-0466 (5551989480466)
 * 3. Remove address for the 15 units that have city photos instead of unit photos:
 *    dourados, fortaleza, goiania, ipatinga, joinville, luanda, maceio, parauapebas,
 *    porto-velho, ribeirao-preto, salvador, santo-andre, santos, sao-jose-do-rio-preto, teresina.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const UNITS_FILE = path.join(ROOT_DIR, 'data', 'units.json');
const CATALOG_FILE = path.join(ROOT_DIR, 'scripts', 'generate-catalog.js');

const data = JSON.parse(fs.readFileSync(UNITS_FILE, 'utf8'));

// 1. Rio de Janeiro WhatsApp
const rj = data.units.find(u => u.slug === 'rio-de-janeiro');
if (rj) {
  rj.whatsapp = '5521990481463';
  rj.whatsappDisplay = '(21) 99048-1463';
  const rapido = (rj.sections || []).find(s => s.id === 'acesso_rapido');
  if (rapido && Array.isArray(rapido.items)) {
    const waItem = rapido.items.find(i => i.icon === 'whatsapp' || (i.url && i.url.includes('whatsapp.com')));
    const msg = encodeURIComponent('Olá! Tenho interesse em saber mais sobre os cursos da Faculdade Inspirar - Rio de Janeiro');
    if (waItem) {
      waItem.desc = 'Fale com nossa equipe • (21) 99048-1463';
      waItem.url = `https://api.whatsapp.com/send?phone=5521990481463&text=${msg}`;
    }
  }
}

// 2. Porto Alegre WhatsApp
const poa = data.units.find(u => u.slug === 'porto-alegre');
if (poa) {
  poa.whatsapp = '5551989480466';
  poa.whatsappDisplay = '(51) 98948-0466';
  const rapido = (poa.sections || []).find(s => s.id === 'acesso_rapido');
  if (rapido && Array.isArray(rapido.items)) {
    const waItem = rapido.items.find(i => i.icon === 'whatsapp' || (i.url && i.url.includes('whatsapp.com')));
    const msg = encodeURIComponent('Olá! Tenho interesse em saber mais sobre os cursos da Faculdade Inspirar - Porto Alegre');
    if (waItem) {
      waItem.desc = 'Fale com nossa equipe • (51) 98948-0466';
      waItem.url = `https://api.whatsapp.com/send?phone=5551989480466&text=${msg}`;
    }
  }
}

// 3. Remove addresses from units with city photos
const citySlugs = [
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

citySlugs.forEach(slug => {
  const u = data.units.find(x => x.slug === slug);
  if (u) {
    u.address = '';
    u.fullAddress = '';
    const campusSec = (u.sections || []).find(s => s.id === 'campus');
    if (campusSec) {
      campusSec.bannerSub = `${u.name} - ${u.state}`;
    }
  }
});

fs.writeFileSync(UNITS_FILE, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('Successfully updated units.json with Rio, Porto Alegre WhatsApp and removed city addresses!');

// Update RAW_UNITS in scripts/generate-catalog.js
if (fs.existsSync(CATALOG_FILE)) {
  let catalogSrc = fs.readFileSync(CATALOG_FILE, 'utf8');
  citySlugs.forEach(slug => {
    const slugRegex = new RegExp(`(\\{[^{}]*slug:\\s*['"]${slug}['"][^{}]*address:\\s*['"])([^'"]+)(['"])`);
    if (slugRegex.test(catalogSrc)) {
      catalogSrc = catalogSrc.replace(slugRegex, `$1$3`);
    }
  });
  fs.writeFileSync(CATALOG_FILE, catalogSrc, 'utf8');
  console.log('Successfully updated RAW_UNITS in scripts/generate-catalog.js');
}
