/**
 * scripts/import-photos.js
 * Imports photos from "Fotos Unidades", normalizes filenames to web-safe standards,
 * and copies them to assets/images/units/<slug>/.
 * Also generates assets/images/units/manifest.json for units.json catalog integration.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const SOURCE_DIR = path.join(ROOT_DIR, 'Fotos Unidades');
const TARGET_UNITS_DIR = path.join(ROOT_DIR, 'assets', 'images', 'units');

const FOLDER_TO_SLUG = {
  'Balneário camboriu': 'balneario-camboriu',
  'Bauru-': 'bauru',
  'Belo Horizonte': 'belo-horizonte',
  'belém-': 'belem',
  'blumenau-': 'blumenau',
  'brasilia': 'brasilia',
  'Campinas -': 'campinas',
  'campo-grande': 'campo-grande',
  'cuiaba': 'cuiaba',
  'curitiba 2': 'curitiba',
  'Florianópolis': 'florianopolis',
  'guarulhos-': 'guarulhos',
  'Londrina -': 'londrina',
  'porto-alegre': 'porto-alegre',
  'rio de janeiro': 'rio-de-janeiro',
  'sao jose dos campos': 'sao-jose-dos-campos',
  'sao paulo - borba gato': 'sao-paulo-borba-gato',
  'sao paulo - vila mariana-': 'sao-paulo-vila-mariana',
  'sorocaba -': 'sorocaba',
  'são luís': 'sao-luis',
  'uberlândia': 'uberlandia',
  'vitoria': 'vitoria'
};

function sanitizeFileName(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  const base = path.basename(fileName, ext);

  let clean = base
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')     // replace non-alphanumeric with -
    .replace(/^-+|-+$/g, '');        // trim -

  return (clean || 'photo') + ext;
}

function generateCaption(fileName) {
  const lower = fileName.toLowerCase();
  if (lower.includes('fachada') || lower.includes('fechada')) return 'Fachada da Unidade';
  if (lower.includes('recep')) return 'Recepção e Atendimento';
  if (lower.includes('conviv')) return 'Área de Convivência';
  if (lower.includes('sala')) return 'Salas de Aula e Prática';
  if (lower.includes('clinica')) return 'Clínica Escola e Atendimento';
  if (lower.includes('biblioteca')) return 'Biblioteca e Estudos';
  if (lower.includes('estacionamento') || lower.includes('entrada')) return 'Entrada e Estacionamento';
  if (lower.includes('auditorio')) return 'Auditório de Eventos';
  if (lower.includes('metro')) return 'Acesso Próximo ao Metrô';
  return 'Instalações da Unidade';
}

function run() {
  console.log('--- Starting Unit Photo Import & Normalization ---');

  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`ERROR: Source directory not found: ${SOURCE_DIR}`);
    process.exit(1);
  }

  if (!fs.existsSync(TARGET_UNITS_DIR)) {
    fs.mkdirSync(TARGET_UNITS_DIR, { recursive: true });
  }

  const manifest = {};
  let totalFilesCopied = 0;

  const folders = fs.readdirSync(SOURCE_DIR);

  folders.forEach(folderName => {
    const slug = FOLDER_TO_SLUG[folderName];
    if (!slug) {
      console.warn(`NOTICE: No slug mapping for folder "${folderName}"`);
      return;
    }

    const folderPath = path.join(SOURCE_DIR, folderName);
    const stat = fs.statSync(folderPath);
    if (!stat.isDirectory()) return;

    const unitDestDir = path.join(TARGET_UNITS_DIR, slug);
    if (!fs.existsSync(unitDestDir)) {
      fs.mkdirSync(unitDestDir, { recursive: true });
    }

    const files = fs.readdirSync(folderPath);
    const photosList = [];

    files.forEach(file => {
      const ext = path.extname(file).toLowerCase();
      if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return;

      const sourceFilePath = path.join(folderPath, file);
      const safeName = sanitizeFileName(file);
      const targetFilePath = path.join(unitDestDir, safeName);

      fs.copyFileSync(sourceFilePath, targetFilePath);
      totalFilesCopied++;

      const relPath = `assets/images/units/${slug}/${safeName}`;
      photosList.push({
        file: safeName,
        src: relPath,
        caption: generateCaption(file)
      });
    });

    if (photosList.length > 0) {
      // Find best cover using priority: fachada > recepcao > convivencia > entrada > sala > others
      const priorityOrder = [
        p => p.caption === 'Fachada da Unidade',
        p => p.caption === 'Recepção e Atendimento',
        p => p.caption === 'Área de Convivência',
        p => p.caption === 'Entrada e Estacionamento',
        p => p.caption === 'Salas de Aula e Prática',
        p => !p.file.includes('banheiro')
      ];

      let bestCover = photosList[0];
      for (const rule of priorityOrder) {
        const found = photosList.find(rule);
        if (found) {
          bestCover = found;
          break;
        }
      }

      manifest[slug] = {
        coverImage: bestCover.src,
        gallery: photosList
      };
      console.log(`[${slug}] Imported ${photosList.length} photos (Cover: ${bestCover.file})`);
    }
  });

  const manifestPath = path.join(TARGET_UNITS_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`\nSaved manifest to ${manifestPath}`);
  console.log(`Total photos processed and normalized: ${totalFilesCopied}`);
  console.log('PHOTOS IMPORT COMPLETED');
  process.exit(0);
}

run();
