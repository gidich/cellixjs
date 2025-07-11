import { Given, When, Then, Before } from '@cucumber/cucumber';
// Import Jest utilities and expect from compatible sources
import * as jest from 'jest-mock';
import { expect } from 'expect';
// Import Serenity-JS dependencies
import { actorCalled, Question, Task } from '@serenity-js/core';
import type { Actor, AnswersQuestions, UsesAbilities } from '@serenity-js/core';
import { StaffUser, type StaffUserProps } from '../../src/domain/contexts/user/staff-user/staff-user.ts';
import { StaffUserCreatedEvent } from '../../src/domain/events/types/staff-user-created.ts';
import type { Passport } from '../../src/domain/contexts/passport.ts';
import type { UserDomainPermissions } from '../../src/domain/contexts/user/user.domain-permissions.ts';
import type { UserVisa } from '../../src/domain/contexts/user/user.visa.ts';
import type { UserPassport } from '../../src/domain/contexts/user/user.passport.ts';

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
let staffUserAdmin: Actor;

// Serenity Tasks
class SetupStaffUserCreationContext extends Task {
  static with(
    externalId: string,
    firstName: string,
    lastName: string,
    email: string,
    permissions: Partial<UserDomainPermissions>
  ) {
    return new SetupStaffUserCreationContext(externalId, firstName, lastName, email, permissions);
  }

  private externalId: string;
  private firstName: string;
  private lastName: string;
  private email: string;
  private permissions: Partial<UserDomainPermissions>;
  
  constructor(
    externalId: string,
    firstName: string,
    lastName: string,
    email: string,
    permissions: Partial<UserDomainPermissions>
  ) {
    super(`Setup staff user creation context for "${firstName} ${lastName}" with specified permissions`);
    this.externalId = externalId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.permissions = permissions;
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    const expectedNewId = '12345';
    
    // Create mock objects using Jest mock functions
    const userProps = jest.mocked({
      id: expectedNewId,
      setRoleRef: jest.fn(),
      firstName: '',
      lastName: '',
      email: '',
      displayName: '',
      externalId: '',
      accessBlocked: false,
      tags: [],
      userType: 'staff',
      createdAt: new Date(),
      updatedAt: new Date(),
      schemaVersion: '1.0.0'
    } as StaffUserProps);

    // Create mock user visa using Jest mock functions
    const mockUserVisa = jest.mocked({
      determineIf: (
        fn: (permissions: Readonly<UserDomainPermissions>) => boolean,
      ) => {
        return fn(this.permissions as UserDomainPermissions);
      },
    } as UserVisa);

    // Create mock passport using Jest mock functions
    const passport = jest.mocked({
      user: {
        forStaffRole: jest.fn(() => mockUserVisa),
        forEndUser: jest.fn(() => mockUserVisa),
        forStaffUser: jest.fn(() => mockUserVisa),
        forVendorUser: jest.fn(() => mockUserVisa),
      },
      community: {} as Passport['community'],
      service: {} as Passport['service'],
    } as Passport);

    remember('userProps', userProps);
    remember('externalId', this.externalId);
    remember('firstName', this.firstName);
    remember('lastName', this.lastName);
    remember('email', this.email);
    remember('passport', passport);
    remember('expectedId', expectedNewId);

    return Promise.resolve();
  }
}

class CreateStaffUser extends Task {
  static withValidData() {
    return new CreateStaffUser();
  }

  constructor() {
    super(`Create a new staff user using valid data and proper permissions`);
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    const props = recall<StaffUserProps>('userProps');
    const passport = recall<Passport>('passport');
    const externalId = recall<string>('externalId');
    const firstName = recall<string>('firstName');
    const lastName = recall<string>('lastName');
    const email = recall<string>('email');

    try {
      const staffUser = StaffUser.getNewUser(
        props,
        passport,
        externalId,
        firstName,
        lastName,
        email,
      );
      remember('createdStaffUser', staffUser);
      remember('staffUserCreationResult', 'success');
    } catch (error) {
      remember('staffUserCreationError', error);
      remember('staffUserCreationResult', 'error');
    }

    return Promise.resolve();
  }
}

class AttemptToCreateStaffUser extends Task {
  static withCurrentData() {
    return new AttemptToCreateStaffUser();
  }

