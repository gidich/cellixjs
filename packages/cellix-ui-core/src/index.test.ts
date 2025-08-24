import { describe, it, expect } from 'vitest';
import { LoadingSpinner } from '../components/LoadingSpinner';

// Basic smoke test to ensure components can be imported
describe('LoadingSpinner', () => {
  it('should export LoadingSpinner component', () => {
    expect(LoadingSpinner).toBeDefined();
    expect(typeof LoadingSpinner).toBe('function');
  });
});

describe('ErrorBoundary', async () => {
  const { ErrorBoundary } = await import('../components/ErrorBoundary');
  
  it('should export ErrorBoundary component', () => {
    expect(ErrorBoundary).toBeDefined();
    expect(typeof ErrorBoundary).toBe('function');
  });
});

describe('ConfirmDialog', async () => {
  const { ConfirmDialog } = await import('../components/ConfirmDialog');
  
  it('should export ConfirmDialog component', () => {
    expect(ConfirmDialog).toBeDefined();
    expect(typeof ConfirmDialog).toBe('function');
  });
});