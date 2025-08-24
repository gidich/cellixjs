import React, { Component, ErrorInfo, ReactNode } from 'react';
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
export declare class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps);
    static getDerivedStateFromError(error: Error): ErrorBoundaryState;
    componentDidCatch(error: Error, errorInfo: ErrorInfo): void;
    private handleReset;
    render(): string | number | bigint | boolean | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | import("react/jsx-runtime").JSX.Element | null | undefined;
}
export {};
//# sourceMappingURL=ErrorBoundary.d.ts.map