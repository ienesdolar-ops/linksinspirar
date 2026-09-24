/**
 * scripts/optimize-assets.js
 * Optimizes heavy raster images (PNG/JPEG) into lightweight, high-fidelity WebP format
 * using the system's ffmpeg installation.
 */

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const IMAGES_DIR = path.join(ROOT_DIR, 'assets', 'images');
const WEBP_DIR = path.join(IMAGES_DIR, 'webp');

if (!fs.existsSync(WEBP_DIR)) {
  fs.mkdirSync(WEBP_DIR, { recursive: true });
}

const IMAGES_TO_CONVERT = [
  {
    src: path.join(IMAGES_DIR, 'UNIDADE CWB sem gourmet.png'),
    dest: path.join(WEBP_DIR, 'unidade-cwb-cover.webp'),
    quality: 82
  },
  {
    src: path.join(IMAGES_DIR, 'UNIDADE CWB sem gourmet 2.png'),
    dest: path.join(WEBP_DIR, 'unidade-cwb-cover-2.webp'),
    quality: 82
  },
  {
    src: path.join(IMAGES_DIR, 'WhatsApp Image 2024-07-24 at 16.50.30.jpeg'),
    dest: path.join(WEBP_DIR, 'cwb-area-convivencia.webp'),
    quality: 82
  },
  {
    src: path.join(IMAGES_DIR, 'units', 'curitiba', 'biblioteca.jpeg'),
    dest: path.join(WEBP_DIR, 'cwb-biblioteca.webp'),
    quality: 82
  },
  {
    src: path.join(IMAGES_DIR, 'units', 'curitiba', 'sala-de-aula-2.jpeg'),
    dest: path.join(WEBP_DIR, 'cwb-sala-de-aula-2.webp'),
    quality: 82
  }
];

console.log('Optimizing images for Versão 2 (WebP conversion)...');
let totalOriginal = 0;
let totalOptimized = 0;

IMAGES_TO_CONVERT.forEach(item => {
  if (!fs.existsSync(item.src)) {
    console.warn(`[Skip] Source image not found: ${item.src}`);
    return;
  }

  const originalSize = fs.statSync(item.src).size;
  totalOriginal += originalSize;

  const res = spawnSync('ffmpeg', [
    '-i', item.src,
    '-c:v', 'libwebp',
    '-quality', String(item.quality),
    item.dest,
    '-y'
  ]);

  if (res.status === 0 && fs.existsSync(item.dest)) {
    const optSize = fs.statSync(item.dest).size;
    totalOptimized += optSize;
    const saving = ((1 - (optSize / originalSize)) * 100).toFixed(1);
    console.log(`✅ Converted: ${path.basename(item.src)} (${(originalSize / 1024).toFixed(1)} KB) -> ${path.basename(item.dest)} (${(optSize / 1024).toFixed(1)} KB) [Saved ${saving}%]`);
  } else {
    console.error(`❌ Failed converting: ${item.src}`);
  }
});

const totalSavings = ((1 - (totalOptimized / totalOriginal)) * 100).toFixed(1);
console.log(`\n🎉 Total: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB -> ${(totalOptimized / 1024 / 1024).toFixed(2)} MB (${totalSavings}% payload reduction)`);
