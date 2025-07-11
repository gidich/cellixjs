import { Given, When, Then, Before } from '@cucumber/cucumber';
// Import Jest utilities and expect from compatible sources
import * as jest from 'jest-mock';
import { expect } from 'expect';
// Import Serenity-JS dependencies
import { actorCalled, Question, Task } from '@serenity-js/core';
import type { Actor, AnswersQuestions, UsesAbilities } from '@serenity-js/core';
import { StaffRole, type StaffRoleProps } from '../../src/domain/contexts/user/staff-role/staff-role.ts';
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
let staffAdmin: Actor;

// Serenity Tasks
class SetupStaffRoleCreationContext extends Task {
  static with(
    roleName: string,
    isDefault: boolean,
    permissions: Partial<UserDomainPermissions>
  ) {
    return new SetupStaffRoleCreationContext(roleName, isDefault, permissions);
  }

  private roleName: string;
  private isDefault: boolean;
  private permissions: Partial<UserDomainPermissions>;
  
  constructor(roleName: string, isDefault: boolean, permissions: Partial<UserDomainPermissions>) {
    super(`Setup staff role creation context for "${roleName}" with specified permissions`);
    this.roleName = roleName;
    this.isDefault = isDefault;
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
        forStaffRole: jest.fn(() => mockUserVisa),
        forEndUser: jest.fn(() => mockUserVisa),
        forStaffUser: jest.fn(() => mockUserVisa),
        forVendorUser: jest.fn(() => mockUserVisa),
      } as UserPassport);

      // Store context
      remember('roleName', this.roleName);
      remember('isDefault', this.isDefault);
      remember('passport', mockPassport);
      remember('permissions', this.permissions);
      
      resolve();
    });
  }
}

class CreateStaffRole extends Task {
  static withCurrentContext() {
    return new CreateStaffRole();
  }

  constructor() {
    super('Create a new staff role with current context');
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    return new Promise((resolve) => {
      try {
        const roleName = recall<string>('roleName');
        const isDefault = recall<boolean>('isDefault');
        const passport = recall<Passport>('passport');
        const roleProps = jest.mocked({} as StaffRoleProps);

        const staffRole = StaffRole.getNewInstance(
          roleProps,
          passport,
          roleName,
          isDefault
        );

        remember('staffRole', staffRole);
        remember('creationResult', 'success');
        resolve();
      } catch (error) {
        remember('creationError', error);
        resolve();
      }
    });
  }
}

class AttemptToCreateStaffRole extends Task {
  static withCurrentContext() {
    return new AttemptToCreateStaffRole();
  }

  constructor() {
    super('Attempt to create a new staff role with current context');
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    return new Promise((resolve) => {
      try {
        const roleName = recall<string>('roleName');
        const isDefault = recall<boolean>('isDefault');
        const passport = recall<Passport>('passport');
        const roleProps = jest.mocked({} as StaffRoleProps);

        const staffRole = StaffRole.getNewInstance(
          roleProps,
          passport,
          roleName,
          isDefault
        );

        remember('staffRole', staffRole);
        remember('creationResult', 'success');
      } catch (error) {
        remember('creationError', error);
      }
      resolve();
    });
  }
}

class UpdateStaffRolePermissions extends Task {
  static withCurrentContext() {
    return new UpdateStaffRolePermissions();
  }

  constructor() {
    super('Update staff role permissions');
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    return new Promise((resolve) => {
      try {
        const staffRole = recall<StaffRole<StaffRoleProps>>('staffRole');
        
        // Attempt to update permissions - this should throw a PermissionError
        staffRole.permissions.communityPermissions.canManageAllCommunities = true;
        
        remember('updateResult', 'success');
      } catch (error) {
        remember('updateError', error);
        remember('updateResult', 'error');
      }
      resolve();
    });
  }
}

class UpdateStaffRoleName extends Task {
  static withCurrentContext() {
    return new UpdateStaffRoleName();
  }

  constructor() {
    super('Update staff role name');
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    return new Promise((resolve) => {
      try {
        const staffRole = recall<StaffRole<StaffRoleProps>>('staffRole');
        const updatedRoleName = recall<string>('updatedRoleName');
        
        staffRole.roleName = updatedRoleName;
        
        remember('updateResult', 'success');
      } catch (error) {
        remember('updateError', error);
        remember('updateResult', 'error');
      }
      resolve();
    });
  }
}

class DeleteStaffRoleWithReassignment extends Task {
  static withCurrentContext() {
    return new DeleteStaffRoleWithReassignment();
  }

  constructor() {
    super('Delete staff role and reassign to target role');
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    return new Promise((resolve) => {
      try {
        const staffRole = recall<StaffRole<StaffRoleProps>>('staffRole');
        const targetRole = recall<StaffRole<StaffRoleProps>>('targetRole');
        
        staffRole.deleteAndReassignTo(targetRole);
        
        remember('deleteResult', 'success');
      } catch (error) {
        remember('deleteError', error);
      }
      resolve();
    });
  }
}

