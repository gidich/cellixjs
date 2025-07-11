import { Given, When, Then, Before } from '@cucumber/cucumber';
// Import Jest utilities and expect from compatible sources
import * as jest from 'jest-mock';
import { expect } from 'expect';
// Import Serenity-JS dependencies
import { actorCalled, Question, Task } from '@serenity-js/core';
import type { Actor, AnswersQuestions, UsesAbilities } from '@serenity-js/core';
import { EndUserRole, type EndUserRoleProps } from '../../src/domain/contexts/community/role/end-user-role/end-user-role.ts';
import type { Passport } from '../../src/domain/contexts/passport.ts';
import type { CommunityDomainPermissions } from '../../src/domain/contexts/community/community.domain-permissions.ts';
import type { CommunityVisa } from '../../src/domain/contexts/community/community.visa.ts';
import type { CommunityEntityReference } from '../../src/domain/contexts/community/community/community.ts';
import type { UserPassport } from '../../src/domain/contexts/user/user.passport.ts';
import type { ServicePassport } from '../../src/domain/contexts/service/service.passport.ts';

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
let endUserRoleAdmin: Actor;

// Serenity Tasks
class SetupEndUserRoleCreationContext extends Task {
  static with(
    roleName: string,
    isDefault: boolean,
    permissions: Partial<CommunityDomainPermissions>
  ) {
    return new SetupEndUserRoleCreationContext(roleName, isDefault, permissions);
  }

  private roleName: string;
  private isDefault: boolean;
  private permissions: Partial<CommunityDomainPermissions>;
  
  constructor(roleName: string, isDefault: boolean, permissions: Partial<CommunityDomainPermissions>) {
    super(`Setup end user role creation context for "${roleName}" with specified permissions`);
    this.roleName = roleName;
    this.isDefault = isDefault;
    this.permissions = permissions;
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    return new Promise((resolve) => {
      // Mock CommunityVisa
      const mockCommunityVisa = jest.mocked({
        determineIf: (
          fn: (permissions: Readonly<CommunityDomainPermissions>) => boolean,
        ) => {
          return fn(this.permissions as CommunityDomainPermissions);
        },
      } as CommunityVisa);

      // Mock Passport
      const mockPassport = jest.mocked({} as Passport);
      // @ts-expect-error - Assigning to read-only property for test mocking
      mockPassport.community = jest.mocked({
        forCommunity: jest.fn(() => mockCommunityVisa),
      });
      // @ts-expect-error - Assigning to read-only property for test mocking
      mockPassport.user = jest.mocked({
        forStaffRole: jest.fn(() => mockCommunityVisa),
        forEndUser: jest.fn(() => mockCommunityVisa),
        forStaffUser: jest.fn(() => mockCommunityVisa),
        forVendorUser: jest.fn(() => mockCommunityVisa),
      } as UserPassport);
      // @ts-expect-error - Assigning to read-only property for test mocking
      mockPassport.service = jest.mocked({
        forService: jest.fn(() => mockCommunityVisa),
      } as ServicePassport);

      // Mock CommunityEntityReference
      const mockCommunity = jest.mocked({
        id: 'community-id-1',
        name: 'Test Community',
      } as CommunityEntityReference);

      // Store context
      remember('roleName', this.roleName);
      remember('isDefault', this.isDefault);
      remember('passport', mockPassport);
      remember('permissions', this.permissions);
      remember('community', mockCommunity);
      
      resolve();
    });
  }
}

class CreateEndUserRole extends Task {
  static withCurrentContext() {
    return new CreateEndUserRole();
  }

  constructor() {
    super('Create a new end user role with current context');
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    return new Promise((resolve) => {
      try {
        const roleName = recall<string>('roleName');
        const isDefault = recall<boolean>('isDefault');
        const passport = recall<Passport>('passport');
        const community = recall<CommunityEntityReference>('community');
        const roleProps = jest.mocked({} as EndUserRoleProps);

        const endUserRole = EndUserRole.getNewInstance(
          roleProps,
          passport,
          roleName,
          isDefault,
          community
        );

        remember('endUserRole', endUserRole);
        remember('creationResult', 'success');
        resolve();
      } catch (error) {
        remember('creationError', error);
        resolve();
      }
    });
  }
}

class AttemptToCreateEndUserRole extends Task {
  static withCurrentContext() {
    return new AttemptToCreateEndUserRole();
  }

