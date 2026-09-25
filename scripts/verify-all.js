/**
 * scripts/verify-all.js
 * End-to-end verification suite testing all 6 gates for 37 units:
 * 1. Asset Ingestion & Normalization
 * 2. Data schema and validation (37 units)
 * 3. Static generator build output (all 37 unit pages + Hub)
 * 4. Unit content fidelity (Curitiba preservation & custom unit photos)
 * 5. Auto-expiring events logic
 * 6. Broken link checker
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT_DIR, 'data', 'units.json');

function runStep(name, fn) {
  process.stdout.write(`Checking ${name}... `);
  try {
    fn();
    console.log('✅ OK');
  } catch (err) {
    console.log('❌ FAILED');
    console.error(err);
    process.exit(1);
  }
}

console.log('====================================================');
console.log('  Bio no Link — Full Verification Suite (37 Units)');
console.log('====================================================\n');

// 1. Photo Ingestion & Manifest
runStep('Gate 1: Photo Ingestion & Manifest', () => {
  const manifestPath = path.join(ROOT_DIR, 'assets', 'images', 'units', 'manifest.json');
  assert(fs.existsSync(manifestPath), 'manifest.json missing');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const unitFolders = Object.keys(manifest);
  assert(unitFolders.length >= 22, `Expected at least 22 photo folders, found ${unitFolders.length}`);
});

// 2. Data Validation
runStep('Gate 2: Data Pipeline Validation (37 units)', () => {
  execSync('node scripts/validate-data.js', { cwd: ROOT_DIR, stdio: 'pipe' });
});

// 3. Static Build & Coverage
runStep('Gate 3: Static Generation (Hub + 37 Units)', () => {
  execSync('node scripts/build.js', { cwd: ROOT_DIR, stdio: 'pipe' });

  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  assert.strictEqual(data.units.length, 37, 'Must have exactly 37 units in catalog');

  // Verify Hub
  const hubHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
  assert(hubHtml.includes('Todas (37)'), 'Hub must have region chip with 37 units');

  // Verify each unit folder and index.html
  data.units.forEach(unit => {
    const unitHtmlPath = path.join(ROOT_DIR, unit.slug, 'index.html');
    assert(fs.existsSync(unitHtmlPath), `Missing index.html for unit: ${unit.slug}`);
    const html = fs.readFileSync(unitHtmlPath, 'utf8');
    assert(html.includes(unit.name), `Unit page for ${unit.slug} must include name ${unit.name}`);
    assert(html.includes(unit.state), `Unit page for ${unit.slug} must include state ${unit.state}`);
  });
});

// 4. Curitiba Fidelity & Custom Photos
runStep('Gate 4: Content Fidelity & Custom Photos', () => {
  const cwbHtml = fs.readFileSync(path.join(ROOT_DIR, 'curitiba', 'index.html'), 'utf8');
  assert(cwbHtml.includes('Fisioterapia em Terapia Intensiva'), 'Must have Intensive Care course');
  assert(cwbHtml.includes('Amo Fisio'), 'Must have Amo Fisio event');
  assert(cwbHtml.includes('Jardim Schaffer'), 'Must have Jardim Schaffer address');
  assert(cwbHtml.includes('0800 602 2828'), 'Must have 0800 phone');
  assert(cwbHtml.includes('UNIDADE CWB sem gourmet.png'), 'Must have facade cover image');

  // Check units with custom photos
  const rioHtml = fs.readFileSync(path.join(ROOT_DIR, 'rio-de-janeiro', 'index.html'), 'utf8');
  assert(rioHtml.includes('assets/images/units/rio-de-janeiro'), 'Rio must use imported photo');

  const bsbHtml = fs.readFileSync(path.join(ROOT_DIR, 'brasilia', 'index.html'), 'utf8');
  assert(bsbHtml.includes('assets/images/units/brasilia'), 'Brasilia must use imported photo');
});

// 5. Auto-expiring events
runStep('Gate 5: Auto-expiring Events', () => {
  execSync('node scripts/test-event-dates.js', { cwd: ROOT_DIR, stdio: 'pipe' });
});

// 6. Broken Link Checker
runStep('Gate 6: Broken Link Checker (Dry Run)', () => {
  execSync('node scripts/check-links.js --dry-run', { cwd: ROOT_DIR, stdio: 'pipe' });
  assert(fs.existsSync(path.join(ROOT_DIR, 'reports', 'link-audit.json')), 'Report json missing');
  assert(fs.existsSync(path.join(ROOT_DIR, 'reports', 'link-audit.md')), 'Report md missing');
});

// 7. Dedicated Instagram Profiles & 30 Anos Verification
runStep('Gate 7: Dedicated Instagram Profiles (37/37 Units) & 30 Anos Branding', () => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  assert.strictEqual(data.units.length, 37, 'Must have 37 units');

  const expectedPortal = 'https://portaldoaluno.inspirar.com.br/projetos/nucleo/uteis/login.php?&tid=0&lid=0&pid=24&arq_ret=R5QT1WSRQBMCVQVPFFQSF99MCT5RT44Q9WRW0RBM0FMM5QQ4';
  assert.strictEqual(data.project.globalSocial.portalAluno, expectedPortal, 'Portal do Aluno URL must match requested login portal');

  // Verify the 4 specifically updated Instagrams
  const bsb = data.units.find(u => u.slug === 'brasilia');
  assert.strictEqual(bsb.instagram, 'https://www.instagram.com/inspirar_brasilia/');
  assert.strictEqual(bsb.instagramUser, '@inspirar_brasilia');

  const luanda = data.units.find(u => u.slug === 'luanda');
  assert.strictEqual(luanda.instagram, 'https://www.instagram.com/inspirarangola/');
  assert.strictEqual(luanda.instagramUser, '@inspirarangola');

  const maceio = data.units.find(u => u.slug === 'maceio');
  assert.strictEqual(maceio.instagram, 'https://www.instagram.com/faculdadeinspirarmaceio/');
  assert.strictEqual(maceio.instagramUser, '@faculdadeinspirarmaceio');

  const parauapebas = data.units.find(u => u.slug === 'parauapebas');
  assert.strictEqual(parauapebas.instagram, 'https://www.instagram.com/inspirarparauapebas/');
  assert.strictEqual(parauapebas.instagramUser, '@inspirarparauapebas');

  let dedicatedCount = 0;
  data.units.forEach(unit => {
    assert(unit.instagram && unit.instagram.includes('instagram.com'), `Unit ${unit.slug} missing instagram URL`);
    assert(unit.instagramUser && unit.instagramUser.startsWith('@'), `Unit ${unit.slug} missing instagram handle`);

    // Verify unit index.html has its designated instagram link, handle, and 30 anos seal
    const unitHtml = fs.readFileSync(path.join(ROOT_DIR, unit.slug, 'index.html'), 'utf8');
    assert(unitHtml.includes(unit.instagram), `Unit ${unit.slug} HTML missing instagram link: ${unit.instagram}`);
    assert(unitHtml.includes(unit.instagramUser), `Unit ${unit.slug} HTML missing instagram handle: ${unit.instagramUser}`);
    assert(unitHtml.includes('30 Anos de Inspirar'), `Unit ${unit.slug} HTML missing 30 Anos de Inspirar in footer`);
    assert(unitHtml.includes(expectedPortal), `Unit ${unit.slug} HTML missing Portal do Aluno in footer`);

    if (unit.instagramUser !== '@faculdadeinspirar') {
      dedicatedCount++;
    }
  });

  // Exactly 37 out of 37 units now have their own dedicated accounts!
  assert.strictEqual(dedicatedCount, 37, `Expected all 37 dedicated unit Instagrams, got ${dedicatedCount}`);

  // Verify Hub index.html contains all 37 unit Instagram links and 30 Anos branding
  const hubHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
  assert(hubHtml.includes('30 Anos de Inspirar'), 'Hub HTML missing 30 Anos de Inspirar in footer');
  assert(hubHtml.includes(expectedPortal), 'Hub HTML missing Portal do Aluno URL');
  data.units.forEach(unit => {
    assert(hubHtml.includes(unit.instagram), `Hub HTML missing instagram link for ${unit.slug}`);
  });
});

// 8. Unit Links Configuration Fidelity (All 37 Units Audited)
runStep('Gate 8: Unit Links Configuration Fidelity (37 Units Audited)', () => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

  // 1. Vila Mariana auto-expiring workshop
  const vm = data.units.find(u => u.slug === 'sao-paulo-vila-mariana');
  const vmJson = JSON.stringify(vm.sections);
  assert(vmJson.includes('workshop-estetica-intima-feminina-na-fisioterapia-pelvica'), 'Vila Mariana missing workshop link');
  assert(vmJson.includes('2026-11-07T09:00:00-03:00'), 'Vila Mariana missing 07/11 09:00 expiration');

  // 2. Curitiba fidelity to linktreecuritiba.vercel.app
  const cwb = data.units.find(u => u.slug === 'curitiba');
  const cwbJson = JSON.stringify(cwb.sections);
  assert(cwbJson.includes('semi-intensiva'), 'Curitiba missing semi-intensiva');
  assert(cwbJson.includes('fisioterapia-vestibular'), 'Curitiba missing vestibular');
  assert(cwbJson.includes('amofisio.vercel.app'), 'Curitiba missing amofisio');
  assert(cwbJson.includes('congresso-de-estetica'), 'Curitiba missing congresso estética');

  // 3. Belém Linktree
  const belem = data.units.find(u => u.slug === 'belem');
  assert(JSON.stringify(belem.sections).includes('https://tr.ee/Yb2RHb61F2'), 'Belém missing tr.ee link');

  // 4. Santo André VIP group
  const sta = data.units.find(u => u.slug === 'santo-andre');
  assert(JSON.stringify(sta.sections).includes('chat.whatsapp.com'), 'Santo André missing WhatsApp VIP group');

  // 5. São Luís links & Sympla expiration
  const slz = data.units.find(u => u.slug === 'sao-luis');
  const slzJson = JSON.stringify(slz.sections);
  assert(slzJson.includes('pelve-expert-sao-luis-do-maranhao'), 'São Luís missing Pelve Expert');
  assert(slzJson.includes('2026-12-10T18:30:00-03:00'), 'São Luís missing 10/12 18:30 expiration');
  assert(slzJson.includes('7HAT7265HDZNL1'), 'São Luís missing WhatsApp link');

  // 6. Brasília Sympla & expiration
  const bsb = data.units.find(u => u.slug === 'brasilia');
  const bsbJson = JSON.stringify(bsb.sections);
  assert(bsbJson.includes('i-simposio-de-acupuntura'), 'Brasília missing simpósio link');
  assert(bsbJson.includes('2026-12-05T08:00:00-03:00'), 'Brasília missing 05/12 08:00 expiration');

  // 7. No duplicate WhatsApp links across all 37 units
  data.units.forEach(u => {
    const waCount = (u.sections || []).flatMap(s => s.items || [])
      .filter(item => (item.url && (item.url.includes('whatsapp.com') || item.url.includes('wa.me'))) || item.icon === 'whatsapp').length;
    assert.strictEqual(waCount, 1, `Unit ${u.slug} must have exactly 1 WhatsApp link, got ${waCount}`);
  });
});

// 9. Browser Tab Icon (Favicon with Símbolo Branco)
runStep('Gate 9: Browser Tab Icon (Favicon with Símbolo Branco)', () => {
  const assetFavicon = path.join(ROOT_DIR, 'assets', 'images', 'favicon.png');
  const assetSimbolo = path.join(ROOT_DIR, 'assets', 'images', 'simbolo-branco.png');
  const rootFavicon = path.join(ROOT_DIR, 'favicon.png');
  const rootIco = path.join(ROOT_DIR, 'favicon.ico');

  assert(fs.existsSync(assetFavicon), 'assets/images/favicon.png is missing');
  assert(fs.existsSync(assetSimbolo), 'assets/images/simbolo-branco.png is missing');
  assert(fs.existsSync(rootFavicon), 'favicon.png in root is missing');
  assert(fs.existsSync(rootIco), 'favicon.ico in root is missing');

  // Verify Hub index.html
  const hubHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
  assert(hubHtml.includes('href="assets/images/favicon.png"'), 'Hub HTML missing favicon.png reference');
  assert(hubHtml.includes('rel="icon"'), 'Hub HTML missing rel="icon"');

  // Verify all 37 units
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  data.units.forEach(unit => {
    const unitHtml = fs.readFileSync(path.join(ROOT_DIR, unit.slug, 'index.html'), 'utf8');
    assert(unitHtml.includes('href="../assets/images/favicon.png"'), `Unit ${unit.slug} missing favicon.png reference`);
    assert(unitHtml.includes('rel="icon"'), `Unit ${unit.slug} missing rel="icon"`);
  });
});

// 10. Schema.org JSON-LD Structured Data Validation
runStep('Gate 10: Schema.org JSON-LD Structured Data (Hub + 37 Units)', () => {
  execSync('node scripts/validate-schema.js', { cwd: ROOT_DIR, stdio: 'pipe' });
});

console.log('\n====================================================');
console.log('ALL VERIFICATIONS PASSED (10 Gates / 37 units)');
console.log('====================================================');
process.exit(0);
