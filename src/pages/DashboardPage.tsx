import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  CreditCard,
  LogOut,
  QrCode,
  Settings,
  BarChart2,
  Layers,
  Check,
} from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { DIVISIONS, DivisionId, PRICING_PLANS } from '../types/platform';

export function DashboardPage() {
  const {
    authUser,
    authReady,
    profile,
    automations,
    customers,
    orders,
    updateUserProfile,
    logout,
    navigate,
    openScannerCheckout,
  } = usePlatform();

  const [tab, setTab] = useState<'overview' | 'services' | 'subscriptions' | 'profile'>('overview');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [activeServices, setActiveServices] = useState<DivisionId[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState('');

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setPhone(profile.phone || '');
      setCompany(profile.company || '');
      setActiveServices(
        profile.activeServices || [
          'ai-robot',
          'ai-automation',
          'ai-shopping',
          'ai-business',
          'ai-video',
        ]
      );
    }
  }, [profile]);

  if (authReady && !authUser) {
    return (
      <div className="bg-[#060913] min-h-screen py-24 px-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-[#0C1324] border border-white/10 rounded-xl p-8 text-center space-y-5">
          <h1 className="text-2xl font-bold text-white">Customer Dashboard</h1>
          <p className="text-sm text-slate-400">
            Sign in to view your profile, active subscriptions, AI service usage statistics, and UPI Scanner order receipts.
          </p>
          <button
            type="button"
            onClick={() => navigate('auth')}
            className="w-full py-2.5 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500"
          >
            Go to Login &amp; Registration
          </button>
        </div>
      </div>
    );
  }

  const currentPlan = PRICING_PLANS.find((p) => p.id === (profile?.plan || 'starter')) || PRICING_PLANS[0];
  const creditsUsed = profile?.aiCreditsUsed || 0;
  const creditsLimit = profile?.aiCreditsLimit || currentPlan.creditsLimit;
  const usagePct = Math.min(100, Math.round((creditsUsed / Math.max(1, creditsLimit)) * 100));

  const toggleService = (id: DivisionId) => {
    setActiveServices((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedNotice('');
    try {
      await updateUserProfile({
        displayName,
        phone,
        company,
        activeServices,
      });
      setSavedNotice('Customer profile updated.');
      setTimeout(() => setSavedNotice(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-[#060913] min-h-screen py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-6 space-y-8">
        {/* Top Workspace Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <p className="text-xs text-slate-400">
              Customer Portal / <span className="text-blue-400 capitalize">{currentPlan.name} Plan</span>
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              {profile?.displayName || authUser?.displayName || 'Customer Workspace'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                openScannerCheckout({
                  orderType: 'subscription',
                  itemSummary: 'EZ AI WORLD Growth Plan Upgrade (Monthly)',
                  totalAmount: 4999,
                  planToActivate: 'growth',
                  requiresAddress: false,
                })
              }
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0"
            >
              <QrCode className="w-4 h-4" />
              <span>Upgrade via UPI Scanner</span>
            </button>
            <button
              type="button"
              onClick={() => logout()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border border-white/15 text-slate-300 hover:text-white hover:bg-white/5 whitespace-nowrap shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-[#0C1324] border border-white/10 w-fit">
          {(
            [
              { id: 'overview', label: 'Usage Statistics', icon: BarChart2 },
              { id: 'services', label: 'Active Services', icon: Layers },
              { id: 'subscriptions', label: 'Subscriptions & Receipts', icon: CreditCard },
              { id: 'profile', label: 'Profile Settings', icon: Settings },
            ] as const
          ).map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  tab === item.id ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview & Usage Statistics */}
        {tab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-[#0C1324] border border-white/10 rounded-xl p-5">
                <span className="text-xs text-slate-400 block mb-1">AI Credits Consumed</span>
                <div className="text-2xl font-semibold text-white font-mono-tabular">
                  {creditsUsed.toLocaleString('en-IN')}{' '}
                  <span className="text-xs text-slate-400">/ {creditsLimit.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full h-1.5 bg-[#060913] rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${usagePct}%` }}
                  />
                </div>
              </div>

              <div className="bg-[#0C1324] border border-white/10 rounded-xl p-5">
                <span className="text-xs text-slate-400 block mb-1">Automation Workflows</span>
                <div className="text-2xl font-semibold text-white font-mono-tabular">
                  {automations.length}
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  {automations.filter((a) => a.status === 'active').length} currently active
                </div>
              </div>

              <div className="bg-[#0C1324] border border-white/10 rounded-xl p-5">
                <span className="text-xs text-slate-400 block mb-1">Managed CRM Accounts</span>
                <div className="text-2xl font-semibold text-white font-mono-tabular">
                  {customers.length}
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  ₹
                  {customers
                    .reduce((s, c) => s + (c.monthlyValue || 0), 0)
                    .toLocaleString('en-IN')}{' '}
                  tracked MRR
                </div>
              </div>

              <div className="bg-[#0C1324] border border-white/10 rounded-xl p-5">
                <span className="text-xs text-slate-400 block mb-1">UPI Scanner Orders</span>
                <div className="text-2xl font-semibold text-white font-mono-tabular">
                  {orders.length}
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  Plan: <span className="text-blue-400 capitalize">{currentPlan.name}</span>
                </div>
              </div>
            </div>

            {/* Quick Launch Divisions */}
            <div className="bg-[#0C1324] border border-white/10 rounded-xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-white">Launch Integrated Divisions</h2>
                <span className="text-xs text-slate-400">
                  {activeServices.length} of 5 divisions enabled
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DIVISIONS.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => navigate(d.id)}
                    className="text-left p-4 rounded-xl bg-[#060913] border border-white/10 hover:border-blue-500/50 transition-colors flex flex-col justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs font-mono-tabular text-blue-400 mb-1">
                        Division {d.index}
                      </div>
                      <div className="text-sm font-semibold text-white">{d.name}</div>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{d.tagline}</p>
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400">
                      <span>Launch Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Active Services */}
        {tab === 'services' && (
          <div className="bg-[#0C1324] border border-white/10 rounded-xl divide-y divide-white/10">
            {DIVISIONS.map((div) => {
              const enabled = activeServices.includes(div.id);
              return (
                <div
                  key={div.id}
                  className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-base font-semibold text-white">
                        {div.index}. {div.name}
                      </span>
                      <span
                        className={`text-xs font-medium ${
                          enabled ? 'text-emerald-400' : 'text-slate-500'
                        }`}
                      >
                        {enabled ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 max-w-2xl">{div.tagline}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => navigate(div.id)}
                      className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500"
                    >
                      Open
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Subscriptions & Scanner Receipts */}
        {tab === 'subscriptions' && (
          <div className="space-y-6">
            <div className="bg-[#0C1324] border border-white/10 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="text-xs text-slate-400 block mb-1">Active Subscription Tier</span>
                <h2 className="text-2xl font-semibold text-white">
                  {currentPlan.name} — ₹{currentPlan.priceInr.toLocaleString('en-IN')}/mo
                </h2>
                <p className="text-xs text-slate-400 mt-1">{currentPlan.audience}</p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {PRICING_PLANS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() =>
                      openScannerCheckout({
                        orderType: 'subscription',
                        itemSummary: `EZ AI WORLD ${p.name} Plan (Monthly)`,
                        totalAmount: p.priceInr,
                        planToActivate: p.id,
                        requiresAddress: false,
                      })
                    }
                    className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-colors ${
                      p.id === currentPlan.id
                        ? 'bg-blue-600 border-blue-500 text-white'
                        : 'bg-[#060913] border-white/15 text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    Pay {p.name} (₹{p.priceInr.toLocaleString('en-IN')})
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#0C1324] border border-white/10 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10">
                <h3 className="text-base font-semibold text-white">
                  UPI Scanner Payment &amp; Order History
                </h3>
              </div>

              {orders.length === 0 ? (
                <div className="p-10 text-center text-sm text-slate-400">
                  No UPI Scanner orders or subscription receipts submitted yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="border-b border-white/10 text-xs text-slate-400">
                      <tr>
                        <th className="px-6 py-3 font-medium">Receipt ID</th>
                        <th className="px-6 py-3 font-medium">Type</th>
                        <th className="px-6 py-3 font-medium">Summary</th>
                        <th className="px-6 py-3 font-medium">UPI UTR</th>
                        <th className="px-6 py-3 font-medium">Status</th>
                        <th className="px-6 py-3 font-medium text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {orders.map((ord) => (
                        <tr key={ord.id}>
                          <td className="px-6 py-3.5 font-mono-tabular text-xs text-slate-300">
                            {ord.id}
                          </td>
                          <td className="px-6 py-3.5 capitalize text-slate-300">
                            {ord.orderType}
                          </td>
                          <td className="px-6 py-3.5 text-white max-w-xs truncate">
                            {ord.itemSummary}
                          </td>
                          <td className="px-6 py-3.5 font-mono-tabular text-slate-300">
                            {ord.upiTransactionRef}
                          </td>
                          <td className="px-6 py-3.5 text-xs capitalize text-amber-400">
                            {ord.status.replace('_', ' ')}
                          </td>
                          <td className="px-6 py-3.5 text-right font-mono-tabular text-white">
                            ₹{ord.totalAmount.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Profile Settings */}
        {tab === 'profile' && (
          <form
            onSubmit={handleSaveProfile}
            className="max-w-2xl bg-[#0C1324] border border-white/10 rounded-xl p-8 space-y-5"
          >
            <h2 className="text-lg font-semibold text-white">Customer Profile &amp; Preferences</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="prof-name" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  id="prof-name"
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-[#060913] border border-white/15 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="prof-phone" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Phone Number
                </label>
                <input
                  id="prof-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-[#060913] border border-white/15 text-white font-mono-tabular focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="prof-company" className="block text-xs font-medium text-slate-300 mb-1.5">
                Company / Organization
              </label>
              <input
                id="prof-company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-[#060913] border border-white/15 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <span className="block text-xs font-medium text-slate-300 mb-2">
                Enabled Business Divisions
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DIVISIONS.map((d) => {
                  const active = activeServices.includes(d.id);
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => toggleService(d.id)}
                      className={`flex items-center justify-between px-3.5 py-2.5 text-xs rounded-lg border transition-colors ${
                        active
                          ? 'bg-blue-600/20 border-blue-500 text-white'
                          : 'bg-[#060913] border-white/10 text-slate-400'
                      }`}
                    >
                      <span>{d.name}</span>
                      {active && <Check className="w-3.5 h-3.5 text-blue-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {savedNotice && <p className="text-xs text-emerald-400">{savedNotice}</p>}

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50"
            >
              {saving ? 'Saving Changes...' : 'Save Profile'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
