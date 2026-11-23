import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected application error occurred.',
    };
  }

  override componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('EZ AI WORLD ErrorBoundary caught:', error, info);
  }

  override render() {
    if (this.state.hasError) {
      let friendlyMessage = this.state.errorMessage;
      try {
        const parsed = JSON.parse(this.state.errorMessage);
        if (parsed?.error) {
          friendlyMessage = `${parsed.error} (${parsed.operationType || 'operation'} on ${parsed.path || 'database'})`;
        }
      } catch {
        // Not JSON, keep raw message
      }

      return (
        <div className="min-h-screen bg-[#060913] text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-[#0C1324] border border-white/10 rounded-xl p-8">
            <div className="flex items-center gap-3 text-amber-400 mb-4">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h2 className="text-lg font-semibold text-white">Application Notice</h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed mb-6 break-words">
              {friendlyMessage}
            </p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, errorMessage: '' })}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reload View
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
