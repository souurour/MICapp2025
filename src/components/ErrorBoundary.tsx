import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReload = (): void => {
    window.location.reload();
  };

  handleGoHome = (): void => {
    window.location.href = "/";
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-white p-4 text-center">
          <div className="rounded-full bg-red-100 p-4">
            <svg
              className="h-10 w-10 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="mt-6 text-3xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-lg text-gray-600">
            We're sorry, but something went wrong. This might be a temporary
            issue.
          </p>

          {process.env.NODE_ENV !== "production" && this.state.error && (
            <div className="mt-6 w-full max-w-2xl overflow-auto rounded-md bg-gray-800 p-4 text-left text-white">
              <p className="font-mono text-sm font-bold text-red-400">
                {this.state.error.toString()}
              </p>
              {this.state.errorInfo && (
                <p className="mt-2 font-mono text-xs text-gray-300">
                  {this.state.errorInfo.componentStack
                    .split("\n")
                    .map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))}
                </p>
              )}
            </div>
          )}

          <div className="mt-8 flex space-x-4">
            <Button onClick={this.handleReload} variant="default">
              Reload Page
            </Button>
            <Button onClick={this.handleGoHome} variant="outline">
              Go to Homepage
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
