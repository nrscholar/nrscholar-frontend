import React from "react";

const UniversalErrorScreen = React.lazy(() => import("./UniversalErrorScreen"));

export class UniversalErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("UniversalErrorBoundary caught a runtime error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <React.Suspense fallback={<div className="flex h-screen items-center justify-center font-bold text-slate-800">Something went wrong. Reloading...</div>}>
          <UniversalErrorScreen
            statusCode={500}
            onRetry={() => {
              this.setState({ hasError: false, error: undefined });
              window.location.reload();
            }}
            onHome={() => {
              this.setState({ hasError: false, error: undefined });
              window.location.href = "/home";
            }}
          />
        </React.Suspense>
      );
    }

    return this.props.children;
  }
}

export default UniversalErrorBoundary;
