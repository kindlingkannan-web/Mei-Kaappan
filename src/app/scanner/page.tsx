'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { scanMessageAndUrl, ScanResult } from '@/lib/scanner-engine';
import { SeverityBadge } from '@/components/common/SeverityBadge';
import { RiskScoreGauge } from '@/components/common/RiskScoreGauge';
import {
  ScanSearch,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Link as LinkIcon,
  Plus,
  Save,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  HelpCircle,
  Sparkles,
  Info,
  ExternalLink,
} from 'lucide-react';

const PRESET_SAMPLES = [
  {
    name: 'Electricity Cutoff Threat',
    text: 'Dear Consumer, Your electricity power will be disconnected tonight at 9.30 PM from electricity office because your previous month bill was not updated. Please immediately contact our bill officer at 9845012345 or update at http://electricity-bill-pay.xyz',
    url: 'http://electricity-bill-pay.xyz',
  },
  {
    name: 'Bank KYC Phishing',
    text: 'Dear Customer, Your SBI account KYC has expired. Your netbanking will be suspended within 24 hours. Immediately verify credentials to avoid account block: https://sbi-kyc-verify-portal.top/update',
    url: 'https://sbi-kyc-verify-portal.top/update',
  },
  {
    name: 'Digital Arrest Narcotics Coercion',
    text: 'URGENT NOTICE: A parcel containing illegal contraband under your Aadhaar was seized at Mumbai Customs. Arrest warrant issued under PMLA. Connect on video call immediately to avoid physical arrest.',
    url: '',
  },
  {
    name: 'Remote Access Tool Bait',
    text: 'Customer Support: To process your refund of Rs 4,500, please download AnyDesk from Play Store and share the 9 digit code with executive.',
    url: '',
  },
  {
    name: 'Legitimate Official Bank Notice (Safe)',
    text: 'Dear Customer, your scheduled ECS debit of Rs 1,250 for HDFC Loan has been processed successfully. Never share this OTP or NetBanking password with anyone. Bank never asks for OTP.',
    url: 'https://hdfcbank.com',
  },
];

