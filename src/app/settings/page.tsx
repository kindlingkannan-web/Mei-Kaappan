'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Settings,
  Shield,
  Users,
  Sun,
  Moon,
  Sparkles,
  CheckCircle2,
  Lock,
  Eye,
  Sliders,
} from 'lucide-react';

export default function SettingsPrivacyPage() {
  const { consentPrefs, saveConsentPreferences, theme, setTheme, showToast } = useApp();

  const [guardianSharing, setGuardianSharing] = useState(consentPrefs?.guardianSharingEnabled ?? true);
  const [criticalOnly, setCriticalOnly] = useState(consentPrefs?.shareCriticalAlertsOnly ?? false);
  const [retentionDays, setRetentionDays] = useState(consentPrefs?.dataRetentionDays ?? 90);
  const [anonymousReporting, setAnonymousReporting] = useState(consentPrefs?.allowAnonymousThreatReporting ?? true);
  const [localProcessingOnly, setLocalProcessingOnly] = useState(consentPrefs?.localRuleProcessingOnly ?? false);
  const [simplifiedExplanations, setSimplifiedExplanations] = useState(consentPrefs?.simplifiedExplanations ?? false);

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveConsentPreferences({
      guardianSharingEnabled: guardianSharing,
      shareCriticalAlertsOnly: criticalOnly,
      dataRetentionDays: retentionDays,
      allowAnonymousThreatReporting: anonymousReporting,
      localRuleProcessingOnly: localProcessingOnly,
      simplifiedExplanations: simplifiedExplanations,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-1">
          <Settings className="w-3.5 h-3.5" />
          User Control & Privacy
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Preferences, Privacy & Consent
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Configure application visual appearance, family guardian alert sharing, data retention rules, and privacy preferences.
        </p>
      </div>

      <form onSubmit={handleSavePreferences} className="space-y-6">
        {/* Appearance & Theme (Global Application Theme) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-500" />
                Global Appearance & Theme
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Controls the color theme across the entire application interface, navigation, and charts.
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400 uppercase bg-cyan-500/10 px-2.5 py-1 rounded-full">
              Active: {theme}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Dark Theme Button Card */}
            <button
              type="button"
              onClick={() => {
                setTheme('dark');
                showToast('info', 'Theme Updated', 'Dark cybersecurity theme applied to entire application.');
              }}
              className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                theme === 'dark'
                  ? 'border-cyan-500 bg-cyan-950/20 ring-2 ring-cyan-500/30'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/40'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-slate-900 text-amber-400 border border-slate-700 flex-shrink-0">
                <Moon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Dark Cyber Defense
                  </h4>
                  {theme === 'dark' && (
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Deep charcoal & navy workspace designed for high visual ergonomics and threat analysis.
                </p>
              </div>
            </button>

            {/* Light Theme Button Card */}
            <button
              type="button"
              onClick={() => {
                setTheme('light');
                showToast('info', 'Theme Updated', 'Clean light workspace theme applied to entire application.');
              }}
              className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                theme === 'light'
                  ? 'border-cyan-500 bg-cyan-50/50 ring-2 ring-cyan-500/30'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/40'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-600 border border-amber-200 flex-shrink-0">
                <Sun className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Light Clean Workspace
                  </h4>
                  {theme === 'light' && (
                    <CheckCircle2 className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Crisp, high-contrast light backgrounds with clean typography and slate borders.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Family Guardian Dispatch Consent */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-card space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-500" />
              Family Guardian Emergency Push Consent
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Control when scam journey alert summaries are forwarded to your trusted family contacts.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-cyan-500/30 transition-colors">
              <input
                type="checkbox"
                checked={guardianSharing}
                onChange={(e) => setGuardianSharing(e.target.checked)}
                className="mt-0.5 rounded text-cyan-600 focus:ring-cyan-500"
              />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                  Enable Family Guardian Emergency Push Notifications
                </span>
                <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                  Dispatches incident summaries to registered trusted family members when high severity scams are identified.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-cyan-500/30 transition-colors">
              <input
                type="checkbox"
                checked={criticalOnly}
                disabled={!guardianSharing}
                onChange={(e) => setCriticalOnly(e.target.checked)}
                className="mt-0.5 rounded text-cyan-600 focus:ring-cyan-500"
              />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                  Restrict Sharing to CRITICAL Severity Incidents Only
                </span>
                <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                  Suppresses High/Suspicious alerts and notifies guardians only when severe financial extortion or physical coercion is detected.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Privacy, Retention & Explanation Settings */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-card space-y-4">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-500" />
              Privacy, Data Retention & Explanation Rules
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage data retention limits and how threat risk explanations are presented.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Audit Log & Incident Retention Window:
              </label>
              <select
                value={retentionDays}
                onChange={(e) => setRetentionDays(parseInt(e.target.value, 10))}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500/40"
              >
                <option value={30}>30 Days (Minimal Retention)</option>
                <option value={90}>90 Days (Recommended Standard)</option>
                <option value={180}>180 Days (Extended Forensic Audit)</option>
              </select>
            </div>

            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-cyan-500/30 transition-colors">
              <input
                type="checkbox"
                checked={anonymousReporting}
                onChange={(e) => setAnonymousReporting(e.target.checked)}
                className="mt-0.5 rounded text-cyan-600 focus:ring-cyan-500"
              />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                  Anonymized Threat Telemetry Contribution
                </span>
                <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                  Anonymously share verified phishing URLs and flagged UPI handles with the national community threat intelligence network.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-cyan-500/30 transition-colors">
              <input
                type="checkbox"
                checked={simplifiedExplanations}
                onChange={(e) => setSimplifiedExplanations(e.target.checked)}
                className="mt-0.5 rounded text-cyan-600 focus:ring-cyan-500"
              />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                  Simplified Non-Technical Explanations
                </span>
                <p className="text-slate-500 text-[11px] mt-0.5 leading-relaxed">
                  Presents scam explanations and safety instructions in plain language suitable for elderly family members.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-md transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
