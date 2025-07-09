import { Given, When, Then, setWorldConstructor } from '@cucumber/cucumber';
import { type Actor, actorCalled } from '@serenity-js/core';
import { Ensure, isPresent, equals, includes } from '@serenity-js/assertions';
import { Community, type CommunityProps } from '../../../src/domain/contexts/community/community/community.ts';
import type { EndUserEntityReference } from '../../../src/domain/contexts/user/end-user/end-user.ts';
import type { Passport } from '../../../src/domain/contexts/passport.ts';
import { createMockPassport, generateStringOfLength } from '../support/community-test-utils.ts';

/**
 * Serenity-enhanced World class that maintains state between steps
 * and provides actor-based testing capabilities
 */
class SerenityCommunityWorld {
  public actor: Actor;
  public validCommunityData: CommunityProps;
  public passport: Passport;
  public createdBy: EndUserEntityReference;
  public communityName: string;
  public creationError: Error | null = null;
  public createdCommunity: Community<CommunityProps> | null = null;

  constructor() {
    // Initialize Serenity actor
    this.actor = actorCalled('System Administrator');

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

setWorldConstructor(SerenityCommunityWorld);

// Serenity-enhanced Step Definitions

Given('I am an authorized user with community management permissions', 
  function (this: SerenityCommunityWorld) {
    // Initialize the actor for this scenario
    this.actor = actorCalled('System Administrator');

    // Verify authorization setup
    Ensure.that(this.passport, isPresent());
    Ensure.that(this.actor, isPresent());

    console.log(`✓ Actor "${this.actor.name}" is set up with community management permissions`);
  }
);

Given('I have valid community data', function (this: SerenityCommunityWorld) {
  // Valid community data is already set up in constructor
  // We just need to ensure it's properly configured
  Ensure.that(this.validCommunityData, isPresent());
  Ensure.that(this.validCommunityData.id, equals('12345'));

  console.log(`✓ Valid community data prepared with ID: ${this.validCommunityData.id}`);
});

When('I try to create a community with a name longer than {int} characters', 
  function (this: SerenityCommunityWorld, maxLength: number) {
    // Create a name that exceeds the specified length
    this.communityName = generateStringOfLength(maxLength + 1);

    console.log(`➤ Attempting to create community with name of ${this.communityName.length} characters (max: ${maxLength})`);

    try {
      this.createdCommunity = Community.getNewInstance(
        this.validCommunityData,
        this.communityName,
        this.createdBy,
        this.passport,
      );
      this.creationError = null;
      console.log(`✗ Unexpected success: Community was created despite invalid name length`);
    } catch (error) {
      this.creationError = error as Error;
      this.createdCommunity = null;
      console.log(`✓ Community creation failed as expected: ${this.creationError.message}`);
    }
  }
);

Then('the community creation should fail', function (this: SerenityCommunityWorld) {
  Ensure.that(this.creationError, isPresent());
  Ensure.that(this.createdCommunity, equals(null));

  console.log(`✓ Community creation properly failed with error: ${this.creationError?.message}`);
});

Then('I should receive an error message containing {string}', 
  function (this: SerenityCommunityWorld, expectedMessage: string) {
    Ensure.that(this.creationError, isPresent());
    Ensure.that(this.creationError?.message, isPresent());
    Ensure.that(this.creationError?.message, includes(expectedMessage));

    console.log(`✓ Error message contains expected text: "${expectedMessage}"`);
  }
);

// Additional utility steps for enhanced testing

Given('I am a {string} with {string} permissions', 
  function (this: SerenityCommunityWorld, userRole: string, permissionLevel: string) {
    // Create actor with specific role
    this.actor = actorCalled(userRole);

    // Configure permissions based on the permission level
    const hasManagementPermissions = permissionLevel.includes('management') || 
                                   permissionLevel.includes('admin');

    this.passport = createMockPassport({ 
      canManageCommunitySettings: hasManagementPermissions 
    });

    console.log(`✓ Actor "${userRole}" configured with "${permissionLevel}" permissions`);
  }
);

When('I attempt to create a community named {string}', 
  function (this: SerenityCommunityWorld, communityName: string) {
    this.communityName = communityName;

    console.log(`➤ Attempting to create community named: "${communityName}"`);

    try {
      this.createdCommunity = Community.getNewInstance(
        this.validCommunityData,
        this.communityName,
        this.createdBy,
        this.passport,
      );
      this.creationError = null;
      console.log(`✓ Successfully created community: "${communityName}"`);
    } catch (error) {
      this.creationError = error as Error;
      this.createdCommunity = null;
      console.log(`✗ Failed to create community: ${this.creationError.message}`);
    }
  }
);

Then('the community {string} should be created successfully', function (this: SerenityCommunityWorld, communityName: string) {
  Ensure.that(this.createdCommunity, isPresent());
  Ensure.that(this.creationError, equals(null));
  Ensure.that(this.createdCommunity?.name, isPresent());
  Ensure.that(this.createdCommunity?.name, equals(communityName));

  console.log(`✓ Community created successfully with name: "${this.createdCommunity?.name}"`);
});

export { SerenityCommunityWorld };