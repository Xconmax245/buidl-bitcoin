"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          color: "#fff",
          fontFamily: "monospace",
          padding: "2rem",
        }}>
          <div style={{ maxWidth: "600px" }}>
            <h1 style={{ color: "#ff4444", marginBottom: "1rem" }}>Application Error</h1>
            <p style={{ color: "#aaa", marginBottom: "1rem" }}>
              Something went wrong. Error details:
            </p>
            <pre style={{
              padding: "1rem",
              backgroundColor: "#1a1a1a",
              borderRadius: "8px",
              overflow: "auto",
              fontSize: "0.85rem",
              color: "#ff8888",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}>
              {this.state.error?.message}
              {"\n\n"}
              {this.state.error?.stack}
            </pre>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#333",
                color: "#fff",
                border: "1px solid #555",
                borderRadius: "4px",
                cursor: "pointer",
              }}
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
