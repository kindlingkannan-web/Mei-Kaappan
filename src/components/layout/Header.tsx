'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  Search,
  Bell,
  Menu,
  ScanSearch,
  CreditCard,
  GitMerge,
  Info,
  CheckCircle2,
  X,
  ExternalLink,
  Sun,
  Moon,
} from 'lucide-react';
import { SeverityBadge } from '../common/SeverityBadge';

interface HeaderProps {
  onToggleMobileMenu: () => void;
}

export function Header({ onToggleMobileMenu }: HeaderProps) {
  const router = useRouter();
  const { alerts, unreadAlertsCount, acknowledgeAlert, incidents, theme, toggleTheme } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/threat-intel?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <>
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-subtle">
        {/* Left: Mobile hamburger & Search */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle navigation drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search phone number, UPI handle, domain, or incident #..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all"
            />
          </form>
        </div>

        {/* Right: Quick Actions, Demo Indicator & Notifications */}
        <div className="flex items-center gap-2 sm:gap-3 ml-2">
          {/* Prominent Demo Mode Badge */}
          <button
            onClick={() => setShowDemoModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition-all"
            title="Click to view Demo Prototype details"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="hidden sm:inline">DEMO MODE</span>
            <Info className="w-3.5 h-3.5 opacity-70" />
          </button>

          {/* Quick Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-800 pl-3">
            <Link
              href="/scanner"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
            >
              <ScanSearch className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Scan Message</span>
            </Link>
            <Link
              href="/payment-check"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
            >
              <CreditCard className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Check Payment</span>
            </Link>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle application theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="w-5 h-5 text-slate-700 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadAlertsCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* Notification Drawer Popover */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in-50 zoom-in-95">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Scam Alerts</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-semibold">
                      {alerts.length} total
                    </span>
                  </div>
                  <Link
                    href="/alerts"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    View All
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {alerts.slice(0, 4).map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                        !alert.isRead ? 'bg-cyan-50/40 dark:bg-cyan-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <SeverityBadge severity={alert.severity} size="sm" />
                        <span className="text-[10px] text-slate-400">
                          {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 mt-1.5 leading-snug">
                        {alert.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        {alert.summary}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <Link
                          href={`/incidents/${alert.incidentId}`}
                          onClick={() => setShowNotifications(false)}
                          className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                        >
                          <GitMerge className="w-3 h-3" />
                          View Incident #{alert.incidentId}
                        </Link>
                        {!alert.isAcknowledged && (
                          <button
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            Acknowledge
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Demo Prototype Transparency Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Mei-Kaappan Demo Architecture
                  </h3>
                  <p className="text-xs text-slate-500">Academic & Prototype Transparency Notice</p>
                </div>
              </div>
              <button
                onClick={() => setShowDemoModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-3 text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                <strong>Mei-Kaappan</strong> is operating in <strong>Demonstration Mode</strong> using deterministic rule-based correlation engines and seed threat intelligence.
              </p>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1.5 border border-slate-100 dark:border-slate-800">
                <p className="font-semibold text-slate-800 dark:text-slate-200">What is operational now:</p>
                <ul className="list-disc list-inside space-y-0.5 text-slate-500 dark:text-slate-400">
                  <li>Scam Journey Correlation Engine (timeline reconstruction & risk escalation)</li>
                  <li>Client-Side SSRF-safe Message & URL heuristic parser</li>
                  <li>Pre-Payment UPI check with known threat intelligence matching</li>
                  <li>Simulated Android client security exposure auditor</li>
                  <li>Family Guardian consent-based alert sharing workflow</li>
                </ul>
              </div>
              <p className="text-[11px] text-slate-500 italic">
                * Note: The web interface does NOT spy on your host operating system, execute live bank transfers, or connect directly to telecom carrier core switches without consent.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowDemoModal(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-cyan-600 dark:hover:bg-cyan-500 text-xs font-semibold rounded-xl transition-colors"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