  constructor() {
    super(`Attempt to create a new staff user with current data`);
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    const props = recall<StaffUserProps>('userProps');
    const passport = recall<Passport>('passport');
    const externalId = recall<string>('externalId');
    const firstName = recall<string>('firstName');
    const lastName = recall<string>('lastName');
    const email = recall<string>('email');

    try {
      const staffUser = StaffUser.getNewUser(
        props,
        passport,
        externalId,
        firstName,
        lastName,
        email,
      );
      remember('createdStaffUser', staffUser);
      remember('staffUserCreationResult', 'success');
    } catch (error) {
      remember('staffUserCreationError', error);
      remember('staffUserCreationResult', 'error');
    }

    return Promise.resolve();
  }
}

class UpdateStaffUserEmail extends Task {
  static withEmail(email: string) {
    return new UpdateStaffUserEmail(email);
  }

  private email: string;
  
  constructor(email: string) {
    super(`Update staff user email to: ${email}`);
    this.email = email;
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    const staffUser = recall<StaffUser<StaffUserProps>>('createdStaffUser');

    try {
      staffUser.email = this.email;
      remember('staffUserUpdateResult', 'success');
    } catch (error) {
      remember('staffUserUpdateError', error);
      remember('staffUserUpdateResult', 'error');
    }

    return Promise.resolve();
  }
}

class UpdateStaffUserFirstName extends Task {
  static withFirstName(firstName: string) {
    return new UpdateStaffUserFirstName(firstName);
  }

  private firstName: string;
  
  constructor(firstName: string) {
    super(`Update staff user first name to: ${firstName}`);
    this.firstName = firstName;
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    const staffUser = recall<StaffUser<StaffUserProps>>('createdStaffUser');

    try {
      staffUser.firstName = this.firstName;
      remember('staffUserUpdateResult', 'success');
    } catch (error) {
      remember('staffUserUpdateError', error);
      remember('staffUserUpdateResult', 'error');
    }

    return Promise.resolve();
  }
}

// Serenity Questions - Using function-based approach for better reporting
const TheStaffUserCreationResult = () => 
  Question.about<string>('the result of the staff user creation attempt', () => {
    return recall<string>('staffUserCreationResult');
  });

const TheStaffUserCreationError = () => 
  Question.about<Error>('the error details from the failed staff user creation', () => {
    return recall<Error>('staffUserCreationError');
  });

const TheStaffUserUpdateResult = () => 
  Question.about<string>('the result of the staff user update attempt', () => {
    return recall<string>('staffUserUpdateResult');
  });

const TheStaffUserUpdateError = () => 
  Question.about<Error>('the error details from the failed staff user update', () => {
    return recall<Error>('staffUserUpdateError');
  });

const TheCreatedStaffUser = () => 
  Question.about<StaffUser<StaffUserProps>>('the successfully created staff user', () => {
    return recall<StaffUser<StaffUserProps>>('createdStaffUser');
  });

const TheStaffUserEvents = (eventType: any) => 
  Question.about<any[]>(`the ${eventType.name} events raised by the staff user`, () => {
    const staffUser = recall<StaffUser<StaffUserProps>>('createdStaffUser');
    if (!staffUser) {
      return [];
    }
    return [...staffUser.getIntegrationEvents()].filter(e => e instanceof eventType);
  });

const TheExpectedStaffUserId = () => 
  Question.about<string>('the expected ID for the new staff user', () => {
    return recall<string>('expectedId');
  });

const TheStaffUserFirstName = () => 
  Question.about<string>('the staff user first name', () => {
    const staffUser = recall<StaffUser<StaffUserProps>>('createdStaffUser');
    return staffUser ? staffUser.firstName : '';
  });

Before(() => {
  clearMemory();
  staffUserAdmin = actorCalled('Staff User Admin');
});

Given('a staff user administrator with valid permissions', () => {
  remember('permissions', {
    canManageStaffRolesAndPermissions: true,
  });
});

Given('a valid staff user external ID {string}', (externalId: string) => {
  remember('externalId', externalId);
});

Given('a valid staff user first name {string}', (firstName: string) => {
  remember('firstName', firstName);
});

Given('a valid staff user last name {string}', (lastName: string) => {
  remember('lastName', lastName);
});

Given('a valid staff user email {string}', (email: string) => {
  remember('email', email);
});

Given('an invalid staff user external ID {string}', (invalidExternalId: string) => {
  remember('externalId', invalidExternalId);
});

