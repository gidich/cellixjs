"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const staff_role_1 = require("./staff-role");
describe('domain.contexts.staff-role', () => {
    describe('when creating a new staff role', () => {
        const givenValidRoleName = 'admin';
        const givenValidContext = jest.mocked({});
        givenValidContext.domainVisa = jest.mocked({});
        const mockCommunityVisa = jest.mocked({
            determineIf: jest.fn(func => func({ canManageStaffRolesAndPermissions: true }))
        });
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
            const creatingInvalidStaffRole = () => {
                staff_role_1.StaffRole.getNewInstance(roleProps, givenInvalidRoleName, false, givenValidContext);
            };
            // Assert
            expect(creatingInvalidStaffRole).toThrowError('Too long');
        });
        it('should accept valid input', () => {
            // Arrange
            const roleProps = jest.mocked({});
            // Act
            const creatingValidStaffRole = () => {
                staff_role_1.StaffRole.getNewInstance(roleProps, givenValidRoleName, false, givenValidContext);
            };
            // Assert
            expect(creatingValidStaffRole).not.toThrow();
        });
    });
    describe('when updating an staff role', () => {
        const roleProps = jest.mocked({});
        const givenValidContext = jest.mocked({});
        givenValidContext.domainVisa = jest.mocked({});
        it('should reject without proper permission', () => {
            // Arrange
            const roleProps = jest.mocked({ permissions: { communityPermissions: {} } });
            const mockCommunityVisa = jest.mocked({
                determineIf: jest.fn(func => func({ canManageStaffRolesAndPermissions: true }))
            });
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
            const role = new staff_role_1.StaffRole(roleProps, givenValidContext);
            // Act
            const updatingStaffRoleWithoutVisa = () => {
                role.permissions.communityPermissions.CanManageAllCommunities = (true);
            };
            // Assert
            expect(updatingStaffRoleWithoutVisa).toThrow('Cannot set permission');
        });
        it('should reject an invalid role name', () => {
            // Arrange
            const mockCommunityVisa = jest.mocked({
                determineIf: jest.fn(func => func({ canManageStaffRolesAndPermissions: true }))
            });
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
            const role = new staff_role_1.StaffRole(roleProps, givenValidContext);
            const givenInvalidRoleName = '';
            // Act
            const updatingUserWithInvalidProperty = () => {
                role.RoleName = (givenInvalidRoleName);
            };
            // Assert
            expect(updatingUserWithInvalidProperty).toThrowError('Too short');
        });
    });
});
//# sourceMappingURL=staff-role.test.js.map