/**
 * Mei-Kaappan Message & URL Scanner Engine
 * Deterministic, explainable heuristics for phishing, urgency, credential harvesting,
 * and malicious URL structures.
 * 
 * IMPORTANT: Pure client-side parsing is used to prevent SSRF (Server-Side Request Forgery).
 * Submitted URLs are NEVER fetched or pinged by the server.
 */

import { Severity, RiskFactor } from '../types';

export interface ScanResult {
  textAnalyzed: string;
  urlAnalyzed?: string;
  riskScore: number; // 0 - 100
  severity: Severity;
  detectedCategories: string[];
  positiveFactors: RiskFactor[];
  reassuringFactors: RiskFactor[];
  extractedIndicators: {
    phones: string[];
    urls: string[];
    upis: string[];
  };
  confidence: number;
  explanation: string;
  recommendedSteps: string[];
  method: 'RULE_BASED';
  timestamp: string;
}

// Known dangerous TLDs often abused in fast-flux phishing campaigns
const SUSPICIOUS_TLDS = new Set([
  '.xyz', '.top', '.buzz', '.work', '.tk', '.ml', '.ga', '.cf', '.gq',
  '.icu', '.click', '.rest', '.link', '.hair', '.skin', '.monster', '.support'
]);

// URL Shortener domains
const SHORTENER_DOMAINS = new Set([
  'bit.ly', 'tinyurl.com', 'is.gd', 't.co', 'cutt.ly', 'rb.gy', 'shrtco.de', 'ow.ly'
]);

// Well-known trusted Indian domains (for reassuring factors)
const TRUSTED_INDIAN_DOMAINS = [
  'onlinesbi.sbi',
  'sbi.co.in',
  'hdfcbank.com',
  'icicibank.com',
  'axisbank.com',
  'incometax.gov.in',
  'cybercrime.gov.in',
  'npci.org.in',
  'rbi.org.in',
  'indiapost.gov.in',
  'epfindia.gov.in',
];

// High-value targets commonly impersonated
const TARGET_BRANDS = [
  'sbi', 'hdfc', 'icici', 'axis', 'paytm', 'phonepe', 'gpay', 'googlepay',
  'incometax', 'cybercrime', 'electricity', 'mahadiscom', 'bescom', 'tneb',
  'indianoil', 'netflix', 'amazon', 'flipkart', 'fedex', 'bluedart'
];

export function extractIndicatorsFromText(text: string): {
  phones: string[];
  urls: string[];
  upis: string[];
} {
  const phones: string[] = [];
  const urls: string[] = [];
  const upis: string[] = [];

  // Match Indian Phone numbers (+91 or 10-digit starting with 6,7,8,9)
  const phoneRegex = /(?:\+91[\-\s]?)?[6-9]\d{9}\b/g;
  let match;
  while ((match = phoneRegex.exec(text)) !== null) {
    const clean = match[0].replace(/[\-\s]/g, '');
    if (!phones.includes(clean)) phones.push(clean);
  }

  // Match URLs
  const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/gi;
  while ((match = urlRegex.exec(text)) !== null) {
    const clean = match[0].replace(/[.,;:)]$/, '');
    if (!urls.includes(clean)) urls.push(clean);
  }

  // Match UPI handles (e.g. name@okhdfcbank, user@ybl, payment@paytm)
  const upiRegex = /[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/g;
  while ((match = upiRegex.exec(text)) !== null) {
    const candidate = match[0];
    // Filter out common email domains like gmail.com, yahoo.com
    const lower = candidate.toLowerCase();
    if (!lower.endsWith('@gmail.com') && !lower.endsWith('@yahoo.com') && !lower.endsWith('@outlook.com') && !lower.endsWith('@hotmail.com')) {
      if (!upis.includes(candidate)) upis.push(candidate);
    }
  }

  return { phones, urls, upis };
}

