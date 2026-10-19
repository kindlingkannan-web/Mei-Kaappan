'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { TrustedContact } from '@/types';
import {
  Users,
  ShieldCheck,
  UserPlus,
  CheckCircle2,
  Clock,
  Trash2,
  AlertOctagon,
  Info,
  GitMerge,
  HeartHandshake,
  Check,
  X,
} from 'lucide-react';

export default function FamilyGuardianPage() {
  const {
    user,
    trustedContacts,
    addNewTrustedContact,
    changeContactConsent,
    deleteContact,
    alerts,
    showToast,
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [relationship, setRelationship] = useState('Son');
  const [notifyOnCritical, setNotifyOnCritical] = useState(true);
  const [notifyOnHigh, setNotifyOnHigh] = useState(true);

  const criticalAlerts = alerts.filter((a) => a.severity === 'CRITICAL');

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim()) return;

    await addNewTrustedContact({
      userId: user?.id || 'usr_demo_101',
      contactName,
      contactPhone,
      relationship,
      consentStatus: 'PENDING',
      notifyOnCritical,
      notifyOnHigh,
    });

    setShowAddModal(false);
    setContactName('');
    setContactPhone('');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-1">
            <HeartHandshake className="w-3.5 h-3.5" />
            Consent-Based Family Protection
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Family Guardian Network
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Keep elderly relatives and loved ones shielded by automatically dispatching safety warnings to trusted family members during severe cyber extortion or coercion attempts.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add Trusted Contact
        </button>
      </div>

      {/* Privacy & Consent Disclosure */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-3">
        <Info className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-800 dark:text-slate-200">
            Consent & Privacy Guarantee:
          </span>
          <p className="text-[11px] leading-relaxed text-slate-500">
            Family Guardian operates on <strong>mutual transparent consent</strong>. Guardians receive high-risk incident alert summaries (e.g., &ldquo;Potential utility power extortion attempt detected&rdquo;) so they can phone the protected relative. Mei-Kaappan does NOT implement silent audio wiretaps, read private personal chats, or permit unauthorized remote device takeover.
          </p>
        </div>
      </div>

      {/* Protected User Summary */}
      {user && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold text-lg">
              {user.name.charAt(0)}
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">
                Protected Account
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                {user.name}
              </h3>
              <p className="text-xs text-slate-500">{user.phone} • {user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Guardian Sharing Active
            </span>
          </div>
        </div>
      )}

      {/* Trusted Contacts Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-500" />
          Configured Trusted Guardians ({trustedContacts.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trustedContacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-card flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {contact.contactName}
                    </h4>
                    <p className="text-xs font-mono text-cyan-600 dark:text-cyan-400 mt-0.5">
                      {contact.contactPhone}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      contact.consentStatus === 'ACCEPTED'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : contact.consentStatus === 'PENDING'
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'bg-red-500/10 text-red-500'
                    }`}
                  >
                    {contact.consentStatus}
                  </span>
                </div>

                <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                  <div className="flex items-center justify-between">
                    <span>Relationship:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {contact.relationship}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Critical Alert Push:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {contact.notifyOnCritical ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>High-Risk Alert Push:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {contact.notifyOnHigh ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions & Consent Simulation */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                {contact.consentStatus === 'PENDING' ? (
                  <button
                    onClick={() => changeContactConsent(contact.id, 'ACCEPTED')}
                    className="text-xs px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Check className="w-3 h-3" />
                    Accept Invitation
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      changeContactConsent(
                        contact.id,
                        contact.consentStatus === 'ACCEPTED' ? 'REVOKED' : 'ACCEPTED'
                      )
                    }
                    className="text-xs text-slate-400 hover:text-slate-200 underline"
                  >
                    {contact.consentStatus === 'ACCEPTED' ? 'Revoke Sharing' : 'Restore Sharing'}
                  </button>
                )}

                <button
                  onClick={() => deleteContact(contact.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                  title="Remove contact"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shared High-Risk Incidents Broadcast Feed */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-card space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-red-500" />
            Guardian Emergency Alert Dispatch History
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Log of severe extortion or multi-stage cyber threats broadcast to registered family guardians.
          </p>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {criticalAlerts.slice(0, 3).map((alert) => (
            <div key={alert.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full text-[10px]">
                    CRITICAL DISPATCH
                  </span>
                  <span className="text-slate-400">
                    {new Date(alert.timestamp).toLocaleString()}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100">{alert.title}</h4>
                <p className="text-slate-500 text-[11px] line-clamp-1">{alert.summary}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Notified Arun Sundaram (Son)
                </span>
                <Link
                  href={`/incidents/${alert.incidentId}`}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500/10 hover:text-cyan-400 font-semibold text-slate-700 dark:text-slate-300"
                >
                  View Case
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Invite Family Guardian Contact
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name:
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Divya Ramesh"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number (+91):
                </label>
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+91 98765 12345"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Relationship:
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Brother">Brother</option>
                  <option value="Sister">Sister</option>
                  <option value="Trusted Friend">Trusted Friend</option>
                </select>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={notifyOnCritical}
                    onChange={(e) => setNotifyOnCritical(e.target.checked)}
                    className="rounded text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className="text-slate-700 dark:text-slate-300">
                    Notify on CRITICAL scam journeys (Extortion, Digital Arrest)
                  </span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={notifyOnHigh}
                    onChange={(e) => setNotifyOnHigh(e.target.checked)}
                    className="rounded text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className="text-slate-700 dark:text-slate-300">
                    Notify on HIGH risk alerts (Phishing credentials, suspicious APKs)
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
