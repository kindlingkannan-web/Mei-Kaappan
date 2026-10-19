/**
 * Mei-Kaappan Domain Models & Interfaces
 * Designed for TypeScript Frontend and future Java Spring Boot Entity / DTO Mapping
 */

export type Severity = 'SAFE' | 'SUSPICIOUS' | 'HIGH' | 'CRITICAL';

export type IncidentStatus = 'ACTIVE' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';

export type EvidenceType =
  | 'SUSPICIOUS_MESSAGE'
  | 'SUSPICIOUS_URL'
  | 'PAYMENT_REQUEST'
  | 'REPORTED_PHONE'
  | 'REPORTED_UPI'
  | 'DEVICE_RISK'
  | 'USER_REPORT';

export type IndicatorType = 'PHONE' | 'URL' | 'DOMAIN' | 'UPI' | 'APP_PACKAGE';

export type IndicatorReputation = 'KNOWN_SCAM' | 'SUSPICIOUS' | 'UNVERIFIED_REPORT' | 'BENIGN';

export type AssessmentMethod = 'RULE_BASED' | 'MODEL_BASED' | 'COMBINED';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'DEMO_USER' | 'ADMIN' | 'ANALYST';
  guardianEnabled: boolean;
  activeDeviceId: string;
}

export interface TrustedContact {
  id: string;
  userId: string;
  contactName: string;
  contactPhone: string;
  relationship: string;
  consentStatus: 'PENDING' | 'ACCEPTED' | 'REVOKED';
  notifyOnCritical: boolean;
  notifyOnHigh: boolean;
  invitedAt: string;
  acceptedAt?: string;
}

export interface DeviceInfo {
  id: string;
  userId: string;
  deviceName: string;
  platform: 'ANDROID' | 'WEB_CLIENT' | 'SIMULATOR';
  osVersion: string;
  lastScanTimestamp: string;
  securityHealthScore: number; // 0 - 100
  activeThreatCount: number;
}

export interface DeviceFinding {
  id: string;
  deviceId: string;
  appOrSettingName: string;
  packageName?: string;
  category: 'ACCESSIBILITY_ABUSE' | 'OVERLAY_PERMISSION' | 'NOTIFICATION_LISTENER' | 'REMOTE_ACCESS_TOOL' | 'SIDELOADED_APK' | 'UNKNOWN_PERMISSION';
  severity: Severity;
  detectionTimestamp: string;
  evidenceSource: 'ANDROID_CLIENT_SIMULATOR' | 'SYSTEM_AUDIT';
  explanation: string;
  recommendedRemediation: string;
  reviewStatus: 'UNRESOLVED' | 'REMEDIATED' | 'IGNORED';
}

export interface RiskFactor {
  code: string;
  title: string;
  scoreContribution: number; // e.g. +25 or -10
  category: 'URGENCY' | 'CREDENTIAL_HARVESTING' | 'PAYMENT_RISK' | 'LOOKALIKE_URL' | 'DEVICE_EXPOSURE' | 'KNOWN_BLACKLIST' | 'TRUSTED_SIGNAL';
  explanation: string;
  confidence: number; // 0.0 - 1.0
  isReassuring: boolean;
}

export interface EvidenceEvent {
  id: string;
  type: EvidenceType;
  source: string; // e.g. 'SMS_SCANNER', 'UPI_CHECKER', 'DEVICE_AUDITOR', 'MANUAL_REPORT'
  timestamp: string;
  summary: string;
  rawPayload: string;
  normalizedValue?: string;
  extractedIndicators: {
    phones?: string[];
    urls?: string[];
    domains?: string[];
    upis?: string[];
    appPackages?: string[];
  };
  confidence: number; // 0.0 - 1.0
  evidenceQuality: 'HIGH_VERIFIED' | 'MEDIUM_AUTOMATED' | 'LOW_UNVERIFIED_USER';
  riskContribution: number;
}

export interface IncidentEvidence {
  incidentId: string;
  evidenceId: string;
  associationReason: string;
  orderIndex: number;
  linkedAt: string;
}

export interface TimelineEntry {
  id: string;
  timestamp: string;
  type: 'EVIDENCE_ADDED' | 'RISK_ESCALATED' | 'RISK_MITIGATED' | 'STATUS_CHANGED' | 'GUARDIAN_NOTIFIED' | 'SAFETY_ACTION_TAKEN';
  title: string;
  description: string;
  previousRiskScore?: number;
  newRiskScore?: number;
  evidenceId?: string;
  actor: string;
}

