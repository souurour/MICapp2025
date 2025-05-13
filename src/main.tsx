import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Create a custom error handler for rendering errors
window.addEventListener("error", (event) => {
  console.error("Global error caught:", event.error);
  // Don't use Vite's error overlay for certain errors
  if (
    event.error &&
    event.error.toString().includes("Cannot read properties of undefined")
  ) {
    event.preventDefault(); // Prevent default error handling

    // Check if we're in development mode before trying to handle the error
    if (import.meta.env.DEV) {
      console.warn(
        "Suppressed Vite error overlay for undefined property error",
      );
    }
  }
});

// Custom error boundary for React rendering
class ErrorBoundaryRoot extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Root error boundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Basic fallback UI
      return (
        <div
          style={{
            padding: "20px",
            maxWidth: "800px",
            margin: "40px auto",
            fontFamily: "system-ui, -apple-system, sans-serif",
            lineHeight: 1.5,
          }}
        >
          <h1 style={{ color: "#e11d48" }}>Something went wrong</h1>
          <p>The application encountered an unexpected error.</p>
          <pre
            style={{
              backgroundColor: "#f1f5f9",
              padding: "12px",
              borderRadius: "4px",
              overflow: "auto",
              fontSize: "14px",
            }}
          >
            {this.state.error?.toString() || "Unknown error"}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
              marginTop: "16px",
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Standard way to mount React app with added error protection
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundaryRoot>
      <App />
    </ErrorBoundaryRoot>
  </React.StrictMode>,
);