// Serenity Questions - Using function-based approach for better reporting
const TheStaffRoleCreationResult = () => 
  Question.about<string>('the result of the staff role creation attempt', () => {
    return recall<string>('creationResult') || 'failed';
  });

const TheStaffRoleCreationError = () => 
  Question.about<Error>('the error details from the failed staff role creation', () => {
    return recall<Error>('creationError');
  });

const TheStaffRoleUpdateError = () => 
  Question.about<Error>('the error details from the failed staff role update', () => {
    return recall<Error>('updateError');
  });

const TheStaffRoleDeleteResult = () => 
  Question.about<string>('the result of the staff role deletion attempt', () => {
    return recall<string>('deleteResult') || 'failed';
  });

const TheStaffRoleIsDeleted = () => 
  Question.about<boolean>('whether the staff role is deleted', () => {
    const staffRole = recall<StaffRole<StaffRoleProps>>('staffRole');
    return staffRole ? staffRole.isDeleted : false;
  });

const TheStaffRoleEvents = () => 
  Question.about<any[]>('the events raised by the staff role', () => {
    const staffRole = recall<StaffRole<StaffRoleProps>>('staffRole');
    if (!staffRole) {
      return [];
    }
    return [...staffRole.getIntegrationEvents()]; // Convert readonly array to mutable array
  });

const TheCurrentStaffRoleName = () => 
  Question.about<string>('the current staff role name', () => {
    const staffRole = recall<StaffRole<StaffRoleProps>>('staffRole');
    return staffRole ? staffRole.roleName : '';
  });

// Cucumber Step Definitions

Before(() => {
  // Clear test memory before each scenario
  clearMemory();
});

// Given Steps
Given('a staff administrator with valid permissions', async () => {
  staffAdmin = actorCalled('Staff Administrator');
});

Given('the required staff role creation context is set up', async () => {
  // Default context - will be overridden by specific scenario steps
  await staffAdmin.attemptsTo(
    SetupStaffRoleCreationContext.with(
      'default-role', 
      false,
      { canManageStaffRolesAndPermissions: true }
    )
  );
});

Given('a valid role name {string}', async (roleName: string) => {
  remember('roleName', roleName);
});

Given('the role is not a default role', async () => {
  remember('isDefault', false);
});

Given('the role is a default role', async () => {
  remember('isDefault', true);
});

Given('a role name that is too long', async () => {
  remember('roleName', 'x'.repeat(51)); // Exceeds 50 character limit
});

Given('a role name that is too short', async () => {
  remember('roleName', ''); // Empty string
});

Given('an existing staff role', async () => {
  // Create a staff role first
  await staffAdmin.attemptsTo(
    SetupStaffRoleCreationContext.with(
      'existing-role',
      false,
      { canManageStaffRolesAndPermissions: true }
    )
  );
  
  const passport = recall<Passport>('passport');
  const roleProps = jest.mocked({
    permissions: { 
      communityPermissions: {
        canManageAllCommunities: false
      } 
    },
  } as StaffRoleProps);
  
  const staffRole = new StaffRole(roleProps, passport);
  remember('staffRole', staffRole);
});

Given('a user without staff role management permissions', async () => {
  // Create passport without proper permissions
  const mockUserVisa = jest.mocked({
    determineIf: (
      fn: (permissions: Readonly<UserDomainPermissions>) => boolean,
    ) => {
      return fn({ canManageStaffRolesAndPermissions: false } as UserDomainPermissions);
    },
  } as UserVisa);

  const mockPassport = jest.mocked({} as Passport);
  // @ts-expect-error - Assigning to read-only property for test mocking
  mockPassport.user = jest.mocked({
    forStaffRole: jest.fn(() => mockUserVisa),
    forEndUser: jest.fn(() => mockUserVisa),
    forStaffUser: jest.fn(() => mockUserVisa),
    forVendorUser: jest.fn(() => mockUserVisa),
  } as UserPassport);

  remember('passport', mockPassport);
  
  // Recreate the staff role with the new passport
  const roleProps = jest.mocked({
    permissions: { 
      communityPermissions: {
        canManageAllCommunities: false
      } 
    },
  } as StaffRoleProps);
  
  const staffRole = new StaffRole(roleProps, mockPassport);
  remember('staffRole', staffRole);
});

