import { Given, When, Then, Before } from '@cucumber/cucumber';
// Import Jest utilities and expect from compatible sources
import * as jest from 'jest-mock';
import { expect } from 'expect';
// Import Serenity-JS dependencies
import { actorCalled, Question, Task } from '@serenity-js/core';
import type { Actor, AnswersQuestions, UsesAbilities } from '@serenity-js/core';
import { Community, type CommunityProps } from '../../src/domain/contexts/community/community/community.ts';
import type { EndUserEntityReference } from '../../src/domain/contexts/user/end-user/end-user.ts';
import type { CommunityVisa } from '../../src/domain/contexts/community/community.visa.ts';
import type { Passport } from '../../src/domain/contexts/passport.ts';
import { CommunityCreatedEvent } from '../../src/domain/events/types/community-created.ts';
import type { CommunityPassport } from '../../src/domain/contexts/community/community.passport.ts';
import type { CommunityDomainPermissions } from '../../src/domain/contexts/community/community.domain-permissions.ts';

// Memory store for test state (Serenity approach)
const testMemory = new Map<string, any>();

// Helper functions for test memory management
const remember = (key: string, value: any) => {
  testMemory.set(key, value);
};

const recall = <T>(key: string): T => {
  return testMemory.get(key);
};

const clearMemory = () => {
  testMemory.clear();
};

// Serenity Actor - Global actor for cucumber steps
let communityAdmin: Actor;

// Serenity Tasks
class SetupCommunityCreationContext extends Task {
  static with(
    communityName: string, 
    permissions: Partial<CommunityDomainPermissions>
  ) {
    return new SetupCommunityCreationContext(communityName, permissions);
  }

  private communityName: string;
  private permissions: Partial<CommunityDomainPermissions>;
  
  constructor(communityName: string, permissions: Partial<CommunityDomainPermissions>) {
    super(`Setup community creation context for "${communityName}" with specified permissions`);
    this.communityName = communityName;
    this.permissions = permissions;
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    const expectedNewId = '12345';
    
    // Create mock objects using Jest mock functions
    const communityProps = jest.mocked({
      id: expectedNewId,
    } as CommunityProps);
    
    const createdBy = jest.mocked({} as EndUserEntityReference);
    communityProps.createdBy = createdBy;

    // Create mock community visa using Jest mock functions
    const mockCommunityVisa = jest.mocked({
      determineIf: (
        fn: (permissions: Readonly<CommunityDomainPermissions>) => boolean,
      ) => {
        return fn(this.permissions as CommunityDomainPermissions);
      },
    } as CommunityVisa);

    // Create mock passport using Jest mock functions
    const passport = jest.mocked({} as Passport);
    // @ts-expect-error - Assigning to read-only property for test mocking
    passport.community = jest.mocked({
      forCommunity: jest.fn(() => mockCommunityVisa),
    } as CommunityPassport);

    remember('communityProps', communityProps);
    remember('createdBy', createdBy);
    remember('communityName', this.communityName);
    remember('passport', passport);
    remember('expectedId', expectedNewId);

    return Promise.resolve();
  }
}

class CreateCommunity extends Task {
  static withValidData() {
    return new CreateCommunity();
  }

  constructor() {
    super(`Create a new community using valid data and proper permissions`);
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    const props = recall<CommunityProps>('communityProps');
    const communityName = recall<string>('communityName');
    const createdBy = recall<EndUserEntityReference>('createdBy');
    const passport = recall<Passport>('passport');

    try {
      const community = Community.getNewInstance(
        props,
        communityName,
        createdBy,
        passport,
      );
      remember('createdCommunity', community);
      remember('communityCreationResult', 'success');
    } catch (error) {
      remember('communityCreationError', error);
      remember('communityCreationResult', 'error');
    }

    return Promise.resolve();
  }
}

class AttemptToCreateCommunityWithInvalidName extends Task {
  static withName(invalidName: string) {
    return new AttemptToCreateCommunityWithInvalidName(invalidName);
  }

  private invalidName: string;
  
