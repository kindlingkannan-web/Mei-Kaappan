'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { SeverityBadge } from '@/components/common/SeverityBadge';
import {
  Smartphone,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RotateCw,
  CheckCircle2,
  XCircle,
  EyeOff,
  Info,
  Key,
  Layers,
  Bell,
  Cpu,
  Download,
} from 'lucide-react';

export default function DeviceExposurePage() {
  const { deviceInfo, deviceFindings, triggerDeviceScan, resolveDeviceFinding, showToast } = useApp();
  const [isScanning, setIsScanning] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const handleRunScan = async () => {
    setIsScanning(true);
    await triggerDeviceScan();
    setIsScanning(false);
  };

  const filteredFindings = deviceFindings.filter((f) => {
    if (filterCategory === 'ALL') return true;
    return f.category === filterCategory;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-1">
            <Smartphone className="w-3.5 h-3.5" />
            Endpoint Security Posture
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Device Exposure Assessment
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Review dangerous permission grants, keylogger risks, remote control apps, and sideloaded APK vulnerabilities.
          </p>
        </div>

        <button
          onClick={handleRunScan}
          disabled={isScanning}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md transition-colors disabled:opacity-50"
        >
          <RotateCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? 'Auditing Permissions...' : 'Simulate Device Scan'}
        </button>
      </div>

      {/* Architecture Transparency Banner */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-3">
        <Info className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            Android Client Companion Architecture (Prototype Mode):
          </span>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            The web dashboard displays <strong>simulated Android device telemetry</strong>. In production, an authorized Android Java agent (Mei-Kaappan Mobile Service) submits real, consented scan payloads over secure TLS to the Java Spring Boot REST backend. No unauthorized background surveillance is performed on your browser or PC.
          </p>
        </div>
      </div>

      {/* Device Health Summary Card */}
      {deviceInfo && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5 items-center">
          {/* Monitored Device */}
          <div className="lg:col-span-4 flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center flex-shrink-0 border border-purple-500/20">
              <Smartphone className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Monitored Device
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate" title={deviceInfo.deviceName}>
                {deviceInfo.deviceName}
              </h4>
              <p className="text-xs text-slate-500 truncate mt-0.5">{deviceInfo.osVersion}</p>
            </div>
          </div>

          {/* Health Score */}
          <div className="lg:col-span-3 sm:border-l border-slate-100 dark:border-slate-800/80 sm:pl-5 min-w-0">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Health Score
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span
                className={`text-2xl font-black ${
                  deviceInfo.securityHealthScore < 50
                    ? 'text-red-500'
                    : deviceInfo.securityHealthScore < 75
                    ? 'text-amber-500'
                    : 'text-emerald-500'
                }`}
              >
                {deviceInfo.securityHealthScore}
              </span>
              <span className="text-xs text-slate-400 font-semibold">/100</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {deviceInfo.securityHealthScore < 50 ? 'Severe Vulnerabilities' : 'Moderate Posture'}
            </p>
          </div>

          {/* Active Findings */}
          <div className="lg:col-span-3 lg:border-l border-slate-100 dark:border-slate-800/80 lg:pl-5 min-w-0">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Active Findings
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-red-500">
                {deviceFindings.filter((f) => f.reviewStatus === 'UNRESOLVED').length}
              </span>
              <span className="text-xs text-slate-400 font-semibold">unresolved threats</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {deviceFindings.filter((f) => f.reviewStatus === 'REMEDIATED').length} resolved
            </p>
          </div>

          {/* Last Synchronized */}
          <div className="lg:col-span-2 lg:border-l border-slate-100 dark:border-slate-800/80 lg:pl-5 min-w-0">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              Last Synced
            </span>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
              {new Date(deviceInfo.lastScanTimestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="text-[11px] text-slate-400">
              {new Date(deviceInfo.lastScanTimestamp).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs text-slate-400 mr-1">Category Filter:</span>
        {[
          { key: 'ALL', label: 'All Findings' },
          { key: 'ACCESSIBILITY_ABUSE', label: 'Accessibility Abuse' },
          { key: 'REMOTE_ACCESS_TOOL', label: 'Remote Control Tools' },
          { key: 'NOTIFICATION_LISTENER', label: 'Notification / SMS Sniffer' },
          { key: 'OVERLAY_PERMISSION', label: 'Screen Overlay' },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilterCategory(item.key)}
            className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-colors ${
              filterCategory === item.key
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Findings List */}
      <div className="space-y-4">
        {filteredFindings.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-card">
            <ShieldCheck className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No Vulnerabilities Found in This Category
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Your device configuration passes checks for this category.
            </p>
          </div>
        ) : (
          filteredFindings.map((finding) => (
            <div
              key={finding.id}
              className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border shadow-card transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 ${
                finding.reviewStatus === 'REMEDIATED'
                  ? 'border-emerald-500/30 opacity-70'
                  : finding.severity === 'CRITICAL'
                  ? 'border-red-500/40'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <SeverityBadge severity={finding.severity} size="sm" />
                  <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                    {finding.category}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      finding.reviewStatus === 'REMEDIATED'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-amber-500/10 text-amber-500'
                    }`}
                  >
                    {finding.reviewStatus}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(finding.detectionTimestamp).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  {finding.appOrSettingName}
                  {finding.packageName && (
                    <span className="text-xs font-mono font-normal text-slate-400">
                      ({finding.packageName})
                    </span>
                  )}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                  {finding.explanation}
                </p>

                {/* Remediation Guide */}
                <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/40 dark:border-purple-900/30 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-purple-600 dark:text-purple-400">
                      Recommended Remediation:
                    </span>
                    <p className="mt-0.5 text-[11px] leading-relaxed">
                      {finding.recommendedRemediation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 self-end md:self-center">
                {finding.reviewStatus === 'UNRESOLVED' ? (
                  <button
                    onClick={() => resolveDeviceFinding(finding.id, 'REMEDIATED')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mark Remediated
                  </button>
                ) : (
                  <button
                    onClick={() => resolveDeviceFinding(finding.id, 'UNRESOLVED')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-colors"
                  >
                    Reopen Finding
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
