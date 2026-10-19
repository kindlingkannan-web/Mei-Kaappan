'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { Severity } from '@/types';
import {
  BarChart3,
  TrendingUp,
  ShieldAlert,
  Calendar,
  Filter,
  PieChart as PieIcon,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export default function ScamTrendsAnalyticsPage() {
  const { incidents, alerts, threatIndicators } = useApp();

  const [timeRange, setTimeRange] = useState<'30D' | '90D' | 'ALL'>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<'ALL' | Severity>('ALL');

  // Trend data over time (mocked chronological progression)
  const timelineTrendData = [
    { date: 'Oct 12', critical: 1, high: 2, suspicious: 4, safe: 6 },
    { date: 'Oct 13', critical: 2, high: 3, suspicious: 5, safe: 8 },
    { date: 'Oct 14', critical: 2, high: 4, suspicious: 4, safe: 9 },
    { date: 'Oct 15', critical: 3, high: 5, suspicious: 6, safe: 10 },
    { date: 'Oct 16', critical: 4, high: 6, suspicious: 5, safe: 12 },
    { date: 'Oct 17', critical: 5, high: 7, suspicious: 7, safe: 14 },
    { date: 'Oct 18', critical: 6, high: 8, suspicious: 8, safe: 15 },
  ];

  // Category frequency
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    incidents.forEach((inc) => {
      const clean = inc.category.replace(/_/g, ' ');
      map[clean] = (map[clean] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  }, [incidents]);

  // Alert resolution status
  const alertResolutionData = useMemo(() => {
    const unresolved = alerts.filter((a) => a.resolutionStatus === 'UNRESOLVED').length;
    const resolved = alerts.filter((a) => a.resolutionStatus === 'RESOLVED').length;
    const dismissed = alerts.filter((a) => a.resolutionStatus === 'DISMISSED').length;

    return [
      { name: 'Resolved', value: resolved, color: '#10b981' },
      { name: 'Unresolved', value: unresolved, color: '#f59e0b' },
      { name: 'Dismissed', value: dismissed, color: '#64748b' },
    ];
  }, [alerts]);

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl shadow-2xl text-xs flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: data.payload?.color || data.color }} />
          <span className="font-bold text-slate-100">{data.name}:</span>
          <span className="font-extrabold text-cyan-400">{data.value} alert{data.value !== 1 ? 's' : ''}</span>
        </div>
      );
    }
    return null;
  };


  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            Threat Metrics & Telemetry
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Scam Trends & Predictive Analytics
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Longitudinal insights into phishing vectors, payment extortion tactics, and community resolution efficiency.
          </p>
        </div>

        {/* Time filters */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
          {(['30D', '90D', 'ALL'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                timeRange === r
                  ? 'bg-cyan-600 text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {r === '30D' ? 'Last 30 Days' : r === '90D' ? 'Last Quarter' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Metric High-Level Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase">Avg Response Time</span>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-2">14.2 min</p>
          <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> -32% from last cycle
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase">Resolution Ratio</span>
          <p className="text-2xl font-black text-emerald-500 mt-2">
            {alerts.length > 0
              ? `${Math.round(
                  (alerts.filter((a) => a.resolutionStatus === 'RESOLVED').length / alerts.length) * 100
                )}%`
              : '85%'}
          </p>
          <p className="text-xs text-slate-500 mt-1">Confirmed actioned</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase">Top Attacker Vector</span>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2 truncate">
            Utility Disconnection
          </p>
          <p className="text-xs text-red-500 mt-1">42% of critical cases</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-card">
          <span className="text-xs font-bold text-slate-400 uppercase">Blacklisted Anchors</span>
          <p className="text-2xl font-black text-cyan-500 mt-2">{threatIndicators.length}</p>
          <p className="text-xs text-slate-500 mt-1">Cross-vector indicators</p>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trend Area Chart (8 Cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Weekly Scam Volume & Severity Trajectory
              </h3>
              <p className="text-xs text-slate-500">
                Number of detected incidents grouped by severity level over time
              </p>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
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
                <Area
                  type="monotone"
                  dataKey="critical"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.2}
                  name="Critical"
                />
                <Area
                  type="monotone"
                  dataKey="high"
                  stroke="#f97316"
                  fill="#f97316"
                  fillOpacity={0.15}
                  name="High"
                />
                <Area
                  type="monotone"
                  dataKey="suspicious"
                  stroke="#f59e0b"
                  fill="#f59e0b"
                  fillOpacity={0.1}
                  name="Suspicious"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alert Resolution Ratio Donut (4 Cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Alert Triage Efficiency
            </h3>
            <p className="text-xs text-slate-500">Breakdown of notification outcomes</p>
          </div>

          <div className="h-56 relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={alertResolutionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {alertResolutionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            {alertResolutionData.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-500">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.name}
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Reported Scam Anchors Leaderboard */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-card space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Frequently Flagged Scam Anchors (Top Leaderboard)
        </h3>
        <p className="text-xs text-slate-500">
          Highest frequency reported indicators observed across the community telemetry network.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                <th className="py-2.5 font-bold">Indicator</th>
                <th className="py-2.5 font-bold">Type</th>
                <th className="py-2.5 font-bold">Reputation Status</th>
                <th className="py-2.5 font-bold">Report Volume</th>
                <th className="py-2.5 font-bold">Evidence Quality</th>
                <th className="py-2.5 font-bold text-right">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {threatIndicators.map((ind) => (
                <tr key={ind.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 font-mono font-bold text-slate-800 dark:text-slate-200">
                    {ind.value}
                  </td>
                  <td className="py-2.5 font-semibold text-cyan-600 dark:text-cyan-400">
                    {ind.type}
                  </td>
                  <td className="py-2.5">
                    <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">
                      {ind.reputationStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-300">
                    {ind.reportCount} reports
                  </td>
                  <td className="py-2.5 text-slate-500">{ind.evidenceQuality.replace(/_/g, ' ')}</td>
                  <td className="py-2.5 text-right font-mono font-bold text-emerald-500">
                    {Math.round(ind.confidence * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
