import React, { useState } from 'react';
import { Phone, Mail, QrCode, CheckCircle2, Send } from 'lucide-react';
import { DIVISIONS, PLATFORM_CONTACT } from '../types/platform';
import { ResilientImage } from '../components/ResilientImage';
import { usePlatform } from '../context/PlatformContext';

export function ContactPage() {
  const { openScannerCheckout } = usePlatform();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [division, setDivision] = useState('All Five Divisions');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [referenceId, setReferenceId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, division, message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed.');
      setReferenceId(data.referenceId);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to send inquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#060913] min-h-screen py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs font-medium text-blue-400">Contact Us</p>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Connect with the EZ AI WORLD engineering and billing desk.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Reach our solutions team directly by phone, email, or submit an enterprise inquiry below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details + Official Scanner Desk */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0C1324] border border-white/10 rounded-xl p-6 space-y-5">
              <h2 className="text-base font-semibold text-white">Direct Channels</h2>

              <div className="flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-400">Phone &amp; WhatsApp Support</div>
                  <a
                    href={`tel:${PLATFORM_CONTACT.phone}`}
                    className="text-base font-semibold text-white hover:text-blue-400 font-mono-tabular"
                  >
                    {PLATFORM_CONTACT.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Mail className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs text-slate-400">Official Email Desk</div>
                  <a
                    href={`mailto:${PLATFORM_CONTACT.email}`}
                    className="text-base font-semibold text-white hover:text-blue-400"
                  >
                    {PLATFORM_CONTACT.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-[#0C1324] border border-white/10 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-blue-400" />
                <h2 className="text-base font-semibold text-white">UPI Scanner Payment Desk</h2>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Payee: <span className="text-white">{PLATFORM_CONTACT.upiPayee}</span> ·{' '}
                <span className="font-mono-tabular text-blue-400">{PLATFORM_CONTACT.upiId}</span> ·{' '}
                {PLATFORM_CONTACT.upiBank}
              </p>
              <div className="w-48 rounded-lg overflow-hidden border border-white/10">
                <ResilientImage
                  src={PLATFORM_CONTACT.scannerImage}
                  alt="EZ AI WORLD UPI Scanner QR Code"
                  className="w-full h-auto object-contain"
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  openScannerCheckout({
                    orderType: 'subscription',
                    itemSummary: 'EZ AI WORLD Growth Plan (Monthly)',
                    totalAmount: 4999,
                    planToActivate: 'growth',
                    requiresAddress: false,
                  })
                }
                className="w-full py-2.5 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"
              >
                Open Scanner Checkout Modal
              </button>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-[#0C1324] border border-white/10 rounded-xl p-8">
            {referenceId ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h2 className="text-2xl font-semibold text-white">Inquiry Received</h2>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Your message has been logged under reference{' '}
                  <span className="font-mono-tabular text-white">{referenceId}</span> and routed to{' '}
                  <span className="text-blue-400">{PLATFORM_CONTACT.email}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => setReferenceId('')}
                  className="px-5 py-2.5 text-xs font-semibold rounded-lg border border-white/15 text-white hover:bg-white/5"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-lg font-semibold text-white">Send an Inquiry</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-medium text-slate-300 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-[#060913] border border-white/15 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-medium text-slate-300 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-[#060913] border border-white/15 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-phone" className="block text-xs font-medium text-slate-300 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 ..."
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-[#060913] border border-white/15 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 font-mono-tabular"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-division" className="block text-xs font-medium text-slate-300 mb-1.5">
                      Division of Interest
                    </label>
                    <select
                      id="contact-division"
                      value={division}
                      onChange={(e) => setDivision(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-[#060913] border border-white/15 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="All Five Divisions">All Five Divisions</option>
                      {DIVISIONS.map((d) => (
                        <option key={d.id} value={d.name}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-msg" className="block text-xs font-medium text-slate-300 mb-1.5">
                    Project Brief *
                  </label>
                  <textarea
                    id="contact-msg"
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your team size, goals, or custom integration requirements..."
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-[#060913] border border-white/15 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {error && <p className="text-xs text-rose-400">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending...' : 'Submit Inquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
