/**
 * Mei-Kaappan — Scam Journey Correlation Engine
 * Primary differentiator: Correlates disparate cyber evidence events across time,
 * builds a chronological attack narrative, calculates non-linear unified risk,
 * explains score transitions, and suggests actionable defense steps.
 */

import {
  Incident,
  EvidenceEvent,
  RiskAssessment,
  RiskFactor,
  Severity,
  TimelineEntry,
  IncidentStatus,
  AuditAction,
} from '../types';

export interface CorrelationResult {
  incident: Incident;
  scoreChange: {
    previousScore: number;
    newScore: number;
    delta: number;
    reason: string;
  };
  assessment: RiskAssessment;
}

/**
 * Validates whether two evidence items share correlation anchors:
 * - Shared phone number
 * - Shared domain or URL
 * - Shared UPI ID
 * - Common attack vector (e.g. KYC SMS + Bank Phishing URL + Fake UPI)
 * - Temporal proximity (< 72 hours)
 */
export function checkEvidenceCorrelation(
  eventA: EvidenceEvent,
  eventB: EvidenceEvent
): { isCorrelated: boolean; reason: string; confidence: number } {
  // Check shared phone
  const sharedPhones = eventA.extractedIndicators.phones?.filter((p) =>
    eventB.extractedIndicators.phones?.includes(p)
  );
  if (sharedPhones && sharedPhones.length > 0) {
    return {
      isCorrelated: true,
      reason: `Direct indicator match: Shared phone number (${sharedPhones.join(', ')})`,
      confidence: 0.95,
    };
  }

  // Check shared UPI
  const sharedUpis = eventA.extractedIndicators.upis?.filter((u) =>
    eventB.extractedIndicators.upis?.includes(u)
  );
  if (sharedUpis && sharedUpis.length > 0) {
    return {
      isCorrelated: true,
      reason: `Direct financial anchor match: Shared UPI identifier (${sharedUpis.join(', ')})`,
      confidence: 0.98,
    };
  }

  // Check shared URLs or Domains
  const sharedUrls = eventA.extractedIndicators.urls?.filter((u) =>
    eventB.extractedIndicators.urls?.includes(u)
  );
  if (sharedUrls && sharedUrls.length > 0) {
    return {
      isCorrelated: true,
      reason: `Shared web destination: Matching URL (${sharedUrls[0]})`,
      confidence: 0.96,
    };
  }

  // Temporal & thematic correlation (e.g. SMS with banking urgency followed by APK or UPI check within 48h)
  const timeA = new Date(eventA.timestamp).getTime();
  const timeB = new Date(eventB.timestamp).getTime();
  const diffHours = Math.abs(timeA - timeB) / (1000 * 60 * 60);

  if (diffHours <= 72) {
    if (
      (eventA.type === 'SUSPICIOUS_MESSAGE' && eventB.type === 'PAYMENT_REQUEST') ||
      (eventA.type === 'PAYMENT_REQUEST' && eventB.type === 'SUSPICIOUS_MESSAGE')
    ) {
      return {
        isCorrelated: true,
        reason: 'Correlated multi-stage attack flow: Coercive message preceded payment verification within 72 hours',
        confidence: 0.75,
      };
    }

    if (
      (eventA.type === 'SUSPICIOUS_URL' && eventB.type === 'DEVICE_RISK') ||
      (eventA.type === 'DEVICE_RISK' && eventB.type === 'SUSPICIOUS_URL')
    ) {
      return {
        isCorrelated: true,
        reason: 'Correlated execution flow: Malicious URL access coincided with suspicious device permission changes',
        confidence: 0.82,
      };
    }
  }

  return {
    isCorrelated: false,
    reason: 'No direct indicator overlap or verified multi-stage correlation sequence found',
    confidence: 0.2,
  };
}

/**
 * Calculates unified risk assessment from all linked evidence events
 * Uses a non-linear compounding model with cross-evidence correlation multipliers.
 */
