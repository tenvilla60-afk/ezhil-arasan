import React, { useState } from 'react';
import { BarChart3, Plus, Trash2, Users, Sparkles } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { BusinessCustomer } from '../types/platform';

interface InsightReport {
  executiveSummary: string;
  priorityInitiatives: {
    title: string;
    impact: string;
    actionStep: string;
  }[];
  riskWatch: string;
}

const REFERENCE_CUSTOMERS: Omit<BusinessCustomer, 'userId'>[] = [
  {
    id: 'ref_1',
    name: 'Karthik Narayanan',
    email: 'karthik@southernretail.in',
    company: 'Southern Retail Works',
    stage: 'retained',
    monthlyValue: 45000,
  },
  {
    id: 'ref_2',
    name: 'Ananya Rao',
    email: 'ananya@auroraapparel.com',
    company: 'Aurora Apparel Studio',
    stage: 'active',
    monthlyValue: 28000,
  },
  {
    id: 'ref_3',
    name: 'Rohan Malhotra',
    email: 'rohan@meridianexports.in',
    company: 'Meridian Exports',
    stage: 'lead',
    monthlyValue: 18500,
  },
];

export function AiBusinessPage() {
  const {
    authUser,
    customers,
    createBusinessCustomer,
    updateCustomerStage,
    deleteBusinessCustomer,
    incrementAiCredits,
    navigate,
  } = usePlatform();

  const [scenario, setScenario] = useState('');
  const [generating, setGenerating] = useState(false);
  const [report, setReport] = useState<InsightReport | null>(null);
  const [insightError, setInsightError] = useState('');

  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custCompany, setCustCompany] = useState('');
  const [custStage, setCustStage] = useState<BusinessCustomer['stage']>('lead');
  const [custValue, setCustValue] = useState('15000');
  const [savingCustomer, setSavingCustomer] = useState(false);

  const displayedCustomers = authUser ? customers : REFERENCE_CUSTOMERS;
  const totalMrr = displayedCustomers.reduce((sum, c) => sum + (c.monthlyValue || 0), 0);
  const retainedCount = displayedCustomers.filter((c) => c.stage === 'retained').length;
  const activeCount = displayedCustomers.filter((c) => c.stage === 'active').length;

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scenario.trim() || generating) return;
    setInsightError('');
    setGenerating(true);

    try {
      const res = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessContext: scenario,
          monthlyRevenue: totalMrr,
          activeCustomers: displayedCustomers.length,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate insights.');
      setReport(data.report);
      if (authUser) await incrementAiCredits(2);
    } catch (err) {
      setInsightError(err instanceof Error ? err.message : 'Unable to generate report.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser) {
      navigate('auth');
      return;
    }
    if (!custName.trim() || !custEmail.trim() || !custCompany.trim()) return;
    setSavingCustomer(true);
    try {
      await createBusinessCustomer({
        name: custName,
        email: custEmail,
        company: custCompany,
        stage: custStage,
        monthlyValue: Number(custValue) || 0,
      });
      setCustName('');
      setCustEmail('');
      setCustCompany('');
      setCustValue('15000');
    } finally {
      setSavingCustomer(false);
    }
  };

  return (
    <div className="bg-[#060913] min-h-screen py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-6 space-y-10">
        {/* Header */}
        <div className="pb-10 border-b border-white/10 max-w-3xl space-y-3">
          <p className="text-xs font-medium text-blue-400">
            Division 04 · AI Business Services
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Business analytics, AI executive reports, and customer management.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Built for small and mid-market operators who need clean pipeline metrics, AI-generated strategic briefs, and an organized CRM in one workspace.
          </p>
        </div>

        {/* Analytics KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[#0C1324] border border-white/10 rounded-xl p-5">
            <span className="text-xs text-slate-400 block mb-1">Monthly Pipeline Value</span>
            <span className="text-2xl font-semibold text-white font-mono-tabular">
              ₹{totalMrr.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="bg-[#0C1324] border border-white/10 rounded-xl p-5">
            <span className="text-xs text-slate-400 block mb-1">CRM Accounts</span>
            <span className="text-2xl font-semibold text-white font-mono-tabular">
              {displayedCustomers.length}
            </span>
          </div>
          <div className="bg-[#0C1324] border border-white/10 rounded-xl p-5">
            <span className="text-xs text-slate-400 block mb-1">Active Implementations</span>
            <span className="text-2xl font-semibold text-blue-400 font-mono-tabular">
              {activeCount}
            </span>
          </div>
          <div className="bg-[#0C1324] border border-white/10 rounded-xl p-5">
            <span className="text-xs text-slate-400 block mb-1">Retained Accounts</span>
            <span className="text-2xl font-semibold text-emerald-400 font-mono-tabular">
              {retainedCount}
            </span>
          </div>
        </div>

        {/* AI Reports & Insights Generator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form
            onSubmit={handleGenerateReport}
            className="lg:col-span-5 bg-[#0C1324] border border-white/10 rounded-xl p-6 space-y-4"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <h2 className="text-base font-semibold text-white">AI Reports &amp; Insights</h2>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Describe your quarterly objective, pricing bottleneck, or customer retention challenge to generate an executive briefing.
            </p>
            <textarea
              rows={4}
              required
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              placeholder="e.g. We have 40 retail inquiries per week, 18% drop-off at checkout, and want to raise repeat customer retention in Q4."
              className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-[#060913] border border-white/15 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
            {insightError && <p className="text-xs text-rose-400">{insightError}</p>}
            <button
              type="submit"
              disabled={generating || !scenario.trim()}
              className="w-full py-2.5 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
            >
              {generating ? 'Synthesizing Report...' : 'Generate Executive Report'}
            </button>
          </form>

          <div className="lg:col-span-7 bg-[#0C1324] border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <h2 className="text-base font-semibold text-white">Executive Insights Output</h2>
            </div>

            {report ? (
              <div className="space-y-5">
                <p className="text-sm text-slate-200 leading-relaxed">
                  {report.executiveSummary}
                </p>
                <div className="space-y-3">
                  {report.priorityInitiatives?.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg bg-[#060913] border border-white/10"
                    >
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <span className="text-sm font-semibold text-white">{item.title}</span>
                        <span className="text-xs font-mono-tabular text-blue-400">
                          {item.impact}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{item.actionStep}</p>
                    </div>
                  ))}
                </div>
                {report.riskWatch && (
                  <div className="p-3.5 rounded-lg bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200">
                    Risk Watch: {report.riskWatch}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-sm text-slate-400">
                Submit a business scenario on the left to generate a structured AI insights briefing calibrated to your current pipeline metrics.
              </div>
            )}
          </div>
        </div>

        {/* Customer Management (CRM) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form
            onSubmit={handleCreateCustomer}
            className="lg:col-span-4 bg-[#0C1324] border border-white/10 rounded-xl p-6 space-y-3.5"
          >
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-blue-400" />
              <h2 className="text-base font-semibold text-white">Add CRM Account</h2>
            </div>

            <input
              type="text"
              required
              value={custName}
              onChange={(e) => setCustName(e.target.value)}
              placeholder="Contact full name"
              className="w-full px-3.5 py-2 text-sm rounded-lg bg-[#060913] border border-white/15 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
            <input
              type="email"
              required
              value={custEmail}
              onChange={(e) => setCustEmail(e.target.value)}
              placeholder="Work email"
              className="w-full px-3.5 py-2 text-sm rounded-lg bg-[#060913] border border-white/15 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              required
              value={custCompany}
              onChange={(e) => setCustCompany(e.target.value)}
              placeholder="Company name"
              className="w-full px-3.5 py-2 text-sm rounded-lg bg-[#060913] border border-white/15 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={custStage}
                onChange={(e) => setCustStage(e.target.value as BusinessCustomer['stage'])}
                className="px-3 py-2 text-sm rounded-lg bg-[#060913] border border-white/15 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="lead">Lead</option>
                <option value="active">Active</option>
                <option value="retained">Retained</option>
              </select>
              <input
                type="number"
                min={0}
                value={custValue}
                onChange={(e) => setCustValue(e.target.value)}
                placeholder="Monthly ₹"
                className="px-3 py-2 text-sm rounded-lg bg-[#060913] border border-white/15 text-white font-mono-tabular focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={savingCustomer}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{authUser ? 'Save Customer Record' : 'Sign In to Save CRM'}</span>
            </button>
          </form>

          <div className="lg:col-span-8 bg-[#0C1324] border border-white/10 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white">Customer Management Table</h2>
                <p className="text-xs text-slate-400">
                  {authUser
                    ? 'Synced live to your private Firestore workspace.'
                    : 'Sample CRM pipeline shown. Sign in to manage your own accounts.'}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-white/10 text-xs text-slate-400">
                  <tr>
                    <th className="px-6 py-3 font-medium">Account</th>
                    <th className="px-6 py-3 font-medium">Company</th>
                    <th className="px-6 py-3 font-medium">Stage</th>
                    <th className="px-6 py-3 font-medium text-right">Monthly Value</th>
                    {authUser && <th className="px-6 py-3 font-medium text-right">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {displayedCustomers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-white/[0.02]">
                      <td className="px-6 py-3.5">
                        <div className="font-medium text-white">{cust.name}</div>
                        <div className="text-xs text-slate-400">{cust.email}</div>
                      </td>
                      <td className="px-6 py-3.5 text-slate-300">{cust.company}</td>
                      <td className="px-6 py-3.5">
                        {authUser ? (
                          <select
                            value={cust.stage}
                            onChange={(e) =>
                              updateCustomerStage(
                                cust as BusinessCustomer,
                                e.target.value as BusinessCustomer['stage']
                              )
                            }
                            className="px-2.5 py-1 text-xs rounded bg-[#060913] border border-white/15 text-white capitalize"
                          >
                            <option value="lead">Lead</option>
                            <option value="active">Active</option>
                            <option value="retained">Retained</option>
                          </select>
                        ) : (
                          <span className="text-xs capitalize text-blue-400">{cust.stage}</span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-right font-mono-tabular text-white">
                        ₹{(cust.monthlyValue || 0).toLocaleString('en-IN')}
                      </td>
                      {authUser && (
                        <td className="px-6 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => deleteBusinessCustomer(cust.id)}
                            aria-label={`Remove ${cust.name}`}
                            className="p-1.5 text-slate-400 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {displayedCustomers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-slate-400">
                        No CRM accounts yet. Add your first customer on the left.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
