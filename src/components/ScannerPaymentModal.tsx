import React, { useState, useEffect } from 'react';
import { CheckCircle2, Copy, Check, QrCode, X, ShieldCheck } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { PLATFORM_CONTACT } from '../types/platform';
import { ResilientImage } from './ResilientImage';

export function ScannerPaymentModal() {
  const {
    scannerPayload,
    closeScannerCheckout,
    authUser,
    profile,
    signInWithGoogle,
    submitScannerPayment,
    clearCart,
    setCartOpen,
    navigate,
  } = usePlatform();

  const [copiedUpi, setCopiedUpi] = useState(false);
  const [upiRef, setUpiRef] = useState('');
  const [payerName, setPayerName] = useState('');
  const [payerPhone, setPayerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (scannerPayload) {
      setPayerName(profile?.displayName || authUser?.displayName || '');
      setPayerPhone(profile?.phone || '');
      setUpiRef('');
      setShippingAddress('');
      setError('');
      setConfirmedOrderId(null);
    }
  }, [scannerPayload, profile, authUser]);

  if (!scannerPayload) return null;

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(PLATFORM_CONTACT.upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    } catch {
      setCopiedUpi(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!authUser) {
      setError('Please sign in with Google below so we can attach this receipt to your customer account.');
      return;
    }
    if (upiRef.trim().length < 4) {
      setError('Enter the 12-digit UPI UTR / Transaction Reference ID from your payment app.');
      return;
    }
    if (payerName.trim().length < 2) {
      setError('Enter the payer full name.');
      return;
    }
    if (payerPhone.trim().length < 6) {
      setError('Enter a valid contact phone number.');
      return;
    }
    if (scannerPayload.requiresAddress && shippingAddress.trim().length < 8) {
      setError('Enter your complete shipping address for order dispatch.');
      return;
    }

    setSubmitting(true);
    try {
      const orderId = await submitScannerPayment({
        payload: scannerPayload,
        upiTransactionRef: upiRef,
        payerName,
        payerPhone,
        shippingAddress: shippingAddress || 'Digital Platform Subscription',
      });
      if (scannerPayload.orderType === 'merchandise') {
        clearCart();
        setCartOpen(false);
      }
      setConfirmedOrderId(orderId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to record payment receipt.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="scanner-checkout-title"
    >
      <div className="relative w-full max-w-3xl bg-[#0C1324] border border-white/10 rounded-xl overflow-hidden my-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <QrCode className="w-5 h-5 text-blue-400" />
            <h2 id="scanner-checkout-title" className="text-lg font-semibold text-white">
              UPI Scanner Payment Mode
            </h2>
          </div>
          <button
            type="button"
            onClick={closeScannerCheckout}
            aria-label="Close scanner payment modal"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedOrderId ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-white mb-2">
              Payment Receipt Submitted
            </h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto mb-6">
              Receipt <span className="font-mono-tabular text-white">{confirmedOrderId}</span> is queued for UPI verification against <span className="font-mono-tabular text-blue-400">{PLATFORM_CONTACT.upiId}</span>.
            </p>
            <div className="max-w-md mx-auto bg-[#060913] border border-white/10 rounded-lg p-4 text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Item</span>
                <span className="text-white text-right">{scannerPayload.itemSummary}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Amount</span>
                <span className="font-mono-tabular text-white">₹{scannerPayload.totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">UTR / Reference</span>
                <span className="font-mono-tabular text-white">{upiRef}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Status</span>
                <span className="text-amber-400">Pending Verification</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  closeScannerCheckout();
                  navigate('dashboard');
                }}
                className="px-5 py-2.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"
              >
                View in Customer Dashboard
              </button>
              <button
                type="button"
                onClick={closeScannerCheckout}
                className="px-5 py-2.5 text-sm font-medium rounded-lg border border-white/15 text-slate-200 hover:bg-white/5 transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Left column: Official UPI Scanner QR */}
            <div className="md:col-span-5 bg-[#060913] p-6 border-b md:border-b-0 md:border-r border-white/10 flex flex-col items-center justify-between">
              <div className="w-full text-center">
                <p className="text-xs text-slate-400 mb-1">Scan with any UPI app</p>
                <p className="text-base font-semibold text-white mb-4">
                  {PLATFORM_CONTACT.upiPayee}
                </p>
                <div className="mx-auto w-56 rounded-xl overflow-hidden border border-white/15 bg-[#12161F]">
                  <ResilientImage
                    src={PLATFORM_CONTACT.scannerImage}
                    alt="EZ AI WORLD Official UPI Payment Scanner for Ezhil Arasan"
                    className="w-full h-auto object-contain"
                    fallbackLabel="UPI ID: ezhila486@oksbi"
                  />
                </div>
              </div>

              <div className="w-full mt-5 space-y-2.5 text-xs">
                <div className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg bg-[#0C1324] border border-white/10">
                  <div className="min-w-0">
                    <span className="block text-[11px] text-slate-400">UPI ID</span>
                    <span className="font-mono-tabular text-white truncate block">
                      {PLATFORM_CONTACT.upiId}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-slate-200 transition-colors shrink-0"
                  >
                    {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="flex items-center justify-between text-slate-400 px-1">
                  <span>Bank</span>
                  <span className="text-slate-200">{PLATFORM_CONTACT.upiBank}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 px-1">
                  <span>Payment Desk</span>
                  <span className="font-mono-tabular text-slate-200">{PLATFORM_CONTACT.phone}</span>
                </div>
              </div>
            </div>

            {/* Right column: Verification & Order Form */}
            <form onSubmit={handleSubmit} className="md:col-span-7 p-6 space-y-4">
              <div className="flex items-baseline justify-between pb-3 border-b border-white/10">
                <div>
                  <span className="text-xs text-slate-400 block">Payable Total</span>
                  <span className="text-2xl font-semibold text-white font-mono-tabular">
                    ₹{scannerPayload.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="text-xs text-slate-400 text-right max-w-[210px] truncate">
                  {scannerPayload.itemSummary}
                </span>
              </div>

              {!authUser && (
                <div className="p-3.5 rounded-lg bg-blue-950/50 border border-blue-500/30 flex items-center justify-between gap-3">
                  <p className="text-xs text-slate-200">
                    Sign in to attach this payment receipt to your Customer Dashboard.
                  </p>
                  <button
                    type="button"
                    onClick={() => signInWithGoogle()}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-500 whitespace-nowrap shrink-0"
                  >
                    Sign In with Google
                  </button>
                </div>
              )}

              <div>
                <label htmlFor="upi-ref" className="block text-xs font-medium text-slate-300 mb-1.5">
                  UPI Transaction ID / 12-Digit UTR *
                </label>
                <input
                  id="upi-ref"
                  type="text"
                  required
                  value={upiRef}
                  onChange={(e) => setUpiRef(e.target.value)}
                  placeholder="e.g. 432819402819"
                  className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-[#060913] border border-white/15 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 font-mono-tabular"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="payer-name" className="block text-xs font-medium text-slate-300 mb-1.5">
                    Payer Full Name *
                  </label>
                  <input
                    id="payer-name"
                    type="text"
                    required
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    placeholder="Full name"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-[#060913] border border-white/15 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="payer-phone" className="block text-xs font-medium text-slate-300 mb-1.5">
                    Contact Phone *
                  </label>
                  <input
                    id="payer-phone"
                    type="tel"
                    required
                    value={payerPhone}
                    onChange={(e) => setPayerPhone(e.target.value)}
                    placeholder="10-digit mobile"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg bg-[#060913] border border-white/15 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 font-mono-tabular"
                  />
                </div>
              </div>

              {scannerPayload.requiresAddress && (
                <div>
                  <label htmlFor="shipping-addr" className="block text-xs font-medium text-slate-300 mb-1.5">
                    Delivery Address *
                  </label>
                  <textarea
                    id="shipping-addr"
                    rows={2}
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Street, City, State, PIN Code"
                    className="w-full px-3.5 py-2 text-sm rounded-lg bg-[#060913] border border-white/15 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {error && (
                <p className="text-xs text-rose-400" role="alert">
                  {error}
                </p>
              )}

              <div className="pt-2 flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Direct UPI Settlement</span>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0"
                >
                  {submitting ? 'Submitting...' : 'Confirm Payment & Submit'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
