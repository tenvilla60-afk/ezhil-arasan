import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { DIVISIONS, PageId } from '../types/platform';

export function Navbar() {
  const { currentPage, navigate, authUser } = usePlatform();
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSolutionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const divisionIds: PageId[] = [
    'ai-robot',
    'ai-automation',
    'ai-shopping',
    'ai-business',
    'ai-video',
  ];
  const isDivisionActive = divisionIds.includes(currentPage);

  const go = (page: PageId) => {
    navigate(page);
    setSolutionsOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#060913]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => go('home')}
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 font-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
        >
          EZ AI WORLD
        </button>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300"
        >
          <button
            type="button"
            onClick={() => go('home')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              currentPage === 'home' ? 'text-white underline underline-offset-8 decoration-blue-500' : ''
            }`}
          >
            Home
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setSolutionsOpen((v) => !v)}
              aria-expanded={solutionsOpen}
              className={`inline-flex items-center gap-1 whitespace-nowrap shrink-0 transition-colors hover:text-white ${
                isDivisionActive ? 'text-white underline underline-offset-8 decoration-blue-500' : ''
              }`}
            >
              <span>Solutions</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${solutionsOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {solutionsOpen && (
              <div className="absolute left-0 top-full mt-3 w-80 bg-[#0C1324] border border-white/10 rounded-xl p-2 shadow-2xl">
                {DIVISIONS.map((div) => (
                  <button
                    key={div.id}
                    type="button"
                    onClick={() => go(div.id)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-lg transition-colors flex flex-col gap-0.5 ${
                      currentPage === div.id
                        ? 'bg-blue-600/15 text-white'
                        : 'hover:bg-white/5 text-slate-200'
                    }`}
                  >
                    <span className="text-sm font-medium text-white">
                      {div.index}. {div.name}
                    </span>
                    <span className="text-xs text-slate-400 line-clamp-1">{div.tagline}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => go('pricing')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              currentPage === 'pricing' ? 'text-white underline underline-offset-8 decoration-blue-500' : ''
            }`}
          >
            Pricing
          </button>

          <button
            type="button"
            onClick={() => go('about')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              currentPage === 'about' ? 'text-white underline underline-offset-8 decoration-blue-500' : ''
            }`}
          >
            About
          </button>

          <button
            type="button"
            onClick={() => go('contact')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
              currentPage === 'contact' ? 'text-white underline underline-offset-8 decoration-blue-500' : ''
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => go(authUser ? 'dashboard' : 'auth')}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0"
          >
            {authUser ? 'Customer Dashboard' : 'Sign In'}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0C1324] border-t border-white/10 px-6 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => go('home')}
              className="text-left px-3 py-2 text-sm text-slate-200 hover:bg-white/5 rounded-lg"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => go('pricing')}
              className="text-left px-3 py-2 text-sm text-slate-200 hover:bg-white/5 rounded-lg"
            >
              Pricing
            </button>
            <button
              type="button"
              onClick={() => go('about')}
              className="text-left px-3 py-2 text-sm text-slate-200 hover:bg-white/5 rounded-lg"
            >
              About Us
            </button>
            <button
              type="button"
              onClick={() => go('contact')}
              className="text-left px-3 py-2 text-sm text-slate-200 hover:bg-white/5 rounded-lg"
            >
              Contact Us
            </button>
          </div>
          <div className="pt-2 border-t border-white/10">
            <p className="text-xs text-slate-400 px-3 mb-1.5">AI Business Divisions</p>
            <div className="space-y-1">
              {DIVISIONS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => go(d.id)}
                  className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-white/5 rounded-lg"
                >
                  {d.index}. {d.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
