/**
 * Mei-Kaappan — Repository Interface & Service Layer
 * Clean Architecture Boundary: Decouples UI components from data persistence.
 * Ready to swap Mock Adapter for Java Spring Boot REST API without touching React views.
 */

import {
  Incident,
  EvidenceEvent,
  Alert,
  ThreatIndicator,
  DeviceFinding,
  DeviceInfo,
  TrustedContact,
  UserProfile,
  UserFeedback,
  ConsentPreferences,
  ModelEvaluation,
  IncidentStatus,
} from '../types';
import {
  SEED_CURRENT_USER,
  SEED_TRUSTED_CONTACTS,
  SEED_DEVICE_INFO,
  SEED_DEVICE_FINDINGS,
  SEED_EVIDENCE_EVENTS,
  SEED_INCIDENTS,
  SEED_THREAT_INDICATORS,
  SEED_ALERTS,
  SEED_USER_FEEDBACK,
  SEED_MODEL_EVALUATION,
  SEED_CONSENT_PREFERENCES,
} from './seed-data';

export interface IRepository {
  // Current user & profile
  getCurrentUser(): Promise<UserProfile>;
  updateCurrentUser(user: Partial<UserProfile>): Promise<UserProfile>;

  // Incidents & Scam Journey
  getIncidents(): Promise<Incident[]>;
  getIncidentById(id: string): Promise<Incident | null>;
  createIncident(incident: Incident): Promise<Incident>;
  updateIncident(incident: Incident): Promise<Incident>;
  updateIncidentStatus(id: string, status: IncidentStatus, notes: string): Promise<Incident | null>;

  // Evidence
  getEvidenceById(id: string): Promise<EvidenceEvent | null>;
  getEvidencesForIncident(incidentId: string): Promise<EvidenceEvent[]>;
  addEvidenceEvent(evidence: EvidenceEvent): Promise<EvidenceEvent>;

  // Alerts & Notifications
  getAlerts(): Promise<Alert[]>;
  markAlertAsRead(id: string): Promise<Alert | null>;
  acknowledgeAlert(id: string): Promise<Alert | null>;
  resolveAlert(id: string, resolution: 'RESOLVED' | 'DISMISSED'): Promise<Alert | null>;

  // Threat Intelligence & Indicators
  getThreatIndicators(): Promise<ThreatIndicator[]>;
  getIndicatorByValue(value: string): Promise<ThreatIndicator | null>;
  submitThreatReport(indicator: Omit<ThreatIndicator, 'id' | 'firstReported' | 'lastReported'>): Promise<ThreatIndicator>;

  // Device Security
  getDeviceInfo(): Promise<DeviceInfo>;
  getDeviceFindings(): Promise<DeviceFinding[]>;
  updateDeviceFindingStatus(id: string, status: DeviceFinding['reviewStatus']): Promise<DeviceFinding | null>;
  addDeviceFinding(finding: DeviceFinding): Promise<DeviceFinding>;

  // Family Guardian
  getTrustedContacts(): Promise<TrustedContact[]>;
  addTrustedContact(contact: Omit<TrustedContact, 'id' | 'invitedAt'>): Promise<TrustedContact>;
  updateContactConsent(id: string, status: TrustedContact['consentStatus']): Promise<TrustedContact | null>;
  removeTrustedContact(id: string): Promise<boolean>;

  // User Feedback
  getUserFeedback(): Promise<UserFeedback[]>;
  submitFeedback(feedback: Omit<UserFeedback, 'id' | 'timestamp'>): Promise<UserFeedback>;

  // Preferences & Consent
  getConsentPreferences(): Promise<ConsentPreferences>;
  updateConsentPreferences(prefs: Partial<ConsentPreferences>): Promise<ConsentPreferences>;

  // Model Evaluation
  getModelEvaluation(): Promise<ModelEvaluation>;

  // Reset demo state
  resetDemoData(): Promise<void>;
}

const STORAGE_KEY = 'mei_kaappan_state_v1';

interface StoredState {
  user: UserProfile;
  contacts: TrustedContact[];
  deviceInfo: DeviceInfo;
  deviceFindings: DeviceFinding[];
  evidenceEvents: Record<string, EvidenceEvent>;
  incidents: Incident[];
  threatIndicators: ThreatIndicator[];
  alerts: Alert[];
  feedback: UserFeedback[];
  consent: ConsentPreferences;
}

