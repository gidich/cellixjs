import { EndUserRole, type EndUserRoleProps } from './end-user-role.ts';
import type { CommunityVisa } from '../../community.visa.ts';
import type { CommunityEntityReference } from '../../community/community.ts';
import type { Passport } from '../../../passport.ts';
import type { CommunityDomainPermissions } from '../../community.domain-permissions.ts';
import type { CommunityPassport } from '../../community.passport.ts';

describe('domain.contexts.end-user-role', () => {
  /**
   * @param {Partial<CommunityDomainPermissions>} partialPermissions - Only need to define permissions that you want to be true, others will be false
   * @returns {Passport}
   */
  const getMockedPassport: (partialPermissions: Partial<CommunityDomainPermissions>) => Passport = (partialPermissions) => {
    const mockCommunityVisa = jest.mocked({
      determineIf: (fn: (permissions: Readonly<CommunityDomainPermissions>) => boolean) => {
        return fn(partialPermissions as CommunityDomainPermissions);
      },
    } as CommunityVisa);

    const givenValidPassport = jest.mocked({} as Passport);
    givenValidPassport.community = jest.mocked({
      forCommunity: jest.fn(() => mockCommunityVisa),
    } as CommunityPassport);

    return givenValidPassport;
  }


  describe('when creating a new end user role', () => {
    const givenValidPassport = getMockedPassport({
      canManageEndUserRolesAndPermissions: true,
    });
    const givenValidCommunity = jest.mocked({} as CommunityEntityReference);
   
    it('should reject an invalid role name', () => {
      // Arrange
      const givenInvalidRoleName = 'x'.repeat(51);
      const roleProps = jest.mocked({} as EndUserRoleProps);
      
      // Act
      const creatingInvalidEndUserRole = () => { 
        EndUserRole.getNewInstance(roleProps,givenValidPassport, givenInvalidRoleName, false, givenValidCommunity); 
      };

      // Assert
      expect(creatingInvalidEndUserRole).toThrow('Too long');
    });

    it('should accept valid input', () => {
      // Arrange
      const givenValidRoleName = 'admin';
      const roleProps = jest.mocked({ set community(community:CommunityEntityReference) {
        community
      }} as EndUserRoleProps);
      
      // Act
      const creatingValidEndUserRole = () => { 
        EndUserRole.getNewInstance(roleProps,givenValidPassport, givenValidRoleName, false, givenValidCommunity); 
      };

      // Assert
      expect(creatingValidEndUserRole).not.toThrow();
    });

  });

  describe('when updating an end user role', () => {
    const roleProps = jest.mocked({} as EndUserRoleProps);

    it('should reject without proper permission', () => {

      // Arrange
      const givenValidPassport = getMockedPassport({
        canManageEndUserRolesAndPermissions: false,
      });
      const roleProps = jest.mocked({ permissions: { communityPermissions: {} }, set community(community: CommunityEntityReference) { community } } as EndUserRoleProps);
      const endUserRole = new EndUserRole(roleProps, givenValidPassport);
      
      // Act
      const updatingEndUserRoleWithoutVisa = () => { 
        endUserRole.permissions.communityPermissions.canManageMembers=(true);
      };

      // Assert
      expect(updatingEndUserRoleWithoutVisa).toThrow('Cannot set permission');
    })

    it('should reject an invalid role name', () => {
      // Arrange
      const givenValidPassport = getMockedPassport({
        canManageEndUserRolesAndPermissions: true,
      });
      const endUserRole = new EndUserRole(roleProps, givenValidPassport);
      const givenInvalidRoleName = '';
      
      // Act
      const updatingUserWithInvalidProperty = () => { 
        endUserRole.roleName = givenInvalidRoleName;
      };

      // Assert
      expect(updatingUserWithInvalidProperty).toThrow('Too short');
    });

  });

});