'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { evaluatePaymentSafety, PaymentCheckResult } from '@/lib/payment-checker';
import { SeverityBadge } from '@/components/common/SeverityBadge';
import { RiskScoreGauge } from '@/components/common/RiskScoreGauge';
import {
  CreditCard,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Save,
  Sparkles,
  Info,
  IndianRupee,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

const PRESET_UPI_TESTS = [
  {
    label: 'Blacklisted Utility Scam UPI',
    upi: 'electricity.billing.dept@okaxis',
    recipient: 'Power Office Bill Officer',
    amount: '10',
    note: 'electricity bill clearance update',
  },
  {
    label: 'Blacklisted KYC Phishing UPI',
    upi: 'quickkyc.verification@ybl',
    recipient: 'KYC Support Executive',
    amount: '5',
    note: 'kyc verification fee token',
  },
  {
    label: 'Customs Extortion Scam UPI',
    upi: 'customs.clearance.fee@paytm',
    recipient: 'Customs Officer Sharma',
    amount: '45000',
    note: 'customs tax penalty clearance for parcel',
  },
  {
    label: 'Reverse UPI PIN Scam ("Receive Money")',
    upi: 'instantcashback@okicici',
    recipient: 'Cashback Rewards Dept',
    amount: '2000',
    note: 'enter pin to receive cashback reward',
  },
  {
    label: 'Verified Official Utility (Safe)',
    upi: 'bescom@sbi',
    recipient: 'Bangalore Electricity Supply Co',
    amount: '1450',
    note: 'Electricity Bill Monthly Payment',
  },
];

export default function PrePaymentSafetyCheckPage() {
  const { incidents, addPaymentCheckToIncident, showToast } = useApp();

  const [upiId, setUpiId] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  const [checkResult, setCheckResult] = useState<PaymentCheckResult | null>(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('NONE');
  const [isSaved, setIsSaved] = useState(false);

  const handleEvaluate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!upiId.trim()) {
      showToast('warning', 'UPI Required', 'Please enter a UPI identifier to check.');
      return;
    }

    const result = evaluatePaymentSafety({
      upiId,
      recipientName: recipientName || undefined,
      amount: amount ? parseFloat(amount) : undefined,
      paymentNoteOrContext: paymentNote || undefined,
    });

    setCheckResult(result);
    setIsSaved(false);
    showToast('info', 'Payment Check Evaluated', `Assessed Risk Score: ${result.riskScore}/100 (${result.severity})`);
  };

  const handleApplyPreset = (preset: typeof PRESET_UPI_TESTS[0]) => {
    setUpiId(preset.upi);
    setRecipientName(preset.recipient);
    setAmount(preset.amount);
    setPaymentNote(preset.note);

    const result = evaluatePaymentSafety({
      upiId: preset.upi,
      recipientName: preset.recipient,
      amount: parseFloat(preset.amount),
      paymentNoteOrContext: preset.note,
    });
    setCheckResult(result);
    setIsSaved(false);
  };

  const handleSaveToIncident = async () => {
    if (!checkResult || selectedIncidentId === 'NONE') return;
    await addPaymentCheckToIncident(selectedIncidentId, checkResult);
    setIsSaved(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-1">
          <CreditCard className="w-3.5 h-3.5" />
          User-Initiated Safety Verification
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Pre-Payment Safety Check
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Verify UPI handles, payment amounts, and context notes against threat intelligence before authorizing any debit.
        </p>
      </div>

      {/* Critical Golden Rule Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex items-start gap-3 shadow-sm">
        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 dark:text-amber-200 space-y-1">
          <h4 className="font-bold text-sm text-amber-600 dark:text-amber-400">
            Golden Rule of UPI Safety:
          </h4>
          <p className="leading-relaxed">
            Entering your UPI PIN is <strong>ALWAYS to SEND money</strong> from your bank account. You NEVER need to enter your UPI PIN, scan a QR code, or approve a payment request to <em>receive</em> money or cashback.
          </p>
        </div>
      </div>

      {/* Preset Test Scenarios */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-card">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
          Test with Sample UPI Scenarios:
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          {PRESET_UPI_TESTS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/10 hover:text-emerald-400 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Check Form & Result Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form: 5 Cols */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            Payment Verification Details
          </h3>

          <form onSubmit={handleEvaluate} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                UPI Identifier (Required):
              </label>
              <input
                type="text"
                required
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g. recipient@bankhandle"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Recipient Name (If displayed):
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Ramesh Electricals"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Amount (₹):
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 10 or 5000"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Payment Remark / Context Note:
              </label>
              <textarea
                rows={2}
                value={paymentNote}
                onChange={(e) => setPaymentNote(e.target.value)}
                placeholder="e.g. 'Electricity bill fee update' or 'KYC processing token'"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-emerald-500" />
                Privacy & Financial Sandbox:
              </span>
              <p>
                Mei-Kaappan does NOT request banking credentials, store UPI PINs, or execute live financial debits.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-md shadow-emerald-950/30 flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Check Payment Safety
            </button>
          </form>
        </div>

        {/* Results: 7 Cols */}
        <div className="lg:col-span-7 space-y-4">
          {!checkResult ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-200 dark:border-slate-800 shadow-card text-center text-slate-400 space-y-2">
              <CreditCard className="w-12 h-12 mx-auto text-slate-500" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Awaiting Payment Safety Verification
              </h4>
              <p className="text-xs max-w-sm mx-auto">
                Enter a UPI identifier or select one of the test scenarios to inspect threat intelligence reputation and contextual risks.
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-card space-y-5 animate-in fade-in">
              {/* Score header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <RiskScoreGauge score={checkResult.riskScore} severity={checkResult.severity} size="md" />
                  <div>
                    <SeverityBadge severity={checkResult.severity} size="md" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                      {checkResult.isBlacklisted
                        ? 'CRITICAL: Reported Scam UPI Identifier'
                        : checkResult.severity === 'HIGH' || checkResult.severity === 'CRITICAL'
                        ? 'High-Risk Payment Request'
                        : checkResult.severity === 'SUSPICIOUS'
                        ? 'Suspicious Payment Context'
                        : 'No Active Threat Reports Found'}
                    </h3>
                    <p className="text-xs font-mono text-cyan-600 dark:text-cyan-400">
                      {checkResult.upiId}
                    </p>
                  </div>
                </div>
              </div>

              {/* Threat Match Details if Blacklisted */}
              {checkResult.threatMatchDetails && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      Known Flagged Threat Indicator Match
                    </span>
                    <span>{checkResult.threatMatchDetails.reportCount} Verified Reports</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                    This UPI identifier was reported in previous cybersecurity cases regarding{' '}
                    <strong>{checkResult.threatMatchDetails.category}</strong>. Last reported on{' '}
                    {new Date(checkResult.threatMatchDetails.lastReported).toLocaleDateString()}.
                  </p>
                </div>
              )}

              {/* Contributing Factors */}
              {checkResult.detectedFactors.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
                    Risk Factors Flagged:
                  </span>
                  <div className="space-y-2">
                    {checkResult.detectedFactors.map((f, idx) => (
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
              )}

              {/* Reassuring Factors */}
              {checkResult.reassuringFactors.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">
                    Reassuring Signals:
                  </span>
                  <div className="space-y-2">
                    {checkResult.reassuringFactors.map((f, idx) => (
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

              {/* Safety Advisories */}
              <div className="p-4 rounded-xl bg-cyan-50/40 dark:bg-cyan-950/20 border border-cyan-200/50 dark:border-cyan-800/40 space-y-1.5 text-xs">
                <span className="font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Safety Guidance
                </span>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                  {checkResult.safetyAdvisories.map((adv, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-cyan-500 font-bold">&bull;</span>
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Link to Scam Journey Incident */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Correlate into Scam Journey Incident
                  </span>
                  {isSaved && (
                    <span className="text-xs font-semibold text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correlated Successfully
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <select
                    value={selectedIncidentId}
                    onChange={(e) => setSelectedIncidentId(e.target.value)}
                    className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                  >
                    <option value="NONE">-- Select Existing Incident to Link --</option>
                    {incidents.map((inc) => (
                      <option key={inc.id} value={inc.id}>
                        #{inc.id} - {inc.title.slice(0, 35)}...
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleSaveToIncident}
                    disabled={selectedIncidentId === 'NONE' || isSaved}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-cyan-600 dark:hover:bg-cyan-500 font-semibold transition-colors disabled:opacity-40"
                  >
                    Link Evidence
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
