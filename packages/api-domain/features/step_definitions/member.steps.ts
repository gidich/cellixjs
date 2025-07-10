import { Given, When, Then, Before } from '@cucumber/cucumber';
// Import Jest utilities and expect from compatible sources
import * as jest from 'jest-mock';
import { expect } from 'expect';
// Import Serenity-JS dependencies
import { actorCalled, Question, Task } from '@serenity-js/core';
import type { Actor, AnswersQuestions, UsesAbilities } from '@serenity-js/core';
import { Member, type MemberProps } from '../../src/domain/contexts/community/member/member.ts';
import type { CommunityEntityReference } from '../../src/domain/contexts/community/community/community.ts';
import type { CommunityVisa } from '../../src/domain/contexts/community/community.visa.ts';
import type { Passport } from '../../src/domain/contexts/passport.ts';
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
let memberAdmin: Actor;

// Serenity Tasks
class SetupMemberCreationContext extends Task {
  static with(
    memberName: string, 
    permissions: Partial<CommunityDomainPermissions>
  ) {
    return new SetupMemberCreationContext(memberName, permissions);
  }

  private memberName: string;
  private permissions: Partial<CommunityDomainPermissions>;
  
  constructor(memberName: string, permissions: Partial<CommunityDomainPermissions>) {
    super(`Setup member creation context for "${memberName}" with specified permissions`);
    this.memberName = memberName;
    this.permissions = permissions;
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    const expectedNewId = '67890';
    
    // Create mock objects using Jest mock functions
    const memberProps = jest.mocked({
      id: expectedNewId,
    } as MemberProps);
    
    const validCommunity = jest.mocked({} as CommunityEntityReference);

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

    remember('memberProps', memberProps);
    remember('validCommunity', validCommunity);
    remember('memberName', this.memberName);
    remember('passport', passport);
    remember('expectedId', expectedNewId);

    return Promise.resolve();
  }
}

class CreateMember extends Task {
  static withValidData() {
    return new CreateMember();
  }

  constructor() {
    super(`Create a new member using valid data and proper permissions`);
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    const props = recall<MemberProps>('memberProps');
    const memberName = recall<string>('memberName');
    const validCommunity = recall<CommunityEntityReference>('validCommunity');
    const passport = recall<Passport>('passport');

    try {
      const member = Member.getNewInstance(
        props,
        passport,
        memberName,
        validCommunity,
      );
      remember('createdMember', member);
      remember('memberCreationResult', 'success');
    } catch (error) {
      remember('memberCreationError', error);
      remember('memberCreationResult', 'error');
    }

    return Promise.resolve();
  }
}

class AttemptToCreateMemberWithInvalidName extends Task {
  static withName(invalidName: string) {
    return new AttemptToCreateMemberWithInvalidName(invalidName);
  }

  private invalidName: string;
  
  constructor(invalidName: string) {
    super(`Attempt to create member with invalid name (${invalidName.length} characters)`);
    this.invalidName = invalidName;
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    const props = recall<MemberProps>('memberProps');
    const validCommunity = recall<CommunityEntityReference>('validCommunity');
    const passport = recall<Passport>('passport');

    try {
      const member = Member.getNewInstance(
        props,
        passport,
        this.invalidName,
        validCommunity,
      );
      remember('createdMember', member);
      remember('memberCreationResult', 'success');
    } catch (error) {
      remember('memberCreationError', error);
      remember('memberCreationResult', 'error');
    }

    return Promise.resolve();
  }
}

class UpdateMemberProperty extends Task {
  static withEmail(email: string) {
    return new UpdateMemberProperty('email', email);
  }

  static withCybersourceId(cybersourceId: string) {
    return new UpdateMemberProperty('cybersourceId', cybersourceId);
  }

  static withMemberName(memberName: string) {
    return new UpdateMemberProperty('memberName', memberName);
  }

  static withBio(bio: string) {
    return new UpdateMemberProperty('bio', bio);
  }

  static withInterests(interests: string[]) {
    return new UpdateMemberProperty('interests', interests);
  }

  private property: string;
  private value: any;
  
  constructor(property: string, value: any) {
    super(`Update member ${property} with value: ${JSON.stringify(value)}`);
    this.property = property;
    this.value = value;
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    const member = recall<Member<MemberProps>>('createdMember');

    try {
      switch (this.property) {
        case 'email':
          member.profile.email = this.value;
          break;
        case 'cybersourceId':
          member.cybersourceCustomerId = this.value;
          break;
        case 'memberName':
          member.memberName = this.value;
          break;
        case 'bio':
          member.profile.bio = this.value;
          break;
        case 'interests':
          member.profile.interests = this.value;
          break;
        default:
          throw new Error(`Unknown property: ${this.property}`);
      }
      remember('memberUpdateResult', 'success');
    } catch (error) {
      remember('memberUpdateError', error);
      remember('memberUpdateResult', 'error');
    }

    return Promise.resolve();
  }
}

