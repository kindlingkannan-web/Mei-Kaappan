/**
 * Mei-Kaappan — Java Spring Boot REST API Adapter
 * Connects the Next.js frontend to a Java Spring Boot REST Backend.
 * Uses environment variable NEXT_PUBLIC_API_BASE_URL (e.g. http://localhost:8080/api/v1).
 * When running in demo mode or if the backend is unreachable, it delegates to DemoRepository.
 */

import { IRepository, DemoRepository } from './repository';
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

export class SpringBootApiAdapter implements IRepository {
  private baseUrl: string;
  private fallback: DemoRepository;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';
    this.fallback = new DemoRepository();
  }

  private isLiveMode(): boolean {
    return process.env.NEXT_PUBLIC_DATA_SOURCE === 'live';
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      throw new Error(`Spring Boot API error: ${res.status} ${res.statusText}`);
    }

    return (await res.json()) as T;
  }

  async getCurrentUser(): Promise<UserProfile> {
    if (!this.isLiveMode()) return this.fallback.getCurrentUser();
    try {
      return await this.request<UserProfile>('/users/me');
    } catch {
      return this.fallback.getCurrentUser();
    }
  }

  async updateCurrentUser(user: Partial<UserProfile>): Promise<UserProfile> {
    if (!this.isLiveMode()) return this.fallback.updateCurrentUser(user);
    try {
      return await this.request<UserProfile>('/users/me', {
        method: 'PATCH',
        body: JSON.stringify(user),
      });
    } catch {
      return this.fallback.updateCurrentUser(user);
    }
  }

  async getIncidents(): Promise<Incident[]> {
    if (!this.isLiveMode()) return this.fallback.getIncidents();
    try {
      return await this.request<Incident[]>('/incidents');
    } catch {
      return this.fallback.getIncidents();
    }
  }

  async getIncidentById(id: string): Promise<Incident | null> {
    if (!this.isLiveMode()) return this.fallback.getIncidentById(id);
    try {
      return await this.request<Incident>(`/incidents/${id}`);
    } catch {
      return this.fallback.getIncidentById(id);
    }
  }

  async createIncident(incident: Incident): Promise<Incident> {
    if (!this.isLiveMode()) return this.fallback.createIncident(incident);
    try {
      return await this.request<Incident>('/incidents', {
        method: 'POST',
        body: JSON.stringify(incident),
      });
    } catch {
      return this.fallback.createIncident(incident);
    }
  }

  async updateIncident(incident: Incident): Promise<Incident> {
    if (!this.isLiveMode()) return this.fallback.updateIncident(incident);
    try {
      return await this.request<Incident>(`/incidents/${incident.id}`, {
        method: 'PUT',
        body: JSON.stringify(incident),
      });
    } catch {
      return this.fallback.updateIncident(incident);
    }
  }

  async updateIncidentStatus(id: string, status: IncidentStatus, notes: string): Promise<Incident | null> {
    if (!this.isLiveMode()) return this.fallback.updateIncidentStatus(id, status, notes);
    try {
      return await this.request<Incident>(`/incidents/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, notes }),
      });
    } catch {
      return this.fallback.updateIncidentStatus(id, status, notes);
    }
  }

  async getEvidenceById(id: string): Promise<EvidenceEvent | null> {
    if (!this.isLiveMode()) return this.fallback.getEvidenceById(id);
    try {
      return await this.request<EvidenceEvent>(`/evidence/${id}`);
    } catch {
      return this.fallback.getEvidenceById(id);
    }
  }

  async getEvidencesForIncident(incidentId: string): Promise<EvidenceEvent[]> {
    if (!this.isLiveMode()) return this.fallback.getEvidencesForIncident(incidentId);
    try {
      return await this.request<EvidenceEvent[]>(`/incidents/${incidentId}/evidence`);
    } catch {
      return this.fallback.getEvidencesForIncident(incidentId);
    }
  }

  async addEvidenceEvent(evidence: EvidenceEvent): Promise<EvidenceEvent> {
    if (!this.isLiveMode()) return this.fallback.addEvidenceEvent(evidence);
    try {
      return await this.request<EvidenceEvent>('/evidence', {
        method: 'POST',
        body: JSON.stringify(evidence),
      });
    } catch {
      return this.fallback.addEvidenceEvent(evidence);
    }
  }

  async getAlerts(): Promise<Alert[]> {
    if (!this.isLiveMode()) return this.fallback.getAlerts();
    try {
      return await this.request<Alert[]>('/alerts');
    } catch {
      return this.fallback.getAlerts();
    }
  }

  async markAlertAsRead(id: string): Promise<Alert | null> {
    if (!this.isLiveMode()) return this.fallback.markAlertAsRead(id);
    try {
      return await this.request<Alert>(`/alerts/${id}/read`, { method: 'POST' });
    } catch {
      return this.fallback.markAlertAsRead(id);
    }
  }

  async acknowledgeAlert(id: string): Promise<Alert | null> {
    if (!this.isLiveMode()) return this.fallback.acknowledgeAlert(id);
    try {
      return await this.request<Alert>(`/alerts/${id}/acknowledge`, { method: 'POST' });
    } catch {
      return this.fallback.acknowledgeAlert(id);
    }
  }

  async resolveAlert(id: string, resolution: 'RESOLVED' | 'DISMISSED'): Promise<Alert | null> {
    if (!this.isLiveMode()) return this.fallback.resolveAlert(id, resolution);
    try {
      return await this.request<Alert>(`/alerts/${id}/resolve`, {
        method: 'POST',
        body: JSON.stringify({ resolution }),
      });
    } catch {
      return this.fallback.resolveAlert(id, resolution);
    }
  }

  async getThreatIndicators(): Promise<ThreatIndicator[]> {
    if (!this.isLiveMode()) return this.fallback.getThreatIndicators();
    try {
      return await this.request<ThreatIndicator[]>('/threat-intelligence/indicators');
    } catch {
      return this.fallback.getThreatIndicators();
    }
  }

  async getIndicatorByValue(value: string): Promise<ThreatIndicator | null> {
    if (!this.isLiveMode()) return this.fallback.getIndicatorByValue(value);
    try {
      return await this.request<ThreatIndicator>(
        `/threat-intelligence/indicators/lookup?value=${encodeURIComponent(value)}`
      );
    } catch {
      return this.fallback.getIndicatorByValue(value);
    }
  }

  async submitThreatReport(
    indicator: Omit<ThreatIndicator, 'id' | 'firstReported' | 'lastReported'>
  ): Promise<ThreatIndicator> {
    if (!this.isLiveMode()) return this.fallback.submitThreatReport(indicator);
    try {
      return await this.request<ThreatIndicator>('/threat-intelligence/reports', {
        method: 'POST',
        body: JSON.stringify(indicator),
      });
    } catch {
      return this.fallback.submitThreatReport(indicator);
    }
  }

  async getDeviceInfo(): Promise<DeviceInfo> {
    if (!this.isLiveMode()) return this.fallback.getDeviceInfo();
    try {
      return await this.request<DeviceInfo>('/device/info');
    } catch {
      return this.fallback.getDeviceInfo();
    }
  }

  async getDeviceFindings(): Promise<DeviceFinding[]> {
    if (!this.isLiveMode()) return this.fallback.getDeviceFindings();
    try {
      return await this.request<DeviceFinding[]>('/device/findings');
    } catch {
      return this.fallback.getDeviceFindings();
    }
  }

  async updateDeviceFindingStatus(
    id: string,
    status: DeviceFinding['reviewStatus']
  ): Promise<DeviceFinding | null> {
    if (!this.isLiveMode()) return this.fallback.updateDeviceFindingStatus(id, status);
    try {
      return await this.request<DeviceFinding>(`/device/findings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch {
      return this.fallback.updateDeviceFindingStatus(id, status);
    }
  }

  async addDeviceFinding(finding: DeviceFinding): Promise<DeviceFinding> {
    if (!this.isLiveMode()) return this.fallback.addDeviceFinding(finding);
    try {
      return await this.request<DeviceFinding>('/device/findings', {
        method: 'POST',
        body: JSON.stringify(finding),
      });
    } catch {
      return this.fallback.addDeviceFinding(finding);
    }
  }

  async getTrustedContacts(): Promise<TrustedContact[]> {
    if (!this.isLiveMode()) return this.fallback.getTrustedContacts();
    try {
      return await this.request<TrustedContact[]>('/guardian/contacts');
    } catch {
      return this.fallback.getTrustedContacts();
    }
  }

  async addTrustedContact(contact: Omit<TrustedContact, 'id' | 'invitedAt'>): Promise<TrustedContact> {
    if (!this.isLiveMode()) return this.fallback.addTrustedContact(contact);
    try {
      return await this.request<TrustedContact>('/guardian/contacts', {
        method: 'POST',
        body: JSON.stringify(contact),
      });
    } catch {
      return this.fallback.addTrustedContact(contact);
    }
  }

  async updateContactConsent(
    id: string,
    status: TrustedContact['consentStatus']
  ): Promise<TrustedContact | null> {
    if (!this.isLiveMode()) return this.fallback.updateContactConsent(id, status);
    try {
      return await this.request<TrustedContact>(`/guardian/contacts/${id}/consent`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch {
      return this.fallback.updateContactConsent(id, status);
    }
  }

  async removeTrustedContact(id: string): Promise<boolean> {
    if (!this.isLiveMode()) return this.fallback.removeTrustedContact(id);
    try {
      await this.request<void>(`/guardian/contacts/${id}`, { method: 'DELETE' });
      return true;
    } catch {
      return this.fallback.removeTrustedContact(id);
    }
  }

  async getUserFeedback(): Promise<UserFeedback[]> {
    if (!this.isLiveMode()) return this.fallback.getUserFeedback();
    try {
      return await this.request<UserFeedback[]>('/feedback');
    } catch {
      return this.fallback.getUserFeedback();
    }
  }

  async submitFeedback(feedback: Omit<UserFeedback, 'id' | 'timestamp'>): Promise<UserFeedback> {
    if (!this.isLiveMode()) return this.fallback.submitFeedback(feedback);
    try {
      return await this.request<UserFeedback>('/feedback', {
        method: 'POST',
        body: JSON.stringify(feedback),
      });
    } catch {
      return this.fallback.submitFeedback(feedback);
    }
  }

  async getConsentPreferences(): Promise<ConsentPreferences> {
    if (!this.isLiveMode()) return this.fallback.getConsentPreferences();
    try {
      return await this.request<ConsentPreferences>('/settings/consent');
    } catch {
      return this.fallback.getConsentPreferences();
    }
  }

  async updateConsentPreferences(prefs: Partial<ConsentPreferences>): Promise<ConsentPreferences> {
    if (!this.isLiveMode()) return this.fallback.updateConsentPreferences(prefs);
    try {
      return await this.request<ConsentPreferences>('/settings/consent', {
        method: 'PATCH',
        body: JSON.stringify(prefs),
      });
    } catch {
      return this.fallback.updateConsentPreferences(prefs);
    }
  }

  async getModelEvaluation(): Promise<ModelEvaluation> {
    if (!this.isLiveMode()) return this.fallback.getModelEvaluation();
    try {
      return await this.request<ModelEvaluation>('/models/evaluation');
    } catch {
      return this.fallback.getModelEvaluation();
    }
  }

  async resetDemoData(): Promise<void> {
    await this.fallback.resetDemoData();
  }
}

// Singleton repository factory
let repositoryInstance: IRepository | null = null;

export function getRepository(): IRepository {
  if (!repositoryInstance) {
    if (process.env.NEXT_PUBLIC_DATA_SOURCE === 'live') {
      repositoryInstance = new SpringBootApiAdapter();
    } else {
      repositoryInstance = new DemoRepository();
    }
  }
  return repositoryInstance;
}
