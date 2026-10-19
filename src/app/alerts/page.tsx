'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Alert, Severity } from '@/types';
import { SeverityBadge } from '@/components/common/SeverityBadge';
import {
  BellRing,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  GitMerge,
  ShieldAlert,
  Users,
  Eye,
  Check,
} from 'lucide-react';

export default function AlertsCenterPage() {
  const { alerts, acknowledgeAlert, resolveAlert, showToast } = useApp();

  const [severityFilter, setSeverityFilter] = useState<'ALL' | Severity>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'UNRESOLVED' | 'RESOLVED' | 'DISMISSED'>('ALL');

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      const matchesSev = severityFilter === 'ALL' || a.severity === severityFilter;
      const matchesStat = statusFilter === 'ALL' || a.resolutionStatus === statusFilter;
      return matchesSev && matchesStat;
    });
  }, [alerts, severityFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-1">
          <BellRing className="w-3.5 h-3.5" />
          Proactive Escalation Management
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Scam Alerts & Notifications Center
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Review critical cyber warnings dispatched by the Scam Journey engine and device auditor.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Severity filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Severity:
          </span>
          {(['ALL', 'CRITICAL', 'HIGH', 'SUSPICIOUS'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                severityFilter === sev
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {sev === 'ALL' ? 'All' : sev}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 mr-1">Resolution:</span>
          {(['ALL', 'UNRESOLVED', 'RESOLVED', 'DISMISSED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 dark:bg-slate-700 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {st === 'ALL' ? 'All' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-card">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No Alerts Matching Current Filter
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              All notifications have been reviewed or no active threats match.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border shadow-card transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 ${
                !alert.isRead ? 'border-cyan-500/50 bg-cyan-50/10 dark:bg-cyan-950/10' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <SeverityBadge severity={alert.severity} size="sm" />
                  <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                    Source: {alert.alertSource.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                    {alert.resolutionStatus}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(alert.timestamp).toLocaleString()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  {alert.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                  {alert.summary}
                </p>

                <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400 flex-wrap">
                  <Link
                    href={`/incidents/${alert.incidentId}`}
                    className="text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <GitMerge className="w-3.5 h-3.5" />
                    View Correlated Incident #{alert.incidentId}
                  </Link>

                  {alert.guardianNotified && (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                      <Users className="w-3.5 h-3.5" />
                      Family Guardian Notified
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-center">
                {!alert.isAcknowledged && (
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Acknowledge
                  </button>
                )}

                {alert.resolutionStatus === 'UNRESOLVED' ? (
                  <>
                    <button
                      onClick={() => resolveAlert(alert.id, 'RESOLVED')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Resolve
                    </button>
                    <button
                      onClick={() => resolveAlert(alert.id, 'DISMISSED')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                    >
                      Dismiss
                    </button>
                  </>
                ) : (
                  <span className="text-xs font-medium text-slate-400 italic">
                    Action Completed
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