export function analyzeUrlSafety(urlStr: string): {
  factors: RiskFactor[];
  reassuring: RiskFactor[];
  parsedHostname: string;
  isLookalike: boolean;
  isShortener: boolean;
} {
  const factors: RiskFactor[] = [];
  const reassuring: RiskFactor[] = [];
  let parsedHostname = '';
  let isLookalike = false;
  let isShortener = false;

  try {
    let normalizedUrl = urlStr.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }

    const parsed = new URL(normalizedUrl);
    parsedHostname = parsed.hostname.toLowerCase();
    const pathname = parsed.pathname.toLowerCase();

    // 1. Check HTTP vs HTTPS
    if (parsed.protocol === 'http:') {
      factors.push({
        code: 'URL_NO_HTTPS',
        title: 'Insecure Connection (HTTP)',
        scoreContribution: 15,
        category: 'LOOKALIKE_URL',
        explanation: 'The URL uses unencrypted HTTP instead of HTTPS, exposing data to interception.',
        confidence: 0.95,
        isReassuring: false,
      });
    }

    // 2. Check for trusted official domains
    const isOfficialDomain = TRUSTED_INDIAN_DOMAINS.some(
      (d) => parsedHostname === d || parsedHostname.endsWith('.' + d)
    );
    if (isOfficialDomain) {
      reassuring.push({
        code: 'URL_OFFICIAL_DOMAIN',
        title: 'Verified Official Domain',
        scoreContribution: -40,
        category: 'TRUSTED_SIGNAL',
        explanation: `Hostname "${parsedHostname}" matches verified official Indian institutional domain registry.`,
        confidence: 0.95,
        isReassuring: true,
      });
      return { factors, reassuring, parsedHostname, isLookalike: false, isShortener: false };
    }

    // 3. Check for Suspicious TLD
    const hasSuspiciousTld = Array.from(SUSPICIOUS_TLDS).some((tld) => parsedHostname.endsWith(tld));
    if (hasSuspiciousTld) {
      factors.push({
        code: 'URL_SUSPICIOUS_TLD',
        title: 'High-Risk Top Level Domain (TLD)',
        scoreContribution: 25,
        category: 'LOOKALIKE_URL',
        explanation: `The domain uses an extension frequently associated with disposable scam hosting.`,
        confidence: 0.9,
        isReassuring: false,
      });
    }

    // 4. Check for URL Shorteners
    if (SHORTENER_DOMAINS.has(parsedHostname)) {
      isShortener = true;
      factors.push({
        code: 'URL_SHORTENER_MASK',
        title: 'Obfuscated Shortened Link',
        scoreContribution: 20,
        category: 'LOOKALIKE_URL',
        explanation: `Shortened links mask the true destination web address, commonly used to conceal phishing destinations.`,
        confidence: 0.85,
        isReassuring: false,
      });
    }

    // 5. Lookalike & Brand Typosquatting Check
    for (const brand of TARGET_BRANDS) {
      if (parsedHostname.includes(brand)) {
        // e.g. sbi-online-update.com or secure-hdfc-otp.xyz
        const isLegitBank = TRUSTED_INDIAN_DOMAINS.some((d) => parsedHostname.endsWith(d));
        if (!isLegitBank) {
          isLookalike = true;
          factors.push({
            code: 'URL_BRAND_IMPERSONATION',
            title: `Brand Impersonation / Typosquatting (${brand.toUpperCase()})`,
            scoreContribution: 35,
            category: 'LOOKALIKE_URL',
            explanation: `Domain contains trusted brand keyword "${brand}" but is not hosted on the bank or organization's official domain.`,
            confidence: 0.95,
            isReassuring: false,
          });
          break;
        }
      }
    }

    // 6. Suspicious subdomains / structure (e.g. sbi.com.attacker.xyz)
    const hostParts = parsedHostname.split('.');
    if (hostParts.length > 3) {
      factors.push({
        code: 'URL_EXCESSIVE_SUBDOMAINS',
        title: 'Misleading Multi-Level Subdomain',
        scoreContribution: 18,
        category: 'LOOKALIKE_URL',
        explanation: `The URL structure has multiple nested subdomains, which scammers use to make the address look authentic at first glance.`,
        confidence: 0.8,
        isReassuring: false,
      });
    }

    // 7. Check for direct APK / App package download
    if (pathname.endsWith('.apk') || pathname.endsWith('.apk.zip')) {
      factors.push({
        code: 'URL_DIRECT_APK_DOWNLOAD',
        title: 'Direct Android APK Download',
        scoreContribution: 40,
        category: 'DEVICE_EXPOSURE',
        explanation: 'URL points directly to an unsigned Android APK package outside the official Google Play Store, posing severe malware risk.',
        confidence: 0.98,
        isReassuring: false,
      });
    }

    // 8. IP address instead of domain name
    const ipRegex = /^(?:\d{1,3}\.){3}\d{1,3}$/;
    if (ipRegex.test(parsedHostname)) {
      factors.push({
        code: 'URL_RAW_IP_HOST',
        title: 'Raw IP Address Hostname',
        scoreContribution: 30,
        category: 'LOOKALIKE_URL',
        explanation: 'Legitimate institutions use registered domain names with SSL, not raw IP addresses.',
        confidence: 0.95,
        isReassuring: false,
      });
    }
  } catch {
    factors.push({
      code: 'URL_MALFORMED',
      title: 'Malformed or Obfuscated URL',
      scoreContribution: 15,
      category: 'LOOKALIKE_URL',
      explanation: 'Unable to parse URL structure cleanly. The link may use evasive encoding.',
      confidence: 0.7,
      isReassuring: false,
    });
  }

  return { factors, reassuring, parsedHostname, isLookalike, isShortener };
}

