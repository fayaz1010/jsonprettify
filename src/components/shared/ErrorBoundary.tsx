"use client";

import React, { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#0F172A" }}>
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: "#1E293B" }}>
              An unexpected error occurred.
            </h2>
            <p className="text-slate-400 mb-8">
              Something went wrong while rendering this page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-block px-6 py-3 rounded-lg font-medium text-white transition-colors hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: "#3B82F6" }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
