import { describe, it, expect } from 'vitest';
import { PropertyCard, CommunityHeader, UserStatusBadge } from './index';

// Basic smoke tests to ensure components can be imported
describe('OCOM UI Components', () => {
  it('should export PropertyCard component', () => {
    expect(PropertyCard).toBeDefined();
    expect(typeof PropertyCard).toBe('function');
  });

  it('should export CommunityHeader component', () => {
    expect(CommunityHeader).toBeDefined();
    expect(typeof CommunityHeader).toBe('function');
  });

  it('should export UserStatusBadge component', () => {
    expect(UserStatusBadge).toBeDefined();
    expect(typeof UserStatusBadge).toBe('function');
  });
});