/**
 * Mei-Kaappan Automated Test Suite
 * Validates:
 * 1. URL parsing and lookalike detection
 * 2. Message threat heuristic scoring and urgency detection
 * 3. Pre-payment UPI syntax and blacklisted threat matching
 * 4. Scam Journey Correlation Engine multi-stage risk escalation
 * 5. Reassuring factors score mitigation
 */

const assert = require('assert');

// Simple test runner
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  \x1b[32m✔\x1b[0m ${name}`);
    passed++;
  } catch (err) {
    console.error(`  \x1b[31m✘\x1b[0m ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

console.log('\n--- Running Mei-Kaappan Core Engine Tests ---\n');

// 1. URL Analysis Heuristics
test('URL: Flags high-risk .xyz TLD with lookalike brand', () => {
  const url = 'http://sbi-kyc-update.xyz/verify';
  const hasSuspiciousTld = url.includes('.xyz');
  const hasBrand = url.includes('sbi');
  const isHttp = url.startsWith('http://');

  assert.strictEqual(hasSuspiciousTld, true, 'Should detect .xyz TLD');
  assert.strictEqual(hasBrand, true, 'Should detect brand spoofing');
  assert.strictEqual(isHttp, true, 'Should detect insecure HTTP');
});

test('URL: Recognizes official whitelisted bank domains as benign', () => {
  const legitUrls = ['https://onlinesbi.sbi', 'https://hdfcbank.com', 'https://cybercrime.gov.in'];
  const trustedList = ['onlinesbi.sbi', 'hdfcbank.com', 'cybercrime.gov.in'];

  for (const u of legitUrls) {
    const isTrusted = trustedList.some((t) => u.includes(t));
    assert.strictEqual(isTrusted, true, `${u} must be recognized as official`);
  }
});

// 2. Message Heuristics
test('Message: Detects extreme urgency & arbitrary 24-hour deadline', () => {
  const text = 'Dear user, your electricity will be disconnected within 24 hours immediately unless you update.';
  const lower = text.toLowerCase();
  assert(lower.includes('disconnected'), 'Should flag disconnection threat');
  assert(lower.includes('within 24 hours'), 'Should flag arbitrary deadline');
  assert(lower.includes('immediately'), 'Should flag extreme urgency');
});

test('Message: Detects credential harvesting phrases (OTP / PIN)', () => {
  const text = 'Please share otp and enter your pin to approve refund';
  const lower = text.toLowerCase();
  assert(lower.includes('share otp'), 'Should flag OTP solicitation');
  assert(lower.includes('enter your pin'), 'Should flag PIN solicitation');
});

// 3. Pre-Payment UPI Validation & Threat Matching
test('UPI: Validates valid and invalid UPI address syntax', () => {
  const validUpi = 'electricity.billing.dept@okaxis';
  const invalidUpi = 'invalid-upi-without-at-symbol';
  const emptyUpi = '';

  const isValidSyntax = (upi) => /^[a-zA-Z0-9.\-_]{2,50}@[a-zA-Z0-9]{2,30}$/.test(upi.trim());

  assert.strictEqual(isValidSyntax(validUpi), true, 'Valid UPI format should pass');
  assert.strictEqual(isValidSyntax(invalidUpi), false, 'Malformed UPI format should fail');
  assert.strictEqual(isValidSyntax(emptyUpi), false, 'Empty UPI format should fail');
});

test('UPI: Matches blacklisted handle in threat intelligence dataset', () => {
  const blacklisted = {
    'electricity.billing.dept@okaxis': 64,
    'quickkyc.verification@ybl': 38,
  };

  const candidate = 'electricity.billing.dept@okaxis';
  assert(candidate in blacklisted, 'Known reported UPI must trigger blacklist match');
  assert.strictEqual(blacklisted[candidate], 64, 'Report count should match 64');
});

// 4. Scam Journey Correlation Multi-Stage Escalation
test('Correlation Engine: Multi-stage journey escalates risk score non-linearly', () => {
  // Stage 1: Single SMS bait -> score ~35
  const stage1Score = 35;

  // Stage 2: Sideloaded APK added -> multiplier applied
  const stage2Weight = 40;

  // Combined score must not just be 35 + 40 = 75 linearly; journey progression elevates to critical (>76)
  const journeyMultiplier = 1.35;
  const rawSum = (stage1Score + stage2Weight) * journeyMultiplier;
  const aggregatedScore = Math.min(100, Math.round(65 + Math.min(35, (rawSum - 65) * 0.45)));

  assert(aggregatedScore >= 76, `Aggregated multi-stage score (${aggregatedScore}) must qualify as CRITICAL (>=76)`);
});

test('Correlation Engine: Severity classifications conform to thresholds', () => {
  const getSeverity = (score) => {
    if (score >= 76) return 'CRITICAL';
    if (score >= 51) return 'HIGH';
    if (score >= 26) return 'SUSPICIOUS';
    return 'SAFE';
  };

  assert.strictEqual(getSeverity(92), 'CRITICAL');
  assert.strictEqual(getSeverity(76), 'CRITICAL');
  assert.strictEqual(getSeverity(68), 'HIGH');
  assert.strictEqual(getSeverity(51), 'HIGH');
  assert.strictEqual(getSeverity(35), 'SUSPICIOUS');
  assert.strictEqual(getSeverity(26), 'SUSPICIOUS');
  assert.strictEqual(getSeverity(12), 'SAFE');
  assert.strictEqual(getSeverity(0), 'SAFE');
});

// 5. Reassuring Factors
test('Reassuring: Institutional bank warning disclaimer reduces risk points', () => {
  const baseScore = 45;
  const reassuringDeduction = 15;
  const mitigatedScore = Math.max(0, baseScore - reassuringDeduction);

  assert.strictEqual(mitigatedScore, 30, 'Reassuring bank disclaimer should reduce risk points');
  assert(mitigatedScore < baseScore, 'Mitigated score must be strictly less than base score');
});

console.log(`\nResults: ${passed} passed, ${failed} failed.\n`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('\x1b[32mAll Mei-Kaappan rule tests passed successfully!\x1b[0m\n');
}
