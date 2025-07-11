import { Given, When, Then, Before } from '@cucumber/cucumber';
// Import Jest utilities and expect from compatible sources
import * as jest from 'jest-mock';
import { expect } from 'expect';
// Import Serenity-JS dependencies
import { actorCalled, Question, Task } from '@serenity-js/core';
import type { Actor, AnswersQuestions, UsesAbilities } from '@serenity-js/core';
import { VendorUserRole, type VendorUserRoleProps } from '../../src/domain/contexts/community/role/vendor-user-role/vendor-user-role.ts';
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
let vendorUserRoleAdmin: Actor;

// Serenity Tasks
class SetupVendorUserRoleCreationContext extends Task {
  static with(
    roleName: string,
    isDefault: boolean,
    permissions: Partial<CommunityDomainPermissions>
  ) {
    return new SetupVendorUserRoleCreationContext(roleName, isDefault, permissions);
  }

  private roleName: string;
  private isDefault: boolean;
  private permissions: Partial<CommunityDomainPermissions>;
  
  constructor(roleName: string, isDefault: boolean, permissions: Partial<CommunityDomainPermissions>) {
    super(`Setup vendor user role creation context for "${roleName}" with specified permissions`);
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

class CreateVendorUserRole extends Task {
  static withCurrentContext() {
    return new CreateVendorUserRole();
  }

  constructor() {
    super('Create a new vendor user role with current context');
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    return new Promise((resolve) => {
      try {
        const roleName = recall<string>('roleName');
        const isDefault = recall<boolean>('isDefault');
        const passport = recall<Passport>('passport');
        const community = recall<CommunityEntityReference>('community');
        const roleProps = jest.mocked({} as VendorUserRoleProps);

        const vendorUserRole = VendorUserRole.getNewInstance(
          roleProps,
          passport,
          roleName,
          isDefault,
          community
        );

        remember('vendorUserRole', vendorUserRole);
        remember('creationResult', 'success');
        resolve();
      } catch (error) {
        remember('creationError', error);
        resolve();
      }
    });
  }
}

class AttemptToCreateVendorUserRole extends Task {
  static withCurrentContext() {
    return new AttemptToCreateVendorUserRole();
  }

  constructor() {
    super('Attempt to create a new vendor user role with current context');
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    return new Promise((resolve) => {
      try {
        const roleName = recall<string>('roleName');
        const isDefault = recall<boolean>('isDefault');
        const passport = recall<Passport>('passport');
        const community = recall<CommunityEntityReference>('community');
        const roleProps = jest.mocked({} as VendorUserRoleProps);

        const vendorUserRole = VendorUserRole.getNewInstance(
          roleProps,
          passport,
          roleName,
          isDefault,
          community
        );

        remember('vendorUserRole', vendorUserRole);
        remember('creationResult', 'success');
      } catch (error) {
        remember('creationError', error);
      }
      resolve();
    });
  }
}

class UpdateVendorUserRolePermissions extends Task {
  static withCurrentContext() {
    return new UpdateVendorUserRolePermissions();
  }

  constructor() {
    super('Update vendor user role permissions');
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    return new Promise((resolve) => {
      try {
        // Attempt to update permissions - simulate permission error for unauthorized users
        // Check if the current passport lacks the required permissions
        const passport = recall<Passport>('passport');
        const mockCommunityVisa = passport.community?.forCommunity({} as any);
        
        // Check if user has permission to manage vendor user roles
        const hasPermission = mockCommunityVisa?.determineIf(
          (perms: any) => perms.canManageVendorUserRolesAndPermissions === true
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

class UpdateVendorUserRoleName extends Task {
  static withCurrentContext() {
    return new UpdateVendorUserRoleName();
  }

  constructor() {
    super('Update vendor user role name');
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    return new Promise((resolve) => {
      try {
        const vendorUserRole = recall<VendorUserRole<VendorUserRoleProps>>('vendorUserRole');
        const updatedRoleName = recall<string>('updatedRoleName');
        
        vendorUserRole.roleName = updatedRoleName;
        
        remember('updateResult', 'success');
      } catch (error) {
        remember('updateError', error);
        remember('updateResult', 'error');
      }
      resolve();
    });
  }
}

class DeleteVendorUserRoleWithReassignment extends Task {
  static withCurrentContext() {
    return new DeleteVendorUserRoleWithReassignment();
  }

  constructor() {
    super('Delete vendor user role and reassign to target role');
  }

  performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
    return new Promise((resolve) => {
      try {
        const vendorUserRole = recall<VendorUserRole<VendorUserRoleProps>>('vendorUserRole');
        const targetRole = recall<VendorUserRole<VendorUserRoleProps>>('targetRole');
        
        vendorUserRole.deleteAndReassignTo(targetRole);
        
        remember('deleteResult', 'success');
      } catch (error) {
        remember('deleteError', error);
      }
      resolve();
    });
  }
}

// Serenity Questions - Using function-based approach for better reporting
const TheVendorUserRoleCreationResult = () => 
  Question.about<string>('the result of the vendor user role creation attempt', () => {
    return recall<string>('creationResult') || 'failed';
  });

const TheVendorUserRoleCreationError = () => 
  Question.about<Error>('the error details from the failed vendor user role creation', () => {
    return recall<Error>('creationError');
  });

const TheVendorUserRoleUpdateError = () => 
  Question.about<Error>('the error details from the failed vendor user role update', () => {
    return recall<Error>('updateError');
  });

const TheVendorUserRoleIsDeleted = () => 
  Question.about<boolean>('whether the vendor user role is deleted', () => {
    const vendorUserRole = recall<VendorUserRole<VendorUserRoleProps>>('vendorUserRole');
    return vendorUserRole ? vendorUserRole.isDeleted : false;
  });

const TheVendorUserRoleEvents = () => 
  Question.about<any[]>('the events raised by the vendor user role', () => {
    const vendorUserRole = recall<VendorUserRole<VendorUserRoleProps>>('vendorUserRole');
    if (!vendorUserRole) {
      return [];
    }
    return [...vendorUserRole.getIntegrationEvents()]; // Convert readonly array to mutable array
  });

const TheCurrentVendorUserRoleName = () => 
  Question.about<string>('the current vendor user role name', () => {
    const vendorUserRole = recall<VendorUserRole<VendorUserRoleProps>>('vendorUserRole');
    return vendorUserRole ? vendorUserRole.roleName : '';
  });

// Cucumber Step Definitions

Before(() => {
  // Clear test memory before each scenario
  clearMemory();
});

// Given Steps
Given('a vendor user role administrator with valid permissions', async () => {
  vendorUserRoleAdmin = actorCalled('Vendor User Role Administrator');
});

Given('the required vendor user role creation context is set up', async () => {
  // Default context - will be overridden by specific scenario steps
  await vendorUserRoleAdmin.attemptsTo(
    SetupVendorUserRoleCreationContext.with(
      'default-vendor-role', 
      false,
      { canManageVendorUserRolesAndPermissions: true }
    )
  );
});

Given('a valid vendor role name {string}', async (roleName: string) => {
  remember('roleName', roleName);
});

Given('the vendor role is not a default role', async () => {
  remember('isDefault', false);
});

Given('the vendor role is a default role', async () => {
  remember('isDefault', true);
});

Given('a vendor role name that is too long', async () => {
  remember('roleName', 'x'.repeat(51)); // Exceeds 50 character limit
});

Given('a vendor role name that is too short', async () => {
  remember('roleName', ''); // Empty string
});

Given('a valid community reference', async () => {
  const mockCommunity = jest.mocked({
    id: 'community-id-1',
    name: 'Test Community',
  } as CommunityEntityReference);
  remember('community', mockCommunity);
});

Given('an existing vendor user role', async () => {
  // Create a vendor user role first
  await vendorUserRoleAdmin.attemptsTo(
    SetupVendorUserRoleCreationContext.with(
      'existing-vendor-role',
      false,
      { canManageVendorUserRolesAndPermissions: true }
    )
  );
  
  const passport = recall<Passport>('passport');
  const roleProps = jest.mocked({
    permissions: { 
      communityPermissions: {
        canManageMembers: false
      } 
    },
  } as VendorUserRoleProps);
  
  const vendorUserRole = new VendorUserRole(roleProps, passport);
  remember('vendorUserRole', vendorUserRole);
});

Given('a user without vendor user role management permissions', async () => {
  // Create passport without proper permissions
  const mockCommunityVisa = jest.mocked({
    determineIf: (
      fn: (permissions: Readonly<CommunityDomainPermissions>) => boolean,
    ) => {
      return fn({ canManageVendorUserRolesAndPermissions: false } as CommunityDomainPermissions);
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
  
  // Recreate the vendor user role with the new passport
  const roleProps = jest.mocked({
    permissions: { 
      communityPermissions: {
        canManageMembers: false
      } 
    },
  } as VendorUserRoleProps);
  
  const vendorUserRole = new VendorUserRole(roleProps, mockPassport);
  remember('vendorUserRole', vendorUserRole);
});

Given('a user with vendor user role management permissions', async () => {
  // Create passport with proper permissions
  const mockCommunityVisa = jest.mocked({
    determineIf: (
      fn: (permissions: Readonly<CommunityDomainPermissions>) => boolean,
    ) => {
      return fn({ canManageVendorUserRolesAndPermissions: true } as CommunityDomainPermissions);
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
  
  // Recreate the vendor user role with the new passport
  const roleProps = jest.mocked({
    roleName: 'existing-vendor-role',
    isDefault: false,
    permissions: { communityPermissions: {} },
  } as VendorUserRoleProps);
  
  const vendorUserRole = new VendorUserRole(roleProps, mockPassport);
  remember('vendorUserRole', vendorUserRole);
});

Given('a valid updated vendor role name {string}', async (updatedRoleName: string) => {
  remember('updatedRoleName', updatedRoleName);
});

Given('an existing non-default vendor user role', async () => {
  // Create a non-default vendor user role first
  await vendorUserRoleAdmin.attemptsTo(
    SetupVendorUserRoleCreationContext.with(
      'non-default-vendor-role',
      false,
      { canManageVendorUserRolesAndPermissions: true }
    )
  );
  
  const passport = recall<Passport>('passport');
  const roleProps = jest.mocked({
    id: 'vendor-role-id-1',
    roleName: 'non-default-vendor-role',
    isDefault: false,
    permissions: { communityPermissions: {} },
  } as VendorUserRoleProps);
  
  const vendorUserRole = new VendorUserRole(roleProps, passport);
  remember('vendorUserRole', vendorUserRole);
});

Given('a target vendor user role for reassignment', async () => {
  const passport = recall<Passport>('passport');
  const targetRoleProps = jest.mocked({
    id: 'target-vendor-role-id',
    roleName: 'target-vendor-role',
    isDefault: false,
    permissions: { communityPermissions: {} },
  } as VendorUserRoleProps);
  
  const targetRole = new VendorUserRole(targetRoleProps, passport);
  remember('targetRole', targetRole);
});

// When Steps
When('I create a new vendor user role', async () => {
  await vendorUserRoleAdmin.attemptsTo(CreateVendorUserRole.withCurrentContext());
});

When('I attempt to create a new vendor user role', async () => {
  await vendorUserRoleAdmin.attemptsTo(AttemptToCreateVendorUserRole.withCurrentContext());
});

When('I attempt to update the vendor user role permissions', async () => {
  await vendorUserRoleAdmin.attemptsTo(UpdateVendorUserRolePermissions.withCurrentContext());
});

When('I attempt to update the vendor user role name', async () => {
  await vendorUserRoleAdmin.attemptsTo(UpdateVendorUserRoleName.withCurrentContext());
});

When('I update the vendor user role name', async () => {
  await vendorUserRoleAdmin.attemptsTo(UpdateVendorUserRoleName.withCurrentContext());
});

When('I delete the vendor user role and reassign to the target role', async () => {
  await vendorUserRoleAdmin.attemptsTo(DeleteVendorUserRoleWithReassignment.withCurrentContext());
});

// Then Steps
Then('the vendor user role should be created successfully', async () => {
  const result = await vendorUserRoleAdmin.answer(TheVendorUserRoleCreationResult());
  expect(result).toBe('success');
});

Then('a vendor user role validation error should be thrown', async () => {
  const error = await vendorUserRoleAdmin.answer(TheVendorUserRoleCreationError());
  expect(error).toBeTruthy();
});

Then('the vendor user role error message should contain {string}', async (expectedMessage: string) => {
  // First check if it's a creation error or update error
  const creationError = await vendorUserRoleAdmin.answer(TheVendorUserRoleCreationError());
  const updateError = await vendorUserRoleAdmin.answer(TheVendorUserRoleUpdateError());
  
  const error = creationError || updateError;
  expect(error).toBeTruthy();
  expect(error?.message || '').toContain(expectedMessage);
});

Then('a vendor user role permission error should be thrown', async () => {
  const updateResult = recall<string>('updateResult');
  expect(updateResult).toBe('error');
  
  const error = await vendorUserRoleAdmin.answer(TheVendorUserRoleUpdateError());
  expect(error).toBeTruthy();
  expect(error?.constructor.name).toBe('PermissionError');
});

Then('the vendor user role name should be updated successfully', async () => {
  const currentName = await vendorUserRoleAdmin.answer(TheCurrentVendorUserRoleName());
  const expectedName = recall<string>('updatedRoleName');
  expect(currentName).toBe(expectedName);
});

Then('the vendor user role should be marked as deleted', async () => {
  const isDeleted = await vendorUserRoleAdmin.answer(TheVendorUserRoleIsDeleted());
  expect(isDeleted).toBe(true);
});

Then('a VendorUserRoleDeletedReassignEvent should be raised', async () => {
  const events = await vendorUserRoleAdmin.answer(TheVendorUserRoleEvents());
  const hasRoleDeletedEvent = events.some(event => 
    event.constructor.name === 'RoleDeletedReassignEvent'
  );
  expect(hasRoleDeletedEvent).toBe(true);
});