export interface AuditAction {
  id: string;
  timestamp: string;
  performedBy: string;
  action: 'CREATED' | 'UPDATED_STATUS' | 'ADDED_EVIDENCE' | 'NOTIFIED_GUARDIAN' | 'EXPORTED_REPORT' | 'USER_FEEDBACK';
  notes: string;
}

export interface RiskAssessment {
  incidentId?: string;
  riskScore: number; // 0 - 100
  severity: Severity;
  classification: string;
  evidenceConsideredCount: number;
  positiveIndicators: RiskFactor[];
  reassuringIndicators: RiskFactor[];
  uncertaintyExplanation: string;
  recommendedNextSteps: string[];
  timestamp: string;
  method: AssessmentMethod;
  disclaimer: string;
}

export interface Incident {
  id: string;
  userId: string;
  title: string;
  category: 'BANKING_KYC_IMPERSONATION' | 'LOTTERY_REWARD_PHISHING' | 'DIGITAL_ARREST_EXTORTION' | 'REMOTE_SUPPORT_TAKEOVER' | 'JOB_OFFER_ADVANCE_FEE' | 'UTILITY_BILL_FRAUD' | 'GENERAL_SUSPICIOUS';
  currentRiskScore: number; // 0 - 100
  severity: Severity;
  status: IncidentStatus;
  createdAt: string;
  updatedAt: string;
  summary: string;
  primaryAttackerVector: string; // e.g., 'Phishing SMS -> Malicious APK -> Fake UPI'
  evidenceIds: string[];
  timeline: TimelineEntry[];
  auditLog: AuditAction[];
  assignedAnalyst?: string;
  lastAssessment: RiskAssessment;
}

export interface ThreatIndicator {
  id: string;
  type: IndicatorType;
  value: string;
  normalizedValue: string;
  reputationStatus: IndicatorReputation;
  reportCount: number;
  evidenceQuality: 'HIGH_OFFICIAL' | 'COMMUNITY_CONSENSUS' | 'UNVERIFIED';
  firstReported: string;
  lastReported: string;
  confidence: number; // 0.0 - 1.0
  sourceType: 'COMMUNITY_REPORT' | 'NATIONAL_PORTAL_SYNC' | 'HEURISTIC_ANALYSIS';
  reviewStatus: 'VERIFIED' | 'PENDING_REVIEW' | 'FALSE_POSITIVE_CLEARED';
  relatedIncidentIds: string[];
  tags: string[];
}

export interface Alert {
  id: string;
  incidentId: string;
  title: string;
  summary: string;
  severity: Severity;
  timestamp: string;
  alertSource: 'SCAM_JOURNEY_ENGINE' | 'DEVICE_SCANNER' | 'PAYMENT_CHECKER' | 'REPUTATION_DATABASE';
  isRead: boolean;
  isAcknowledged: boolean;
  resolutionStatus: 'UNRESOLVED' | 'RESOLVED' | 'DISMISSED';
  guardianNotified: boolean;
  guardianAcknowledged?: boolean;
}

export interface UserFeedback {
  id: string;
  targetType: 'INCIDENT' | 'SCAN' | 'INDICATOR';
  targetId: string;
  label: 'CORRECT' | 'INCORRECT' | 'UNCERTAIN';
  userComments: string;
  timestamp: string;
  submittedBy: string;
}

export interface ModelEvaluation {
  modelName: string;
  version: string;
  datasetVersion: string;
  testSamplesCount: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: {
    truePositives: number;
    falsePositives: number;
    trueNegatives: number;
    falseNegatives: number;
  };
  falsePositiveExamples: Array<{
    text: string;
    actual: string;
    predicted: string;
    reason: string;
  }>;
  evaluatedAt: string;
  comparisonWithBaseline: {
    baselineType: string;
    baselinePrecision: number;
    baselineRecall: number;
    baselineF1: number;
    relativeImprovement: string;
  };
}

export interface ConsentPreferences {
  guardianSharingEnabled: boolean;
  shareCriticalAlertsOnly: boolean;
  dataRetentionDays: number;
  allowAnonymousThreatReporting: boolean;
  localRuleProcessingOnly: boolean;
  simplifiedExplanations: boolean;
}