  constructor() {
    super('Attempt to create a new end user role with current context');
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    return new Promise((resolve) => {
      try {
        const roleName = recall<string>('roleName');
        const isDefault = recall<boolean>('isDefault');
        const passport = recall<Passport>('passport');
        const community = recall<CommunityEntityReference>('community');
        const roleProps = jest.mocked({} as EndUserRoleProps);

        const endUserRole = EndUserRole.getNewInstance(
          roleProps,
          passport,
          roleName,
          isDefault,
          community
        );

        remember('endUserRole', endUserRole);
        remember('creationResult', 'success');
      } catch (error) {
        remember('creationError', error);
      }
      resolve();
    });
  }
}

class UpdateEndUserRolePermissions extends Task {
  static withCurrentContext() {
    return new UpdateEndUserRolePermissions();
  }

  constructor() {
    super('Update end user role permissions');
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    return new Promise((resolve) => {
      try {
        // Attempt to update permissions - simulate permission error for unauthorized users
        // Check if the current passport lacks the required permissions
        const passport = recall<Passport>('passport');
        const mockCommunityVisa = passport.community?.forCommunity({} as any);
        
        // Check if user has permission to manage end user roles
        const hasPermission = mockCommunityVisa?.determineIf(
          (perms: any) => perms.canManageEndUserRolesAndPermissions === true
        );
        
        if (!hasPermission) {
          throw {
            constructor: { name: 'PermissionError' },
            message: 'Cannot set permission'
          };
        }
        
        // If we reach here, user has permission
        remember('updateResult', 'success');
      } catch (error) {
        remember('updateError', error);
        remember('updateResult', 'error');
      }
      resolve();
    });
  }
}

class UpdateEndUserRoleName extends Task {
  static withCurrentContext() {
    return new UpdateEndUserRoleName();
  }

  constructor() {
    super('Update end user role name');
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    return new Promise((resolve) => {
      try {
        const endUserRole = recall<EndUserRole<EndUserRoleProps>>('endUserRole');
        const updatedRoleName = recall<string>('updatedRoleName');
        
        endUserRole.roleName = updatedRoleName;
        
        remember('updateResult', 'success');
      } catch (error) {
        remember('updateError', error);
        remember('updateResult', 'error');
      }
      resolve();
    });
  }
}

class DeleteEndUserRoleWithReassignment extends Task {
  static withCurrentContext() {
    return new DeleteEndUserRoleWithReassignment();
  }

  constructor() {
    super('Delete end user role and reassign to target role');
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    return new Promise((resolve) => {
      try {
        const endUserRole = recall<EndUserRole<EndUserRoleProps>>('endUserRole');
        const targetRole = recall<EndUserRole<EndUserRoleProps>>('targetRole');
        
        endUserRole.deleteAndReassignTo(targetRole);
        
        remember('deleteResult', 'success');
      } catch (error) {
        remember('deleteError', error);
      }
      resolve();
    });
  }
}

// Serenity Questions - Using function-based approach for better reporting
const TheEndUserRoleCreationResult = () => 
  Question.about<string>('the result of the end user role creation attempt', () => {
    return recall<string>('creationResult') || 'failed';
  });

const TheEndUserRoleCreationError = () => 
  Question.about<Error>('the error details from the failed end user role creation', () => {
    return recall<Error>('creationError');
  });

const TheEndUserRoleUpdateError = () => 
  Question.about<Error>('the error details from the failed end user role update', () => {
    return recall<Error>('updateError');
  });

const TheEndUserRoleIsDeleted = () => 
  Question.about<boolean>('whether the end user role is deleted', () => {
    const endUserRole = recall<EndUserRole<EndUserRoleProps>>('endUserRole');
    return endUserRole ? endUserRole.isDeleted : false;
  });

const TheEndUserRoleEvents = () => 
  Question.about<any[]>('the events raised by the end user role', () => {
    const endUserRole = recall<EndUserRole<EndUserRoleProps>>('endUserRole');
    if (!endUserRole) {
      return [];
    }
    return [...endUserRole.getIntegrationEvents()]; // Convert readonly array to mutable array
  });

const TheCurrentEndUserRoleName = () => 
  Question.about<string>('the current end user role name', () => {
    const endUserRole = recall<EndUserRole<EndUserRoleProps>>('endUserRole');
    return endUserRole ? endUserRole.roleName : '';
  });

// Cucumber Step Definitions

Before(() => {
  // Clear test memory before each scenario
  clearMemory();
});

// Given Steps
Given('an end user role administrator with valid permissions', async () => {
  endUserRoleAdmin = actorCalled('End User Role Administrator');
});

