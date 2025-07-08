import { Given, When, Then, setWorldConstructor } from '@cucumber/cucumber';
import assert from 'node:assert';
import { Community, type CommunityProps } from '../../../src/domain/contexts/community/community/community.ts';
import type { EndUserEntityReference } from '../../../src/domain/contexts/user/end-user/end-user.ts';
import type { Passport } from '../../../src/domain/contexts/passport.ts';
import { createMockPassport, generateStringOfLength } from '../support/community-test-utils.ts';

// World class to maintain state between steps
class CommunityWorld {
  public validCommunityData: CommunityProps;
  public passport: Passport;
  public createdBy: EndUserEntityReference;
  public communityName: string;
  public creationError: Error | null = null;
  public createdCommunity: Community<CommunityProps> | null = null;

  constructor() {
    // Initialize with default valid data
    this.validCommunityData = {
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

    this.createdBy = {} as EndUserEntityReference;
    this.passport = createMockPassport({ canManageCommunitySettings: true });
    this.communityName = '';
  }
}

setWorldConstructor(CommunityWorld);

// Step Definitions

Given('I am an authorized user with community management permissions', function (this: CommunityWorld) {
  // Already set up in constructor with canManageCommunitySettings: true
  assert.ok(this.passport, 'Passport should be initialized');
});

Given('I have valid community data', function (this: CommunityWorld) {
  // Valid community data is already set up in constructor
  // We just need to ensure it's properly configured
  assert.ok(this.validCommunityData, 'Valid community data should be set up');
  assert.ok(this.validCommunityData.id, 'Community ID should be set');
});

When('I try to create a community with a name longer than {int} characters', function (this: CommunityWorld, maxLength: number) {
  // Create a name that exceeds the specified length
  this.communityName = generateStringOfLength(maxLength + 1);
  
  try {
    this.createdCommunity = Community.getNewInstance(
      this.validCommunityData,
      this.communityName,
      this.createdBy,
      this.passport,
    );
    this.creationError = null;
  } catch (error) {
    this.creationError = error as Error;
    this.createdCommunity = null;
  }
});

Then('the community creation should fail', function (this: CommunityWorld) {
  assert.ok(this.creationError, 'Community creation should have failed with an error');
  assert.strictEqual(this.createdCommunity, null, 'No community should have been created');
});

Then('I should receive an error message containing {string}', function (this: CommunityWorld, expectedMessage: string) {
  assert.ok(this.creationError, 'An error should have occurred');
  assert.ok(
    this.creationError.message.includes(expectedMessage),
    `Error message should contain "${expectedMessage}". Actual message: "${this.creationError.message}"`
  );
});
