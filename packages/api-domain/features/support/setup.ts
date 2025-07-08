// Setup file for Cucumber tests
// This file is automatically loaded by Cucumber and can be used for global setup

// Make sure Jest matchers are available  
import { expect as jestExpect } from '@jest/globals';

// Extend global type to include expect
// (No need to redeclare 'expect' as it's already declared by Jest types)

// Make expect available globally for step definitions
(global as any).expect = jestExpect;
