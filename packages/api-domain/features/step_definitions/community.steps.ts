import { Given, When, Then, Before } from '@cucumber/cucumber';
// Import expect from a Jest-compatible library for Cucumber
import { expect } from 'expect';
import { Community, type CommunityProps } from '../../src/domain/contexts/community/community/community.ts';
import type { EndUserEntityReference } from '../../src/domain/contexts/user/end-user/end-user.ts';
import type { CommunityVisa } from '../../src/domain/contexts/community/community.visa.ts';
import type { Passport } from '../../src/domain/contexts/passport.ts';
import { CommunityCreatedEvent } from '../../src/domain/events/types/community-created.ts';
import type { CommunityPassport } from '../../src/domain/contexts/community/community.passport.ts';
import type { CommunityDomainPermissions } from '../../src/domain/contexts/community/community.domain-permissions.ts';

// Test context to share data between steps
interface TestContext {
  communityProps?: CommunityProps;
  communityName?: string;
  createdBy?: EndUserEntityReference;
  passport?: Passport;
  expectedId?: string;
  createdCommunity?: Community<CommunityProps>;
  communityCreationResult?: string;
  communityCreationError?: Error;
  permissions?: Partial<CommunityDomainPermissions>;
}

let testContext: TestContext = {};

Before(() => {
  testContext = {};
});

Given('a community administrator with valid permissions', () => {
  testContext.permissions = {
    canManageCommunitySettings: true,
  };
});

Given('a valid community name {string}', (communityName: string) => {
  testContext.communityName = communityName;
});

Given('an invalid community name that is too long', () => {
  // 201 characters -> exceeds the 200 character limit
  testContext.communityName = 'REcK03mhSslLPAmidGzyRvc16iOyrZ9VDfgnOcTlBEZzDFlbl8FdPcpLGZXLAXJxbScF96qRhGkqnPgDWMYAHst56OZwIxVb4b8mX4FvmiqwjpY51pBG5C9EOwlWhELc7mi74z977jnaR4IpMlP3cZpUY0bkRLJAUVprG2jfHQymztv4KbQzDUcmbwjnXiBIxO9faxcV0';
});

Given('the required community creation context is set up', () => {
  const expectedNewId = '12345';
  
  // Create mock objects without Jest
  const communityProps = {
    id: expectedNewId,
    createdBy: {} as EndUserEntityReference
  } as CommunityProps;
  
  const createdBy = {} as EndUserEntityReference;
  communityProps.createdBy = createdBy;

  // Create mock community visa
  const mockCommunityVisa = {
    determineIf: (fn: (permissions: Readonly<CommunityDomainPermissions>) => boolean) => {
      return fn(testContext.permissions as CommunityDomainPermissions);
    },
  } as CommunityVisa;

  // Create mock passport
  const passport = {
    community: {
      forCommunity: () => mockCommunityVisa,
    },
    service: {},
    user: {}
  } as unknown as Passport;

  testContext.communityProps = communityProps;
  testContext.createdBy = createdBy;
  testContext.passport = passport;
  testContext.expectedId = expectedNewId;
});

When('I create a new community', () => {
  try {
    const community = Community.getNewInstance(
      testContext.communityProps!,
      testContext.communityName!,
      testContext.createdBy!,
      testContext.passport!,
    );
    testContext.createdCommunity = community;
    testContext.communityCreationResult = 'success';
  } catch (error) {
    testContext.communityCreationError = error as Error;
    testContext.communityCreationResult = 'error';
  }
});

When('I attempt to create a community with the invalid name', () => {
  try {
    const community = Community.getNewInstance(
      testContext.communityProps!,
      testContext.communityName!,
      testContext.createdBy!,
      testContext.passport!,
    );
    testContext.createdCommunity = community;
    testContext.communityCreationResult = 'success';
  } catch (error) {
    testContext.communityCreationError = error as Error;
    testContext.communityCreationResult = 'error';
  }
});

Then('the community should be created successfully', () => {
  expect(testContext.communityCreationResult).toBe('success');
  expect(testContext.createdCommunity).toBeDefined();
});

Then('a CommunityCreatedEvent should be raised', () => {
  const community = testContext.createdCommunity!;
  const communityEvents = community.getIntegrationEvents().filter(e => e instanceof CommunityCreatedEvent);
  
  expect(communityEvents).toHaveLength(1);
  
  const createdEvent = communityEvents[0] as CommunityCreatedEvent;
  expect(createdEvent.payload.communityId).toBe(testContext.expectedId);
});

Then('the community creation should fail', () => {
  expect(testContext.communityCreationResult).toBe('error');
  expect(testContext.communityCreationError).toBeDefined();
});

Then('the error should indicate the name is too long', () => {
  expect(testContext.communityCreationError).toEqual(
    expect.objectContaining({
      message: expect.stringContaining('Too long'),
    })
  );
});
