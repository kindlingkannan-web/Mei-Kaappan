'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  ShieldAlert,
  LayoutDashboard,
  GitMerge,
  ScanSearch,
  CreditCard,
  Smartphone,
  Database,
  BellRing,
  Users,
  FileText,
  BarChart3,
  Cpu,
  Settings,
  RotateCcw,
  UserCheck,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const { unreadAlertsCount, criticalIncidentsCount, user, resetDemoData } = useApp();

  const navItems = [
    {
      name: 'Overview Dashboard',
      href: '/',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: 'Scam Journey Explorer',
      href: '/incidents',
      icon: GitMerge,
      badge: criticalIncidentsCount > 0 ? `${criticalIncidentsCount} High` : null,
      badgeColor: 'bg-red-500/20 text-red-400 border border-red-500/30',
    },
    {
      name: 'Message & URL Scanner',
      href: '/scanner',
      icon: ScanSearch,
      badge: null,
    },
    {
      name: 'Pre-Payment Safety Check',
      href: '/payment-check',
      icon: CreditCard,
      badge: null,
    },
    {
      name: 'Device Exposure Audit',
      href: '/device-exposure',
      icon: Smartphone,
      badge: null,
    },
    {
      name: 'Threat Intelligence',
      href: '/threat-intel',
      icon: Database,
      badge: null,
    },
    {
      name: 'Alerts & Notifications',
      href: '/alerts',
      icon: BellRing,
      badge: unreadAlertsCount > 0 ? `${unreadAlertsCount} New` : null,
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30',
    },
    {
      name: 'Family Guardian',
      href: '/guardian',
      icon: Users,
      badge: null,
    },
    {
      name: 'Incident Reports',
      href: '/reports',
      icon: FileText,
      badge: null,
    },
    {
      name: 'Trends & Analytics',
      href: '/analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      name: 'Model Evaluation',
      href: '/evaluation',
      icon: Cpu,
      badge: null,
    },
    {
      name: 'Settings & Privacy',
      href: '/settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="w-72 bg-navy-950 text-slate-300 flex flex-col h-full border-r border-slate-800/80 shadow-2xl select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
        <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-brand-700 text-white shadow-lg shadow-cyan-900/30">
          <ShieldAlert className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white tracking-tight truncate">Mei-Kaappan</h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60">
              v1.0
            </span>
          </div>
          <p className="text-[11px] text-slate-400 truncate">Intelligent Scam Prevention</p>
        </div>
      </div>

      {/* Demo Mode Sub-Banner */}
      <div className="px-5 py-2.5 bg-slate-900/80 border-b border-slate-800/60 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-slate-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          Demo Prototype
        </span>
        <button
          onClick={() => {
            if (confirm('Reset demo state to factory seed data?')) {
              resetDemoData();
            }
          }}
          title="Reset to factory seed data"
          className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1 text-[11px] px-2 py-0.5 rounded hover:bg-slate-800"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
          Main Application
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-300 font-semibold border border-cyan-500/25 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/70'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.badgeColor || 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400 opacity-70" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
          <UserCheck className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'Ramesh Sundaram'}</p>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Family Guardian Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