Given('a user with staff role management permissions', async () => {
  // Create passport with proper permissions
  const mockUserVisa = jest.mocked({
    determineIf: (
      fn: (permissions: Readonly<UserDomainPermissions>) => boolean,
    ) => {
      return fn({ canManageStaffRolesAndPermissions: true } as UserDomainPermissions);
    },
  } as UserVisa);

  const mockPassport = jest.mocked({} as Passport);
  // @ts-expect-error - Assigning to read-only property for test mocking
  mockPassport.user = jest.mocked({
    forStaffRole: jest.fn(() => mockUserVisa),
    forEndUser: jest.fn(() => mockUserVisa),
    forStaffUser: jest.fn(() => mockUserVisa),
    forVendorUser: jest.fn(() => mockUserVisa),
  } as UserPassport);

  remember('passport', mockPassport);
  
  // Recreate the staff role with the new passport
  const roleProps = jest.mocked({
    roleName: 'existing-role',
    isDefault: false,
    permissions: { communityPermissions: {} },
  } as StaffRoleProps);
  
  const staffRole = new StaffRole(roleProps, mockPassport);
  remember('staffRole', staffRole);
});

Given('a valid updated role name {string}', async (updatedRoleName: string) => {
  remember('updatedRoleName', updatedRoleName);
});

Given('an existing non-default staff role', async () => {
  // Create a non-default staff role first
  await staffAdmin.attemptsTo(
    SetupStaffRoleCreationContext.with(
      'non-default-role',
      false,
      { canManageStaffRolesAndPermissions: true }
    )
  );
  
  const passport = recall<Passport>('passport');
  const roleProps = jest.mocked({
    id: 'staff-role-id-1',
    roleName: 'non-default-role',
    isDefault: false,
    permissions: { communityPermissions: {} },
  } as StaffRoleProps);
  
  const staffRole = new StaffRole(roleProps, passport);
  remember('staffRole', staffRole);
});

Given('a target staff role for reassignment', async () => {
  const passport = recall<Passport>('passport');
  const targetRoleProps = jest.mocked({
    id: 'target-role-id',
    roleName: 'target-role',
    isDefault: false,
    permissions: { communityPermissions: {} },
  } as StaffRoleProps);
  
  const targetRole = new StaffRole(targetRoleProps, passport);
  remember('targetRole', targetRole);
});

// When Steps
When('I create a new staff role', async () => {
  await staffAdmin.attemptsTo(CreateStaffRole.withCurrentContext());
});

When('I attempt to create a new staff role', async () => {
  await staffAdmin.attemptsTo(AttemptToCreateStaffRole.withCurrentContext());
});

When('I attempt to update the staff role permissions', async () => {
  await staffAdmin.attemptsTo(UpdateStaffRolePermissions.withCurrentContext());
});

When('I attempt to update the staff role name', async () => {
  await staffAdmin.attemptsTo(UpdateStaffRoleName.withCurrentContext());
});

When('I update the staff role name', async () => {
  await staffAdmin.attemptsTo(UpdateStaffRoleName.withCurrentContext());
});

When('I delete the staff role and reassign to the target role', async () => {
  await staffAdmin.attemptsTo(DeleteStaffRoleWithReassignment.withCurrentContext());
});

// Then Steps
Then('the staff role should be created successfully', async () => {
  const result = await staffAdmin.answer(TheStaffRoleCreationResult());
  expect(result).toBe('success');
});

Then('a validation error should be thrown', async () => {
  const error = await staffAdmin.answer(TheStaffRoleCreationError());
  expect(error).toBeTruthy();
});

Then('the error message should contain {string}', async (expectedMessage: string) => {
  // First check if it's a creation error or update error
  const creationError = await staffAdmin.answer(TheStaffRoleCreationError());
  const updateError = await staffAdmin.answer(TheStaffRoleUpdateError());
  
  const error = creationError || updateError;
  expect(error).toBeTruthy();
  expect(error?.message || '').toContain(expectedMessage);
});

Then('a permission error should be thrown', async () => {
  const updateResult = recall<string>('updateResult');
  expect(updateResult).toBe('error');
  
  const error = await staffAdmin.answer(TheStaffRoleUpdateError());
  expect(error).toBeTruthy();
  expect(error?.constructor.name).toBe('PermissionError');
});

Then('the staff role name should be updated successfully', async () => {
  const currentName = await staffAdmin.answer(TheCurrentStaffRoleName());
  const expectedName = recall<string>('updatedRoleName');
  expect(currentName).toBe(expectedName);
});

Then('the staff role should be marked as deleted', async () => {
  const isDeleted = await staffAdmin.answer(TheStaffRoleIsDeleted());
  expect(isDeleted).toBe(true);
});

Then('a RoleDeletedReassignEvent should be raised', async () => {
  const events = await staffAdmin.answer(TheStaffRoleEvents());
  const hasRoleDeletedEvent = events.some(event => 
    event.constructor.name === 'RoleDeletedReassignEvent'
  );
  expect(hasRoleDeletedEvent).toBe(true);
});
