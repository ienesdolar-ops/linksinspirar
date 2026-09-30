/**
 * scripts/sympla.js
 * Integration with Sympla Public API v3.
 * Automatically fetches event details (cover/banner image, start date, title)
 * for any Sympla event link across all Inspirar units.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT_DIR, 'data', 'units.json');

// Sympla API Token provided by user
const SYMPLA_TOKEN = process.env.SYMPLA_TOKEN || '3c53762d14d139ec276692b86d49fa2e478279608c6aa00a4b8b11124176f580';
const SYMPLA_API_BASE = 'https://api.sympla.com.br/public/v3';

/**
 * Extracts numeric Sympla event ID from URL.
 * Handles formats like:
 * - https://www.sympla.com.br/evento/nome-do-evento/3582004?param=1
 * - https://www.sympla.com.br/3582004
 * - https://sympla.com.br/evento/3582004
 */
function extractSymplaEventId(url) {
  if (!url || typeof url !== 'string') return null;
  if (!url.includes('sympla.com.br')) return null;

  const match = url.match(/(?:sympla\.com\.br\/(?:evento\/[^\/?#]+\/)?|sympla\.com\.br\/)(\d{5,10})/i);
  if (match && match[1]) {
    return match[1];
  }

  const fallbackMatch = url.match(/\/(\d{5,10})(?:[/?#]|$)/);
  return fallbackMatch ? fallbackMatch[1] : null;
}

/**
 * Scrapes public Sympla event page as fallback if API returns 401/403 or event is from another organizer account.
 */
async function fetchSymplaPublicEvent(eventIdOrUrl) {
  const url = eventIdOrUrl.startsWith('http') 
    ? eventIdOrUrl 
    : `https://www.sympla.com.br/${eventIdOrUrl}`;

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

    if (!res.ok) {
      console.warn(`[Sympla Public] HTTP ${res.status} for ${url}`);
      return null;
    }

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
          start_date: ev.startDate,
          end_date: ev.endDate,
          url: ev.newUrl || url
        };
      }
    }

    const ogImg = html.match(/<meta property=["']og:image["'] content=["']([^"']+)["']/i);
    if (ogImg) {
      return { image: ogImg[1] };
    }
  } catch (err) {
    console.warn(`[Sympla Public] Failed to fetch ${eventIdOrUrl}:`, err.message);
  }
  return null;
}

/**
 * Fetches event data from Sympla API v3 with automatic fallback to public event page.
 * Returns null if network fails or event not found.
 */
async function fetchSymplaEvent(eventId, token = SYMPLA_TOKEN, eventUrl = null) {
  if (!eventId) return null;
  const endpoint = `${SYMPLA_API_BASE}/events/${eventId}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(endpoint, {
      headers: {
        's_token': token,
        'Accept': 'application/json'
      },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (res.ok) {
      const json = await res.json();
      if (json.data) return json.data;
    } else {
      // 401/403: event belongs to a different organizer account; fallback to public page
      return await fetchSymplaPublicEvent(eventUrl || eventId);
    }
  } catch (err) {
    // On API error, fallback to public page
    return await fetchSymplaPublicEvent(eventUrl || eventId);
  }
  return null;
}

/**
 * Formats a Sympla start_date ("YYYY-MM-DD HH:mm:ss") into ISO format with BRT timezone ("YYYY-MM-DDTHH:mm:ss-03:00").
 */
function formatSymplaDate(dateStr) {
  if (!dateStr) return null;
  const clean = dateStr.trim();
  if (clean.includes('T')) return clean;
  const parts = clean.split(' ');
  if (parts.length === 2) {
    return `${parts[0]}T${parts[1]}-03:00`;
  }
  return clean;
}

/**
 * Scans data for Sympla links and enriches them with banner image and expiration date.
 * @param {Object} data The parsed units.json object
 * @param {Object} options { force: boolean, save: boolean }
 * @returns {Promise<{ total: number, updated: number, errors: number, data: Object }>}
 */
async function enrichSymplaEvents(data, options = {}) {
  const { force = false, save = true } = options;
  const cache = new Map();

  let total = 0;
  let updated = 0;
  let errors = 0;

  if (!data || !Array.isArray(data.units)) {
    return { total, updated, errors, data };
  }

  for (const unit of data.units) {
    if (!Array.isArray(unit.sections)) continue;

    for (const sec of unit.sections) {
      if (!Array.isArray(sec.items)) continue;

      for (const item of sec.items) {
        if (!item.url || !item.url.includes('sympla.com.br')) continue;

        total++;
        const eventId = extractSymplaEventId(item.url);
        if (!eventId) {
          console.warn(`[Sympla] Could not extract event ID from URL: ${item.url}`);
          errors++;
          continue;
        }

        // If banner already exists and force is false, keep existing
        if (item.banner && !force) {
          continue;
        }

        // Check in-memory cache
        let eventData = cache.get(eventId);
        if (!eventData && !cache.has(eventId)) {
          eventData = await fetchSymplaEvent(eventId, SYMPLA_TOKEN, item.url);
          cache.set(eventId, eventData);
        }

        if (!eventData) {
          errors++;
          continue;
        }

        let itemChanged = false;

        // Cover / Banner image from Sympla
        if (eventData.image && item.banner !== eventData.image) {
          item.banner = eventData.image;
          itemChanged = true;
        }

        // Auto-expire when event starts (if endDate not already custom set)
        if (eventData.start_date && !item.endDate) {
          item.endDate = formatSymplaDate(eventData.start_date);
          itemChanged = true;
        }

        if (itemChanged) {
          updated++;
          console.log(`[Sympla] Enriched "${item.title}" (${unit.slug}) with banner: ${item.banner}`);
        }
      }
    }
  }

  if (updated > 0 && save) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2) + '\n', 'utf8');
    console.log(`[Sympla] Successfully updated data/units.json (${updated} items updated).`);
  }

  return { total, updated, errors, data };
}

// Standalone execution: node scripts/sympla.js [--force]
if (require.main === module) {
  const force = process.argv.includes('--force');
  console.log(`--- Syncing Sympla Banners & Metadata (force=${force}) ---`);

  if (!fs.existsSync(DATA_FILE)) {
    console.error(`ERROR: data file not found at ${DATA_FILE}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  const data = JSON.parse(raw);

  enrichSymplaEvents(data, { force, save: true })
    .then(result => {
      console.log(`\nSympla Sync Complete:`);
      console.log(`- Total Sympla links found: ${result.total}`);
      console.log(`- Updated: ${result.updated}`);
      console.log(`- Errors: ${result.errors}`);
      process.exit(0);
    })
    .catch(err => {
      console.error('Sympla Sync Failed:', err);
      process.exit(1);
    });
}

module.exports = {
  SYMPLA_TOKEN,
  extractSymplaEventId,
  fetchSymplaEvent,
  formatSymplaDate,
  enrichSymplaEvents
};
