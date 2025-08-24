import { jsx as _jsx } from "react/jsx-runtime";
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, Button } from 'antd';
/**
 * Error boundary component to catch and handle React errors
 */
export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error
        };
    }
    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        this.props.onError?.(error, errorInfo);
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
    handleReset = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };
    render() {
        if (this.state.hasError) {
            if (this.props.fallback && this.state.error && this.state.errorInfo) {
                return this.props.fallback(this.state.error, this.state.errorInfo);
            }
            const errorMessage = this.props.errorMessage || 'Something went wrong. Please try again.';
            return (_jsx("div", { className: "p-4", children: _jsx(Alert, { message: "Error", description: errorMessage, type: "error", showIcon: true, action: this.props.showReset ? (_jsx(Button, { size: "small", danger: true, type: "text", onClick: this.handleReset, children: "Try Again" })) : undefined }) }));
        }
        return this.props.children;
    }
}
//# sourceMappingURL=ErrorBoundary.js.map