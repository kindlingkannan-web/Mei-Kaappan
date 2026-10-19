'use client';

/**
 * Mei-Kaappan — Global Application Context & State Store
 * Synchronizes reactive data across Overview, Scam Journey, Scanner, Pre-Payment Check,
 * Device Exposure, Threat Intel, Alerts, Family Guardian, Analytics, and Settings.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
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
import { getRepository } from '../services/api-adapter';
import { ScanResult } from '../lib/scanner-engine';
import { PaymentCheckResult } from '../lib/payment-checker';
import { correlateEvidenceIntoIncident } from '../lib/correlation-engine';
import { runSimulatedDeviceScan } from '../lib/device-scanner';

interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AppContextType {
  // Data State
  user: UserProfile | null;
  incidents: Incident[];
  alerts: Alert[];
  threatIndicators: ThreatIndicator[];
  deviceInfo: DeviceInfo | null;
  deviceFindings: DeviceFinding[];
  trustedContacts: TrustedContact[];
  userFeedback: UserFeedback[];
  consentPrefs: ConsentPreferences | null;
  modelEvaluation: ModelEvaluation | null;
  isLoading: boolean;
  toasts: ToastMessage[];

  // Computed metrics
  unreadAlertsCount: number;
  criticalIncidentsCount: number;
  highRiskIncidentsCount: number;
  activeIncidentsCount: number;

  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Actions
  refreshAll: () => Promise<void>;
  createIncidentFromScan: (title: string, category: Incident['category'], scanResult: ScanResult) => Promise<Incident>;
  addScanEvidenceToIncident: (incidentId: string, scanResult: ScanResult, note?: string) => Promise<Incident | null>;
  addPaymentCheckToIncident: (incidentId: string, paymentResult: PaymentCheckResult) => Promise<Incident | null>;
  changeIncidentStatus: (id: string, status: IncidentStatus, notes: string) => Promise<Incident | null>;
  acknowledgeAlert: (id: string) => Promise<void>;
  resolveAlert: (id: string, resolution: 'RESOLVED' | 'DISMISSED') => Promise<void>;
  triggerDeviceScan: () => Promise<void>;
  resolveDeviceFinding: (id: string, status: DeviceFinding['reviewStatus']) => Promise<void>;
  addNewTrustedContact: (contact: Omit<TrustedContact, 'id' | 'invitedAt'>) => Promise<void>;
  changeContactConsent: (id: string, status: TrustedContact['consentStatus']) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  submitFeedback: (feedback: Omit<UserFeedback, 'id' | 'timestamp'>) => Promise<void>;
  submitThreatReport: (indicator: Omit<ThreatIndicator, 'id' | 'firstReported' | 'lastReported'>) => Promise<void>;
  saveConsentPreferences: (prefs: Partial<ConsentPreferences>) => Promise<void>;
  resetDemoData: () => Promise<void>;
  showToast: (type: ToastMessage['type'], title: string, message: string) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const repository = getRepository();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [threatIndicators, setThreatIndicators] = useState<ThreatIndicator[]>([]);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [deviceFindings, setDeviceFindings] = useState<DeviceFinding[]>([]);
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([]);
  const [userFeedback, setUserFeedback] = useState<UserFeedback[]>([]);
  const [consentPrefs, setConsentPrefs] = useState<ConsentPreferences | null>(null);
  const [modelEvaluation, setModelEvaluation] = useState<ModelEvaluation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [theme, setThemeState] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('mei_kaappan_theme') as 'light' | 'dark' | null;
      const initialTheme = savedTheme || 'dark';
      setThemeState(initialTheme);
      if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const setTheme = useCallback((newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mei_kaappan_theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  const showToast = useCallback((type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshAll = useCallback(async () => {
    try {
      setIsLoading(true);
      const [
        u,
        incs,
        alrts,
        inds,
        devInfo,
        devFinds,
        contacts,
        fbs,
        prefs,
        evalData,
      ] = await Promise.all([
        repository.getCurrentUser(),
        repository.getIncidents(),
        repository.getAlerts(),
        repository.getThreatIndicators(),
        repository.getDeviceInfo(),
        repository.getDeviceFindings(),
        repository.getTrustedContacts(),
        repository.getUserFeedback(),
        repository.getConsentPreferences(),
        repository.getModelEvaluation(),
      ]);

      setUser(u);
      setIncidents(incs);
      setAlerts(alrts);
      setThreatIndicators(inds);
      setDeviceInfo(devInfo);
      setDeviceFindings(devFinds);
      setTrustedContacts(contacts);
      setUserFeedback(fbs);
      setConsentPrefs(prefs);
      setModelEvaluation(evalData);
    } catch (err) {
      console.error('Failed to load application data:', err);
      showToast('error', 'Sync Warning', 'Could not refresh some repository data.');
    } finally {
      setIsLoading(false);
    }
  }, [repository, showToast]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Derived counts
  const unreadAlertsCount = alerts.filter((a) => !a.isRead).length;
  const criticalIncidentsCount = incidents.filter((i) => i.severity === 'CRITICAL' && i.status !== 'RESOLVED' && i.status !== 'DISMISSED').length;
  const highRiskIncidentsCount = incidents.filter((i) => i.severity === 'HIGH' && i.status !== 'RESOLVED' && i.status !== 'DISMISSED').length;
  const activeIncidentsCount = incidents.filter((i) => i.status === 'ACTIVE' || i.status === 'UNDER_REVIEW').length;

  const createIncidentFromScan = async (
    title: string,
    category: Incident['category'],
    scanResult: ScanResult
  ): Promise<Incident> => {
    const evidenceId = `ev_scan_${Date.now()}`;
    const evidence: EvidenceEvent = {
      id: evidenceId,
      type: scanResult.urlAnalyzed ? 'SUSPICIOUS_URL' : 'SUSPICIOUS_MESSAGE',
      source: 'MESSAGE_URL_SCANNER',
      timestamp: scanResult.timestamp,
      summary: scanResult.explanation,
      rawPayload: scanResult.textAnalyzed,
      extractedIndicators: scanResult.extractedIndicators,
      confidence: scanResult.confidence,
      evidenceQuality: 'HIGH_VERIFIED',
      riskContribution: scanResult.riskScore,
    };

    await repository.addEvidenceEvent(evidence);

    const newIncident: Incident = {
      id: `inc_${Math.floor(1000 + Math.random() * 9000)}`,
      userId: user?.id || 'usr_demo_101',
      title: title || 'Suspicious Phishing Message Incident',
      category: category || 'GENERAL_SUSPICIOUS',
      currentRiskScore: scanResult.riskScore,
      severity: scanResult.severity,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      summary: scanResult.explanation,
      primaryAttackerVector: scanResult.urlAnalyzed ? 'Suspicious Web Link / SMS Phishing' : 'Urgent Message Coercion',
      evidenceIds: [evidenceId],
      timeline: [
        {
          id: `tl_${Date.now()}`,
          timestamp: new Date().toISOString(),
          type: 'EVIDENCE_ADDED',
          title: `Initial Scan Flagged (${scanResult.riskScore}/100 - ${scanResult.severity})`,
          description: scanResult.explanation,
          previousRiskScore: 0,
          newRiskScore: scanResult.riskScore,
          evidenceId,
          actor: 'Message & URL Scanner',
        },
      ],
      auditLog: [
        {
          id: `audit_${Date.now()}`,
          timestamp: new Date().toISOString(),
          performedBy: user?.name || 'Demo User',
          action: 'CREATED',
          notes: 'Incident created from manual scanner evaluation.',
        },
      ],
      lastAssessment: {
        riskScore: scanResult.riskScore,
        severity: scanResult.severity,
        classification: `Scam Scanner: ${scanResult.detectedCategories.join(', ') || 'Heuristic Flag'}`,
        evidenceConsideredCount: 1,
        positiveIndicators: scanResult.positiveFactors,
        reassuringIndicators: scanResult.reassuringFactors,
        uncertaintyExplanation: 'Assessed using deterministic text & URL heuristics.',
        recommendedNextSteps: scanResult.recommendedSteps,
        timestamp: scanResult.timestamp,
        method: 'RULE_BASED',
        disclaimer: 'Prototype assessment. Not proof of fraud.',
      },
    };

    const saved = await repository.createIncident(newIncident);
    setIncidents((prev) => [saved, ...prev]);

    // If critical, trigger an alert
    if (saved.severity === 'CRITICAL' || saved.severity === 'HIGH') {
      const newAlert: Alert = {
        id: `alert_${Date.now()}`,
        incidentId: saved.id,
        title: `${saved.severity} Alert: ${saved.title}`,
        summary: saved.summary,
        severity: saved.severity,
        timestamp: new Date().toISOString(),
        alertSource: 'SCAM_JOURNEY_ENGINE',
        isRead: false,
        isAcknowledged: false,
        resolutionStatus: 'UNRESOLVED',
        guardianNotified: consentPrefs?.guardianSharingEnabled ?? true,
      };
      setAlerts((prev) => [newAlert, ...prev]);
    }

    showToast('success', 'Incident Created', `Saved to Scam Journey as Incident #${saved.id}`);
    return saved;
  };

  const addScanEvidenceToIncident = async (
    incidentId: string,
    scanResult: ScanResult,
    note?: string
  ): Promise<Incident | null> => {
    const targetIncident = incidents.find((i) => i.id === incidentId);
    if (!targetIncident) return null;

    const evidenceId = `ev_scan_${Date.now()}`;
    const evidence: EvidenceEvent = {
      id: evidenceId,
      type: scanResult.urlAnalyzed ? 'SUSPICIOUS_URL' : 'SUSPICIOUS_MESSAGE',
      source: 'MESSAGE_URL_SCANNER',
      timestamp: scanResult.timestamp,
      summary: note || scanResult.explanation,
      rawPayload: scanResult.textAnalyzed,
      extractedIndicators: scanResult.extractedIndicators,
      confidence: scanResult.confidence,
      evidenceQuality: 'HIGH_VERIFIED',
      riskContribution: scanResult.riskScore,
    };

    await repository.addEvidenceEvent(evidence);
    const existingEvidences = await repository.getEvidencesForIncident(incidentId);

    const correlation = correlateEvidenceIntoIncident(
      targetIncident,
      evidence,
      existingEvidences,
      user?.name || 'Demo User'
    );

    const updated = await repository.updateIncident(correlation.incident);
    setIncidents((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));

    showToast(
      'info',
      'Scam Journey Correlated',
      `${correlation.scoreChange.reason}`
    );
    return updated;
  };

  const addPaymentCheckToIncident = async (
    incidentId: string,
    paymentResult: PaymentCheckResult
  ): Promise<Incident | null> => {
    const targetIncident = incidents.find((i) => i.id === incidentId);
    if (!targetIncident) return null;

    const evidenceId = `ev_upi_${Date.now()}`;
    const evidence: EvidenceEvent = {
      id: evidenceId,
      type: 'PAYMENT_REQUEST',
      source: 'PRE_PAYMENT_SAFETY_CHECK',
      timestamp: paymentResult.timestamp,
      summary: `Payment check for ${paymentResult.upiId} (Amount: ${paymentResult.amount ? '₹' + paymentResult.amount : 'Unspecified'}) - Risk Score: ${paymentResult.riskScore}/100`,
      rawPayload: `UPI: ${paymentResult.upiId} | Recipient: ${paymentResult.recipientName || 'N/A'} | Blacklisted: ${paymentResult.isBlacklisted}`,
      normalizedValue: paymentResult.upiId,
      extractedIndicators: {
        upis: [paymentResult.upiId],
      },
      confidence: 0.95,
      evidenceQuality: 'HIGH_VERIFIED',
      riskContribution: paymentResult.riskScore,
    };

    await repository.addEvidenceEvent(evidence);
    const existingEvidences = await repository.getEvidencesForIncident(incidentId);

    const correlation = correlateEvidenceIntoIncident(
      targetIncident,
      evidence,
      existingEvidences,
      user?.name || 'Demo User'
    );

    const updated = await repository.updateIncident(correlation.incident);
    setIncidents((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));

    showToast('info', 'Payment Evidence Linked', correlation.scoreChange.reason);
    return updated;
  };

  const changeIncidentStatus = async (
    id: string,
    status: IncidentStatus,
    notes: string
  ): Promise<Incident | null> => {
    const updated = await repository.updateIncidentStatus(id, status, notes);
    if (updated) {
      setIncidents((prev) => prev.map((i) => (i.id === id ? updated : i)));
      showToast('success', 'Incident Updated', `Status changed to ${status}`);
    }
    return updated;
  };

  const acknowledgeAlert = async (id: string) => {
    const updated = await repository.acknowledgeAlert(id);
    if (updated) {
      setAlerts((prev) => prev.map((a) => (a.id === id ? updated : a)));
      showToast('info', 'Alert Acknowledged', 'Alert has been marked as reviewed.');
    }
  };

  const resolveAlert = async (id: string, resolution: 'RESOLVED' | 'DISMISSED') => {
    const updated = await repository.resolveAlert(id, resolution);
    if (updated) {
      setAlerts((prev) => prev.map((a) => (a.id === id ? updated : a)));
      showToast('success', 'Alert Resolved', `Alert marked as ${resolution.toLowerCase()}.`);
    }
  };

  const triggerDeviceScan = async () => {
    const scan = runSimulatedDeviceScan(deviceInfo?.id || 'dev_demo_01');
    for (const f of scan.findings) {
      await repository.addDeviceFinding(f);
    }
    setDeviceFindings(scan.findings);
    setDeviceInfo(scan.deviceInfo);
    showToast(
      scan.overallSeverity === 'CRITICAL' ? 'warning' : 'info',
      'Device Scan Completed',
      `Audit found ${scan.findings.length} findings. Health Score: ${scan.overallScore}/100`
    );
  };

  const resolveDeviceFinding = async (id: string, status: DeviceFinding['reviewStatus']) => {
    const updated = await repository.updateDeviceFindingStatus(id, status);
    if (updated) {
      setDeviceFindings((prev) => prev.map((f) => (f.id === id ? updated : f)));
      const dev = await repository.getDeviceInfo();
      setDeviceInfo(dev);
      showToast('success', 'Finding Remediated', `Finding marked as ${status.toLowerCase()}.`);
    }
  };

  const addNewTrustedContact = async (contact: Omit<TrustedContact, 'id' | 'invitedAt'>) => {
    const added = await repository.addTrustedContact(contact);
    setTrustedContacts((prev) => [...prev, added]);
    showToast('success', 'Invitation Dispatched', `Trusted contact invitation sent to ${added.contactName}.`);
  };

  const changeContactConsent = async (id: string, status: TrustedContact['consentStatus']) => {
    const updated = await repository.updateContactConsent(id, status);
    if (updated) {
      setTrustedContacts((prev) => prev.map((c) => (c.id === id ? updated : c)));
      showToast('info', 'Consent Updated', `Status updated to ${status}.`);
    }
  };

  const deleteContact = async (id: string) => {
    await repository.removeTrustedContact(id);
    setTrustedContacts((prev) => prev.filter((c) => c.id !== id));
    showToast('info', 'Contact Removed', 'Trusted contact removed from Family Guardian.');
  };

  const submitFeedback = async (feedback: Omit<UserFeedback, 'id' | 'timestamp'>) => {
    const fb = await repository.submitFeedback(feedback);
    setUserFeedback((prev) => [fb, ...prev]);
    showToast('success', 'Feedback Recorded', 'Thank you. Your feedback helps calibrate detection accuracy.');
  };

  const submitThreatReport = async (
    indicator: Omit<ThreatIndicator, 'id' | 'firstReported' | 'lastReported'>
  ) => {
    const ind = await repository.submitThreatReport(indicator);
    setThreatIndicators((prev) => {
      const exists = prev.some((i) => i.id === ind.id);
      return exists ? prev.map((i) => (i.id === ind.id ? ind : i)) : [ind, ...prev];
    });
    showToast('success', 'Threat Report Registered', `Report submitted for ${ind.value}.`);
  };

  const saveConsentPreferences = async (prefs: Partial<ConsentPreferences>) => {
    const updated = await repository.updateConsentPreferences(prefs);
    setConsentPrefs(updated);
    showToast('success', 'Preferences Saved', 'Privacy and guardian sharing settings updated.');
  };

  const resetDemoData = async () => {
    await repository.resetDemoData();
    await refreshAll();
    showToast('info', 'Demo Data Reset', 'All records restored to factory demonstration state.');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        incidents,
        alerts,
        threatIndicators,
        deviceInfo,
        deviceFindings,
        trustedContacts,
        userFeedback,
        consentPrefs,
        modelEvaluation,
        isLoading,
        toasts,
        theme,
        setTheme,
        toggleTheme,
        unreadAlertsCount,
        criticalIncidentsCount,
        highRiskIncidentsCount,
        activeIncidentsCount,
        refreshAll,
        createIncidentFromScan,
        addScanEvidenceToIncident,
        addPaymentCheckToIncident,
        changeIncidentStatus,
        acknowledgeAlert,
        resolveAlert,
        triggerDeviceScan,
        resolveDeviceFinding,
        addNewTrustedContact,
        changeContactConsent,
        deleteContact,
        submitFeedback,
        submitThreatReport,
        saveConsentPreferences,
        resetDemoData,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
