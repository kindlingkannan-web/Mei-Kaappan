'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ThreatIndicator, IndicatorType, IndicatorReputation } from '@/types';
import {
  Database,
  Search,
  Filter,
  Plus,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  GitMerge,
  Phone,
  Link as LinkIcon,
  Globe,
  CreditCard,
  Package,
  Clock,
  ExternalLink,
} from 'lucide-react';

function ThreatIntelContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const { threatIndicators, submitThreatReport, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [typeFilter, setTypeFilter] = useState<'ALL' | IndicatorType>('ALL');
  const [reputationFilter, setReputationFilter] = useState<'ALL' | IndicatorReputation>('ALL');

  // Submit report modal
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState<IndicatorType>('PHONE');
  const [reportValue, setReportValue] = useState('');
  const [reportTag, setReportTag] = useState('');

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  const filteredIndicators = useMemo(() => {
    return threatIndicators.filter((ind) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        q === '' ||
        ind.value.toLowerCase().includes(q) ||
        ind.normalizedValue.toLowerCase().includes(q) ||
        ind.tags.some((t) => t.toLowerCase().includes(q));

      const matchesType = typeFilter === 'ALL' || ind.type === typeFilter;
      const matchesRep = reputationFilter === 'ALL' || ind.reputationStatus === reputationFilter;

      return matchesSearch && matchesType && matchesRep;
    });
  }, [threatIndicators, searchQuery, typeFilter, reputationFilter]);

  const handleSubmitNewReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportValue.trim()) return;

    await submitThreatReport({
      type: reportType,
      value: reportValue.trim(),
      normalizedValue: reportValue.trim().toLowerCase(),
      reputationStatus: 'SUSPICIOUS',
      reportCount: 1,
      evidenceQuality: 'UNVERIFIED',
      confidence: 0.8,
      sourceType: 'COMMUNITY_REPORT',
      reviewStatus: 'PENDING_REVIEW',
      relatedIncidentIds: [],
      tags: reportTag ? [reportTag] : ['User Submitted Report'],
    });

    setShowReportModal(false);
    setReportValue('');
    setReportTag('');
  };

  const getIndicatorIcon = (type: IndicatorType) => {
    switch (type) {
      case 'PHONE':
        return Phone;
      case 'URL':
        return LinkIcon;
      case 'DOMAIN':
        return Globe;
      case 'UPI':
        return CreditCard;
      case 'APP_PACKAGE':
        return Package;
      default:
        return Database;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-1">
            <Database className="w-3.5 h-3.5" />
            Cross-Indicator Reputation Graph
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Threat Intelligence & Reputation
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Verified blacklist dataset of phone numbers, domains, UPI addresses, and app packages reported across scam campaigns.
          </p>
        </div>

        <button
          onClick={() => setShowReportModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          Submit Threat Report
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search phone number, URL, domain, UPI, or tag..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          />
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 mr-1">Type:</span>
          {(['ALL', 'PHONE', 'URL', 'DOMAIN', 'UPI', 'APP_PACKAGE'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                typeFilter === t
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {t === 'ALL' ? 'All' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Indicators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIndicators.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-card">
            <Database className="w-12 h-12 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No Threat Indicators Found
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              No matching records found in seed threat intelligence database.
            </p>
          </div>
        ) : (
          filteredIndicators.map((ind) => {
            const Icon = getIndicatorIcon(ind.type);
            return (
              <div
                key={ind.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-card hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      <Icon className="w-3 h-3 text-cyan-500" />
                      {ind.type}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ind.reputationStatus === 'KNOWN_SCAM'
                          ? 'bg-red-500/10 text-red-500'
                          : 'bg-amber-500/10 text-amber-500'
                      }`}
                    >
                      {ind.reputationStatus.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100 mt-2 truncate">
                    {ind.value}
                  </h3>

                  <div className="flex items-center gap-1.5 flex-wrap mt-2">
                    {ind.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Community Reports:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {ind.reportCount} reports
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-500">
                    <span>Confidence Score:</span>
                    <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                      {Math.round(ind.confidence * 100)}%
                    </span>
                  </div>

                  {ind.relatedIncidentIds.length > 0 && (
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">Related Incident:</span>
                      <Link
                        href={`/incidents/${ind.relatedIncidentIds[0]}`}
                        className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <GitMerge className="w-3 h-3" />
                        #{ind.relatedIncidentIds[0]}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Submit Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Submit Suspicious Threat Indicator
            </h3>
            <p className="text-xs text-slate-500">
              Contribute a scam phone number, phishing link, or fraudulent UPI handle to Mei-Kaappan&apos;s community intelligence database.
            </p>

            <form onSubmit={handleSubmitNewReport} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Indicator Type:
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as IndicatorType)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="PHONE">Phone Number (+91...)</option>
                  <option value="UPI">UPI Identifier (user@bank)</option>
                  <option value="URL">Phishing Web URL</option>
                  <option value="DOMAIN">Malicious Domain Name</option>
                  <option value="APP_PACKAGE">Malicious App Package Name</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Indicator Value:
                </label>
                <input
                  type="text"
                  required
                  value={reportValue}
                  onChange={(e) => setReportValue(e.target.value)}
                  placeholder={
                    reportType === 'PHONE'
                      ? '+91 98765 00000'
                      : reportType === 'UPI'
                      ? 'scammer@okaxis'
                      : 'https://fake-login-bank.xyz'
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Scam Tag / Modus Operandi (Optional):
                </label>
                <input
                  type="text"
                  value={reportTag}
                  onChange={(e) => setReportTag(e.target.value)}
                  placeholder="e.g. Electricity Bill Extortion or Job Offer Scam"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
                >
                  Register Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ThreatIntelligencePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading threat intelligence directory...</div>}>
      <ThreatIntelContent />
    </Suspense>
  );
}

