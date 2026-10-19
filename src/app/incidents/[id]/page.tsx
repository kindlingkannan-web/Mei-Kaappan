'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Incident, EvidenceEvent, IncidentStatus } from '@/types';
import { SeverityBadge } from '@/components/common/SeverityBadge';
import { RiskScoreGauge } from '@/components/common/RiskScoreGauge';
import { scanMessageAndUrl } from '@/lib/scanner-engine';
import { evaluatePaymentSafety } from '@/lib/payment-checker';
import {
  GitMerge,
  ArrowLeft,
  Clock,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Plus,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  Send,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  CreditCard,
  Info,
} from 'lucide-react';

export default function IncidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const {
    incidents,
    changeIncidentStatus,
    addScanEvidenceToIncident,
    addPaymentCheckToIncident,
    submitFeedback,
    showToast,
  } = useApp();

  const [incident, setIncident] = useState<Incident | null>(null);
  const [evidences, setEvidences] = useState<EvidenceEvent[]>([]);
  const [expandedEvidence, setExpandedEvidence] = useState<Record<string, boolean>>({});
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<IncidentStatus>('UNDER_REVIEW');
  const [statusNotes, setStatusNotes] = useState('');

  // Add evidence modal
  const [showAddEvidenceModal, setShowAddEvidenceModal] = useState(false);
  const [evidenceInputType, setEvidenceInputType] = useState<'MESSAGE' | 'PAYMENT'>('MESSAGE');
  const [evidenceText, setEvidenceText] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [evidenceUpi, setEvidenceUpi] = useState('');
  const [evidenceAmount, setEvidenceAmount] = useState('');

  // Feedback state
  const [feedbackLabel, setFeedbackLabel] = useState<'CORRECT' | 'INCORRECT' | 'UNCERTAIN'>('CORRECT');
  const [feedbackComments, setFeedbackComments] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Sync incident
  useEffect(() => {
    const found = incidents.find((i) => i.id === id);
    if (found) {
      setIncident(found);
    }
  }, [id, incidents]);

  if (!incident) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-card">
        <ShieldAlert className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">Incident Not Found</h3>
        <p className="text-xs text-slate-500 mt-1">
          No scam journey incident found with ID #{id}.
        </p>
        <Link
          href="/incidents"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Incidents List
        </Link>
      </div>
    );
  }

  const handleStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await changeIncidentStatus(incident.id, newStatus, statusNotes);
    setShowStatusModal(false);
    setStatusNotes('');
  };

  const handleAddEvidenceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (evidenceInputType === 'MESSAGE') {
      if (!evidenceText.trim()) return;
      const scan = scanMessageAndUrl(evidenceText, evidenceUrl);
      await addScanEvidenceToIncident(incident.id, scan, 'Additional user submitted message evidence');
    } else {
      if (!evidenceUpi.trim()) return;
      const check = evaluatePaymentSafety({
        upiId: evidenceUpi,
        amount: evidenceAmount ? parseFloat(evidenceAmount) : undefined,
      });
      await addPaymentCheckToIncident(incident.id, check);
    }

    setShowAddEvidenceModal(false);
    setEvidenceText('');
    setEvidenceUrl('');
    setEvidenceUpi('');
    setEvidenceAmount('');
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitFeedback({
      targetType: 'INCIDENT',
      targetId: incident.id,
      label: feedbackLabel,
      userComments: feedbackComments || `Marked incident #${incident.id} assessment as ${feedbackLabel.toLowerCase()}.`,
      submittedBy: 'Demo User',
    });
    setFeedbackSubmitted(true);
  };

  return (
    <div className="space-y-6">
      {/* Back button & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/incidents"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400">
                Incident #{incident.id}
              </span>
              <SeverityBadge severity={incident.severity} size="sm" />
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                {incident.status.replace('_', ' ')}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {incident.title}
            </h2>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowAddEvidenceModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Correlated Evidence
          </button>

          <button
            onClick={() => setShowStatusModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
          >
            Change Status
          </button>

          <Link
            href={`/reports?incidentId=${incident.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Export Report
          </Link>
        </div>
      </div>

      {/* Main Incident Overview & Score Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Summary & Attack Vector */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-card space-y-4">
          <div>
            <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
              Scam Vector Progression
            </span>
            <div className="mt-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <GitMerge className="w-4 h-4 text-cyan-500 flex-shrink-0" />
              <span>{incident.primaryAttackerVector}</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Executive Incident Summary
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
              {incident.summary}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400">Created:</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {new Date(incident.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-slate-400">Last Evaluated:</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {new Date(incident.updatedAt).toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-slate-400">Assessment Method:</span>
              <p className="font-semibold text-cyan-500 mt-0.5">
                {incident.lastAssessment?.method || 'RULE_BASED'}
              </p>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Score Gauge & Risk Box */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-card flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Unified Scam Risk Score
          </span>
          <RiskScoreGauge score={incident.currentRiskScore} severity={incident.severity} size="lg" showScale />
          <div className="mt-4">
            <SeverityBadge severity={incident.severity} size="lg" />
          </div>
          <p className="text-xs text-slate-500 mt-2 px-4 leading-relaxed">
            Derived from {incident.evidenceIds.length} correlated cross-vector evidence events.
          </p>
        </div>
      </div>

      {/* CORE DIFFERENTIATOR: Scam Journey Correlation Chronological Timeline */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-card">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <GitMerge className="w-5 h-5 text-cyan-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Scam Journey Correlation Timeline
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Chronological evolution of risk and evidence correlation over time
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
            {incident.timeline.length} Events
          </span>
        </div>

        {/* Timeline List */}
        <div className="mt-6 relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-6">
          {incident.timeline.map((entry, idx) => {
            let dotColor = 'bg-cyan-500';
            if (entry.type === 'RISK_ESCALATED') dotColor = 'bg-red-500';
            else if (entry.type === 'RISK_MITIGATED') dotColor = 'bg-emerald-500';
            else if (entry.type === 'STATUS_CHANGED') dotColor = 'bg-purple-500';

            return (
              <div key={entry.id || idx} className="relative group">
                {/* Node dot */}
                <div
                  className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${dotColor} shadow-md`}
                />

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {entry.title}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{new Date(entry.timestamp).toLocaleString()}</span>
                      <span>•</span>
                      <span className="font-medium text-slate-500">{entry.actor}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {entry.description}
                  </p>

                  {entry.previousRiskScore !== undefined && entry.newRiskScore !== undefined && (
                    <div className="flex items-center gap-2 pt-1 text-[11px] font-mono">
                      <span className="text-slate-400">Score Transition:</span>
                      <span className="text-slate-500">{entry.previousRiskScore}/100</span>
                      <span className="text-slate-400">&rarr;</span>
                      <span
                        className={`font-bold ${
                          entry.newRiskScore > entry.previousRiskScore
                            ? 'text-red-500'
                            : 'text-emerald-500'
                        }`}
                      >
                        {entry.newRiskScore}/100
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Explainable Risk Assessment Breakdown ("Why was this flagged?") */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-card space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              Explainable Risk Factors & Recommended Defense Steps
            </h3>
            <p className="text-xs text-slate-500">
              Transparent, deterministic evaluation breakdown. No black-box unexplained verdicts.
            </p>
          </div>
        </div>

        {/* Positive Risk Factors */}
        <div>
          <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2">
            Contributing Threat Indicators (+Points)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {incident.lastAssessment?.positiveIndicators.map((factor, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-600 dark:text-red-400">
                    {factor.title}
                  </span>
                  <span className="text-xs font-mono font-bold text-red-500">
                    +{factor.scoreContribution} pts
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {factor.explanation}
                </p>
                <div className="text-[10px] text-slate-400 font-mono">
                  Confidence: {Math.round(factor.confidence * 100)}% • Category: {factor.category}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reassuring Factors */}
        {incident.lastAssessment?.reassuringIndicators && incident.lastAssessment.reassuringIndicators.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-2">
              Mitigating Reassuring Factors (-Points)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {incident.lastAssessment.reassuringIndicators.map((factor, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {factor.title}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-500">
                      {factor.scoreContribution} pts
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {factor.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Defense Actions */}
        <div className="p-4 rounded-xl bg-cyan-50/40 dark:bg-cyan-950/20 border border-cyan-200/50 dark:border-cyan-800/40 space-y-2">
          <h4 className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Recommended Next Safety Actions
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            {incident.lastAssessment?.recommendedNextSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-cyan-500 font-bold">&bull;</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* User Feedback & Model Calibration Widget */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-card">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-cyan-500" />
          Model Calibration Feedback
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Help improve Mei-Kaappan&apos;s detection heuristics by validating whether this risk score was accurate.
        </p>

        {feedbackSubmitted ? (
          <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Thank you! Your feedback has been recorded in the model evaluation workspace.
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="mt-4 space-y-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFeedbackLabel('CORRECT')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  feedbackLabel === 'CORRECT'
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                Accurate Detection
              </button>
              <button
                type="button"
                onClick={() => setFeedbackLabel('INCORRECT')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  feedbackLabel === 'INCORRECT'
                    ? 'bg-red-500 text-white border-red-500 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                False Alarm / Incorrect
              </button>
              <button
                type="button"
                onClick={() => setFeedbackLabel('UNCERTAIN')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  feedbackLabel === 'UNCERTAIN'
                    ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Uncertain
              </button>
            </div>

            <textarea
              rows={2}
              value={feedbackComments}
              onChange={(e) => setFeedbackComments(e.target.value)}
              placeholder="Optional notes: Was this an actual scam attempt you encountered? What happened?"
              className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-md transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              Submit Feedback
            </button>
          </form>
        )}
      </div>

      {/* Audit Log */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-card">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Incident Audit Log & Action History
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Immutable audit record of actions taken by users and analysts.
        </p>

        <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {incident.auditLog.length === 0 ? (
            <p className="text-slate-400 py-2">No manual audit actions recorded yet.</p>
          ) : (
            incident.auditLog.map((log) => (
              <div key={log.id} className="py-2.5 flex items-start justify-between gap-4">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {log.action.replace('_', ' ')}
                  </span>
                  <p className="text-slate-500 mt-0.5">{log.notes}</p>
                </div>
                <div className="text-right text-[11px] text-slate-400 flex-shrink-0">
                  <p>{new Date(log.timestamp).toLocaleTimeString()}</p>
                  <p className="font-medium text-slate-500">{log.performedBy}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Change Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Update Incident Status
            </h3>

            <form onSubmit={handleStatusSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Select New Status:
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as IncidentStatus)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                >
                  <option value="ACTIVE">ACTIVE (Threat ongoing / under monitoring)</option>
                  <option value="UNDER_REVIEW">UNDER_REVIEW (Assigned for analyst check)</option>
                  <option value="RESOLVED">RESOLVED (Threat contained / verified harmless)</option>
                  <option value="DISMISSED">DISMISSED (False alarm / duplicate case)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Resolution Notes / Rationale:
                </label>
                <textarea
                  rows={3}
                  required
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="Explain why this status is being assigned..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
                >
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Evidence Modal */}
      {showAddEvidenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Correlate Additional Evidence into Incident #{incident.id}
            </h3>
            <p className="text-xs text-slate-500">
              The Scam Journey Correlation Engine will evaluate newly added evidence and recalculate the unified incident risk score in real-time.
            </p>

            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <button
                type="button"
                onClick={() => setEvidenceInputType('MESSAGE')}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all ${
                  evidenceInputType === 'MESSAGE'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Suspicious SMS / Message
              </button>
              <button
                type="button"
                onClick={() => setEvidenceInputType('PAYMENT')}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all ${
                  evidenceInputType === 'PAYMENT'
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                UPI Payment Request
              </button>
            </div>

            <form onSubmit={handleAddEvidenceSubmit} className="space-y-4 text-xs">
              {evidenceInputType === 'MESSAGE' ? (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Message Content:
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={evidenceText}
                      onChange={(e) => setEvidenceText(e.target.value)}
                      placeholder="Paste follow-up SMS or chat message..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Associated URL (Optional):
                    </label>
                    <input
                      type="text"
                      value={evidenceUrl}
                      onChange={(e) => setEvidenceUrl(e.target.value)}
                      placeholder="e.g. http://electricity-bill-pay.xyz"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      UPI Identifier:
                    </label>
                    <input
                      type="text"
                      required
                      value={evidenceUpi}
                      onChange={(e) => setEvidenceUpi(e.target.value)}
                      placeholder="e.g. electricity.billing.dept@okaxis"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Requested Amount (₹):
                    </label>
                    <input
                      type="number"
                      value={evidenceAmount}
                      onChange={(e) => setEvidenceAmount(e.target.value)}
                      placeholder="e.g. 10"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddEvidenceModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
                >
                  Correlate Evidence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
