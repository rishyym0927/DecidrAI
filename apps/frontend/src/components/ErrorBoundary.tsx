/**
 * Error Boundary Component
 * Catches JavaScript errors and shows fallback UI
 */

'use client';

import { Component, ReactNode } from 'react';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console (can be extended to send to error tracking service)
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-6">😵</div>
            <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
            <p className="text-[var(--muted)] mb-6">
              An unexpected error occurred. Please try again or go back to the homepage.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre className="text-left text-sm bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6 overflow-auto">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-[var(--foreground)] text-[var(--background)] rounded-full font-semibold hover:opacity-80 transition-opacity"
              >
                Try Again
              </button>
              <Link
                href="/"
                className="px-6 py-3 border-2 border-[var(--foreground)] text-[var(--foreground)] rounded-full font-semibold hover:bg-[var(--surface)] transition-colors"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
