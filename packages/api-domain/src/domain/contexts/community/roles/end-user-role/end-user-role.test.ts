import { EndUserRole, EndUserRoleProps } from './end-user-role';
import { DomainExecutionContext } from '../../../../domain-execution-context';
import { DomainVisa } from '../../../../domain.visa';
import { CommunityVisa } from '../../community.visa';
import { CommunityEntityReference } from '../../community/community';

describe('domain.contexts.end-user-role', () => {
  describe('when creating a new end user role', () => {
    const givenValidCommunity = jest.mocked({} as CommunityEntityReference);
    const givenValidRoleName = 'admin';
    const givenValidContext = jest.mocked({} as DomainExecutionContext);
    givenValidContext.domainVisa = jest.mocked({} as DomainVisa);
    const mockCommunityVisa = jest.mocked({} as CommunityVisa);
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
      const roleProps = jest.mocked({} as EndUserRoleProps);
      
      // Act
      const creatingInvalidEndUserRole = () => { 
        EndUserRole.getNewInstance(roleProps, givenInvalidRoleName, false, givenValidCommunity, givenValidContext); 
      };

      // Assert
      expect(creatingInvalidEndUserRole).toThrowError('Too long');
    });

    it('should accept valid input', () => {
      // Arrange
      const roleProps = jest.mocked({ setCommunityRef(community) {
        community
      }} as EndUserRoleProps);
      
      // Act
      const creatingValidEndUserRole = () => { 
        EndUserRole.getNewInstance(roleProps, givenValidRoleName, false, givenValidCommunity, givenValidContext); 
      };

      // Assert
      expect(creatingValidEndUserRole).not.toThrow();
    });

  });

  describe('when updating an end user role', () => {
    const roleProps = jest.mocked({} as EndUserRoleProps);
    const givenValidContext = jest.mocked({} as DomainExecutionContext);
    givenValidContext.domainVisa = jest.mocked({} as DomainVisa);

    it('should reject without proper permission', () => {
      // Arrange
      const roleProps = jest.mocked({ permissions: { communityPermissions: {} }, setCommunityRef(community) { community } } as EndUserRoleProps);
      const mockCommunityVisa = jest.mocked({} as CommunityVisa);
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
      const endUserRole = new EndUserRole(roleProps, givenValidContext);
      
      // Act
      const updatingEndUserRoleWithoutVisa = () => { 
        endUserRole.permissions.communityPermissions.CanManageMembers=(true);
      };

      // Assert
      expect(updatingEndUserRoleWithoutVisa).toThrow('Cannot set permission');
    })

    it('should reject an invalid role name', () => {
      // Arrange
      const mockCommunityVisa = jest.mocked({} as CommunityVisa);
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
      const endUserRole = new EndUserRole(roleProps, givenValidContext);
      const givenInvalidRoleName = '';
      
      // Act
      const updatingUserWithInvalidProperty = () => { 
        endUserRole.RoleName=(givenInvalidRoleName);
      };

      // Assert
      expect(updatingUserWithInvalidProperty).toThrowError('Too short');
    });

  });

});