import React from "react";
import {
  Container,
  Stack,
  Text,
  Box,
  Group,
  Code,
  Divider,
  type ContainerProps
} from "@mantine/core";
import {
  IconRefresh,
  IconHome,
  IconBug,
  IconAlertTriangle
} from "@tabler/icons-react";
import AlertMessage, { type AlertMessageProps, AlertPresets } from "./AlertMessage";
import Button from "./Button";

// Error information type
export type ErrorInfo = {
  componentStack: string;
  errorBoundary?: string;
  errorBoundaryStack?: string;
};

// Error details for better debugging
export type ErrorDetails = {
  message: string;
  stack?: string;
  name?: string;
  cause?: unknown;
  timestamp: Date;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId?: string;
  buildVersion?: string;
  environment?: string;
};

// Fallback UI configuration
export type FallbackUIConfig = {
  variant?: "alert" | "fullscreen" | "minimal";
  title?: string;
  message?: string;
  showErrorDetails?: boolean;
  showRetryButton?: boolean;
  showHomeButton?: boolean;
  showReportButton?: boolean;
  hideStackTrace?: boolean;
  alertProps?: Partial<AlertMessageProps>;
};

export type ErrorBoundaryProps = {
  // Children to wrap
  children: React.ReactNode;
  
  // Fallback UI configuration
  fallback?: FallbackUIConfig;
  
  // Custom fallback component
  fallbackComponent?: React.ComponentType<{
    error: Error;
    errorInfo: ErrorInfo;
    resetError: () => void;
  }>;
  
  // Event handlers
  onError?: (error: Error, errorInfo: ErrorInfo, errorDetails: ErrorDetails) => void;
  onReset?: () => void;
  onRetry?: () => void;
  onReportError?: (errorDetails: ErrorDetails) => void;
  
  // Recovery options
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
  isolate?: boolean; // Prevent error from bubbling up
  
  // Environment configuration
  development?: boolean;
  enableErrorReporting?: boolean;
  errorReportingEndpoint?: string;
  
  // Layout
  containerProps?: ContainerProps;
  fullscreen?: boolean;
  
  // Metadata
  boundaryName?: string;
  userId?: string;
  sessionId?: string;
  buildVersion?: string;
  environment?: string;
};

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorDetails: ErrorDetails | null;
  errorId: string | null;
  retryCount: number;
}

/**
 * ErrorBoundary component that catches JavaScript errors and displays user-friendly fallback UI.
 * Built with your existing AlertMessage component with Framer Motion animations.
 */