Given('a first name that is too long', () => {
  // 501 characters -> exceeds the limit
  const invalidFirstName = 'U3edLYh3jCG6qVcJyp4VYbWVBHCD72tEWxveuKM52pp5VV77otbhztgp5HJrvRshhHxjxDTiWEsuskVBFKd2WosKOvBCvXHZMy0sE7iXzLA9q8m6vevUK0UUnUsImby5uuun3R1LbjsQucbLO9R1GLnvYBWBbvVbpT6Wycq4JDfJWfjamxLmCqxjlhFMyUDMm2XMvkKdBVfYVJ9zx13HInjGSliPOgY5Ab3gVTx0r7v6VJ5gOxfoe762uemL9u3LvNvQaR89UgopJEwIYe3UanhkqXshFxK9Ryk7C38KLRzrTqbsfLedIISlBlrGaIQlWw44ehMaFx1D7eupzO49NQn5gCMiZN3lVwK1P6Ipq2w8hLjDY17rjLYo9HIF1cTVXzIB01n7ecQfP5YB7nIAT8uFEV34RPRCS3OU6WSLuFkOeC1xb2ssMATDvRfBiuZr9yraH43jipwV3QE2g3q3FrTGvmhZrrjjjedmj0iqpRGGHZRN9z9jU';
  remember('firstName', invalidFirstName);
});

Given('a last name that is too long', () => {
  // 501 characters -> exceeds the limit
  const invalidLastName = 'U3edLYh3jCG6qVcJyp4VYbWVBHCD72tEWxveuKM52pp5VV77otbhztgp5HJrvRshhHxjxDTiWEsuskVBFKd2WosKOvBCvXHZMy0sE7iXzLA9q8m6vevUK0UUnUsImby5uuun3R1LbjsQucbLO9R1GLnvYBWBbvVbpT6Wycq4JDfJWfjamxLmCqxjlhFMyUDMm2XMvkKdBVfYVJ9zx13HInjGSliPOgY5Ab3gVTx0r7v6VJ5gOxfoe762uemL9u3LvNvQaR89UgopJEwIYe3UanhkqXshFxK9Ryk7C38KLRzrTqbsfLedIISlBlrGaIQlWw44ehMaFx1D7eupzO49NQn5gCMiZN3lVwK1P6Ipq2w8hLjDY17rjLYo9HIF1cTVXzIB01n7ecQfP5YB7nIAT8uFEV34RPRCS3OU6WSLuFkOeC1xb2ssMATDvRfBiuZr9yraH43jipwV3QE2g3q3FrTGvmhZrrjjjedmj0iqpRGGHZRN9z9jU';
  remember('lastName', invalidLastName);
});

Given('the required staff user creation context is set up', async () => {
  const externalId = recall<string>('externalId');
  const firstName = recall<string>('firstName');
  const lastName = recall<string>('lastName');
  const email = recall<string>('email');
  const permissions = recall<Partial<UserDomainPermissions>>('permissions');
  
  await staffUserAdmin.attemptsTo(
    SetupStaffUserCreationContext.with(externalId, firstName, lastName, email, permissions)
  );
});

Given('a created staff user', async () => {
  await staffUserAdmin.attemptsTo(CreateStaffUser.withValidData());
});

Given('a user without staff user management permissions', async () => {
  // Create passport without proper permissions
  const mockUserVisa = jest.mocked({
    determineIf: (
      fn: (permissions: Readonly<UserDomainPermissions>) => boolean,
    ) => {
      return fn({ canManageStaffRolesAndPermissions: false } as UserDomainPermissions);
    },
  } as UserVisa);

  const mockPassport = jest.mocked({
    user: {
      forStaffRole: jest.fn(() => mockUserVisa),
      forEndUser: jest.fn(() => mockUserVisa),
      forStaffUser: jest.fn(() => mockUserVisa),
      forVendorUser: jest.fn(() => mockUserVisa),
    },
    community: {} as Passport['community'],
    service: {} as Passport['service'],
  } as Passport);

  remember('passport', mockPassport);
  
  // Recreate the staff user with the new passport
  const props = recall<StaffUserProps>('userProps');
  const staffUser = new StaffUser(props, mockPassport);
  remember('createdStaffUser', staffUser);
});

