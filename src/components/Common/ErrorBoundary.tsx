// ErrorBoundary component to catch errors in the application

import React from "react";
import AlertMessage from "./AlertMessage";

type ErrorBoundaryProps = {
  children: React.ReactNode;
  // Optionally override the default error title/message
  errorTitle?: string;
  errorMessage?: string;
  // Optionally customize AlertMessage props (except onClose, which is managed)
  alertProps?: Partial<React.ComponentProps<typeof AlertMessage>>;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error | null;
  errorInfo?: React.ErrorInfo | null;
};

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });
    // Optionally log error to service here
  }

  handleClose = () => {
    // Reset error state so user can retry
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { errorTitle, errorMessage, alertProps, children } = this.props;

    if (hasError) {
      return (
        <AlertMessage
          type="error"
          title={errorTitle || "Something went wrong"}
          message={
            <div>
              <div>{errorMessage || "An unexpected error occurred in this section."}</div>
              {error?.message && (
                <div style={{ marginTop: 8, fontSize: 13, opacity: 0.8 }}>
                  <b>Error:</b> {error.message}
                </div>
              )}
              {errorInfo?.componentStack && (
                <details style={{ marginTop: 8, fontSize: 11, opacity: 0.7 }}>
                  <summary style={{ cursor: "pointer" }}>Stack trace</summary>
                  <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{errorInfo.componentStack}</pre>
                </details>
              )}
            </div>
          }
          animated
          animationType="bounce"
          withCloseButton
          persistent
          onClose={this.handleClose}
          {...alertProps}
        />
      );
    }

    return children;
  }
}