export default function MessageUrlScannerPage() {
  const { incidents, createIncidentFromScan, addScanEvidenceToIncident, submitFeedback, showToast } = useApp();

  const [messageText, setMessageText] = useState('');
  const [manualUrl, setManualUrl] = useState('');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Save to incident modal/dropdown
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('NEW');
  const [newIncidentTitle, setNewIncidentTitle] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleRunScan = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageText.trim() && !manualUrl.trim()) {
      showToast('warning', 'Input Required', 'Please enter a message text or URL to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setTimeout(() => {
      const result = scanMessageAndUrl(messageText, manualUrl);
      setScanResult(result);
      setIsAnalyzing(false);
      setIsSaved(false);
      showToast('info', 'Analysis Completed', `Computed Scam Risk Score: ${result.riskScore}/100 (${result.severity})`);
    }, 300);
  };

  const handleApplyPreset = (preset: typeof PRESET_SAMPLES[0]) => {
    setMessageText(preset.text);
    setManualUrl(preset.url);
    const result = scanMessageAndUrl(preset.text, preset.url);
    setScanResult(result);
    setIsSaved(false);
  };

  const handleSaveEvidence = async () => {
    if (!scanResult) return;

    if (selectedIncidentId === 'NEW') {
      const created = await createIncidentFromScan(
        newIncidentTitle || `Scam Scan: ${scanResult.detectedCategories[0] || 'Phishing Heuristic'}`,
        'GENERAL_SUSPICIOUS',
        scanResult
      );
      setIsSaved(true);
    } else {
      await addScanEvidenceToIncident(selectedIncidentId, scanResult);
      setIsSaved(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-1">
          <ScanSearch className="w-3.5 h-3.5" />
          Deterministic Heuristics Engine
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Message & URL Scam Scanner
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Inspect suspicious SMS, WhatsApp forwards, phishing links, and coercion tactics safely.
        </p>
      </div>

      {/* Preset Test Scenarios */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-card">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
          Quick Test Sample Scenarios:
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {PRESET_SAMPLES.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500/10 hover:text-cyan-400 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: 5 Cols */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            Input Communication Content
          </h3>

          <form onSubmit={handleRunScan} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Suspicious SMS / Chat / Email Text:
              </label>
              <textarea
                rows={6}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Paste the SMS or message here (e.g. 'Dear customer, your electricity will be disconnected...')"
                className="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 leading-relaxed font-sans"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Extracted or Manual URL (Optional):
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={manualUrl}
                  onChange={(e) => setManualUrl(e.target.value)}
                  placeholder="https://example-suspicious-domain.xyz"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>
            </div>

            {/* SSRF Safety Disclaimer */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-start gap-2">
              <Info className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
              <span>
                <strong>SSRF Protection Active:</strong> URLs are evaluated purely on client-side grammatical syntax, known TLD risks, and brand typosquatting. Destination links are never visited by servers.
              </span>
            </div>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-md shadow-cyan-950/40 flex items-center justify-center gap-2"
            >
              <ScanSearch className="w-4 h-4" />
              {isAnalyzing ? 'Analyzing Heuristics...' : 'Assess Scam Risk'}
            </button>
          </form>
        </div>

        {/* Right Results: 7 Cols */}
        <div className="lg:col-span-7 space-y-4">
          {!scanResult ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-200 dark:border-slate-800 shadow-card text-center text-slate-400 space-y-2">
              <ScanSearch className="w-12 h-12 mx-auto text-slate-500" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Awaiting Content Analysis
              </h4>
              <p className="text-xs max-w-sm mx-auto">
                Select one of the sample scenarios above or paste your own message to evaluate threat indicators and risk score.
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-card space-y-5 animate-in fade-in">
              {/* Score Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <RiskScoreGauge score={scanResult.riskScore} severity={scanResult.severity} size="md" />
                  <div>
                    <SeverityBadge severity={scanResult.severity} size="md" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                      {scanResult.severity === 'CRITICAL'
                        ? 'High-Probability Scam Detected'
                        : scanResult.severity === 'HIGH'
                        ? 'Severe Risk Signals Flagged'
                        : scanResult.severity === 'SUSPICIOUS'
                        ? 'Suspicious Patterns Identified'
                        : 'No High-Risk Signals Detected'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Evaluated via {scanResult.method} Engine • Confidence: {Math.round(scanResult.confidence * 100)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Detected Categories Badges */}
              {scanResult.detectedCategories.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Detected Threat Typologies:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {scanResult.detectedCategories.map((cat, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 font-semibold"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Contributing Factors */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
                  Threat Indicators Flagged (+Points):
                </span>
                <div className="space-y-2">
                  {scanResult.positiveFactors.map((f, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 text-xs space-y-0.5"
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-red-600 dark:text-red-400">{f.title}</span>
                        <span className="text-red-500">+{f.scoreContribution} pts</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                        {f.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reassuring Factors */}
              {scanResult.reassuringFactors.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
                    Mitigating Reassuring Factors (-Points):
                  </span>
                  <div className="space-y-2">
                    {scanResult.reassuringFactors.map((f, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30 text-xs space-y-0.5"
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-emerald-600 dark:text-emerald-400">{f.title}</span>
                          <span className="text-emerald-500">{f.scoreContribution} pts</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                          {f.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Steps */}
              <div className="p-4 rounded-xl bg-cyan-50/40 dark:bg-cyan-950/20 border border-cyan-200/50 dark:border-cyan-800/40 space-y-1.5 text-xs">
                <span className="font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Recommended Defense Steps
                </span>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                  {scanResult.recommendedSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-cyan-500 font-bold">&bull;</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Save to Incident Action Box */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Save Assessment as Scam Journey Evidence
                  </span>
                  {isSaved && (
                    <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Saved to Incidents
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-500 mb-1">Target Incident:</label>
                    <select
                      value={selectedIncidentId}
                      onChange={(e) => setSelectedIncidentId(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                    >
                      <option value="NEW">+ Create New Scam Journey Incident</option>
                      {incidents.map((inc) => (
                        <option key={inc.id} value={inc.id}>
                          #{inc.id} - {inc.title.slice(0, 30)}...
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedIncidentId === 'NEW' && (
                    <div>
                      <label className="block text-slate-500 mb-1">Incident Title:</label>
                      <input
                        type="text"
                        value={newIncidentTitle}
                        onChange={(e) => setNewIncidentTitle(e.target.value)}
                        placeholder="e.g. Electricity Bill Scam Attempt"
                        className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSaveEvidence}
                  disabled={isSaved}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-cyan-600 dark:hover:bg-cyan-500 text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  {isSaved ? 'Evidence Recorded' : 'Save to Scam Journey'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