  constructor(invalidName: string) {
    super(`Attempt to create community with invalid name (${invalidName.length} characters)`);
    this.invalidName = invalidName;
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    const props = recall<CommunityProps>('communityProps');
    const createdBy = recall<EndUserEntityReference>('createdBy');
    const passport = recall<Passport>('passport');

    try {
      const community = Community.getNewInstance(
        props,
        this.invalidName,
        createdBy,
        passport,
      );
      remember('createdCommunity', community);
      remember('communityCreationResult', 'success');
    } catch (error) {
      remember('communityCreationError', error);
      remember('communityCreationResult', 'error');
    }

    return Promise.resolve();
  }
}

// Serenity Questions - Using function-based approach for better reporting
const TheCommunityCreationResult = () => 
  Question.about<string>('the result of the community creation attempt', () => {
    return recall<string>('communityCreationResult');
  });

const TheCommunityCreationError = () => 
  Question.about<Error>('the error details from the failed community creation', () => {
    return recall<Error>('communityCreationError');
  });

const TheCreatedCommunity = () => 
  Question.about<Community<CommunityProps>>('the successfully created community', () => {
    return recall<Community<CommunityProps>>('createdCommunity');
  });

const TheCommunityEvents = (eventType: any) => 
  Question.about<any[]>(`the ${eventType.name} events raised by the community`, () => {
    const community = recall<Community<CommunityProps>>('createdCommunity');
    if (!community) {
      return [];
    }
    return community.getIntegrationEvents().filter(e => e instanceof eventType);
  });

const TheExpectedCommunityId = () => 
  Question.about<string>('the expected ID for the new community', () => {
    return recall<string>('expectedId');
  });

Before(() => {
  clearMemory();
  communityAdmin = actorCalled('Community Admin');
});

Given('a community administrator with valid permissions', () => {
  remember('permissions', {
    canManageCommunitySettings: true,
  });
});

Given('a valid community name {string}', (communityName: string) => {
  remember('communityName', communityName);
});

Given('an invalid community name that is too long', () => {
  // 201 characters -> exceeds the 200 character limit
  const invalidName = 'REcK03mhSslLPAmidGzyRvc16iOyrZ9VDfgnOcTlBEZzDFlbl8FdPcpLGZXLAXJxbScF96qRhGkqnPgDWMYAHst56OZwIxVb4b8mX4FvmiqwjpY51pBG5C9EOwlWhELc7mi74z977jnaR4IpMlP3cZpUY0bkRLJAUVprG2jfHQymztv4KbQzDUcmbwjnXiBIxO9faxcV0';
  remember('communityName', invalidName);
});

Given('the required community creation context is set up', async () => {
  const communityName = recall<string>('communityName');
  const permissions = recall<Partial<CommunityDomainPermissions>>('permissions');
  
  await communityAdmin.attemptsTo(
    SetupCommunityCreationContext.with(communityName, permissions)
  );
});

When('I create a new community', async () => {
  await communityAdmin.attemptsTo(CreateCommunity.withValidData());
});

When('I attempt to create a community with the invalid name', async () => {
  const invalidName = recall<string>('communityName');
  await communityAdmin.attemptsTo(
    AttemptToCreateCommunityWithInvalidName.withName(invalidName)
  );
});

Then('the community should be created successfully', async () => {
  const result = await communityAdmin.answer(TheCommunityCreationResult());
  expect(result).toBe('success');
  
  const createdCommunity = await communityAdmin.answer(TheCreatedCommunity());
  expect(createdCommunity).toBeDefined();
});

Then('a CommunityCreatedEvent should be raised', async () => {
  const communityEvents = await communityAdmin.answer(TheCommunityEvents(CommunityCreatedEvent));
  expect(communityEvents).toHaveLength(1);
  
  const createdEvent = communityEvents[0] as CommunityCreatedEvent;
  const expectedId = await communityAdmin.answer(TheExpectedCommunityId());
  expect(createdEvent.payload.communityId).toBe(expectedId);
});

Then('the community creation should fail', async () => {
  const result = await communityAdmin.answer(TheCommunityCreationResult());
  expect(result).toBe('error');
  
  const error = await communityAdmin.answer(TheCommunityCreationError());
  expect(error).toBeDefined();
});

Then('the error should indicate the name is too long', async () => {
  const error = await communityAdmin.answer(TheCommunityCreationError());
  expect(error).toEqual(
    expect.objectContaining({
      message: expect.stringContaining('Too long'),
    })
  );
});
