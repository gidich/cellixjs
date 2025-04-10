"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vendor_user_role_1 = require("./vendor-user-role");
describe('domain.contexts.end-user-role', () => {
    describe('when creating a new end user role', () => {
        const givenValidCommunity = jest.mocked({});
        const givenValidRoleName = 'admin';
        const givenValidContext = jest.mocked({});
        givenValidContext.domainVisa = jest.mocked({});
        const mockCommunityVisa = jest.mocked({});
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
        });
        it('should reject an invalid role name', () => {
            // Arrange
            const givenInvalidRoleName = 'x'.repeat(51);
            const roleProps = jest.mocked({});
            // Act
            const creatingInvalidVendorUserRole = () => {
                vendor_user_role_1.VendorUserRole.getNewInstance(roleProps, givenInvalidRoleName, false, givenValidCommunity, givenValidContext);
            };
            // Assert
            expect(creatingInvalidVendorUserRole).toThrowError('Too long');
        });
        it('should accept valid input', () => {
            // Arrange
            const roleProps = jest.mocked({ setCommunityRef(community) {
                    community;
                } });
            // Act
            const creatingValidVendorUserRole = () => {
                vendor_user_role_1.VendorUserRole.getNewInstance(roleProps, givenValidRoleName, false, givenValidCommunity, givenValidContext);
            };
            // Assert
            expect(creatingValidVendorUserRole).not.toThrow();
        });
    });
    describe('when updating an end user role', () => {
        const roleProps = jest.mocked({});
        const givenValidContext = jest.mocked({});
        givenValidContext.domainVisa = jest.mocked({});
        it('should reject without proper permission', () => {
            // Arrange
            const roleProps = jest.mocked({ permissions: { communityPermissions: {} }, setCommunityRef(community) { community; } });
            const mockCommunityVisa = jest.mocked({});
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
            });
            const endUserRole = new vendor_user_role_1.VendorUserRole(roleProps, givenValidContext);
            // Act
            const updatingVendorUserRoleWithoutVisa = () => {
                endUserRole.permissions.communityPermissions.CanManageMembers = (true);
            };
            // Assert
            expect(updatingVendorUserRoleWithoutVisa).toThrow('Cannot set permission');
        });
        it('should reject an invalid role name', () => {
            // Arrange
            const mockCommunityVisa = jest.mocked({});
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
            });
            const endUserRole = new vendor_user_role_1.VendorUserRole(roleProps, givenValidContext);
            const givenInvalidRoleName = '';
            // Act
            const updatingUserWithInvalidProperty = () => {
                endUserRole.RoleName = (givenInvalidRoleName);
            };
            // Assert
            expect(updatingUserWithInvalidProperty).toThrowError('Too short');
        });
    });
});
//# sourceMappingURL=vendor-user-role.test.js.map