import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Alert, Button } from 'antd';

export interface ErrorBoundaryProps {
  /** Child components to render */
  children: ReactNode;
  /** Custom fallback component */
  fallback?: (error: Error, errorInfo: ErrorInfo) => ReactNode;
  /** Callback when error occurs */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Custom error message */
  errorMessage?: string;
  /** Show reset button */
  showReset?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * Error boundary component to catch and handle React errors
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  override render() {
    if (this.state.hasError) {
      if (this.props.fallback && this.state.error && this.state.errorInfo) {
        return this.props.fallback(this.state.error, this.state.errorInfo);
      }

      const errorMessage = this.props.errorMessage || 'Something went wrong. Please try again.';

      return (
        <div className="p-4">
          <Alert
            message="Error"
            description={errorMessage}
            type="error"
            showIcon
            action={
              this.props.showReset ? (
                <Button size="small" danger type="text" onClick={this.handleReset}>
                  Try Again
                </Button>
              ) : undefined
            }
          />
        </div>
      );
    }

    return this.props.children;
  }
}