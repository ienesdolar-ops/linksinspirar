/**
 * scripts/sync-amofisio-events.js
 * Fetches all AmoFisio events for each unit from https://amofisio.vercel.app/data.js,
 * enriches them with official Sympla banners and start dates (for expiration),
 * and saves the catalog to data/amofisio-events.json.
 */

const fs = require('fs');
const path = require('path');
const { fetchSymplaEvent, extractSymplaEventId, formatSymplaDate } = require('./sympla');

const ROOT_DIR = path.resolve(__dirname, '..');
const AMOFISIO_DATA_FILE = path.join(ROOT_DIR, 'reports', 'amofisio_data.js');
const OUTPUT_FILE = path.join(ROOT_DIR, 'data', 'amofisio-events.json');

// Map AmoFisio unit IDs to linksinspirar slugs
const SLUG_MAP = {
  'bauru': 'bauru',
  'belem': 'belem',
  'belo-horizonte': 'belo-horizonte',
  'blumenau': 'blumenau',
  'campinas': 'campinas',
  'campo-grande': 'campo-grande',
  'cuiaba': 'cuiaba',
  'curitiba': 'curitiba',
  'florianopolis': 'florianopolis',
  'fortaleza': 'fortaleza',
  'goiania': 'goiania',
  'guarulhos': 'guarulhos',
  'londrina': 'londrina',
  'maceio': 'maceio',
  'porto-velho': 'porto-velho',
  'ribeirao-preto': 'ribeirao-preto',
  'rio-de-janeiro': 'rio-de-janeiro',
  'sao-jose-dos-campos': 'sao-jose-dos-campos',
  'sao-luis': 'sao-luis',
  'sp-borba-gato': 'sao-paulo-borba-gato',
  'sp-vila-mariana': 'sao-paulo-vila-mariana',
  'sorocaba': 'sorocaba',
  'vitoria': 'vitoria'
};

async function fetchPublicSympla(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const html = await res.text();
    const nextMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/i);
    if (nextMatch) {
      const data = JSON.parse(nextMatch[1]);
      const ev = data.props?.pageProps?.hydrationData?.eventHydration?.event;
      if (ev) {
        return {
          id: ev.id,
          name: ev.name,
          image: ev.logoUrl || null,
          startDate: ev.startDate,
          endDate: ev.endDate
        };
      }
    }

    const ogImg = html.match(/<meta property=["']og:image["'] content=["']([^"']+)["']/i);
    if (ogImg) {
      return { image: ogImg[1] };
    }
  } catch (err) {
    // console.warn(`Failed fetching public ${url}:`, err.message);
  }
  return null;
}

async function getEventDetails(symplaUrl) {
  const eventId = extractSymplaEventId(symplaUrl);
  if (!eventId) return null;

  // 1. Try API first
  let ev = await fetchSymplaEvent(eventId);
  if (ev && ev.image) {
    return {
      id: ev.id,
      name: ev.name,
      banner: ev.image,
      startDate: ev.start_date
    };
  }

  // 2. Try Public page fallback
  const pub = await fetchPublicSympla(symplaUrl);
  if (pub) {
    return {
      id: pub.id || eventId,
      name: pub.name,
      banner: pub.image,
      startDate: pub.startDate
    };
  }

  return null;
}

async function main() {
  console.log('--- Syncing AmoFisio Events from amofisio.vercel.app ---');

  if (!fs.existsSync(AMOFISIO_DATA_FILE)) {
    console.error(`ERROR: ${AMOFISIO_DATA_FILE} not found. Please download it first.`);
    process.exit(1);
  }

  let code = fs.readFileSync(AMOFISIO_DATA_FILE, 'utf8');
  code = code.replace(/const AMO_FISIO_DATA\s*=/, 'global.AMO_FISIO_DATA =');
  eval(code);
  const amoData = global.AMO_FISIO_DATA;

  console.log(`Found ${amoData.units.length} units in AmoFisio catalog.`);

  // Load existing cache if present to avoid re-fetching
  let existingCache = {};
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      existingCache = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
    } catch (e) {}
  }

  const resultBySlug = {};
  let totalCourses = 0;
  let fetchedCount = 0;

  for (const u of amoData.units) {
    const slug = SLUG_MAP[u.id];
    if (!slug) {
      console.warn(`Unmapped unit ID: ${u.id}`);
      continue;
    }

    resultBySlug[slug] = [];
    const courses = u.courses || [];
    totalCourses += courses.length;

    console.log(`Processing unit: ${u.name} (${slug}) - ${courses.length} courses`);

    for (const c of courses) {
      const symplaUrl = c.symplaUrl;
      const eventId = extractSymplaEventId(symplaUrl);

      // Check existing cache
      const cached = (existingCache[slug] || []).find(item => item.url === symplaUrl);
      if (cached && cached.banner && cached.endDate) {
        resultBySlug[slug].push(cached);
        continue;
      }

      fetchedCount++;
      process.stdout.write(`  Fetching [${eventId}] ${c.title.slice(0, 40)}... `);

      const details = await getEventDetails(symplaUrl);
      const banner = details?.banner || 'https://amofisio.vercel.app/amofisio_logo.png';
      const startDateTime = details?.startDate ? formatSymplaDate(details.startDate) : null;

      const item = {
        title: `AmoFisio — ${c.title}`,
        desc: c.description ? `${c.category || 'Workshop Presencial'} • ${c.description}` : `${c.category || 'Workshop Presencial'} • AmoFisio Inspirar`,
        url: symplaUrl,
        icon: "heart",
        accent: "purple",
        startDate: "2026-09-01",
        endDate: startDateTime || "2026-12-31T23:59:59-03:00",
        banner: banner
      };

      resultBySlug[slug].push(item);
      console.log(`✅ ${banner.includes('sympla') ? 'Banner OK' : 'Fallback'} (${startDateTime || 'no date'})`);

      // Gentle pause to avoid rate limiting
      await new Promise(r => setTimeout(r, 150));
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(resultBySlug, null, 2) + '\n', 'utf8');
  console.log(`\nSuccessfully saved ${totalCourses} AmoFisio events to ${OUTPUT_FILE}!`);
  console.log(`(Newly fetched: ${fetchedCount})`);
}

main().catch(err => {
  console.error('Failed syncing AmoFisio events:', err);
  process.exit(1);
});
