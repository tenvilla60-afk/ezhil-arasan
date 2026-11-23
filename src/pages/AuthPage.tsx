import React, { useState } from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { DIVISIONS, DivisionId } from '../types/platform';

export function AuthPage() {
  const { authUser, profile, signInWithGoogle, updateUserProfile, navigate } = usePlatform();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [company, setCompany] = useState(profile?.company || '');
  const [selectedServices, setSelectedServices] = useState<DivisionId[]>(
    profile?.activeServices || ['ai-robot', 'ai-automation', 'ai-shopping', 'ai-business', 'ai-video']
  );
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setAuthError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      if (mode === 'login') {
        navigate('dashboard');
      }
    } catch (err) {
      setAuthError(
        err instanceof Error ? err.message : 'Unable to complete Google authentication.'
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleService = (id: DivisionId) => {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);
    try {
      await updateUserProfile({
        displayName: displayName || authUser?.displayName || 'Customer',
        phone,
        company,
        activeServices: selectedServices,
      });
      navigate('dashboard');
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Could not update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#060913] min-h-screen py-16 lg:py-24">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Narrative */}
        <div className="lg:col-span-5 space-y-5">
          <p className="text-xs font-medium text-blue-400">Customer Access</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            One account for all five EZ AI WORLD divisions.
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Sign in or register to unlock your customer dashboard, monitor real-time AI credit usage, manage CRM and automation workflows, and track UPI Scanner orders.
          </p>
          <div className="pt-4 border-t border-white/10 space-y-3 text-xs text-slate-400">
            <div className="flex items-center gap-2 text-slate-200">
              <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Verified Google Identity &amp; Isolated Customer Vault</span>
            </div>
            <p>
              All subscriptions, automation workflows, CRM accounts, and UPI payment receipts synchronize instantaneously across sessions.
            </p>
          </div>
        </div>

        {/* Right Auth Card */}
        <div className="lg:col-span-7 bg-[#0C1324] border border-white/10 rounded-xl p-8 space-y-6">
          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#060913] border border-white/10 w-fit">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
                mode === 'login' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
                mode === 'register' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Register Organization
            </button>
          </div>

          {!authUser ? (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">
                  {mode === 'login' ? 'Welcome back' : 'Create your customer workspace'}
                </h2>
                <p className="text-xs text-slate-400">
                  Authenticate securely with your verified Google account.
                </p>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={handleGoogleSignIn}
                className="w-full inline-flex items-center justify-center gap-3 py-3 px-4 text-sm font-semibold rounded-lg bg-white text-slate-950 hover:bg-slate-200 disabled:opacity-50 transition-colors"
              >
                <span>
                  {loading
                    ? 'Connecting...'
                    : mode === 'login'
                    ? 'Continue with Google'
                    : 'Register with Google'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {authError && (
                <p className="text-xs text-rose-400" role="alert">
                  {authError}
                </p>
              )}
            </div>
          ) : (
            <form onSubmit={handleCompleteProfile} className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">
                  Complete Customer Registration
                </h2>
                <p className="text-xs text-slate-400">
                  Signed in as <span className="text-white">{authUser.email}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="reg-name" className="block text-xs font-medium text-slate-300 mb-1.5">
                    Full Name *
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    value={displayName || authUser.displayName || ''}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-[#060913] border border-white/15 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="reg-phone" className="block text-xs font-medium text-slate-300 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    id="reg-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 ..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-[#060913] border border-white/15 text-white font-mono-tabular focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-company" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Company / Brand Name
                </label>
                <input
                  id="reg-company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Optional organization name"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-[#060913] border border-white/15 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <span className="block text-xs font-medium text-slate-300 mb-2">
                  Enable Divisions
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {DIVISIONS.map((d) => {
                    const active = selectedServices.includes(d.id);
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => toggleService(d.id)}
                        className={`px-3 py-2 text-xs rounded-lg text-left border transition-colors ${
                          active
                            ? 'bg-blue-600/20 border-blue-500 text-white'
                            : 'bg-[#060913] border-white/10 text-slate-400'
                        }`}
                      >
                        {d.index}. {d.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {authError && <p className="text-xs text-rose-400">{authError}</p>}

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save & Enter Dashboard'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('dashboard')}
                  className="px-4 py-2.5 text-sm font-medium rounded-lg border border-white/15 text-slate-200 hover:bg-white/5"
                >
                  Skip to Dashboard
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