// Serenity Questions - Using function-based approach for better reporting
const TheMemberCreationResult = () => 
  Question.about<string>('the result of the member creation attempt', () => {
    return recall<string>('memberCreationResult');
  });

const TheMemberCreationError = () => 
  Question.about<Error>('the error details from the failed member creation', () => {
    return recall<Error>('memberCreationError');
  });

const TheCreatedMember = () => 
  Question.about<Member<MemberProps>>('the successfully created member', () => {
    return recall<Member<MemberProps>>('createdMember');
  });

const TheMemberUpdateResult = () => 
  Question.about<string>('the result of the member update attempt', () => {
    return recall<string>('memberUpdateResult');
  });

const TheMemberUpdateError = () => 
  Question.about<Error>('the error details from the failed member update', () => {
    return recall<Error>('memberUpdateError');
  });

Before(() => {
  clearMemory();
  memberAdmin = actorCalled('Member Admin');
});

Given('a member administrator with valid permissions', () => {
  remember('permissions', {
    canManageMembers: true,
  });
});

Given('a valid member name {string}', (memberName: string) => {
  remember('memberName', memberName);
});

Given('an invalid member name that is too long', () => {
  // 201 characters -> exceeds the 200 character limit
  const invalidName = 'x'.repeat(201);
  remember('memberName', invalidName);
});

Given('the required member creation context is set up', async () => {
  const memberName = recall<string>('memberName') || 'Default Member';
  const permissions = recall<Partial<CommunityDomainPermissions>>('permissions') || { canManageMembers: true };
  
  await memberAdmin.attemptsTo(
    SetupMemberCreationContext.with(memberName, permissions)
  );
});

Given('a created member', async () => {
  await memberAdmin.attemptsTo(CreateMember.withValidData());
});

When('I create a new member', async () => {
  await memberAdmin.attemptsTo(CreateMember.withValidData());
});

When('I attempt to create a member with the invalid name', async () => {
  const invalidName = recall<string>('memberName');
  await memberAdmin.attemptsTo(
    AttemptToCreateMemberWithInvalidName.withName(invalidName)
  );
});

When('I update the member email to {string}', async (email: string) => {
  await memberAdmin.attemptsTo(UpdateMemberProperty.withEmail(email));
});

When('I update the member cybersource ID to a {int} character string', async (length: number) => {
  const longId = 'x'.repeat(length);
  await memberAdmin.attemptsTo(UpdateMemberProperty.withCybersourceId(longId));
});

When('I update the member name to a {int} character string', async (length: number) => {
  const longName = 'x'.repeat(length);
  await memberAdmin.attemptsTo(UpdateMemberProperty.withMemberName(longName));
});

When('I update the member bio to a {int} character string', async (length: number) => {
  const longBio = 'x'.repeat(length);
  await memberAdmin.attemptsTo(UpdateMemberProperty.withBio(longBio));
});

When('I update the member interests to {int} items', async (count: number) => {
  const interests = Array(count).fill('interest') as string[];
  await memberAdmin.attemptsTo(UpdateMemberProperty.withInterests(interests));
});

Then('the member should be created successfully', async () => {
  const result = await memberAdmin.answer(TheMemberCreationResult());
  expect(result).toBe('success');
  
  const createdMember = await memberAdmin.answer(TheCreatedMember());
  expect(createdMember).toBeDefined();
});

Then('the member creation should fail', async () => {
  const result = await memberAdmin.answer(TheMemberCreationResult());
  expect(result).toBe('error');
  
  const error = await memberAdmin.answer(TheMemberCreationError());
  expect(error).toBeDefined();
});

Then('the member update should fail', async () => {
  const result = await memberAdmin.answer(TheMemberUpdateResult());
  expect(result).toBe('error');
  
  const error = await memberAdmin.answer(TheMemberUpdateError());
  expect(error).toBeDefined();
});

Then('the error should indicate the member name is too long', async () => {
  const error = await memberAdmin.answer(TheMemberCreationError());
  expect(error).toEqual(
    expect.objectContaining({
      message: expect.stringContaining('Too long'),
    })
  );
});

Then('the error should indicate the field is too long', async () => {
  const error = await memberAdmin.answer(TheMemberUpdateError());
  expect(error).toEqual(
    expect.objectContaining({
      message: expect.stringContaining('Too long'),
    })
  );
});

Then('the error should indicate the email format is invalid', async () => {
  const error = await memberAdmin.answer(TheMemberUpdateError());
  expect(error).toEqual(
    expect.objectContaining({
      message: expect.stringContaining("Value doesn't match pattern"),
    })
  );
});
