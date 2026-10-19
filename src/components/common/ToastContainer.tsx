'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full px-4 sm:px-0">
      {toasts.map((toast) => {
        let borderClass = 'border-slate-700 bg-slate-900 text-slate-100';
        let Icon = Info;
        let iconColor = 'text-cyan-400';

        switch (toast.type) {
          case 'success':
            borderClass = 'border-emerald-500/40 bg-slate-900/95 text-slate-100 shadow-emerald-950/20';
            Icon = CheckCircle2;
            iconColor = 'text-emerald-400';
            break;
          case 'warning':
            borderClass = 'border-amber-500/40 bg-slate-900/95 text-slate-100 shadow-amber-950/20';
            Icon = AlertTriangle;
            iconColor = 'text-amber-400';
            break;
          case 'error':
            borderClass = 'border-red-500/40 bg-slate-900/95 text-slate-100 shadow-red-950/20';
            Icon = AlertOctagon;
            iconColor = 'text-red-400';
            break;
          case 'info':
          default:
            borderClass = 'border-cyan-500/40 bg-slate-900/95 text-slate-100 shadow-cyan-950/20';
            Icon = Info;
            iconColor = 'text-cyan-400';
            break;
        }

        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-2 ${borderClass}`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold tracking-tight">{toast.title}</h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-100 transition-colors p-1 rounded-lg"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
