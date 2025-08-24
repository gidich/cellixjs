import React from 'react';
export interface LoadingSpinnerProps {
    /** Loading state */
    loading?: boolean;
    /** Size of the spinner */
    size?: 'small' | 'default' | 'large';
    /** Custom loading text */
    tip?: string;
    /** Content to show when not loading */
    children?: React.ReactNode;
    /** Custom className */
    className?: string;
}
/**
 * General purpose loading spinner component
 * Can be used as a wrapper or standalone spinner
 */
export declare const LoadingSpinner: React.FC<LoadingSpinnerProps>;
//# sourceMappingURL=LoadingSpinner.d.ts.map