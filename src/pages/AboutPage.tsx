import { ArrowRight } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { DIVISIONS, PLATFORM_CONTACT, PLATFORM_IMAGES } from '../types/platform';
import { ResilientImage } from '../components/ResilientImage';

export function AboutPage() {
  const { navigate } = usePlatform();

  return (
    <div className="bg-[#060913] min-h-screen py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pb-14 border-b border-white/10">
          <div className="lg:col-span-6 space-y-5">
            <p className="text-xs font-medium text-blue-400">About EZ AI WORLD</p>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Engineering practical AI infrastructure for ambitious businesses.
            </h1>
            <p className="text-base text-slate-300 leading-relaxed">
              EZ AI WORLD was founded to eliminate fragmented software stacks. Rather than forcing growing companies to connect unrelated chatbots, automation tools, online storefronts, CRMs, and video scripting apps, we built five integrated divisions on a single cloud architecture.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => navigate('contact')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"
              >
                <span>Speak with our Team</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0C1324]">
              <ResilientImage
                src={PLATFORM_IMAGES.heroCore}
                alt="EZ AI WORLD Technology Operations"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Operating Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0C1324] border border-white/10 rounded-xl p-7 space-y-3">
            <div className="text-xs font-mono-tabular text-blue-400">01</div>
            <h2 className="text-lg font-semibold text-white">Unified Customer Identity</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              One authenticated account governs conversational AI usage, automated workflows, shopping orders, CRM pipelines, and creative storyboards.
            </p>
          </div>
          <div className="bg-[#0C1324] border border-white/10 rounded-xl p-7 space-y-3">
            <div className="text-xs font-mono-tabular text-blue-400">02</div>
            <h2 className="text-lg font-semibold text-white">Production AI Reliability</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every AI endpoint runs securely on dedicated server infrastructure with structured JSON output schemas for workflow and video generation.
            </p>
          </div>
          <div className="bg-[#0C1324] border border-white/10 rounded-xl p-7 space-y-3">
            <div className="text-xs font-mono-tabular text-blue-400">03</div>
            <h2 className="text-lg font-semibold text-white">Direct Commerce &amp; Settlement</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Integrated retail catalog and direct UPI QR Scanner payment mode ({PLATFORM_CONTACT.upiId}) allow businesses and customers to transact immediately.
            </p>
          </div>
        </div>

        {/* Five Divisions Overview */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Our Five Business Divisions</h2>
          <div className="divide-y divide-white/10 border-t border-b border-white/10">
            {DIVISIONS.map((d) => (
              <div
                key={d.id}
                className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="text-base font-semibold text-white">
                    {d.index}. {d.name}
                  </div>
                  <p className="text-sm text-slate-400">{d.tagline}</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(d.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 whitespace-nowrap shrink-0"
                >
                  <span>Explore Division</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
