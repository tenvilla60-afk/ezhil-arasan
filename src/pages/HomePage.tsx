import { ArrowRight, Check, QrCode, Shield, Zap } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import {
  DIVISIONS,
  PLATFORM_CONTACT,
  PLATFORM_IMAGES,
  PRICING_PLANS,
  TESTIMONIALS,
} from '../types/platform';
import { ResilientImage } from '../components/ResilientImage';

export function HomePage() {
  const { navigate, authUser, openScannerCheckout } = usePlatform();

  const scrollToServices = () => {
    const el = document.getElementById('divisions-showcase');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-[#060913] text-slate-100">
      {/* Hero Section */}
      <section className="relative border-b border-white/10 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 right-0 w-[640px] h-[640px] rounded-full bg-gradient-to-br from-blue-600/15 via-violet-600/10 to-transparent blur-3xl"
        />

        <div className="max-w-7xl mx-auto px-6 pt-16 pb-14 lg:pt-24 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-xs font-medium tracking-wide text-blue-400 mb-4">
                EZ AI WORLD Enterprise Platform · Unified Intelligence
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-white leading-[1.08] mb-6">
                One Platform. Five Powerful AI Business Solutions.
              </h1>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl mb-8">
                Transform your ideas into business opportunities with EZ AI WORLD. Deploy autonomous customer support, workflow automation, modern digital retail, executive analytics, and AI video production from a single unified command layer.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => navigate(authUser ? 'dashboard' : 'auth')}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={scrollToServices}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg border border-white/15 bg-[#0C1324] text-slate-100 hover:bg-white/5 transition-colors whitespace-nowrap shrink-0"
                >
                  <span>Explore AI Services</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 flex">
              <div className="w-full rounded-xl overflow-hidden border border-white/10 bg-[#0C1324]">
                <ResilientImage
                  src={PLATFORM_IMAGES.heroCore}
                  alt="EZ AI WORLD architectural AI infrastructure and command center"
                  className="w-full h-72 sm:h-96 lg:h-full object-cover"
                  fallbackLabel="EZ AI WORLD Enterprise Architecture"
                />
              </div>
            </div>
          </div>

          {/* 4-Column Full-Width KPI Strip Below Hero Split */}
          <div className="mt-14 pt-10 border-t border-white/10 grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl sm:text-3xl font-semibold text-white font-mono-tabular">
                5 Divisions
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Robot, Automation, Retail, Analytics & Video
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-semibold text-white font-mono-tabular">
                &lt; 180ms
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Mean conversational AI response latency
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-semibold text-white font-mono-tabular">
                99.95%
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Enterprise cloud uptime commitment
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-semibold text-white font-mono-tabular">
                Instant UPI
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Direct scanner checkout ({PLATFORM_CONTACT.upiId})
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Five Attractive Service Cards (Asymmetric Editorial Grid) */}
      <section id="divisions-showcase" className="py-20 lg:py-24 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-medium text-blue-400 mb-2">Five Core Business Divisions</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              Built as one unified operating system for modern enterprises.
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Every division shares unified customer accounts, live billing, and server-side AI intelligence so teams move from insight to execution without tool sprawl.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            {DIVISIONS.map((div, idx) => {
              const spanClass = idx < 2 ? 'lg:col-span-3' : 'lg:col-span-2';
              return (
                <article
                  key={div.id}
                  className={`${spanClass} group bg-[#0C1324] border border-white/10 rounded-xl overflow-hidden flex flex-col justify-between hover:border-blue-500/40 transition-colors`}
                >
                  <div>
                    <div className="aspect-[16/9] w-full overflow-hidden bg-[#060913] border-b border-white/10">
                      <ResilientImage
                        src={div.image}
                        alt={div.name}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        fallbackLabel={div.name}
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-4 text-xs text-slate-400 mb-3">
                        <span>Division {div.index}</span>
                        <span className="font-mono-tabular text-blue-400">{div.metric}</span>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">{div.name}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed mb-5">
                        {div.tagline}
                      </p>
                      <ul className="space-y-2 border-t border-white/10 pt-4">
                        {div.capabilities.map((cap) => (
                          <li key={cap} className="flex items-center gap-2.5 text-xs text-slate-300">
                            <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            <span>{cap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-2">
                    <button
                      type="button"
                      onClick={() => navigate(div.id)}
                      className="w-full inline-flex items-center justify-between px-4 py-2.5 text-xs font-semibold rounded-lg bg-[#060913] border border-white/10 text-white hover:bg-blue-600 hover:border-blue-500 transition-colors"
                    >
                      <span>Open {div.shortTitle}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Technology Architecture Section */}
      <section className="py-20 lg:py-24 border-b border-white/10 bg-[#080D1A]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <p className="text-xs font-medium text-violet-400">Platform Architecture</p>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Precision AI infrastructure engineered for operational scale.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Instead of stitching fragmented SaaS subscriptions together, EZ AI WORLD runs your customer support bot, automated workflows, e-commerce storefront, CRM intelligence, and video script studio on a single data fabric.
            </p>
            <div className="space-y-4 pt-2 border-t border-white/10">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-white">Real-Time Gemini Inference</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Server-side AI endpoints power live Q&amp;A, workflow generation, executive insights, and video production scripts.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-white">Tenant-Isolated Customer Vault</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Verified authentication, strict role boundaries, and real-time subscription and payment receipt tracking.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[#0C1324] border border-white/10 rounded-xl overflow-hidden">
              <ResilientImage
                src={PLATFORM_IMAGES.robotHardware}
                alt="AI Robot Hardware Intelligence Unit"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="p-5">
                <div className="text-xs text-slate-400 mb-1">Conversational Core</div>
                <div className="text-sm font-semibold text-white">
                  24/7 Support &amp; Executive Q&amp;A
                </div>
              </div>
            </div>
            <div className="bg-[#0C1324] border border-white/10 rounded-xl overflow-hidden">
              <ResilientImage
                src={PLATFORM_IMAGES.videoStudio}
                alt="AI Video Creator Production Environment"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="p-5">
                <div className="text-xs text-slate-400 mb-1">Creative Engine</div>
                <div className="text-sm font-semibold text-white">
                  YouTube, Reels &amp; Ad Scripting
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 lg:py-24 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
              <p className="text-xs font-medium text-blue-400 mb-2">Transparent Licensing</p>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                Plans scaled to your business stage.
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('pricing')}
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 whitespace-nowrap shrink-0"
            >
              <span>Compare full matrix</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-xl p-7 flex flex-col justify-between border ${
                  plan.highlighted
                    ? 'bg-[#0E172E] border-blue-500/60'
                    : 'bg-[#0C1324] border-white/10'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                    {plan.highlighted && (
                      <span className="text-xs font-medium text-blue-400">Most Selected</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mb-6">{plan.audience}</p>
                  <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-white/10">
                    <span className="text-3xl font-bold text-white font-mono-tabular">
                      ₹{plan.priceInr.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-400">/ month</span>
                    <span className="text-xs text-slate-500 font-mono-tabular ml-auto">
                      (${plan.priceUsd} USD)
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
                  className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg transition-colors ${
                    plan.highlighted
                      ? 'bg-blue-600 text-white hover:bg-blue-500'
                      : 'bg-[#060913] border border-white/15 text-white hover:bg-white/5'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>Pay via UPI Scanner</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="py-20 lg:py-24 border-b border-white/10 bg-[#080D1A]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-medium text-blue-400 mb-2">Customer Outcomes</p>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Measured operational impact across industries.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((item) => (
              <blockquote
                key={item.name}
                className="bg-[#0C1324] border border-white/10 rounded-xl p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-mono-tabular text-blue-400 mb-4">
                    {item.metric}
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed mb-6">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>
                <footer className="pt-4 border-t border-white/10">
                  <div className="text-sm font-semibold text-white">{item.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {item.role} · {item.company}
                  </div>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Final Conversion Band */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Ready to launch with EZ AI WORLD?
          </h2>
          <p className="text-base text-slate-400 max-w-2xl mx-auto mb-8">
            Create your customer account in seconds or speak directly with our solutions desk at{' '}
            <span className="text-slate-200 font-mono-tabular">{PLATFORM_CONTACT.phone}</span> and{' '}
            <span className="text-slate-200">{PLATFORM_CONTACT.email}</span>.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => navigate(authUser ? 'dashboard' : 'auth')}
              className="px-6 py-3 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"
            >
              {authUser ? 'Open Customer Dashboard' : 'Create Free Account'}
            </button>
            <button
              type="button"
              onClick={() => navigate('contact')}
              className="px-6 py-3 text-sm font-semibold rounded-lg border border-white/15 bg-[#0C1324] text-white hover:bg-white/5 transition-colors"
            >
              Contact Enterprise Desk
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