Given('a user with staff user management permissions', async () => {
  // Create passport with proper permissions
  const mockUserVisa = jest.mocked({
    determineIf: (
      fn: (permissions: Readonly<UserDomainPermissions>) => boolean,
    ) => {
      return fn({ canManageStaffRolesAndPermissions: true } as UserDomainPermissions);
    },
  } as UserVisa);

  const mockPassport = jest.mocked({
    user: {
      forStaffRole: jest.fn(() => mockUserVisa),
      forEndUser: jest.fn(() => mockUserVisa),
      forStaffUser: jest.fn(() => mockUserVisa),
      forVendorUser: jest.fn(() => mockUserVisa),
    },
    community: {} as Passport['community'],
    service: {} as Passport['service'],
  } as Passport);

  remember('passport', mockPassport);
  
  // Recreate the staff user with the new passport
  const props = recall<StaffUserProps>('userProps');
  const staffUser = new StaffUser(props, mockPassport);
  remember('createdStaffUser', staffUser);
});

When('I create a new staff user', async () => {
  await staffUserAdmin.attemptsTo(CreateStaffUser.withValidData());
});

When('I attempt to create a new staff user', async () => {
  await staffUserAdmin.attemptsTo(AttemptToCreateStaffUser.withCurrentData());
});

When('I update the staff user email to {string}', async (email: string) => {
  await staffUserAdmin.attemptsTo(
    UpdateStaffUserEmail.withEmail(email)
  );
});

When('I attempt to update the staff user first name to {string}', async (firstName: string) => {
  await staffUserAdmin.attemptsTo(
    UpdateStaffUserFirstName.withFirstName(firstName)
  );
});

When('I update the staff user first name to {string}', async (firstName: string) => {
  await staffUserAdmin.attemptsTo(
    UpdateStaffUserFirstName.withFirstName(firstName)
  );
});

Then('the staff user should be created successfully', async () => {
  const result = await staffUserAdmin.answer(TheStaffUserCreationResult());
  expect(result).toBe('success');
  
  const createdStaffUser = await staffUserAdmin.answer(TheCreatedStaffUser());
  expect(createdStaffUser).toBeDefined();
});

Then('a StaffUserCreatedEvent should be raised', async () => {
  const staffUserEvents = await staffUserAdmin.answer(TheStaffUserEvents(StaffUserCreatedEvent));
  expect(staffUserEvents).toHaveLength(1);
  
  const createdEvent = staffUserEvents[0] as StaffUserCreatedEvent;
  const expectedId = await staffUserAdmin.answer(TheExpectedStaffUserId());
  expect(createdEvent.aggregateId).toBe(expectedId);
});

Then('a staff user validation error should be thrown', async () => {
  const result = await staffUserAdmin.answer(TheStaffUserCreationResult());
  expect(result).toBe('error');
  
  const error = await staffUserAdmin.answer(TheStaffUserCreationError());
  expect(error).toBeDefined();
});

Then('the staff user error message should contain {string}', async (expectedMessage: string) => {
  // First check if it's a creation error or update error
  const creationError = await staffUserAdmin.answer(TheStaffUserCreationError());
  const updateError = await staffUserAdmin.answer(TheStaffUserUpdateError());
  
  const error = creationError || updateError;
  expect(error).toBeTruthy();
  expect(error?.message || '').toContain(expectedMessage);
});

Then('the staff user update should fail', async () => {
  const result = await staffUserAdmin.answer(TheStaffUserUpdateResult());
  expect(result).toBe('error');
  
  const error = await staffUserAdmin.answer(TheStaffUserUpdateError());
  expect(error).toBeDefined();
});

Then('the staff user update should be successful', async () => {
  const result = await staffUserAdmin.answer(TheStaffUserUpdateResult());
  expect(result).toBe('success');
});

Then('a staff user permission error should be thrown', async () => {
  const updateResult = recall<string>('staffUserUpdateResult');
  expect(updateResult).toBe('error');
  
  const error = await staffUserAdmin.answer(TheStaffUserUpdateError());
  expect(error).toBeTruthy();
  expect(error?.constructor.name).toBe('PermissionError');
});

Then('the staff user first name should be {string}', async (expectedFirstName: string) => {
  const currentFirstName = await staffUserAdmin.answer(TheStaffUserFirstName());
  expect(currentFirstName).toBe(expectedFirstName);
});