export function scanMessageAndUrl(text: string, manualUrl?: string): ScanResult {
  const textLower = text.toLowerCase();
  const positiveFactors: RiskFactor[] = [];
  const reassuringFactors: RiskFactor[] = [];
  const detectedCategories: string[] = [];

  const indicators = extractIndicatorsFromText(text);

  if (manualUrl && !indicators.urls.includes(manualUrl)) {
    indicators.urls.push(manualUrl);
  }

  // --- 1. URGENCY & THREAT HEURISTICS ---
  const urgencyKeywords = [
    { phrase: 'immediately', weight: 15, title: 'Extreme Urgency' },
    { phrase: 'within 24 hours', weight: 20, title: 'Arbitrary 24-Hour Deadline' },
    { phrase: 'account will be blocked', weight: 25, title: 'Account Suspension Threat' },
    { phrase: 'electricity will be disconnected', weight: 30, title: 'Utility Disconnection Threat' },
    { phrase: 'kyc expired', weight: 25, title: 'Urgent KYC Expiry Claim' },
    { phrase: 'pan card not linked', weight: 20, title: 'PAN Card Delinking Threat' },
    { phrase: 'sim will be blocked', weight: 25, title: 'Telecom SIM Block Threat' },
    { phrase: 'digital arrest', weight: 35, title: 'Digital Arrest Extortion Scheme' },
    { phrase: 'police warrant', weight: 30, title: 'Imposter Police Coercion' },
    { phrase: 'customs parcel detained', weight: 25, title: 'Customs Extortion Scheme' },
  ];

  for (const item of urgencyKeywords) {
    if (textLower.includes(item.phrase)) {
      positiveFactors.push({
        code: `URGENCY_${item.phrase.replace(/\s+/g, '_').toUpperCase()}`,
        title: item.title,
        scoreContribution: item.weight,
        category: 'URGENCY',
        explanation: `The message uses manipulative pressure tactic "${item.phrase}" to trigger panic and hasty compliance.`,
        confidence: 0.92,
        isReassuring: false,
      });
      if (!detectedCategories.includes('Urgency & Coercion')) {
        detectedCategories.push('Urgency & Coercion');
      }
    }
  }

  // --- 2. CREDENTIAL & SENSITIVE DATA HARVESTING ---
  const credentialPhrases = [
    { phrase: 'share otp', weight: 35, title: 'OTP Request Trap' },
    { phrase: 'enter your pin', weight: 35, title: 'UPI/ATM PIN Request' },
    { phrase: 'cvv', weight: 30, title: 'Card CVV Harvesting' },
    { phrase: 'netbanking password', weight: 35, title: 'NetBanking Password Solicitation' },
    { phrase: 'aadhaar card photo', weight: 20, title: 'Identity Document Harvesting' },
    { phrase: 'forward this sms', weight: 25, title: 'SMS Forwarding Malicious Script' },
  ];

  for (const item of credentialPhrases) {
    if (textLower.includes(item.phrase)) {
      positiveFactors.push({
        code: `CREDENTIAL_${item.phrase.replace(/\s+/g, '_').toUpperCase()}`,
        title: item.title,
        scoreContribution: item.weight,
        category: 'CREDENTIAL_HARVESTING',
        explanation: `Demands sensitive authentication secret "${item.phrase}". Legitimate organizations never request OTPs or PINs.`,
        confidence: 0.98,
        isReassuring: false,
      });
      if (!detectedCategories.includes('Credential Harvesting')) {
        detectedCategories.push('Credential Harvesting');
      }
    }
  }

  // --- 3. FINANCIAL LURES & UNREALISTIC OFFERS ---
  const lurePhrases = [
    { phrase: 'lottery winner', weight: 30, title: 'Fake Lottery Scam' },
    { phrase: 'cashback reward', weight: 20, title: 'Deceptive Cashback Trap' },
    { phrase: 'work from home earn 5000', weight: 25, title: 'Part-Time Task Scam' },
    { phrase: 'instant loan approved without documents', weight: 25, title: 'Predatory Loan App Lure' },
    { phrase: 'refund credited click here', weight: 25, title: 'Fake Refund Phishing' },
  ];

  for (const item of lurePhrases) {
    if (textLower.includes(item.phrase)) {
      positiveFactors.push({
        code: `LURE_${item.phrase.replace(/\s+/g, '_').toUpperCase()}`,
        title: item.title,
        scoreContribution: item.weight,
        category: 'PAYMENT_RISK',
        explanation: `Offers unverified financial incentive "${item.phrase}" conditioned on clicking a link or sending advance fees.`,
        confidence: 0.9,
        isReassuring: false,
      });
      if (!detectedCategories.includes('Financial Bait')) {
        detectedCategories.push('Financial Bait');
      }
    }
  }

  // --- 4. REMOTE ACCESS APP INSTRUCTIONS ---
  const remoteAppPhrases = [
    { phrase: 'anydesk', weight: 40, title: 'AnyDesk Remote Takeover Risk' },
    { phrase: 'teamviewer', weight: 40, title: 'TeamViewer Screen Sharing Prompt' },
    { phrase: 'rustdesk', weight: 40, title: 'RustDesk Remote Control Prompt' },
    { phrase: 'quicksupport', weight: 40, title: 'QuickSupport Installation Request' },
  ];

  for (const item of remoteAppPhrases) {
    if (textLower.includes(item.phrase)) {
      positiveFactors.push({
        code: `REMOTE_APP_${item.phrase.toUpperCase()}`,
        title: item.title,
        scoreContribution: item.weight,
        category: 'DEVICE_EXPOSURE',
        explanation: `Instructs the target to install remote desktop tool "${item.phrase}", commonly used by cybercriminals to remotely drain bank accounts.`,
        confidence: 0.96,
        isReassuring: false,
      });
      if (!detectedCategories.includes('Remote Access Takeover')) {
        detectedCategories.push('Remote Access Takeover');
      }
    }
  }

  // --- 5. URL ANALYSIS ---
  let targetUrlAnalyzed: string | undefined;
  if (indicators.urls.length > 0) {
    targetUrlAnalyzed = indicators.urls[0];
    const urlAnalysis = analyzeUrlSafety(targetUrlAnalyzed);
    positiveFactors.push(...urlAnalysis.factors);
    reassuringFactors.push(...urlAnalysis.reassuring);
    if (urlAnalysis.factors.length > 0 && !detectedCategories.includes('Suspicious Web Link')) {
      detectedCategories.push('Suspicious Web Link');
    }
  }

  // --- 6. REASSURING HEURISTICS ---
  if (textLower.includes('never share this otp with anyone') || textLower.includes('bank never asks for otp')) {
    reassuringFactors.push({
      code: 'REASSURING_BANK_WARNING',
      title: 'Standard Bank Anti-Fraud Safety Notice',
      scoreContribution: -15,
      category: 'TRUSTED_SIGNAL',
      explanation: 'Contains legitimate institutional safety disclaimer advising customer never to disclose OTPs.',
      confidence: 0.85,
      isReassuring: true,
    });
  }

  // --- 7. CALCULATE RISK SCORE & SEVERITY ---
  // Compounding non-linear score calculation to prevent runaway addition
  let rawPositive = positiveFactors.reduce((acc, f) => acc + f.scoreContribution, 0);
  const rawReassuring = reassuringFactors.reduce((acc, f) => acc + Math.abs(f.scoreContribution), 0);

  // Dampen multiple signals from same category to avoid double-counting
  if (rawPositive > 70) {
    rawPositive = 70 + Math.min(30, (rawPositive - 70) * 0.4);
  }

  let finalScore = Math.round(Math.max(0, Math.min(100, rawPositive - rawReassuring * 0.7)));

  // If critical remote app or direct APK is detected with urgency, elevate floor to 80
  const hasCriticalTakeover = positiveFactors.some(
    (f) => f.code.startsWith('REMOTE_APP_') || f.code === 'URL_DIRECT_APK_DOWNLOAD'
  );
  if (hasCriticalTakeover && finalScore < 80) {
    finalScore = 82;
  }

  let severity: Severity = 'SAFE';
  if (finalScore >= 76) severity = 'CRITICAL';
  else if (finalScore >= 51) severity = 'HIGH';
  else if (finalScore >= 26) severity = 'SUSPICIOUS';
  else severity = 'SAFE';

  // Recommendations
  const recommendedSteps: string[] = [];
  if (severity === 'CRITICAL' || severity === 'HIGH') {
    recommendedSteps.push('DO NOT click any links, download files, or reply to this message.');
    recommendedSteps.push('DO NOT share OTP, UPI PIN, or install AnyDesk / QuickSupport.');
    recommendedSteps.push('Save this message as an evidence record in Mei-Kaappan Scam Journey.');
    recommendedSteps.push('Contact your bank via their official number behind your debit card if money was deducted.');
    recommendedSteps.push('Report to the National Cyber Crime Reporting Portal at https://cybercrime.gov.in or helpline 1930.');
  } else if (severity === 'SUSPICIOUS') {
    recommendedSteps.push('Verify sender identity through official channels before taking action.');
    recommendedSteps.push('Avoid clicking links; navigate to official app or website directly.');
    recommendedSteps.push('Keep monitoring for follow-up calls or payment requests.');
  } else {
    recommendedSteps.push('No immediate high-risk threat indicators detected in this content.');
    recommendedSteps.push('Always adhere to safe cyber hygiene: never share UPI PIN to receive money.');
  }

  const confidence = positiveFactors.length > 0 ? 0.9 : 0.65;
  const explanation =
    positiveFactors.length === 0
      ? 'No prominent malicious keywords, coercive urgency, or malicious URL characteristics were detected in the supplied text.'
      : `Flagged ${positiveFactors.length} potential risk factor(s) across categories: ${detectedCategories.join(', ') || 'General'}.`;

  return {
    textAnalyzed: text,
    urlAnalyzed: targetUrlAnalyzed,
    riskScore: finalScore,
    severity,
    detectedCategories,
    positiveFactors,
    reassuringFactors,
    extractedIndicators: indicators,
    confidence,
    explanation,
    recommendedSteps,
    method: 'RULE_BASED',
    timestamp: new Date().toISOString(),
  };
}
