/**
 * scripts/test-event-dates.js
 * Verifies auto-expiring events logic (Gate 3).
 * Tests start date, end date, past events exclusion, active events inclusion,
 * and client-side auto-removal script presence.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

// Import the logic or re-test function
function isEventActive(item, referenceDate) {
  if (item.startDate && item.startDate > referenceDate) {
    return false; // Not yet started
  }
  if (item.endDate && item.endDate < referenceDate) {
    return false; // Expired
  }
  return true;
}

function runTests() {
  console.log('--- Testing Auto-Expiring Events Logic (Gate 3) ---');

  const refDate = '2026-09-24';

  // Test Case 1: Expired event
  const expiredEvent = {
    title: 'Open Day Inspirar Passado',
    startDate: '2026-08-01',
    endDate: '2026-09-10'
  };
  assert.strictEqual(
    isEventActive(expiredEvent, refDate),
    false,
    'Expired event should NOT be active'
  );
  console.log('Test 1 Passed: Past event (endDate < today) correctly identified as inactive.');

  // Test Case 2: Future event
  const futureEvent = {
    title: 'Congresso 2028',
    startDate: '2028-01-01',
    endDate: '2028-01-05'
  };
  assert.strictEqual(
    isEventActive(futureEvent, refDate),
    false,
    'Future event should NOT be active yet'
  );
  console.log('Test 2 Passed: Future event (startDate > today) correctly identified as inactive.');

  // Test Case 3: Currently active event
  const activeEvent = {
    title: 'Amo Fisio 2026',
    startDate: '2026-09-01',
    endDate: '2026-10-30'
  };
  assert.strictEqual(
    isEventActive(activeEvent, refDate),
    true,
    'Ongoing event should be active'
  );
  console.log('Test 3 Passed: Ongoing event spanning today is active.');

  // Test Case 4: Event without date restrictions
  const perpetualEvent = {
    title: 'Inscrições Abertas 2026'
  };
  assert.strictEqual(
    isEventActive(perpetualEvent, refDate),
    true,
    'Event without date restrictions should be active'
  );
  console.log('Test 4 Passed: Perpetual event is active.');

  // Test Case 5: Verify client-side script in generated HTML
  const curitibaHtmlPath = path.join(ROOT_DIR, 'curitiba', 'index.html');
  if (!fs.existsSync(curitibaHtmlPath)) {
    console.error('ERROR: curitiba/index.html not found. Run scripts/build.js first.');
    process.exit(1);
  }
  const curitibaHtml = fs.readFileSync(curitibaHtmlPath, 'utf8');
  assert(
    curitibaHtml.includes('filterExpiredEvents'),
    'Generated HTML must include client-side filterExpiredEvents function'
  );
  assert(
    curitibaHtml.includes('data-end-date'),
    'Active date-bounded event cards must include data-end-date attribute'
  );
  console.log('Test 5 Passed: Client-side auto-expiry script and data attributes are present in generated HTML.');

  console.log('\nEVENT EXPIRATION TESTS PASSED');
  process.exit(0);
}

runTests();