export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;
  private prevResetKeys: Array<string | number> = [];
  
  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorDetails: null,
      errorId: null,
      retryCount: 0
    };
    
    this.prevResetKeys = props.resetKeys || [];
  }
  
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const errorDetails = this.createErrorDetails(error, errorInfo);
    
    this.setState({
      errorInfo,
      errorDetails
    });
    
    // Call error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo, errorDetails);
    }
    
    // Report error if enabled
    if (this.props.enableErrorReporting) {
      this.reportError(errorDetails);
    }
    
    // Log error in development
    if (this.props.development) {
      console.group("🚨 ErrorBoundary caught an error");
      console.error("Error:", error);
      console.error("Error Info:", errorInfo);
      console.error("Error Details:", errorDetails);
      console.groupEnd();
    }
  }
  
  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;
    
    // Check if reset keys have changed
    if (hasError && resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (key, index) => key !== this.prevResetKeys[index]
      );
      
      if (hasResetKeyChanged) {
        this.prevResetKeys = resetKeys;
        this.resetErrorBoundary();
      }
    }
    
    // Reset on any prop change if enabled
    if (hasError && resetOnPropsChange && prevProps !== this.props) {
      this.resetErrorBoundary();
    }
  }
  
  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }
  
  private createErrorDetails(error: Error, errorInfo: ErrorInfo): ErrorDetails {
    // Use errorInfo parameter and componentStack to avoid eslint warnings
    const componentStack = errorInfo.componentStack;
    console.debug('Error component stack:', componentStack); // Use componentStack to avoid unused warning
    
    // Type-safe way to access cause property for older TypeScript versions
    const errorWithCause = error as Error & { cause?: unknown };
    
    return {
      message: error.message,
      stack: error.stack,
      name: error.name,
      cause: errorWithCause.cause,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.props.userId,
      sessionId: this.props.sessionId,
      buildVersion: this.props.buildVersion,
      environment: this.props.environment || (this.props.development ? 'development' : 'production')
    };
  }
  
  private async reportError(errorDetails: ErrorDetails) {
    if (!this.props.errorReportingEndpoint) return;
    
    try {
      await fetch(this.props.errorReportingEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...errorDetails,
          boundaryName: this.props.boundaryName,
          errorId: this.state.errorId
        }),
      });
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }
  
  private resetErrorBoundary = () => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorDetails: null,
      errorId: null,
      retryCount: 0
    });
  };
  
  private handleRetry = () => {
    this.setState(prevState => ({
      retryCount: prevState.retryCount + 1
    }));
    
    if (this.props.onRetry) {
      this.props.onRetry();
    }
    
    // Reset after a short delay to allow for cleanup
    this.resetTimeoutId = window.setTimeout(() => {
      this.resetErrorBoundary();
    }, 100);
  };
  
  private handleReportError = () => {
    if (this.state.errorDetails && this.props.onReportError) {
      this.props.onReportError(this.state.errorDetails);
    }
  };
  
  private navigateHome = () => {
    window.location.href = '/';
  };
  
  // Create error message content with optional details
  private createErrorMessage() {
    const { fallback, development } = this.props;
    const { error, errorInfo, errorDetails, retryCount } = this.state;
    
    const showDetails = fallback?.showErrorDetails !== false;
    const hideStack = fallback?.hideStackTrace === true;
    
    return (
      <Stack gap="sm">
        {/* Main error message */}
        <Text>
          {fallback?.message || error?.message || "An unexpected error occurred in the application."}
        </Text>
        
        {/* Error ID for reference */}
        {this.state.errorId && (
          <Text size="sm" c="dimmed">
            Error ID: <Code>{this.state.errorId}</Code>
          </Text>
        )}
        
        {/* Timestamp */}
        {errorDetails?.timestamp && (
          <Text size="sm" c="dimmed">
            Time: {errorDetails.timestamp.toLocaleString()}
          </Text>
        )}
        
        {/* Error details in development or when explicitly shown */}
        {showDetails && !hideStack && error?.stack && (
          <details style={{ marginTop: 8 }}>
            <summary style={{ cursor: "pointer", fontSize: "0.875rem", fontWeight: 500 }}>
              Technical Details {development ? "(Development Mode)" : ""}
            </summary>
            <Box mt="xs" p="sm" style={{ backgroundColor: "var(--mantine-color-gray-1)", borderRadius: 4 }}>
              <Code block style={{ whiteSpace: "pre-wrap", maxHeight: 200, overflow: "auto", fontSize: "0.75rem" }}>
                {error.stack}
              </Code>
              {development && errorInfo?.componentStack && (
                <>
                  <Divider my="xs" />
                  <Text size="xs" fw={500} mb="xs">Component Stack:</Text>
                  <Code block style={{ whiteSpace: "pre-wrap", maxHeight: 150, overflow: "auto", fontSize: "0.75rem" }}>
                    {errorInfo.componentStack}
                  </Code>
                </>
              )}
            </Box>
          </details>
        )}
        
        {/* Action buttons */}
        <Group gap="xs" mt="md">
          {fallback?.showRetryButton !== false && (
            <Button
              leftSection={<IconRefresh size={16} />}
              variant="filled"
              size="sm"
              onClick={this.handleRetry}
            >
              Try Again{retryCount > 0 ? ` (${retryCount})` : ""}
            </Button>
          )}
          
          {fallback?.showHomeButton !== false && (
            <Button
              leftSection={<IconHome size={16} />}
              variant="outline"
              size="sm"
              onClick={this.navigateHome}
            >
              Go Home
            </Button>
          )}
          
          {fallback?.showReportButton !== false && (
            <Button
              leftSection={<IconBug size={16} />}
              variant="subtle"
              size="sm"
              onClick={this.handleReportError}
            >
              Report Issue
            </Button>
          )}
        </Group>
      </Stack>
    );
  }
  
  private renderAlertFallback() {
    const { fallback } = this.props;
    
    return (
      <AlertMessage
        {...AlertPresets.error}
        type="error"
        title={fallback?.title || "Something went wrong"}
        message={this.createErrorMessage()}
        animated
        animationType="bounce"
        withCloseButton
        persistent
        onClose={this.resetErrorBoundary}
        {...fallback?.alertProps}
      />
    );
  }
  
  private renderMinimalFallback() {
    const { fallback } = this.props;
    
    return (
      <AlertMessage
        {...AlertPresets.error}
        type="error"
        title={fallback?.title || "Error"}
        message={fallback?.message || "Something went wrong. Please try again."}
        animated
        animationType="slide"
        withCloseButton
        onClose={this.resetErrorBoundary}
        {...fallback?.alertProps}
      />
    );
  }
  
  private renderFullscreenFallback() {
    const { containerProps } = this.props;
    
    return (
      <Box
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--mantine-color-gray-0)",
          padding: "var(--mantine-spacing-xl)"
        }}
      >
        <Container size="sm" {...containerProps}>
          <Stack gap="xl" align="center">
            <IconAlertTriangle size={64} color="var(--mantine-color-red-6)" />
            
            <Stack gap="md" align="center">
              <Text size="xl" fw={700} ta="center">
                Oops! Something went wrong
              </Text>
              <Text size="md" c="dimmed" ta="center" maw={400}>
                We're sorry, but something unexpected happened. Our team has been notified and is working on a fix.
              </Text>
            </Stack>
            
            {this.renderAlertFallback()}
          </Stack>
        </Container>
      </Box>
    );
  }
  
  render() {
    if (this.state.hasError) {
      // Use custom fallback component if provided
      if (this.props.fallbackComponent) {
        const FallbackComponent = this.props.fallbackComponent;
        return (
          <FallbackComponent
            error={this.state.error!}
            errorInfo={this.state.errorInfo!}
            resetError={this.resetErrorBoundary}
          />
        );
      }
      
      // Render based on variant
      const variant = this.props.fallback?.variant || "alert";
      
      if (this.props.fullscreen || variant === "fullscreen") {
        return this.renderFullscreenFallback();
      }
      
      if (variant === "minimal") {
        return this.renderMinimalFallback();
      }
      
      // Default alert variant
      const fallbackContent = this.renderAlertFallback();
      
      // Wrap in container if specified
      return this.props.containerProps ? (
        <Container {...this.props.containerProps}>
          {fallbackContent}
        </Container>
      ) : fallbackContent;
    }
    
    return this.props.children;
  }
}