export function calculateUnifiedRisk(
  evidences: EvidenceEvent[],
  previousScore: number = 0
): RiskAssessment {
  if (evidences.length === 0) {
    return {
      riskScore: 0,
      severity: 'SAFE',
      classification: 'No Evidence Recorded',
      evidenceConsideredCount: 0,
      positiveIndicators: [],
      reassuringIndicators: [],
      uncertaintyExplanation: 'No evidence events have been attached to this incident.',
      recommendedNextSteps: ['Monitor for incoming suspicious communications.'],
      timestamp: new Date().toISOString(),
      method: 'RULE_BASED',
      disclaimer: 'Prototype assessment based on rule-based heuristics. Not guaranteed proof of fraud.',
    };
  }

  const positiveFactors: RiskFactor[] = [];
  const reassuringFactors: RiskFactor[] = [];
  const detectedTypes = new Set<string>();

  let baseScoreSum = 0;

  for (const ev of evidences) {
    detectedTypes.add(ev.type);

    // Score based on evidence type
    let weight = ev.riskContribution || 20;

    // Quality multiplier
    if (ev.evidenceQuality === 'HIGH_VERIFIED') weight *= 1.1;
    else if (ev.evidenceQuality === 'LOW_UNVERIFIED_USER') weight *= 0.8;

    baseScoreSum += weight;

    positiveFactors.push({
      code: `EV_${ev.type}_${ev.id.substring(0, 6)}`,
      title: `${formatEvidenceTypeName(ev.type)} (${ev.source})`,
      scoreContribution: Math.round(weight),
      category: mapEvidenceToFactorCategory(ev.type),
      explanation: ev.summary,
      confidence: ev.confidence,
      isReassuring: false,
    });
  }

  // Multi-stage attack progression multiplier:
  // If incident contains BOTH communication bait (Message/URL) AND financial/device execution (UPI/Device Risk),
  // scam journey correlation significantly elevates threat priority.
  const hasBait = detectedTypes.has('SUSPICIOUS_MESSAGE') || detectedTypes.has('SUSPICIOUS_URL');
  const hasExecution = detectedTypes.has('PAYMENT_REQUEST') || detectedTypes.has('DEVICE_RISK');
  const hasKnownBlacklist = detectedTypes.has('REPORTED_PHONE') || detectedTypes.has('REPORTED_UPI');

  let journeyMultiplier = 1.0;
  if (hasBait && hasExecution) {
    journeyMultiplier = 1.35;
    positiveFactors.push({
      code: 'JOURNEY_CORRELATION_MULTI_STAGE',
      title: 'Scam Journey Progression: Bait + Execution Correlated',
      scoreContribution: 25,
      category: 'KNOWN_BLACKLIST',
      explanation: 'Scam Journey Correlation Engine identified cross-vector progression: coercive bait followed by active payment solicitation or device tampering.',
      confidence: 0.95,
      isReassuring: false,
    });
  }

  if (hasKnownBlacklist) {
    journeyMultiplier *= 1.15;
  }

  // Non-linear ceiling calculation to avoid runaway addition
  let aggregated = baseScoreSum * journeyMultiplier;
  if (aggregated > 65) {
    aggregated = 65 + Math.min(35, (aggregated - 65) * 0.45);
  }

  const finalScore = Math.min(100, Math.max(5, Math.round(aggregated)));

  let severity: Severity = 'SAFE';
  if (finalScore >= 76) severity = 'CRITICAL';
  else if (finalScore >= 51) severity = 'HIGH';
  else if (finalScore >= 26) severity = 'SUSPICIOUS';
  else severity = 'SAFE';

  // Classification
  let classification = 'General Suspicious Activity';
  if (hasBait && detectedTypes.has('PAYMENT_REQUEST')) {
    classification = 'Coercive Payment Impersonation Journey';
  } else if (hasBait && detectedTypes.has('DEVICE_RISK')) {
    classification = 'Remote Access / Malicious APK Takeover Journey';
  } else if (detectedTypes.has('SUSPICIOUS_MESSAGE')) {
    classification = 'Phishing Communication Campaign';
  } else if (detectedTypes.has('PAYMENT_REQUEST')) {
    classification = 'Unverified UPI Payment Request';
  }

  // Next steps
  const recommendedNextSteps: string[] = [];
  if (severity === 'CRITICAL') {
    recommendedNextSteps.push('DO NOT send money or enter UPI PIN under any pretext.');
    recommendedNextSteps.push('Disconnect device from WiFi/Mobile Data if unauthorized remote app was opened.');
    recommendedNextSteps.push('Uninstall any newly sideloaded APKs or remote tools (AnyDesk, QuickSupport).');
    recommendedNextSteps.push('Immediately contact your bank at their official customer helpline.');
    recommendedNextSteps.push('File an incident with National Cyber Crime Helpline (1930) or https://cybercrime.gov.in.');
  } else if (severity === 'HIGH') {
    recommendedNextSteps.push('Block sender and report the phone number / UPI handle.');
    recommendedNextSteps.push('Verify legitimacy of any claims independently via official branch or website.');
    recommendedNextSteps.push('Alert Family Guardian contacts to monitor against follow-up intimidation.');
  } else {
    recommendedNextSteps.push('Exercise caution. Validate recipient details prior to initiating any transaction.');
    recommendedNextSteps.push('Keep this incident under observation.');
  }

  const uncertaintyExplanation =
    evidences.length === 1
      ? 'Assessment relies on a single isolated evidence event. Confidence will increase as additional contextual signals or user reports are correlated.'
      : `High confidence based on ${evidences.length} correlated evidence events across ${detectedTypes.size} distinct vector(s).`;

  return {
    riskScore: finalScore,
    severity,
    classification,
    evidenceConsideredCount: evidences.length,
    positiveIndicators: positiveFactors,
    reassuringIndicators: reassuringFactors,
    uncertaintyExplanation,
    recommendedNextSteps,
    timestamp: new Date().toISOString(),
    method: 'RULE_BASED',
    disclaimer:
      'Prototype assessment based on rule-based heuristics and seed threat intelligence. This assessment is not a certified guarantee of criminal prosecution or banking fraud.',
  };
}

/**
 * Appends a new evidence event to an incident, recalculates the unified risk,
 * records a timeline entry explaining the score transition, and updates the audit log.
 */
