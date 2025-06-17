import { StaffRole, type StaffRoleProps } from './staff-role.ts';
import type { Passport } from '../../passport.ts';
import type { UserDomainPermissions } from '../user.domain-permissions.ts';
import type { UserPassport } from '../user.passport.ts';
import type { UserVisa } from '../user.visa.ts';

describe('domain.contexts.staff-role', () => {
  /**
   * @param {Partial<CommunityDomainPermissions>} partialPermissions - Only need to define permissions that you want to be true, others will be false
   * @returns {Passport}
   */
  const getMockedPassport: (partialPermissions: Partial<UserDomainPermissions>) => Passport = (partialPermissions) => {
    const mockUserVisa = jest.mocked({
      determineIf: (fn: (permissions: Readonly<UserDomainPermissions>) => boolean) => {
        return fn(partialPermissions as UserDomainPermissions);
      },
    } as UserVisa);

    const givenValidPassport = jest.mocked({} as Passport);
    givenValidPassport.user = jest.mocked({
      forStaffRole: jest.fn(() => mockUserVisa),
      forEndUser: jest.fn(() => mockUserVisa),
      forStaffUser: jest.fn(() => mockUserVisa),
      forVendorUser: jest.fn(() => mockUserVisa)
    } as UserPassport);

    return givenValidPassport;
  }
  
  describe('when creating a new staff role', () => {
    const givenValidPassport = getMockedPassport({
      canManageStaffRolesAndPermissions: true,
    });
    const givenValidRoleName = 'admin';
    

    it('should reject an invalid role name', () => {
      // Arrange
      const givenInvalidRoleName = 'x'.repeat(51);
      const roleProps = jest.mocked({} as StaffRoleProps);
      
      // Act
      const creatingInvalidStaffRole = () => { 
        StaffRole.getNewInstance(roleProps, givenValidPassport, givenInvalidRoleName, false); 
      };

      // Assert
      expect(creatingInvalidStaffRole).toThrow('Too long');
    });

    it('should accept valid input', () => {
      // Arrange
      const roleProps = jest.mocked({} as StaffRoleProps);
      
      // Act
      const creatingValidStaffRole = () => { 
        StaffRole.getNewInstance(roleProps, givenValidPassport, givenValidRoleName, false); 
      };

      // Assert
      expect(creatingValidStaffRole).not.toThrow();
    });

  });

  describe('when updating an staff role', () => {
    const givenValidPassport = getMockedPassport({
      canManageStaffRolesAndPermissions: true,
    });
    const roleProps = jest.mocked({} as StaffRoleProps);


    it('should reject without proper permission', () => {
      // Arrange
      const roleProps = jest.mocked({ permissions: { communityPermissions: {} } } as StaffRoleProps);
      const role = new StaffRole(roleProps, givenValidPassport);
      
      // Act
      const updatingStaffRoleWithoutVisa = () => { 
        role.permissions.communityPermissions.canManageAllCommunities=(true);
      };

      // Assert
      expect(updatingStaffRoleWithoutVisa).toThrow('Cannot set permission');
    })

    it('should reject an invalid role name', () => {
      // Arrange
      const role = new StaffRole(roleProps, givenValidPassport);
      const givenInvalidRoleName = '';
      
      // Act
      const updatingUserWithInvalidProperty = () => { 
        role.roleName = givenInvalidRoleName;
      };

      // Assert
      expect(updatingUserWithInvalidProperty).toThrow('Too short');
    });

  });

});