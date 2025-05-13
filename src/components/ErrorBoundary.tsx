import React, { Component, ReactNode } from "react";
import { Button } from "./ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: _, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details
    console.error("Error caught by error boundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    const { hasError, error, errorInfo } = this.state;

    if (hasError) {
      // Render a nicer error UI than the default
      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
          <div className="mb-6 rounded-full bg-red-100 p-4 text-red-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-12 w-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Something went wrong
          </h1>
          <p className="mb-4 text-gray-600">
            The application encountered an unexpected error.
          </p>
          <div className="mb-6 max-w-lg rounded-md bg-gray-50 p-4 text-left">
            <div className="mb-2 font-medium text-gray-800">Error:</div>
            <div className="mb-4 overflow-auto text-sm text-red-600">
              {error?.toString() || "Unknown error"}
            </div>
            {errorInfo && (
              <>
                <div className="mb-2 font-medium text-gray-800">
                  Component Stack:
                </div>
                <pre className="max-h-96 overflow-auto rounded bg-gray-100 p-2 text-xs text-gray-800">
                  {errorInfo.componentStack}
                </pre>
              </>
            )}
          </div>
          <div className="flex space-x-4">
            <Button
              onClick={() => window.location.reload()}
              className="bg-primary"
            >
              Reload Page
            </Button>
            <Button
              onClick={() => (window.location.href = "/")}
              variant="outline"
            >
              Go to Home
            </Button>
          </div>
          <div className="mt-8 text-sm text-gray-500">
            If this problem persists, please contact support.
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
