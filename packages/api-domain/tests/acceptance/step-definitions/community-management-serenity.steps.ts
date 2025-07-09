import { Given, When, Then, setWorldConstructor } from '@cucumber/cucumber';
import type { Actor } from '@serenity-js/core';
import assert from 'node:assert';
import type { Community, CommunityProps } from '../../../src/domain/contexts/community/community/community.ts';
import type { EndUserEntityReference } from '../../../src/domain/contexts/user/end-user/end-user.ts';
import type { Passport } from '../../../src/domain/contexts/passport.ts';
import { createMockPassport, generateStringOfLength } from '../support/community-test-utils.ts';

// Import Screenplay pattern components
import { 
  Actors, 
  CommunityManagementCast,
  ManageCommunities,
  CommunityManagement,
  CommunityState,
  CommunityCreationResults
} from '../screenplay/index.js';

/**
 * Serenity-enhanced World class that maintains state between steps
 * and provides actor-based testing capabilities using Screenplay pattern
 */
class SerenityCommunityWorld {
  public actor: Actor;
  public cast: CommunityManagementCast;
  public validCommunityData: CommunityProps;
  public passport: Passport;
  public createdBy: EndUserEntityReference;
  public communityName: string;
  
  // Legacy properties for backward compatibility (will be removed after full refactor)
  public creationError: Error | null = null;
  public createdCommunity: Community<CommunityProps> | null = null;

  constructor() {
    // Initialize Screenplay Cast and default actor
    this.cast = new CommunityManagementCast();
    this.actor = this.cast.prepare(Actors.systemAdministrator());
    
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

  /**
   * Helper method to sync Screenplay results with legacy properties
   * This maintains backward compatibility while transitioning to Screenplay
   */
  syncResultsFromScreenplay(): void {
    this.createdCommunity = CommunityCreationResults.createdCommunity;
    this.creationError = CommunityCreationResults.creationError;
  }
}

setWorldConstructor(SerenityCommunityWorld);

// Serenity-enhanced Step Definitions

Given('I am an authorized user with community management permissions', 
  function (this: SerenityCommunityWorld) {
    // Initialize the actor for this scenario using Screenplay pattern
    this.actor = this.cast.prepare(Actors.systemAdministrator());
    
    // Verify the actor has the required abilities
    const ability = ManageCommunities.as(this.actor);
    assert.ok(ability, 'Actor should have ManageCommunities ability');
    assert.ok(ability.getPassport(), 'Actor should have a valid passport');
    
    console.log(`✓ Actor "${this.actor.name}" is set up with community management permissions`);
  }
);

Given('I have valid community data', function (this: SerenityCommunityWorld) {
  // Valid community data is already set up in constructor
  // We just need to ensure it's properly configured
  assert.ok(this.validCommunityData, 'Valid community data should be set up');
  assert.ok(this.validCommunityData.id, 'Community ID should be set');
  
  console.log(`✓ Valid community data prepared with ID: ${this.validCommunityData.id}`);
});

When('I try to create a community with a name longer than {int} characters', 
  async function (this: SerenityCommunityWorld, maxLength: number) {
    // Create a name that exceeds the specified length
    this.communityName = generateStringOfLength(maxLength + 1);
    
    console.log(`➤ Attempting to create community with name of ${this.communityName.length} characters (max: ${maxLength})`);
    
    // Use Screenplay pattern to perform the action
    await this.actor.attemptsTo(
      CommunityManagement.createCommunityWithInvalidName(maxLength + 1)
    );
    
    // Sync results for legacy compatibility
    this.syncResultsFromScreenplay();
    
    if (this.creationError) {
      console.log(`✓ Community creation failed as expected: ${this.creationError.message}`);
    } else {
      console.log(`✗ Unexpected success: Community was created despite invalid name length`);
    }
  }
);

Then('the community creation should fail', async function (this: SerenityCommunityWorld) {
  // Use Screenplay Questions to verify the state
  const creationFailed = await CommunityState.creationFailed().answeredBy(this.actor);
  const wasNotCreated = !(await CommunityState.wasCreated().answeredBy(this.actor));
  
  assert.ok(creationFailed, 'Community creation should have failed');
  assert.ok(wasNotCreated, 'No community should have been created');
  
  // Sync for legacy compatibility
  this.syncResultsFromScreenplay();
  
  console.log(`✓ Community creation properly failed with error: ${this.creationError?.message}`);
});

Then('I should receive an error message containing {string}', 
  async function (this: SerenityCommunityWorld, expectedMessage: string) {
    // Use Screenplay Questions to verify the error message
    const errorContainsMessage = await CommunityState.errorMessageContains(expectedMessage)
      .answeredBy(this.actor);
    
    assert.ok(errorContainsMessage, 
      `Error message should contain "${expectedMessage}". Actual message: "${CommunityCreationResults.creationError?.message}"`
    );
    
    console.log(`✓ Error message contains expected text: "${expectedMessage}"`);
  }
);

// Additional utility steps for enhanced testing

Given('I am a {string} with {string} permissions', 
  function (this: SerenityCommunityWorld, userRole: string, permissionLevel: string) {
    // Create actor with specific role using Screenplay pattern
    let actor: Actor;
    
    switch (userRole.toLowerCase()) {
      case 'system administrator':
      case 'admin':
        actor = Actors.systemAdministrator();
        break;
      case 'community manager':
        actor = Actors.communityManager();
        break;
      case 'regular user':
        actor = Actors.regularUser();
        break;
      default:
        actor = Actors.named(userRole);
    }
    
    this.actor = this.cast.prepare(actor);
    
    // Verify the actor has the required abilities
    const ability = ManageCommunities.as(this.actor);
    assert.ok(ability, 'Actor should have ManageCommunities ability');
    
    console.log(`✓ Actor "${userRole}" configured with "${permissionLevel}" permissions`);
  }
);

When('I attempt to create a community named {string}', 
  async function (this: SerenityCommunityWorld, communityName: string) {
    this.communityName = communityName;
    
    console.log(`➤ Attempting to create community named: "${communityName}"`);
    
    // Use Screenplay pattern to perform the action
    await this.actor.attemptsTo(
      CommunityManagement.createCommunityNamed(communityName)
    );
    
    // Sync results for legacy compatibility
    this.syncResultsFromScreenplay();
    
    if (this.createdCommunity) {
      console.log(`✓ Successfully created community: "${communityName}"`);
    } else {
      console.log(`✗ Failed to create community: ${this.creationError?.message}`);
    }
  }
);

Then('the community should be created successfully', async function (this: SerenityCommunityWorld) {
  // Use Screenplay Questions to verify success
  const wasCreated = await CommunityState.wasCreated().answeredBy(this.actor);
  const noError = !(await CommunityState.creationFailed().answeredBy(this.actor));
  
  assert.ok(wasCreated, 'Community should have been created');
  assert.ok(noError, 'No error should have occurred');
  
  // Sync for legacy compatibility
  this.syncResultsFromScreenplay();
  
  assert.strictEqual(this.createdCommunity?.name, this.communityName, 'Community name should match');
  
  console.log(`✓ Community created successfully with name: "${this.createdCommunity?.name}"`);
});

export { SerenityCommunityWorld };
