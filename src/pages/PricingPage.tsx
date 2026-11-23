import { Check, QrCode } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { PLATFORM_CONTACT, PRICING_PLANS } from '../types/platform';

export function PricingPage() {
  const { openScannerCheckout } = usePlatform();

  return (
    <div className="bg-[#060913] min-h-screen py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-medium text-blue-400">Pricing &amp; Licensing</p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            One subscription across all five AI divisions.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Every plan includes instant activation via our UPI Scanner payment desk ({PLATFORM_CONTACT.upiId}) with transparent usage quotas and zero hidden seat surcharges.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-xl p-8 flex flex-col justify-between border ${
                plan.highlighted
                  ? 'bg-[#0E172E] border-blue-500/60'
                  : 'bg-[#0C1324] border-white/10'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h2 className="text-2xl font-semibold text-white">{plan.name}</h2>
                  {plan.highlighted && (
                    <span className="text-xs font-medium text-blue-400">Recommended</span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mb-6">{plan.audience}</p>
                <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-white/10">
                  <span className="text-4xl font-bold text-white font-mono-tabular">
                    ₹{plan.priceInr.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-slate-400">/ month</span>
                  <span className="text-xs text-slate-500 font-mono-tabular ml-auto">
                    ${plan.priceUsd} USD
                  </span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() =>
                  openScannerCheckout({
                    orderType: 'subscription',
                    itemSummary: `EZ AI WORLD ${plan.name} Plan (Monthly)`,
                    totalAmount: plan.priceInr,
                    planToActivate: plan.id,
                    requiresAddress: false,
                  })
                }
                className={`w-full inline-flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-lg transition-colors ${
                  plan.highlighted
                    ? 'bg-blue-600 text-white hover:bg-blue-500'
                    : 'bg-[#060913] border border-white/15 text-white hover:bg-white/5'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>Subscribe via UPI Scanner</span>
              </button>
            </div>
          ))}
        </div>

        {/* Concrete Comparison Matrix */}
        <div className="bg-[#0C1324] border border-white/10 rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">Division Quota Matrix</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 text-xs text-slate-400">
                <tr>
                  <th className="px-6 py-3.5 font-medium">Capability</th>
                  <th className="px-6 py-3.5 font-medium">Starter</th>
                  <th className="px-6 py-3.5 font-medium">Growth</th>
                  <th className="px-6 py-3.5 font-medium">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <tr>
                  <td className="px-6 py-4 text-slate-300">AI Robot Monthly Credits</td>
                  {PRICING_PLANS.map((p) => (
                    <td key={p.id} className="px-6 py-4 font-mono-tabular text-white">
                      {p.creditsLimit.toLocaleString('en-IN')}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 text-slate-300">AI Automation Workflows</td>
                  {PRICING_PLANS.map((p) => (
                    <td key={p.id} className="px-6 py-4 text-slate-200">
                      {p.workflowsLimit}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 text-slate-300">CRM Customer Capacity</td>
                  {PRICING_PLANS.map((p) => (
                    <td key={p.id} className="px-6 py-4 text-slate-200">
                      {p.crmLimit}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 text-slate-300">AI Video Creator Scripts</td>
                  {PRICING_PLANS.map((p) => (
                    <td key={p.id} className="px-6 py-4 text-slate-200">
                      {p.videoScripts}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-4 text-slate-300">Support &amp; Verification SLA</td>
                  {PRICING_PLANS.map((p) => (
                    <td key={p.id} className="px-6 py-4 text-slate-200">
                      {p.supportSla}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
