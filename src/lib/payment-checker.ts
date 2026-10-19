/**
 * Mei-Kaappan — Pre-Payment Safety Check Engine
 * Evaluates user-initiated payment requests, UPI identifiers, contextual payment notes,
 * and matches against known threat intelligence indicators.
 * 
 * DISCLAIMER:
 * Does NOT access live bank accounts, execute UPI transactions, or claim to intercept bank switches.
 * Performs deterministic safety validation and contextual fraud prevention.
 */

import { Severity, RiskFactor } from '../types';

export interface PaymentCheckInput {
  upiId: string;
  recipientName?: string;
  amount?: number;
  paymentNoteOrContext?: string;
  associatedUrl?: string;
}

export interface PaymentCheckResult {
  upiId: string;
  recipientName?: string;
  amount?: number;
  isValidFormat: boolean;
  formatFeedback: string;
  riskScore: number;
  severity: Severity;
  isBlacklisted: boolean;
  threatMatchDetails?: {
    reportCount: number;
    category: string;
    lastReported: string;
    evidenceQuality: string;
  };
  detectedFactors: RiskFactor[];
  reassuringFactors: RiskFactor[];
  safetyAdvisories: string[];
  disclaimer: string;
  timestamp: string;
}

// Known seed malicious UPI handles for demo threat intelligence
export const KNOWN_SUSPICIOUS_UPIS: Record<
  string,
  { reportCount: number; category: string; lastReported: string; quality: string }
> = {
  'quickkyc.verification@ybl': {
    reportCount: 38,
    category: 'Banking KYC Phishing',
    lastReported: '2026-10-17T11:20:00Z',
    quality: 'HIGH_OFFICIAL',
  },
  'electricity.billing.dept@okaxis': {
    reportCount: 64,
    category: 'Utility Disconnection Extortion',
    lastReported: '2026-10-18T16:45:00Z',
    quality: 'COMMUNITY_CONSENSUS',
  },
  'customs.clearance.fee@paytm': {
    reportCount: 19,
    category: 'Fake Parcel & Courier Scam',
    lastReported: '2026-10-14T09:10:00Z',
    quality: 'COMMUNITY_CONSENSUS',
  },
  'lottery.reward.tax@icici': {
    reportCount: 52,
    category: 'Lottery Advance Fee Scam',
    lastReported: '2026-10-15T14:30:00Z',
    quality: 'HIGH_OFFICIAL',
  },
  'parttime.task.salary@ibl': {
    reportCount: 41,
    category: 'Telegram Job Task Scam',
    lastReported: '2026-10-16T18:00:00Z',
    quality: 'COMMUNITY_CONSENSUS',
  },
};

// Known verified handles of major utility boards or legitimate merchants
const VERIFIED_MERCHANT_DOMAINS = [
  'tneb@tneb',
  'bescom@sbi',
  'irctc@hdfcbank',
  'airtel@airtel',
  'tatapower@icici',
];

export function validateUpiFormat(upi: string): { isValid: boolean; feedback: string } {
  const trimmed = upi.trim().toLowerCase();
  if (!trimmed) {
    return { isValid: false, feedback: 'UPI ID cannot be blank.' };
  }

  // Must have exactly one '@'
  const parts = trimmed.split('@');
  if (parts.length !== 2) {
    return { isValid: false, feedback: 'Invalid UPI format. Must be in the format: username@bankhandle (e.g. name@okhdfcbank).' };
  }

  const [username, handle] = parts;
  if (!username || username.length < 2 || username.length > 50) {
    return { isValid: false, feedback: 'Username part before "@" must be between 2 and 50 characters.' };
  }

  if (!handle || handle.length < 2 || handle.length > 30) {
    return { isValid: false, feedback: 'Bank handle part after "@" must be between 2 and 30 characters.' };
  }

  // Regex check for valid UPI characters
  const validRegex = /^[a-zA-Z0-9.\-_]{2,50}@[a-zA-Z0-9]{2,30}$/;
  if (!validRegex.test(trimmed)) {
    return { isValid: false, feedback: 'UPI ID contains disallowed special characters. Only alphanumeric, dots, hyphens, and underscores are allowed.' };
  }

  return { isValid: true, feedback: 'Valid UPI format.' };
}

