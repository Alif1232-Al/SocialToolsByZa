"use client";

import { Component, ReactNode, ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="border-4 border-black bg-red-100 p-6 comic-shadow">
            <div className="bg-red-500 text-white font-display font-black uppercase text-sm px-3 py-1 inline-block mb-3 border-4 border-black">
              ERROR!
            </div>
            <p className="font-body font-bold text-red-700">
              Something went wrong: {this.state.error?.message}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="mt-3 bg-black text-white border-4 border-black px-4 py-2 font-body font-bold uppercase text-sm hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              TRY AGAIN
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