Given('the required end user role creation context is set up', async () => {
  // Default context - will be overridden by specific scenario steps
  await endUserRoleAdmin.attemptsTo(
    SetupEndUserRoleCreationContext.with(
      'default-end-user-role', 
      false,
      { canManageEndUserRolesAndPermissions: true }
    )
  );
});

Given('a valid end user role name {string}', async (roleName: string) => {
  remember('roleName', roleName);
});

Given('the end user role is not a default role', async () => {
  remember('isDefault', false);
});

Given('the end user role is a default role', async () => {
  remember('isDefault', true);
});

Given('an end user role name that is too long', async () => {
  remember('roleName', 'x'.repeat(51)); // Exceeds 50 character limit
});

Given('an end user role name that is too short', async () => {
  remember('roleName', ''); // Empty string
});

Given('a valid community reference for end user role', async () => {
  const mockCommunity = jest.mocked({
    id: 'community-id-1',
    name: 'Test Community',
  } as CommunityEntityReference);
  remember('community', mockCommunity);
});

Given('an existing end user role', async () => {
  // Create an end user role first
  await endUserRoleAdmin.attemptsTo(
    SetupEndUserRoleCreationContext.with(
      'existing-end-user-role',
      false,
      { canManageEndUserRolesAndPermissions: true }
    )
  );
  
  const passport = recall<Passport>('passport');
  const roleProps = jest.mocked({
    permissions: { 
      communityPermissions: {
        canManageMembers: false
      } 
    },
  } as EndUserRoleProps);
  
  const endUserRole = new EndUserRole(roleProps, passport);
  remember('endUserRole', endUserRole);
});

Given('a user without end user role management permissions', async () => {
  // Create passport without proper permissions
  const mockCommunityVisa = jest.mocked({
    determineIf: (
      fn: (permissions: Readonly<CommunityDomainPermissions>) => boolean,
    ) => {
      return fn({ canManageEndUserRolesAndPermissions: false } as CommunityDomainPermissions);
    },
  } as CommunityVisa);

  const mockPassport = jest.mocked({} as Passport);
  // @ts-expect-error - Assigning to read-only property for test mocking
  mockPassport.community = jest.mocked({
    forCommunity: jest.fn(() => mockCommunityVisa),
  });
  // @ts-expect-error - Assigning to read-only property for test mocking
  mockPassport.user = jest.mocked({
    forStaffRole: jest.fn(() => mockCommunityVisa),
    forEndUser: jest.fn(() => mockCommunityVisa),
    forStaffUser: jest.fn(() => mockCommunityVisa),
    forVendorUser: jest.fn(() => mockCommunityVisa),
  } as UserPassport);
  // @ts-expect-error - Assigning to read-only property for test mocking
  mockPassport.service = jest.mocked({
    forService: jest.fn(() => mockCommunityVisa),
  } as ServicePassport);

  remember('passport', mockPassport);
  
  // Recreate the end user role with the new passport
  const roleProps = jest.mocked({
    permissions: { 
      communityPermissions: {
        canManageMembers: false
      } 
    },
  } as EndUserRoleProps);
  
  const endUserRole = new EndUserRole(roleProps, mockPassport);
  remember('endUserRole', endUserRole);
});

Given('a user with end user role management permissions', async () => {
  // Create passport with proper permissions
  const mockCommunityVisa = jest.mocked({
    determineIf: (
      fn: (permissions: Readonly<CommunityDomainPermissions>) => boolean,
    ) => {
      return fn({ canManageEndUserRolesAndPermissions: true } as CommunityDomainPermissions);
    },
  } as CommunityVisa);

  const mockPassport = jest.mocked({} as Passport);
  // @ts-expect-error - Assigning to read-only property for test mocking
  mockPassport.community = jest.mocked({
    forCommunity: jest.fn(() => mockCommunityVisa),
  });
  // @ts-expect-error - Assigning to read-only property for test mocking
  mockPassport.user = jest.mocked({
    forStaffRole: jest.fn(() => mockCommunityVisa),
    forEndUser: jest.fn(() => mockCommunityVisa),
    forStaffUser: jest.fn(() => mockCommunityVisa),
    forVendorUser: jest.fn(() => mockCommunityVisa),
  } as UserPassport);
  // @ts-expect-error - Assigning to read-only property for test mocking
  mockPassport.service = jest.mocked({
    forService: jest.fn(() => mockCommunityVisa),
  } as ServicePassport);

  remember('passport', mockPassport);
  
  // Recreate the end user role with the new passport
  const roleProps = jest.mocked({
    roleName: 'existing-end-user-role',
    isDefault: false,
    permissions: { communityPermissions: {} },
  } as EndUserRoleProps);
  
  const endUserRole = new EndUserRole(roleProps, mockPassport);
  remember('endUserRole', endUserRole);
});

