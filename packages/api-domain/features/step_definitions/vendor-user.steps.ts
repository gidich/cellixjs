import { Given, When, Then, Before } from '@cucumber/cucumber';
// Import Jest utilities and expect from compatible sources
import * as jest from 'jest-mock';
import { expect } from 'expect';
// Import Serenity-JS dependencies
import { actorCalled, Question, Task } from '@serenity-js/core';
import type { Actor, AnswersQuestions, UsesAbilities } from '@serenity-js/core';
import { VendorUser, type VendorUserProps } from '../../src/domain/contexts/user/vendor-user/vendor-user.ts';
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
let vendorUserAdmin: Actor;

// Serenity Tasks
class SetupVendorUserCreationContext extends Task {
  static with(
    externalId: string,
    lastName: string,
    restOfName: string | undefined,
    permissions: Partial<UserDomainPermissions>
  ) {
    return new SetupVendorUserCreationContext(externalId, lastName, restOfName, permissions);
  }

  private externalId: string;
  private lastName: string;
  private restOfName: string | undefined;
  private permissions: Partial<UserDomainPermissions>;
  
  constructor(externalId: string, lastName: string, restOfName: string | undefined, permissions: Partial<UserDomainPermissions>) {
    super(`Setup vendor user creation context for "${externalId} ${lastName}" with specified permissions`);
    this.externalId = externalId;
    this.lastName = lastName;
    this.restOfName = restOfName;
    this.permissions = permissions;
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    return new Promise((resolve) => {
      // Mock UserVisa
      const mockUserVisa = jest.mocked({
        determineIf: (
          fn: (permissions: Readonly<UserDomainPermissions>) => boolean,
        ) => {
          return fn(this.permissions as UserDomainPermissions);
        },
      } as UserVisa);

      // Mock Passport
      const mockPassport = jest.mocked({} as Passport);
      // @ts-expect-error - Assigning to read-only property for test mocking
      mockPassport.user = jest.mocked({
        forVendorUser: jest.fn(() => mockUserVisa),
        forEndUser: jest.fn(() => mockUserVisa),
        forStaffUser: jest.fn(() => mockUserVisa),
        forStaffRole: jest.fn(() => mockUserVisa),
      } as UserPassport);

      // Store context
      remember('externalId', this.externalId);
      remember('lastName', this.lastName);
      remember('restOfName', this.restOfName);
      remember('passport', mockPassport);
      remember('permissions', this.permissions);
      
      resolve();
    });
  }
}

class CreateVendorUser extends Task {
  static withCurrentContext() {
    return new CreateVendorUser();
  }

  constructor() {
    super('Create a new vendor user using valid data and proper permissions');
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    return new Promise((resolve) => {
      try {
        const externalId = recall<string>('externalId');
        const lastName = recall<string>('lastName');
        const restOfName = recall<string | undefined>('restOfName');
        const passport = recall<Passport>('passport');
        const userProps = jest.mocked({
          personalInformation: { contactInformation: {}, identityDetails: {} },
        } as VendorUserProps);

        const vendorUser = VendorUser.getNewUser(
          userProps,
          passport,
          externalId,
          lastName,
          restOfName
        );

        remember('vendorUser', vendorUser);
        remember('vendorUserCreationResult', 'success');
        resolve();
      } catch (error) {
        remember('vendorUserCreationError', error);
        remember('vendorUserCreationResult', 'error');
        resolve();
      }
    });
  }
}

class AttemptToCreateVendorUser extends Task {
  static withCurrentContext() {
    return new AttemptToCreateVendorUser();
  }

  constructor() {
    super('Attempt to create a new vendor user with current data');
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    return new Promise((resolve) => {
      try {
        const externalId = recall<string>('externalId');
        const lastName = recall<string>('lastName');
        const restOfName = recall<string | undefined>('restOfName');
        const passport = recall<Passport>('passport');
        const userProps = jest.mocked({
          personalInformation: { contactInformation: {}, identityDetails: {} },
        } as VendorUserProps);

        const vendorUser = VendorUser.getNewUser(
          userProps,
          passport,
          externalId,
          lastName,
          restOfName
        );

        remember('vendorUser', vendorUser);
        remember('vendorUserCreationResult', 'success');
      } catch (error) {
        remember('vendorUserCreationError', error);
        remember('vendorUserCreationResult', 'error');
      }
      resolve();
    });
  }
}

class UpdateVendorUserEmail extends Task {
  static withCurrentContext() {
    return new UpdateVendorUserEmail();
  }

  constructor() {
    super('Update vendor user email to: ' + recall<string>('newEmail'));
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    return new Promise((resolve) => {
      try {
        const vendorUser = recall<VendorUser<VendorUserProps>>('vendorUser');
        const newEmail = recall<string>('newEmail');
        
        vendorUser.email = newEmail;
        
        remember('vendorUserUpdateResult', 'success');
      } catch (error) {
        remember('vendorUserUpdateError', error);
        remember('vendorUserUpdateResult', 'error');
      }
      resolve();
    });
  }
}

