import assert from 'node:assert';
import { describe, test } from 'node:test';
import { Community, type CommunityProps } from '../../src/domain/contexts/community/community/community.ts';
import type { EndUserEntityReference } from '../../src/domain/contexts/user/end-user/end-user.ts';
import { createMockPassport, generateStringOfLength } from './support/community-test-utils.ts';

/**
 * Integration tests that demonstrate how the Cucumber scenarios work
 * with the domain logic. These tests implement the same scenarios
 * described in the community-management.feature file.
 */
describe('Community Management - Cucumber Integration Tests', () => {
  
  describe('Scenario: Rejecting community creation with invalid name - too long', () => {
    
    test('Given I am an authorized user with community management permissions', () => {
      // Setup: Create a user with community management permissions
      const passport = createMockPassport({ canManageCommunitySettings: true });
      assert.ok(passport, 'User should have valid passport with community management permissions');
    });

    test('Given I have valid community data', () => {
      // Setup: Create valid community data structure
      const validCommunityData = {
        id: '12345',
        name: '',
        domain: '',
        whiteLabelDomain: null,
        handle: null,
        createdBy: {} as EndUserEntityReference,
        createdAt: new Date(),
        updatedAt: new Date(),
        schemaVersion: '1.0.0',
      } as CommunityProps;
      
      assert.ok(validCommunityData, 'Valid community data should be available');
      assert.ok(validCommunityData.id, 'Community should have an ID');
    });

    test('When I try to create a community with a name longer than 200 characters', () => {
      // Arrange
      const validCommunityData = {
        id: '12345',
        name: '',
        domain: '',
        whiteLabelDomain: null,
        handle: null,
        createdBy: {} as EndUserEntityReference,
        createdAt: new Date(),
        updatedAt: new Date(),
        schemaVersion: '1.0.0',
      } as CommunityProps;
      
      const passport = createMockPassport({ canManageCommunitySettings: true });
      const createdBy = {} as EndUserEntityReference;
      
      // Create a name longer than 200 characters (201 characters)
      const invalidCommunityName = generateStringOfLength(201);
      
      // Act & Assert
      let creationError: Error | null = null;
      let createdCommunity: Community<CommunityProps> | null = null;
      
      try {
        createdCommunity = Community.getNewInstance(
          validCommunityData,
          invalidCommunityName,
          createdBy,
          passport,
        );
      } catch (error) {
        creationError = error as Error;
      }
      
      // Then the community creation should fail
      assert.ok(creationError, 'Community creation should have failed with an error');
      assert.strictEqual(createdCommunity, null, 'No community should have been created');
      
      // And I should receive an error message containing "Too long"
      assert.ok(creationError.message.includes('Too long'), 
        `Error message should contain "Too long". Actual message: "${creationError.message}"`);
    });
  });
});
