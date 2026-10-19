'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Severity } from '@/types';
import { SeverityBadge } from '@/components/common/SeverityBadge';
import { RiskScoreGauge } from '@/components/common/RiskScoreGauge';
import {
  ShieldAlert,
  AlertTriangle,
  BellRing,
  GitMerge,
  ScanSearch,
  CreditCard,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Filter,
  Eye,
  ExternalLink,
  Activity,
  MessageSquare,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export default function OverviewDashboard() {
  const {
    incidents,
    alerts,
    deviceFindings,
    threatIndicators,
    userFeedback,
    criticalIncidentsCount,
    highRiskIncidentsCount,
    unreadAlertsCount,
  } = useApp();

  const [severityFilter, setSeverityFilter] = useState<'ALL' | Severity>('ALL');

  // Filtered incidents
  const filteredIncidents = useMemo(() => {
    if (severityFilter === 'ALL') return incidents;
    return incidents.filter((i) => i.severity === severityFilter);
  }, [incidents, severityFilter]);

  // Derived alert stats
  const unresolvedAlerts = alerts.filter((a) => a.resolutionStatus === 'UNRESOLVED').length;
  const resolvedAlerts = alerts.filter((a) => a.resolutionStatus === 'RESOLVED').length;
  const dismissedAlerts = alerts.filter((a) => a.resolutionStatus === 'DISMISSED').length;

  // Chart 1: Severity Distribution
  const severityChartData = useMemo(() => {
    const counts = { CRITICAL: 0, HIGH: 0, SUSPICIOUS: 0, SAFE: 0 };
    incidents.forEach((inc) => {
      counts[inc.severity] = (counts[inc.severity] || 0) + 1;
    });
    return [
      { name: 'Critical', value: counts.CRITICAL, color: '#ef4444' },
      { name: 'High Risk', value: counts.HIGH, color: '#f97316' },
      { name: 'Suspicious', value: counts.SUSPICIOUS, color: '#f59e0b' },
      { name: 'Safe', value: counts.SAFE, color: '#10b981' },
    ];
  }, [incidents]);

  // Chart 2: Category Distribution
  const categoryChartData = useMemo(() => {
    const map: Record<string, number> = {};
    incidents.forEach((inc) => {
      const friendlyName = inc.category
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
      map[friendlyName] = (map[friendlyName] || 0) + 1;
    });
    return Object.entries(map).map(([category, count]) => ({
      category: category.length > 15 ? category.slice(0, 15) + '...' : category,
      count,
    }));
  }, [incidents]);

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-900 via-navy-800 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              Active Defense Monitoring • Demo Intelligence
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Scam Prevention & Risk Overview
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Mei-Kaappan unifies message threat heuristics, destination URL lookalikes, UPI payment
              requests, and device permissions into connected, explainable Scam Journey incident narratives.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full md:w-auto">
            <Link
              href="/scanner"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all shadow-lg shadow-cyan-950/40 hover:shadow-cyan-900/60"
            >
              <ScanSearch className="w-4 h-4" />
              Scan Message
            </Link>
            <Link
              href="/payment-check"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-950/40"
            >
              <CreditCard className="w-4 h-4" />
              Check Payment
            </Link>
            <Link
              href="/incidents"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
            >
              <GitMerge className="w-4 h-4 text-cyan-400" />
              View Journeys
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Incidents */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-card">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Total Assessed</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100">{incidents.length}</span>
            <span className="text-xs text-slate-400">cases on file</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
            <span>Critical: {criticalIncidentsCount}</span>
            <span>High: {highRiskIncidentsCount}</span>
          </div>
        </div>

        {/* High Risk & Critical */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-card">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Severe Threats</span>
            <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-red-600 dark:text-red-400">
              {criticalIncidentsCount + highRiskIncidentsCount}
            </span>
            <span className="text-xs text-red-500/80 font-medium">requiring attention</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>Active multi-stage scam vectors</span>
          </div>
        </div>

        {/* Alerts Awaiting Review */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-card">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Alerts for Review</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <BellRing className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600 dark:text-amber-400">{unresolvedAlerts}</span>
            <span className="text-xs text-slate-400">({unreadAlertsCount} unread)</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
            <span>Resolved: {resolvedAlerts}</span>
            <span>Dismissed: {dismissedAlerts}</span>
          </div>
        </div>

        {/* Device Vulnerabilities */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-card">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <span>Device Findings</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
              <Smartphone className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100">
              {deviceFindings.filter((f) => f.reviewStatus === 'UNRESOLVED').length}
            </span>
            <span className="text-xs text-slate-400">active risks</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800/80 pt-2.5">
            <span>Total findings: {deviceFindings.length}</span>
            <Link href="/device-exposure" className="text-cyan-500 hover:underline">
              Audit &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Visual Analytics Row: Severity & Category Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Severity Distribution Donut */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-card flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Risk Severity Breakdown</h3>
              <p className="text-xs text-slate-500">Unified risk scores of assessed incidents</p>
            </div>
          </div>

          <div className="h-56 mt-2 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {severityChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                  itemStyle={{ color: '#f8fafc', fontWeight: 600 }}
                  labelStyle={{ color: '#f8fafc', fontWeight: 700 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900 dark:text-slate-100">{incidents.length}</span>
              <span className="text-[10px] uppercase font-bold text-slate-400">Incidents</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-auto pt-3 border-t border-slate-100 dark:border-slate-800">
            {severityChartData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 dark:text-slate-400 truncate">{item.name}:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scam Categories Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-card flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Scam Categories Distribution</h3>
              <p className="text-xs text-slate-500">Breakdown of primary threat typologies</p>
            </div>
            <Link href="/analytics" className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-medium">
              Full Trends & Analytics &rarr;
            </Link>
          </div>

          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="category" tick={{ fill: '#94a3b8', fontSize: 11 }} angle={-15} textAnchor="end" />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#06b6d4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Incidents Feed with Severity Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-card overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Recent Scam Journey Incidents
            </h3>
            <p className="text-xs text-slate-500">
              Correlated chronological cases tracked by Mei-Kaappan
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {(['ALL', 'CRITICAL', 'HIGH', 'SUSPICIOUS', 'SAFE'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  severityFilter === sev
                    ? 'bg-slate-900 text-white dark:bg-cyan-600 dark:text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {sev === 'ALL' ? 'All' : sev}
              </button>
            ))}
          </div>
        </div>

        {/* Incident List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredIncidents.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              No incidents found matching the selected filter.
            </div>
          ) : (
            filteredIncidents.map((incident) => (
              <div
                key={incident.id}
                className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <RiskScoreGauge score={incident.currentRiskScore} severity={incident.severity} size="sm" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <SeverityBadge severity={incident.severity} size="sm" />
                      <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                        #{incident.id}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                        {incident.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(incident.updatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {incident.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-2xl">
                      {incident.summary}
                    </p>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                        Vector: {incident.primaryAttackerVector}
                      </span>
                      <span>•</span>
                      <span>{incident.evidenceIds.length} evidence event(s)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <Link
                    href={`/incidents/${incident.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500/10 hover:text-cyan-400 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    <span>View Scam Journey</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Two-Column Supporting Signals: Common Threat Indicators & User Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threat Indicators Quick Lookup */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-card">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Known Threat Intelligence Indicators
              </h3>
              <p className="text-xs text-slate-500">Seed database of reported scam anchors</p>
            </div>
            <Link href="/threat-intel" className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline">
              View All &rarr;
            </Link>
          </div>

          <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
            {threatIndicators.slice(0, 3).map((ind) => (
              <div key={ind.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                      {ind.type}
                    </span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 font-mono">
                      {ind.value}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {ind.tags.join(', ')} • {ind.reportCount} reports
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">
                  {ind.reputationStatus.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Community & User Feedback */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-card">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Model Evaluation & User Feedback
              </h3>
              <p className="text-xs text-slate-500">User validation on automated heuristic flags</p>
            </div>
            <Link href="/evaluation" className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline">
              Model Metrics &rarr;
            </Link>
          </div>

          <div className="mt-3 space-y-3">
            {userFeedback.slice(0, 2).map((fb) => (
              <div
                key={fb.id}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center justify-between text-xs">
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full ${
                      fb.label === 'CORRECT'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-red-500/10 text-red-500'
                    }`}
                  >
                    User Marked: {fb.label}
                  </span>
                  <span className="text-[10px] text-slate-400">Target: #{fb.targetId}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 italic">
                  &ldquo;{fb.userComments}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
