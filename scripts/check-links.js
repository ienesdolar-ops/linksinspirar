/**
 * scripts/check-links.js
 * Broken link checker for "Bio no Link" (Faculdade Inspirar).
 * Scans all URLs in data/units.json, validates format, optionally tests live HTTP response,
 * and writes an audit report to reports/link-audit.json and reports/link-audit.md.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT_DIR, 'data', 'units.json');
const REPORTS_DIR = path.join(ROOT_DIR, 'reports');

const isDryRun = process.argv.includes('--dry-run');

function collectUrls(data) {
  const links = [];

  // Global links
  if (data.project && data.project.globalSocial) {
    Object.entries(data.project.globalSocial).forEach(([key, url]) => {
      if (url) {
        links.push({
          source: 'global',
          unit: 'Institucional',
          field: key,
          url
        });
      }
    });
  }

  // Unit links
  if (Array.isArray(data.units)) {
    data.units.forEach(unit => {
      if (unit.website) {
        links.push({ source: 'unit_meta', unit: unit.name, field: 'website', url: unit.website });
      }
      if (unit.instagram) {
        links.push({ source: 'unit_meta', unit: unit.name, field: 'instagram', url: unit.instagram });
      }
      if (unit.mapsUrl) {
        links.push({ source: 'unit_meta', unit: unit.name, field: 'mapsUrl', url: unit.mapsUrl });
      }

      if (Array.isArray(unit.sections)) {
        unit.sections.forEach(sec => {
          if (Array.isArray(sec.items)) {
            sec.items.forEach(item => {
              if (item.url) {
                links.push({
                  source: sec.title || sec.id,
                  unit: unit.name,
                  field: item.title,
                  url: item.url
                });
              }
            });
          }
        });
      }
    });
  }

  return links;
}

function isValidUrl(string) {
  try {
    const parsed = new URL(string);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

async function testUrl(url, timeoutMs = 7000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Some platforms (Instagram, WhatsApp) return 400/403/429 to non-browser user agents
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    };

    let response;
    try {
      response = await fetch(url, {
        method: 'HEAD',
        headers,
        signal: controller.signal,
        redirect: 'follow'
      });
    } catch (headErr) {
      // Fallback to GET if HEAD method is not allowed
      response = await fetch(url, {
        method: 'GET',
        headers,
        signal: controller.signal,
        redirect: 'follow'
      });
    }

    clearTimeout(timeoutId);
    return {
      status: response.status,
      ok: response.status >= 200 && response.status < 400,
      statusText: response.statusText
    };
  } catch (err) {
    clearTimeout(timeoutId);
    return {
      status: 0,
      ok: false,
      error: err.name === 'AbortError' ? 'Timeout' : err.message
    };
  }
}

async function run() {
  console.log('--- Broken Link Checker: Bio no Link ---');
  if (isDryRun) {
    console.log('Mode: DRY-RUN (Syntax and structural catalog validation)');
  } else {
    console.log('Mode: LIVE CHECK (Testing HTTP endpoints)');
  }

  if (!fs.existsSync(DATA_FILE)) {
    console.error(`ERROR: data/units.json not found!`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const links = collectUrls(data);
  console.log(`Found ${links.length} URLs across all units.`);

  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }

  const results = [];
  let syntaxErrors = 0;

  for (const item of links) {
    const validFormat = isValidUrl(item.url);
    if (!validFormat) {
      syntaxErrors++;
      results.push({
        ...item,
        status: 'INVALID_URL',
        ok: false,
        error: 'Invalid URL format'
      });
      continue;
    }

    if (isDryRun) {
      results.push({
        ...item,
        status: 'FORMAT_OK',
        ok: true
      });
    } else {
      process.stdout.write(`Testing: [${item.unit}] ${item.field.slice(0, 30)}... `);
      const res = await testUrl(item.url);
      console.log(res.ok ? `[OK: ${res.status}]` : `[WARN: ${res.status || res.error}]`);
      results.push({
        ...item,
        status: res.status,
        ok: res.ok,
        error: res.error || null
      });
    }
  }

  // Generate Reports
  const reportJsonPath = path.join(REPORTS_DIR, 'link-audit.json');
  fs.writeFileSync(reportJsonPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    total: results.length,
    dryRun: isDryRun,
    results
  }, null, 2), 'utf8');

  let mdContent = `# Relatório de Verificação de Links — Bio no Link\n\n`;
  mdContent += `- **Data**: ${new Date().toLocaleString('pt-BR')}\n`;
  mdContent += `- **Modo**: ${isDryRun ? 'Validação Estrutural (Dry Run)' : 'Checagem Live HTTP'}\n`;
  mdContent += `- **Total de Links Verificados**: ${results.length}\n\n`;
  mdContent += `| Unidade | Campo / Título | URL | Status |\n`;
  mdContent += `| :--- | :--- | :--- | :--- |\n`;

  results.forEach(r => {
    const statusLabel = r.ok ? '✅ OK' : `⚠️ ${r.status || r.error}`;
    mdContent += `| ${r.unit} | ${r.field} | [${r.url.slice(0, 45)}...](${r.url}) | ${statusLabel} |\n`;
  });

  const reportMdPath = path.join(REPORTS_DIR, 'link-audit.md');
  fs.writeFileSync(reportMdPath, mdContent, 'utf8');

  console.log(`\nAudit saved to:\n- ${reportJsonPath}\n- ${reportMdPath}`);

  if (syntaxErrors > 0) {
    console.error(`FAILED: Found ${syntaxErrors} invalid URL(s)!`);
    process.exit(1);
  }

  console.log('LINK CHECKER VALIDATION PASSED');
  process.exit(0);
}

run();
