import React from 'react';
import { Spin } from 'antd';

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
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  loading = true,
  size = 'default',
  tip = 'Loading...',
  children,
  className
}) => {
  if (!children) {
    // Standalone spinner
    return (
      <div className={`flex justify-center items-center p-4 ${className || ''}`}>
        <Spin size={size} tip={tip} spinning={loading} />
      </div>
    );
  }

  // Wrapper spinner
  return (
    <Spin size={size} tip={tip} spinning={loading} className={className}>
      {children}
    </Spin>
  );
};