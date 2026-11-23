import { usePlatform } from '../context/PlatformContext';
import { DIVISIONS, PLATFORM_CONTACT } from '../types/platform';

export function Footer() {
  const { navigate, authUser } = usePlatform();

  return (
    <footer className="bg-[#050811] border-t border-white/10 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4 space-y-4">
          <div className="text-lg font-bold tracking-tight text-white font-display">
            EZ AI WORLD
          </div>
          <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
            Unified enterprise technology platform combining conversational AI intelligence, workflow automation, modern digital retail, small-business analytics, and video production.
          </p>
          <div className="pt-2 text-xs text-slate-400 space-y-1">
            <div>
              Phone:{' '}
              <a
                href={`tel:${PLATFORM_CONTACT.phone}`}
                className="text-slate-200 hover:text-white font-mono-tabular"
              >
                {PLATFORM_CONTACT.phone}
              </a>
            </div>
            <div>
              Email:{' '}
              <a
                href={`mailto:${PLATFORM_CONTACT.email}`}
                className="text-slate-200 hover:text-white"
              >
                {PLATFORM_CONTACT.email}
              </a>
            </div>
            <div>
              UPI Scanner Desk:{' '}
              <span className="text-slate-200 font-mono-tabular">{PLATFORM_CONTACT.upiId}</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-3 space-y-3">
          <h3 className="text-xs font-semibold text-white">Business Divisions</h3>
          <ul className="space-y-2.5 text-sm">
            {DIVISIONS.map((div) => (
              <li key={div.id}>
                <button
                  type="button"
                  onClick={() => navigate(div.id)}
                  className="text-slate-400 hover:text-white transition-colors text-left"
                >
                  {div.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3 space-y-3">
          <h3 className="text-xs font-semibold text-white">Company & Portal</h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <button
                type="button"
                onClick={() => navigate('home')}
                className="text-slate-400 hover:text-white transition-colors"
              >
                Home
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigate('pricing')}
                className="text-slate-400 hover:text-white transition-colors"
              >
                Pricing
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigate('about')}
                className="text-slate-400 hover:text-white transition-colors"
              >
                About Us
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigate('contact')}
                className="text-slate-400 hover:text-white transition-colors"
              >
                Contact Us
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => navigate(authUser ? 'dashboard' : 'auth')}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {authUser ? 'Customer Dashboard' : 'Login & Registration'}
              </button>
            </li>
          </ul>
        </div>

        <div className="md:col-span-2 space-y-3">
          <h3 className="text-xs font-semibold text-white">Payments</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Instant UPI QR Scanner verification via {PLATFORM_CONTACT.upiBank} ({PLATFORM_CONTACT.upiPayee}).
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} EZ AI WORLD. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span>{PLATFORM_CONTACT.phone}</span>
            <span aria-hidden="true">·</span>
            <span>{PLATFORM_CONTACT.email}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