class UpdateVendorUserDisplayName extends Task {
  static withCurrentContext() {
    return new UpdateVendorUserDisplayName();
  }

  constructor() {
    super('Update vendor user display name to: ' + recall<string>('newDisplayName'));
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    return new Promise((resolve) => {
      try {
        const vendorUser = recall<VendorUser<VendorUserProps>>('vendorUser');
        const newDisplayName = recall<string>('newDisplayName');
        
        vendorUser.displayName = newDisplayName;
        
        remember('vendorUserUpdateResult', 'success');
      } catch (error) {
        remember('vendorUserUpdateError', error);
        remember('vendorUserUpdateResult', 'error');
      }
      resolve();
    });
  }
}

// Serenity Questions - Using function-based approach for better reporting
const TheVendorUserCreationResult = () => 
  Question.about<string>('the result of the vendor user creation attempt', () => {
    return recall<string>('vendorUserCreationResult') || 'failed';
  });

const TheVendorUserCreationError = () => 
  Question.about<Error>('the error details from the failed vendor user creation', () => {
    return recall<Error>('vendorUserCreationError');
  });

const TheVendorUserUpdateError = () => 
  Question.about<Error>('the error details from the failed vendor user update', () => {
    return recall<Error>('vendorUserUpdateError');
  });

const TheVendorUserUpdateResult = () => 
  Question.about<string>('the result of the vendor user update attempt', () => {
    return recall<string>('vendorUserUpdateResult') || 'failed';
  });

const TheVendorUserEvents = () => 
  Question.about<any[]>('the events raised by the vendor user', () => {
    const vendorUser = recall<VendorUser<VendorUserProps>>('vendorUser');
    if (!vendorUser) {
      return [];
    }
    return [...vendorUser.getIntegrationEvents()]; // Convert readonly array to mutable array
  });

const TheVendorUserLegalNameConsistency = () => 
  Question.about<boolean>('whether the vendor user legal name consists of one name', () => {
    const vendorUser = recall<VendorUser<VendorUserProps>>('vendorUser');
    return vendorUser ? vendorUser.personalInformation.identityDetails.legalNameConsistsOfOneName : false;
  });

const TheCurrentVendorUserDisplayName = () => 
  Question.about<string>('the current vendor user display name', () => {
    const vendorUser = recall<VendorUser<VendorUserProps>>('vendorUser');
    return vendorUser ? vendorUser.displayName : '';
  });

// Cucumber Step Definitions

Before(() => {
  // Clear test memory before each scenario
  clearMemory();
});

// Given Steps
Given('a vendor user administrator with valid permissions', () => {
  vendorUserAdmin = actorCalled('Vendor User Administrator');
  remember('permissions', {
    canManageVendorUsers: true,
  });
});

Given('the required vendor user creation context is set up', async () => {
  // Default context - will be overridden by specific scenario steps
  await vendorUserAdmin.attemptsTo(
    SetupVendorUserCreationContext.with(
      'default-external-id', 
      'default-last-name',
      'default-rest-of-name',
      { canManageVendorUsers: true }
    )
  );
});

Given('a valid vendor user external ID {string}', (externalId: string) => {
  remember('externalId', externalId);
});

Given('a valid vendor user last name {string}', (lastName: string) => {
  remember('lastName', lastName);
});

Given('a valid vendor user rest of name {string}', (restOfName: string) => {
  remember('restOfName', restOfName);
});

Given('an empty vendor user rest of name', () => {
  remember('restOfName', undefined);
});

Given('an invalid vendor user external ID {string}', (invalidExternalId: string) => {
  remember('externalId', invalidExternalId);
});

Given('a vendor user rest of name that is too long', () => {
  remember('restOfName', 'x'.repeat(51));
});

Given('a vendor user last name that is too long', () => {
  remember('lastName', 'x'.repeat(51));
});

Given('a created vendor user', async () => {
  const externalId = recall<string>('externalId');
  const lastName = recall<string>('lastName');
  const restOfName = recall<string | undefined>('restOfName');
  
  // Update context with current test data
  await vendorUserAdmin.attemptsTo(
    SetupVendorUserCreationContext.with(
      externalId,
      lastName,
      restOfName,
      { canManageVendorUsers: true }
    )
  );
  
  // Create the vendor user
  await vendorUserAdmin.attemptsTo(CreateVendorUser.withCurrentContext());
});

Given('a user without vendor user management permissions', () => {
  // Create passport without proper permissions
  const mockUserVisa = jest.mocked({
    determineIf: (
      fn: (permissions: Readonly<UserDomainPermissions>) => boolean,
    ) => {
      return fn({ canManageVendorUsers: false } as UserDomainPermissions);
    },
  } as UserVisa);

  const mockPassport = jest.mocked({} as Passport);
  // @ts-expect-error - Assigning to read-only property for test mocking
  mockPassport.user = jest.mocked({
    forVendorUser: jest.fn(() => mockUserVisa),
    forEndUser: jest.fn(() => mockUserVisa),
    forStaffUser: jest.fn(() => mockUserVisa),
    forStaffRole: jest.fn(() => mockUserVisa),
  } as UserPassport);

  remember('passport', mockPassport);
  
  // Recreate the vendor user with the new passport
  const userProps = jest.mocked({
    personalInformation: { contactInformation: {}, identityDetails: {} },
  } as VendorUserProps);
  
  const vendorUser = new VendorUser(userProps, mockPassport);
  remember('vendorUser', vendorUser);
});