function getDefaultState(): StoredState {
  return {
    user: { ...SEED_CURRENT_USER },
    contacts: [...SEED_TRUSTED_CONTACTS],
    deviceInfo: { ...SEED_DEVICE_INFO },
    deviceFindings: [...SEED_DEVICE_FINDINGS],
    evidenceEvents: { ...SEED_EVIDENCE_EVENTS },
    incidents: JSON.parse(JSON.stringify(SEED_INCIDENTS)),
    threatIndicators: [...SEED_THREAT_INDICATORS],
    alerts: [...SEED_ALERTS],
    feedback: [...SEED_USER_FEEDBACK],
    consent: { ...SEED_CONSENT_PREFERENCES },
  };
}

/**
 * Local in-memory and localStorage Mock Adapter
 */
export class DemoRepository implements IRepository {
  private state: StoredState;

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): StoredState {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          return JSON.parse(raw);
        }
      } catch (e) {
        console.warn('Could not read from localStorage, using default seed data.', e);
      }
    }
    return getDefaultState();
  }

  private saveState(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (e) {
        console.warn('Could not save to localStorage.', e);
      }
    }
  }

  async getCurrentUser(): Promise<UserProfile> {
    return { ...this.state.user };
  }

  async updateCurrentUser(user: Partial<UserProfile>): Promise<UserProfile> {
    this.state.user = { ...this.state.user, ...user };
    this.saveState();
    return { ...this.state.user };
  }

  async getIncidents(): Promise<Incident[]> {
    return [...this.state.incidents];
  }

  async getIncidentById(id: string): Promise<Incident | null> {
    const inc = this.state.incidents.find((i) => i.id === id);
    return inc ? JSON.parse(JSON.stringify(inc)) : null;
  }

  async createIncident(incident: Incident): Promise<Incident> {
    this.state.incidents = [incident, ...this.state.incidents];
    this.saveState();
    return incident;
  }

  async updateIncident(incident: Incident): Promise<Incident> {
    this.state.incidents = this.state.incidents.map((i) => (i.id === incident.id ? incident : i));
    this.saveState();
    return incident;
  }

  async updateIncidentStatus(id: string, status: IncidentStatus, notes: string): Promise<Incident | null> {
    const idx = this.state.incidents.findIndex((i) => i.id === id);
    if (idx === -1) return null;

    const current = this.state.incidents[idx];
    const updated: Incident = {
      ...current,
      status,
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          id: `tl_${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'STATUS_CHANGED',
          title: `Status changed to ${status}`,
          description: notes || `Incident status updated to ${status}.`,
          previousRiskScore: current.currentRiskScore,
          newRiskScore: status === 'RESOLVED' || status === 'DISMISSED' ? 0 : current.currentRiskScore,
          actor: 'Security Analyst (Demo)',
        },
        ...current.timeline,
      ],
      auditLog: [
        {
          id: `audit_${Date.now()}`,
          timestamp: new Date().toISOString(),
          performedBy: 'Demo Analyst',
          action: 'UPDATED_STATUS',
          notes: `Status changed to ${status}: ${notes}`,
        },
        ...current.auditLog,
      ],
    };

    this.state.incidents[idx] = updated;
    this.saveState();
    return updated;
  }

  async getEvidenceById(id: string): Promise<EvidenceEvent | null> {
    return this.state.evidenceEvents[id] || null;
  }

  async getEvidencesForIncident(incidentId: string): Promise<EvidenceEvent[]> {
    const incident = this.state.incidents.find((i) => i.id === incidentId);
    if (!incident) return [];
    return incident.evidenceIds
      .map((eid) => this.state.evidenceEvents[eid])
      .filter((e): e is EvidenceEvent => Boolean(e));
  }

  async addEvidenceEvent(evidence: EvidenceEvent): Promise<EvidenceEvent> {
    this.state.evidenceEvents[evidence.id] = evidence;
    this.saveState();
    return evidence;
  }

  async getAlerts(): Promise<Alert[]> {
    return [...this.state.alerts];
  }

  async markAlertAsRead(id: string): Promise<Alert | null> {
    const alert = this.state.alerts.find((a) => a.id === id);
    if (!alert) return null;
    alert.isRead = true;
    this.saveState();
    return { ...alert };
  }

  async acknowledgeAlert(id: string): Promise<Alert | null> {
    const alert = this.state.alerts.find((a) => a.id === id);
    if (!alert) return null;
    alert.isAcknowledged = true;
    alert.isRead = true;
    this.saveState();
    return { ...alert };
  }

  async resolveAlert(id: string, resolution: 'RESOLVED' | 'DISMISSED'): Promise<Alert | null> {
    const alert = this.state.alerts.find((a) => a.id === id);
    if (!alert) return null;
    alert.resolutionStatus = resolution;
    alert.isAcknowledged = true;
    alert.isRead = true;
    this.saveState();
    return { ...alert };
  }

  async getThreatIndicators(): Promise<ThreatIndicator[]> {
    return [...this.state.threatIndicators];
  }

  async getIndicatorByValue(value: string): Promise<ThreatIndicator | null> {
    const valClean = value.trim().toLowerCase();
    const ind = this.state.threatIndicators.find((i) => i.normalizedValue.toLowerCase() === valClean);
    return ind || null;
  }

  async submitThreatReport(
    indicator: Omit<ThreatIndicator, 'id' | 'firstReported' | 'lastReported'>
  ): Promise<ThreatIndicator> {
    const existing = await this.getIndicatorByValue(indicator.normalizedValue);
    if (existing) {
      existing.reportCount += 1;
      existing.lastReported = new Date().toISOString();
      this.saveState();
      return existing;
    }

    const newInd: ThreatIndicator = {
      ...indicator,
      id: `ind_${Date.now()}`,
      firstReported: new Date().toISOString(),
      lastReported: new Date().toISOString(),
    };
    this.state.threatIndicators = [newInd, ...this.state.threatIndicators];
    this.saveState();
    return newInd;
  }

  async getDeviceInfo(): Promise<DeviceInfo> {
    return { ...this.state.deviceInfo };
  }

  async getDeviceFindings(): Promise<DeviceFinding[]> {
    return [...this.state.deviceFindings];
  }

  async updateDeviceFindingStatus(
    id: string,
    status: DeviceFinding['reviewStatus']
  ): Promise<DeviceFinding | null> {
    const f = this.state.deviceFindings.find((item) => item.id === id);
    if (!f) return null;
    f.reviewStatus = status;

    // Recalculate health score
    const unresolved = this.state.deviceFindings.filter((item) => item.reviewStatus === 'UNRESOLVED');
    this.state.deviceInfo.activeThreatCount = unresolved.length;
    this.state.deviceInfo.securityHealthScore = Math.max(20, 100 - unresolved.length * 20);

    this.saveState();
    return { ...f };
  }

  async addDeviceFinding(finding: DeviceFinding): Promise<DeviceFinding> {
    this.state.deviceFindings = [finding, ...this.state.deviceFindings];
    this.saveState();
    return finding;
  }

  async getTrustedContacts(): Promise<TrustedContact[]> {
    return [...this.state.contacts];
  }

  async addTrustedContact(contact: Omit<TrustedContact, 'id' | 'invitedAt'>): Promise<TrustedContact> {
    const newContact: TrustedContact = {
      ...contact,
      id: `contact_${Date.now()}`,
      invitedAt: new Date().toISOString(),
    };
    this.state.contacts = [...this.state.contacts, newContact];
    this.saveState();
    return newContact;
  }

  async updateContactConsent(
    id: string,
    status: TrustedContact['consentStatus']
  ): Promise<TrustedContact | null> {
    const contact = this.state.contacts.find((c) => c.id === id);
    if (!contact) return null;
    contact.consentStatus = status;
    if (status === 'ACCEPTED') {
      contact.acceptedAt = new Date().toISOString();
    }
    this.saveState();
    return { ...contact };
  }

  async removeTrustedContact(id: string): Promise<boolean> {
    const prevLen = this.state.contacts.length;
    this.state.contacts = this.state.contacts.filter((c) => c.id !== id);
    this.saveState();
    return this.state.contacts.length < prevLen;
  }

  async getUserFeedback(): Promise<UserFeedback[]> {
    return [...this.state.feedback];
  }

  async submitFeedback(feedback: Omit<UserFeedback, 'id' | 'timestamp'>): Promise<UserFeedback> {
    const newFb: UserFeedback = {
      ...feedback,
      id: `fb_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.state.feedback = [newFb, ...this.state.feedback];
    this.saveState();
    return newFb;
  }

  async getConsentPreferences(): Promise<ConsentPreferences> {
    return { ...this.state.consent };
  }

  async updateConsentPreferences(prefs: Partial<ConsentPreferences>): Promise<ConsentPreferences> {
    this.state.consent = { ...this.state.consent, ...prefs };
    this.saveState();
    return { ...this.state.consent };
  }

  async getModelEvaluation(): Promise<ModelEvaluation> {
    return { ...SEED_MODEL_EVALUATION };
  }

  async resetDemoData(): Promise<void> {
    this.state = getDefaultState();
    this.saveState();
  }
}