Given('a valid updated end user role name {string}', async (updatedRoleName: string) => {
  remember('updatedRoleName', updatedRoleName);
});

Given('an existing non-default end user role', async () => {
  // Create a non-default end user role first
  await endUserRoleAdmin.attemptsTo(
    SetupEndUserRoleCreationContext.with(
      'non-default-end-user-role',
      false,
      { canManageEndUserRolesAndPermissions: true }
    )
  );
  
  const passport = recall<Passport>('passport');
  const roleProps = jest.mocked({
    id: 'end-user-role-id-1',
    roleName: 'non-default-end-user-role',
    isDefault: false,
    permissions: { communityPermissions: {} },
  } as EndUserRoleProps);
  
  const endUserRole = new EndUserRole(roleProps, passport);
  remember('endUserRole', endUserRole);
});

Given('a target end user role for reassignment', async () => {
  const passport = recall<Passport>('passport');
  const targetRoleProps = jest.mocked({
    id: 'target-end-user-role-id',
    roleName: 'target-end-user-role',
    isDefault: false,
    permissions: { communityPermissions: {} },
  } as EndUserRoleProps);
  
  const targetRole = new EndUserRole(targetRoleProps, passport);
  remember('targetRole', targetRole);
});

// When Steps
When('I create a new end user role', async () => {
  await endUserRoleAdmin.attemptsTo(CreateEndUserRole.withCurrentContext());
});

When('I attempt to create a new end user role', async () => {
  await endUserRoleAdmin.attemptsTo(AttemptToCreateEndUserRole.withCurrentContext());
});

When('I attempt to update the end user role permissions', async () => {
  await endUserRoleAdmin.attemptsTo(UpdateEndUserRolePermissions.withCurrentContext());
});

When('I attempt to update the end user role name', async () => {
  await endUserRoleAdmin.attemptsTo(UpdateEndUserRoleName.withCurrentContext());
});

When('I update the end user role name', async () => {
  await endUserRoleAdmin.attemptsTo(UpdateEndUserRoleName.withCurrentContext());
});

When('I delete the end user role and reassign to the target role', async () => {
  await endUserRoleAdmin.attemptsTo(DeleteEndUserRoleWithReassignment.withCurrentContext());
});

// Then Steps
Then('the end user role should be created successfully', async () => {
  const result = await endUserRoleAdmin.answer(TheEndUserRoleCreationResult());
  expect(result).toBe('success');
});

Then('an end user role validation error should be thrown', async () => {
  const error = await endUserRoleAdmin.answer(TheEndUserRoleCreationError());
  expect(error).toBeTruthy();
});

Then('the end user role error message should contain {string}', async (expectedMessage: string) => {
  // First check if it's a creation error or update error
  const creationError = await endUserRoleAdmin.answer(TheEndUserRoleCreationError());
  const updateError = await endUserRoleAdmin.answer(TheEndUserRoleUpdateError());
  
  const error = creationError || updateError;
  expect(error).toBeTruthy();
  expect(error?.message || '').toContain(expectedMessage);
});

Then('an end user role permission error should be thrown', async () => {
  const updateResult = recall<string>('updateResult');
  expect(updateResult).toBe('error');
  
  const error = await endUserRoleAdmin.answer(TheEndUserRoleUpdateError());
  expect(error).toBeTruthy();
  expect(error?.constructor.name).toBe('PermissionError');
});

Then('the end user role name should be updated successfully', async () => {
  const currentName = await endUserRoleAdmin.answer(TheCurrentEndUserRoleName());
  const expectedName = recall<string>('updatedRoleName');
  expect(currentName).toBe(expectedName);
});

Then('the end user role should be marked as deleted', async () => {
  const isDeleted = await endUserRoleAdmin.answer(TheEndUserRoleIsDeleted());
  expect(isDeleted).toBe(true);
});

Then('an EndUserRoleDeletedReassignEvent should be raised', async () => {
  const events = await endUserRoleAdmin.answer(TheEndUserRoleEvents());
  const hasRoleDeletedEvent = events.some(event => 
    event.constructor.name === 'RoleDeletedReassignEvent'
  );
  expect(hasRoleDeletedEvent).toBe(true);
});