export function correlateEvidenceIntoIncident(
  incident: Incident,
  newEvidence: EvidenceEvent,
  allEvidencesForIncident: EvidenceEvent[],
  actor: string = 'Demo User'
): CorrelationResult {
  const previousScore = incident.currentRiskScore;
  const updatedEvidences = [...allEvidencesForIncident, newEvidence];

  const newAssessment = calculateUnifiedRisk(updatedEvidences, previousScore);
  const delta = newAssessment.riskScore - previousScore;

  // Generate explainable transition reason
  let transitionReason = '';
  if (delta > 0) {
    transitionReason = `Risk escalated (+${delta} pts) to ${newAssessment.riskScore}/100 after linking ${formatEvidenceTypeName(
      newEvidence.type
    )}: "${newEvidence.summary}"`;
  } else if (delta < 0) {
    transitionReason = `Risk lowered (${delta} pts) to ${newAssessment.riskScore}/100 due to reassuring verification factors.`;
  } else {
    transitionReason = `Evidence added without significant risk variance (Risk score remains ${newAssessment.riskScore}/100).`;
  }

  const timelineEntry: TimelineEntry = {
    id: `tl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    type: delta >= 15 ? 'RISK_ESCALATED' : 'EVIDENCE_ADDED',
    title: delta >= 15 ? `Escalated to ${newAssessment.severity} Risk` : `Added Evidence: ${formatEvidenceTypeName(newEvidence.type)}`,
    description: transitionReason,
    previousRiskScore: previousScore,
    newRiskScore: newAssessment.riskScore,
    evidenceId: newEvidence.id,
    actor,
  };

  const auditEntry: AuditAction = {
    id: `audit_${Date.now()}`,
    timestamp: new Date().toISOString(),
    performedBy: actor,
    action: 'ADDED_EVIDENCE',
    notes: `Linked evidence ${newEvidence.id} (${newEvidence.type}). Recalculated risk score: ${newAssessment.riskScore}.`,
  };

  const updatedIncident: Incident = {
    ...incident,
    currentRiskScore: newAssessment.riskScore,
    severity: newAssessment.severity,
    updatedAt: new Date().toISOString(),
    evidenceIds: [...incident.evidenceIds, newEvidence.id],
    timeline: [timelineEntry, ...incident.timeline],
    auditLog: [auditEntry, ...incident.auditLog],
    lastAssessment: newAssessment,
  };

  return {
    incident: updatedIncident,
    scoreChange: {
      previousScore,
      newScore: newAssessment.riskScore,
      delta,
      reason: transitionReason,
    },
    assessment: newAssessment,
  };
}

/**
 * Updates the status of an incident (Under Review, Resolved, Dismissed) with audit logging
 */
export function updateIncidentStatus(
  incident: Incident,
  newStatus: IncidentStatus,
  notes: string,
  actor: string = 'Security Analyst'
): Incident {
  const timelineEntry: TimelineEntry = {
    id: `tl_${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: 'STATUS_CHANGED',
    title: `Incident marked as ${newStatus.replace('_', ' ')}`,
    description: notes || `Status changed from ${incident.status} to ${newStatus}.`,
    previousRiskScore: incident.currentRiskScore,
    newRiskScore: newStatus === 'RESOLVED' || newStatus === 'DISMISSED' ? 0 : incident.currentRiskScore,
    actor,
  };

  const auditEntry: AuditAction = {
    id: `audit_${Date.now()}`,
    timestamp: new Date().toISOString(),
    performedBy: actor,
    action: 'UPDATED_STATUS',
    notes: `Changed status to ${newStatus}. Reason: ${notes}`,
  };

  return {
    ...incident,
    status: newStatus,
    updatedAt: new Date().toISOString(),
    timeline: [timelineEntry, ...incident.timeline],
    auditLog: [auditEntry, ...incident.auditLog],
  };
}

function formatEvidenceTypeName(type: string): string {
  switch (type) {
    case 'SUSPICIOUS_MESSAGE':
      return 'Suspicious Message';
    case 'SUSPICIOUS_URL':
      return 'Malicious URL';
    case 'PAYMENT_REQUEST':
      return 'Payment / UPI Request';
    case 'REPORTED_PHONE':
      return 'Blacklisted Caller';
    case 'REPORTED_UPI':
      return 'Flagged UPI ID';
    case 'DEVICE_RISK':
      return 'Device Vulnerability / App Risk';
    case 'USER_REPORT':
      return 'Victim Scam Report';
    default:
      return type;
  }
}

function mapEvidenceToFactorCategory(type: string): RiskFactor['category'] {
  switch (type) {
    case 'SUSPICIOUS_MESSAGE':
      return 'URGENCY';
    case 'SUSPICIOUS_URL':
      return 'LOOKALIKE_URL';
    case 'PAYMENT_REQUEST':
      return 'PAYMENT_RISK';
    case 'DEVICE_RISK':
      return 'DEVICE_EXPOSURE';
    case 'REPORTED_PHONE':
    case 'REPORTED_UPI':
      return 'KNOWN_BLACKLIST';
    default:
      return 'URGENCY';
  }
}
