'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { IncidentStatus, Severity } from '@/types';
import { SeverityBadge } from '@/components/common/SeverityBadge';
import { RiskScoreGauge } from '@/components/common/RiskScoreGauge';
import {
  GitMerge,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Clock,
  ShieldAlert,
  CheckCircle2,
  AlertOctagon,
  FileText,
} from 'lucide-react';

export default function IncidentsListPage() {
  const { incidents } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | IncidentStatus>('ALL');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | Severity>('ALL');

  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      const matchesSearch =
        searchQuery === '' ||
        inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.primaryAttackerVector.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'ALL' || inc.status === statusFilter;
      const matchesSeverity = severityFilter === 'ALL' || inc.severity === severityFilter;

      return matchesSearch && matchesStatus && matchesSeverity;
    });
  }, [incidents, searchQuery, statusFilter, severityFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-1">
            <GitMerge className="w-3.5 h-3.5" />
            Core Differentiator
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Scam Journey & Incident Explorer
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Track multi-stage cyber attacks correlated from messages, URLs, payments, and device exposures.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/scanner"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-md shadow-cyan-950/30"
          >
            <Plus className="w-4 h-4" />
            New Assessment
          </Link>
          <Link
            href="/reports"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Export Reports
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search incident ID, vector, title, or keywords..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 mr-1">Status:</span>
          {(['ALL', 'ACTIVE', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {st === 'ALL' ? 'All' : st.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 mr-1">Severity:</span>
          {(['ALL', 'CRITICAL', 'HIGH', 'SUSPICIOUS', 'SAFE'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                severityFilter === sev
                  ? 'bg-slate-900 dark:bg-slate-700 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {sev === 'ALL' ? 'All' : sev}
            </button>
          ))}
        </div>
      </div>

      {/* Incidents List Grid */}
      <div className="space-y-4">
        {filteredIncidents.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-card">
            <ShieldAlert className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No Incidents Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No scam journey records matched your filter criteria. Try clearing search or reset filters.
            </p>
          </div>
        ) : (
          filteredIncidents.map((incident) => (
            <div
              key={incident.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-card hover:border-cyan-500/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
            >
              <div className="flex items-start gap-4 flex-1">
                <RiskScoreGauge
                  score={incident.currentRiskScore}
                  severity={incident.severity}
                  size="md"
                />

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <SeverityBadge severity={incident.severity} size="sm" />
                    <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400">
                      #{incident.id}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                      {incident.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(incident.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {incident.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {incident.summary}
                  </p>

                  <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
                    <div className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      Attack Vector: {incident.primaryAttackerVector}
                    </div>
                    <span>•</span>
                    <span>{incident.evidenceIds.length} Correlated Evidence Events</span>
                    <span>•</span>
                    <span>{incident.timeline.length} Timeline Steps</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                <Link
                  href={`/incidents/${incident.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-cyan-600 dark:hover:bg-cyan-500 text-xs font-semibold transition-all shadow-md whitespace-nowrap shrink-0"
                >
                  <span>Explore Scam Journey</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