Given('a user with vendor user management permissions', () => {
  // Create passport with proper permissions
  const mockUserVisa = jest.mocked({
    determineIf: (
      fn: (permissions: Readonly<UserDomainPermissions>) => boolean,
    ) => {
      return fn({ canManageVendorUsers: true } as UserDomainPermissions);
    },
  } as UserVisa);

  const mockPassport = jest.mocked({} as Passport);
  // @ts-expect-error - Assigning to read-only property for test mocking
  mockPassport.user = jest.mocked({
    forVendorUser: jest.fn(() => mockUserVisa),
    forEndUser: jest.fn(() => mockUserVisa),
    forStaffUser: jest.fn(() => mockUserVisa),
    forStaffRole: jest.fn(() => mockUserVisa),
  } as UserPassport);

  remember('passport', mockPassport);
  
  // Recreate the vendor user with the new passport
  const userProps = jest.mocked({
    personalInformation: { contactInformation: {}, identityDetails: {} },
  } as VendorUserProps);
  
  const vendorUser = new VendorUser(userProps, mockPassport);
  remember('vendorUser', vendorUser);
});

// When Steps
When('I create a new vendor user', async () => {
  await vendorUserAdmin.attemptsTo(CreateVendorUser.withCurrentContext());
});

When('I attempt to create a new vendor user', async () => {
  await vendorUserAdmin.attemptsTo(AttemptToCreateVendorUser.withCurrentContext());
});

When('I update the vendor user email to {string}', async (newEmail: string) => {
  remember('newEmail', newEmail);
  await vendorUserAdmin.attemptsTo(UpdateVendorUserEmail.withCurrentContext());
});

When('I update the vendor user display name to {string}', async (newDisplayName: string) => {
  remember('newDisplayName', newDisplayName);
  await vendorUserAdmin.attemptsTo(UpdateVendorUserDisplayName.withCurrentContext());
});

When('I attempt to update the vendor user display name to {string}', async (newDisplayName: string) => {
  remember('newDisplayName', newDisplayName);
  await vendorUserAdmin.attemptsTo(UpdateVendorUserDisplayName.withCurrentContext());
});

// Then Steps
Then('the vendor user should be created successfully', async () => {
  const result = await vendorUserAdmin.answer(TheVendorUserCreationResult());
  expect(result).toBe('success');
});

Then('a VendorUserCreatedEvent should be raised', async () => {
  const events = await vendorUserAdmin.answer(TheVendorUserEvents());
  const hasVendorUserCreatedEvent = events.some(event => 
    event.constructor.name === 'VendorUserCreatedEvent'
  );
  expect(hasVendorUserCreatedEvent).toBe(true);
});

Then('the vendor user legal name should consist of multiple names', async () => {
  const consistsOfOneName = await vendorUserAdmin.answer(TheVendorUserLegalNameConsistency());
  expect(consistsOfOneName).toBe(false);
});

Then('the vendor user legal name should consist of one name', async () => {
  const consistsOfOneName = await vendorUserAdmin.answer(TheVendorUserLegalNameConsistency());
  expect(consistsOfOneName).toBe(true);
});

Then('a vendor user validation error should be thrown', async () => {
  const result = await vendorUserAdmin.answer(TheVendorUserCreationResult());
  expect(result).toBe('error');
  
  const error = await vendorUserAdmin.answer(TheVendorUserCreationError());
  expect(error).toBeDefined();
});

Then('the vendor user error message should contain {string}', async (expectedMessage: string) => {
  // First check if it's a creation error or update error
  const creationError = await vendorUserAdmin.answer(TheVendorUserCreationError());
  const updateError = await vendorUserAdmin.answer(TheVendorUserUpdateError());
  
  const error = creationError || updateError;
  expect(error).toBeTruthy();
  expect(error?.message || '').toContain(expectedMessage);
});

Then('the vendor user update should fail', async () => {
  const result = await vendorUserAdmin.answer(TheVendorUserUpdateResult());
  expect(result).toBe('error');
});

Then('the vendor user update should be successful', async () => {
  const result = await vendorUserAdmin.answer(TheVendorUserUpdateResult());
  expect(result).toBe('success');
});

Then('a vendor user permission error should be thrown', async () => {
  const updateResult = recall<string>('vendorUserUpdateResult');
  expect(updateResult).toBe('error');
  
  const error = await vendorUserAdmin.answer(TheVendorUserUpdateError());
  expect(error).toBeTruthy();
  expect(error?.constructor.name).toBe('PermissionError');
});

Then('the vendor user display name should be {string}', async (expectedDisplayName: string) => {
  const currentDisplayName = await vendorUserAdmin.answer(TheCurrentVendorUserDisplayName());
  expect(currentDisplayName).toBe(expectedDisplayName);
});