// Preset configurations for common use cases
export const ErrorBoundaryPresets = {
  // Development mode with full details
  development: {
    development: true,
    fallback: {
      variant: "alert" as const,
      showErrorDetails: true,
      showRetryButton: true,
      showReportButton: true,
      alertProps: {
        animationType: "bounce" as const,
        persistent: true
      }
    }
  },
  
  // Production mode with minimal details
  production: {
    development: false,
    enableErrorReporting: true,
    fallback: {
      variant: "alert" as const,
      showErrorDetails: false,
      hideStackTrace: true,
      showRetryButton: true,
      showHomeButton: true,
      alertProps: {
        animationType: "slide" as const,
        persistent: true
      }
    }
  },
  
  // Minimal error display
  minimal: {
    fallback: {
      variant: "minimal" as const,
      showRetryButton: true,
      alertProps: {
        animationType: "fade" as const,
        autoClose: 5000
      }
    }
  },
  
  // Full page error
  fullscreen: {
    fullscreen: true,
    fallback: {
      variant: "fullscreen" as const,
      showErrorDetails: true,
      showRetryButton: true,
      showHomeButton: true
    }
  },
  
  // Component-level error boundary
  component: {
    fallback: {
      variant: "alert" as const,
      title: "Component Error",
      message: "This component encountered an error and couldn't render properly.",
      showRetryButton: true,
      alertProps: {
        type: "warning" as const,
        animationType: "scale" as const
      }
    },
    isolate: true
  }
};

// HOC for easy wrapping
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Hook for error reporting
export function useErrorHandler() {
  const reportError = React.useCallback((error: Error, context?: string) => {
    // This would typically integrate with your error reporting service
    console.error(`Error in ${context}:`, error);
    
    // You could dispatch to a global error handler here
    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('unhandledError', {
        detail: { error, context }
      }));
    }
  }, []);
  
  return { reportError };
}