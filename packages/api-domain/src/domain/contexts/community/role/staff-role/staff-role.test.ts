import { StaffRole, type StaffRoleProps } from './staff-role.ts';
import type { DomainExecutionContext } from '../../../../domain-execution-context.ts';
import type { DomainVisa } from '../../../../domain.visa.ts';
import type { CommunityVisa } from '../../community.visa.ts';
import { CommunityEntityReference } from '../../community/community.ts';

describe('domain.contexts.staff-role', () => {
  describe('when creating a new staff role', () => {
    const givenValidRoleName = 'admin';
    const givenValidContext = jest.mocked({} as DomainExecutionContext);
    givenValidContext.domainVisa = jest.mocked({} as DomainVisa);
    const mockCommunityVisa = jest.mocked({
      determineIf: jest.fn(func => func({ canManageStaffRolesAndPermissions: true }))
    } as CommunityVisa);
    givenValidContext.domainVisa = jest.mocked({
      forCommunity: jest.fn(() => mockCommunityVisa),
      forUser: jest.fn(() => ({ determineIf: () => false })),
      forStaffRole: jest.fn(() => mockCommunityVisa),
      forVendorUserRole: jest.fn(() => mockCommunityVisa),
      forService: jest.fn(() => ({ determineIf: () => false })),
      forEndUser: jest.fn(() => ({ determineIf: () => false })),
      forStaffUser: jest.fn(() => ({ determineIf: () => false })),
      forVendorUser: jest.fn(() => ({ determineIf: () => false })),
      forServiceTicketV1: jest.fn(() => ({ determineIf: () => false })),
      forViolationTicketV1: jest.fn(() => ({ determineIf: () => false })),
      forEndUserRole: jest.fn(() => mockCommunityVisa),
    } as DomainVisa);

    it('should reject an invalid role name', () => {
      // Arrange
      const givenInvalidRoleName = 'x'.repeat(51);
      const roleProps = jest.mocked({} as StaffRoleProps);
      
      // Act
      const creatingInvalidStaffRole = () => { 
        StaffRole.getNewInstance(roleProps, givenInvalidRoleName, false, givenValidContext); 
      };

      // Assert
      expect(creatingInvalidStaffRole).toThrowError('Too long');
    });

    it('should accept valid input', () => {
      // Arrange
      const roleProps = jest.mocked({} as StaffRoleProps);
      
      // Act
      const creatingValidStaffRole = () => { 
        StaffRole.getNewInstance(roleProps, givenValidRoleName, false, givenValidContext); 
      };

      // Assert
      expect(creatingValidStaffRole).not.toThrow();
    });

  });

  describe('when updating an staff role', () => {
    const roleProps = jest.mocked({} as StaffRoleProps);
    const givenValidContext = jest.mocked({} as DomainExecutionContext);
    givenValidContext.domainVisa = jest.mocked({} as DomainVisa);

    it('should reject without proper permission', () => {
      // Arrange
      const roleProps = jest.mocked({ permissions: { communityPermissions: {} } } as StaffRoleProps);
      const mockCommunityVisa = jest.mocked({
        determineIf: jest.fn(func => func({ canManageStaffRolesAndPermissions: true }))
      } as CommunityVisa);
      givenValidContext.domainVisa = jest.mocked({
        forCommunity: jest.fn(() => mockCommunityVisa),
        forUser: jest.fn(() => ({ determineIf: () => false })),
        forStaffRole: jest.fn(() => mockCommunityVisa),
        forVendorUserRole: jest.fn(() => mockCommunityVisa),
        forService: jest.fn(() => ({ determineIf: () => false })),
        forEndUser: jest.fn(() => ({ determineIf: () => false })),
        forStaffUser: jest.fn(() => ({ determineIf: () => false })),
        forVendorUser: jest.fn(() => ({ determineIf: () => false })),
        forServiceTicketV1: jest.fn(() => ({ determineIf: () => false })),
        forViolationTicketV1: jest.fn(() => ({ determineIf: () => false })),
        forEndUserRole: jest.fn(() => mockCommunityVisa),
      } as DomainVisa);
      const role = new StaffRole(roleProps, givenValidContext);
      
      // Act
      const updatingStaffRoleWithoutVisa = () => { 
        role.permissions.communityPermissions.CanManageAllCommunities=(true);
      };

      // Assert
      expect(updatingStaffRoleWithoutVisa).toThrow('Cannot set permission');
    })

    it('should reject an invalid role name', () => {
      // Arrange
      const mockCommunityVisa = jest.mocked({
        determineIf: jest.fn(func => func({ canManageStaffRolesAndPermissions: true }))
      } as CommunityVisa);
      givenValidContext.domainVisa = jest.mocked({
        forCommunity: jest.fn(() => mockCommunityVisa),
        forUser: jest.fn(() => ({ determineIf: () => false })),
        forStaffRole: jest.fn(() => mockCommunityVisa),
        forVendorUserRole: jest.fn(() => mockCommunityVisa),
        forService: jest.fn(() => ({ determineIf: () => false })),
        forEndUser: jest.fn(() => ({ determineIf: () => false })),
        forStaffUser: jest.fn(() => ({ determineIf: () => false })),
        forVendorUser: jest.fn(() => ({ determineIf: () => false })),
        forServiceTicketV1: jest.fn(() => ({ determineIf: () => false })),
        forViolationTicketV1: jest.fn(() => ({ determineIf: () => false })),
        forEndUserRole: jest.fn(() => mockCommunityVisa),
      } as DomainVisa);
      const role = new StaffRole(roleProps, givenValidContext);
      const givenInvalidRoleName = '';
      
      // Act
      const updatingUserWithInvalidProperty = () => { 
        role.RoleName=(givenInvalidRoleName);
      };

      // Assert
      expect(updatingUserWithInvalidProperty).toThrowError('Too short');
    });

  });

});