export function evaluatePaymentSafety(input: PaymentCheckInput): PaymentCheckResult {
  const normalizedUpi = input.upiId.trim().toLowerCase();
  const formatCheck = validateUpiFormat(normalizedUpi);

  const detectedFactors: RiskFactor[] = [];
  const reassuringFactors: RiskFactor[] = [];
  const safetyAdvisories: string[] = [];

  let isBlacklisted = false;
  let threatMatchDetails: PaymentCheckResult['threatMatchDetails'];

  // 1. Check Threat Intelligence Match
  const threatMatch = KNOWN_SUSPICIOUS_UPIS[normalizedUpi];
  if (threatMatch) {
    isBlacklisted = true;
    threatMatchDetails = {
      reportCount: threatMatch.reportCount,
      category: threatMatch.category,
      lastReported: threatMatch.lastReported,
      evidenceQuality: threatMatch.quality,
    };

    detectedFactors.push({
      code: 'THREAT_INTEL_BLACKLIST_UPI',
      title: `Known Flagged UPI Handle (${threatMatch.category})`,
      scoreContribution: 65,
      category: 'KNOWN_BLACKLIST',
      explanation: `This UPI address was previously reported ${threatMatch.reportCount} times in connection with ${threatMatch.category}.`,
      confidence: 0.96,
      isReassuring: false,
    });
  }

  // 2. Check for Verified Merchant handles
  if (VERIFIED_MERCHANT_DOMAINS.includes(normalizedUpi)) {
    reassuringFactors.push({
      code: 'VERIFIED_UTILITY_MERCHANT',
      title: 'Recognized Official Merchant Identifier',
      scoreContribution: -35,
      category: 'TRUSTED_SIGNAL',
      explanation: 'Matches official registered institutional utility billing handle.',
      confidence: 0.9,
      isReassuring: true,
    });
  }

  // 3. Contextual Notes Analysis
  const note = (input.paymentNoteOrContext || '').toLowerCase();
  const suspiciousNoteKeywords = [
    { phrase: 'kyc verification fee', weight: 30, title: 'Fraudulent KYC Processing Fee' },
    { phrase: 'electricity bill clearance', weight: 25, title: 'Coerced Utility Bill Payment' },
    { phrase: 'refund activation token', weight: 35, title: 'Fake Refund Token Trap' },
    { phrase: 'customs tax penalty', weight: 35, title: 'Extortionary Penalty Payment' },
    { phrase: 'task security deposit', weight: 30, title: 'Job Task Advance Deposit' },
    { phrase: 'digital arrest settlement', weight: 45, title: 'Extortion Coercion Settlement' },
  ];

  for (const item of suspiciousNoteKeywords) {
    if (note.includes(item.phrase)) {
      detectedFactors.push({
        code: `PAYMENT_NOTE_${item.phrase.replace(/\s+/g, '_').toUpperCase()}`,
        title: item.title,
        scoreContribution: item.weight,
        category: 'PAYMENT_RISK',
        explanation: `Payment remarks context contains high-risk phrase "${item.phrase}". Legitimate government agencies and banks do not settle official matters through personal UPI handles.`,
        confidence: 0.92,
        isReassuring: false,
      });
    }
  }

  // 4. Amount-based heuristic
  if (input.amount !== undefined && input.amount > 0) {
    if (input.amount > 50000) {
      detectedFactors.push({
        code: 'HIGH_VALUE_UNVERIFIED_TRANSFER',
        title: 'High-Value Transfer Request',
        scoreContribution: 15,
        category: 'PAYMENT_RISK',
        explanation: `Amount (₹${input.amount.toLocaleString('en-IN')}) exceeds typical peer transaction thresholds. Exercise extreme scrutiny.`,
        confidence: 0.75,
        isReassuring: false,
      });
    } else if (input.amount < 15 && note.includes('refund')) {
      detectedFactors.push({
        code: 'MICRO_TRANSACTION_REVERSE_PAY_TRAP',
        title: 'Micro-Transaction / Reverse-Pay Trap',
        scoreContribution: 30,
        category: 'PAYMENT_RISK',
        explanation: 'Scammers frequently request a "test payment" of ₹1 or ₹5 to trick victims into revealing or approving an auto-debit mandate.',
        confidence: 0.9,
        isReassuring: false,
      });
    }
  }

  // 5. Inverted Recipient / "Receive Money" Scam Advisory
  if (note.includes('receive') || note.includes('credit') || note.includes('cashback') || note.includes('prize')) {
    safetyAdvisories.push('CRITICAL RULE: You NEVER need to enter your UPI PIN or scan a QR code to RECEIVE money or cashback! Entering UPI PIN ALWAYS deducts funds.');
    detectedFactors.push({
      code: 'REVERSE_UPI_PIN_BAIT',
      title: 'Reverse UPI Claim ("Enter PIN to Receive Money")',
      scoreContribution: 40,
      category: 'PAYMENT_RISK',
      explanation: 'Scammer is likely attempting to solicit UPI PIN under the deception of receiving money.',
      confidence: 0.98,
      isReassuring: false,
    });
  }

  // Calculate score
  let rawScore = detectedFactors.reduce((acc, f) => acc + f.scoreContribution, 0);
  const rawReassuring = reassuringFactors.reduce((acc, f) => acc + Math.abs(f.scoreContribution), 0);

  if (isBlacklisted) {
    rawScore = Math.max(rawScore, 85);
  }

  let finalScore = Math.round(Math.max(0, Math.min(100, rawScore - rawReassuring)));
  if (!formatCheck.isValid) {
    finalScore = Math.max(finalScore, 40);
  }

  let severity: Severity = 'SAFE';
  if (finalScore >= 76) severity = 'CRITICAL';
  else if (finalScore >= 51) severity = 'HIGH';
  else if (finalScore >= 26) severity = 'SUSPICIOUS';
  else severity = 'SAFE';

  // Advisories
  if (severity === 'CRITICAL' || severity === 'HIGH') {
    safetyAdvisories.push('HALT TRANSACTION: Do not proceed with this payment.');
    safetyAdvisories.push('Do not share OTPs, UPI PIN, or approve any payment request on Google Pay, PhonePe, or Paytm.');
    safetyAdvisories.push('Verify recipient identity using a trusted phone number you already know.');
    safetyAdvisories.push('Save this check to Mei-Kaappan Scam Journey to build an incident trail.');
  } else if (severity === 'SUSPICIOUS') {
    safetyAdvisories.push('Double check recipient name displayed on your UPI app matches the intended beneficiary.');
    safetyAdvisories.push('Never click links sent via SMS to complete a payment.');
  } else {
    safetyAdvisories.push('Identifier passed baseline syntax checks and has no active reports in seed threat database.');
    safetyAdvisories.push('Always confirm the beneficiary name on the UPI screen before approving any debit.');
  }

  return {
    upiId: input.upiId,
    recipientName: input.recipientName,
    amount: input.amount,
    isValidFormat: formatCheck.isValid,
    formatFeedback: formatCheck.feedback,
    riskScore: finalScore,
    severity,
    isBlacklisted,
    threatMatchDetails,
    detectedFactors,
    reassuringFactors,
    safetyAdvisories,
    disclaimer: 'This check evaluates format, known threat intelligence reports, and context. Mei-Kaappan does not access banking switches or bank account balances.',
    timestamp: new Date().toISOString(),
  };
}
