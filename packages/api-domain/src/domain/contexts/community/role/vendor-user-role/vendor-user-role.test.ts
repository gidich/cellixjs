import { jest } from '@jest/globals';
import {
	VendorUserRole,
	type VendorUserRoleProps,
} from './vendor-user-role.ts';
import type { CommunityVisa } from '../../community.visa.ts';
import type { CommunityEntityReference } from '../../community/community.ts';
import type { Passport } from '../../../passport.ts';
import type { CommunityDomainPermissions } from '../../community.domain-permissions.ts';
import type { UserPassport } from '../../../user/user.passport.ts';
import type { ServicePassport } from '../../../service/service.passport.ts';

describe('domain.contexts.vendor-user-role', () => {
	/**
	 * @param {Partial<CommunityDomainPermissions>} partialPermissions - Only need to define permissions that you want to be true, others will be false
	 * @returns {Passport}
	 */
	const getMockedPassport: (
		partialPermissions: Partial<CommunityDomainPermissions>,
	) => Passport = (partialPermissions) => {
		const mockCommunityVisa = jest.mocked({
			determineIf: (
				fn: (permissions: Readonly<CommunityDomainPermissions>) => boolean,
			) => {
				return fn(partialPermissions as CommunityDomainPermissions);
			},
		} as CommunityVisa);

		return jest.mocked({
			community: {
				forCommunity: jest.fn(() => mockCommunityVisa),
			},
			user: {
				forEndUser: jest.fn(),
				forStaffUser: jest.fn(),
				forStaffRole: jest.fn(),
				forVendorUser: jest.fn(),
			} as UserPassport,
			service: {
				forService: jest.fn(),
			} as ServicePassport,
		} as Passport);
	};
	describe('when creating a new vendor user role', () => {
		const givenValidPassport = getMockedPassport({
			canManageVendorUserRolesAndPermissions: true,
		});
		const givenValidCommunity = jest.mocked({} as CommunityEntityReference);
		const givenValidRoleName = 'admin';

		it('should reject an invalid role name', () => {
			// Arrange
			const givenInvalidRoleName = 'x'.repeat(51);
			const roleProps = jest.mocked({} as VendorUserRoleProps);

			// Act
			const creatingInvalidVendorUserRole = () => {
				VendorUserRole.getNewInstance(
					roleProps,
					givenValidPassport,
					givenInvalidRoleName,
					false,
					givenValidCommunity,
				);
			};

			// Assert
			expect(creatingInvalidVendorUserRole).toThrow('Too long');
		});

		it('should accept valid input', () => {
			// Arrange
			const roleProps = jest.mocked({

			} as VendorUserRoleProps);

			// Act
			const creatingValidVendorUserRole = () => {
				VendorUserRole.getNewInstance(
					roleProps,
					givenValidPassport,
					givenValidRoleName,
					false,
					givenValidCommunity,
				);
			};

			// Assert
			expect(creatingValidVendorUserRole).not.toThrow();
		});
	});

	describe('when updating a vendor user role', () => {

		it('should reject without proper permission', () => {
			// Arrange
			const givenPassportWithoutPermission = getMockedPassport({
				canManageVendorUserRolesAndPermissions: false, // User does NOT have permission
			});
			const roleProps = jest.mocked({
				id: 'test-id',
				roleName: 'test-role',
				isDefault: false,
				permissions: { 
					communityPermissions: {
						canManageEndUserRolesAndPermissions: false,
						canManageCommunitySettings: false,
						canManageSiteContent: false,
						canManageMembers: false,
						canEditOwnMemberProfile: false,
						canEditOwnMemberAccounts: false
					},
					propertyPermissions: {
						canManageProperties: false,
						canEditOwnProperty: false
					},
					serviceTicketPermissions: {
						canCreateTickets: false,
						canManageTickets: false,
						canAssignTickets: false,
						canWorkOnTickets: false
					},
					servicePermissions: {
						canManageServices: false
					},
					violationTicketPermissions: {
						canCreateTickets: false,
						canManageTickets: false,
						canAssignTickets: false,
						canWorkOnTickets: false
					}
				},
				roleType: 'test-type',
				createdAt: new Date(),
				updatedAt: new Date(),
				schemaVersion: '1.0.0',
				get community() {
					return jest.mocked({} as CommunityEntityReference);
				},
				set community(_community: CommunityEntityReference) {
					// Mock setter
				},
			} as VendorUserRoleProps);
			const endUserRole = new VendorUserRole(roleProps, givenPassportWithoutPermission);

			// Act
			const updatingVendorUserRoleWithoutVisa = () => {
				endUserRole.permissions.communityPermissions.CanManageMembers = true;
			};

			// Assert
			expect(updatingVendorUserRoleWithoutVisa).toThrow(
				'Cannot set permission',
			);
		});

		it('should reject an invalid role name', () => {
			// Arrange
			const givenValidPassport = getMockedPassport({
				canManageVendorUserRolesAndPermissions: true,
			});
			const roleProps = jest.mocked({
				id: 'test-id',
				roleName: 'valid-role',
				isDefault: false,
				permissions: { 
					communityPermissions: {
						canManageEndUserRolesAndPermissions: false,
						canManageCommunitySettings: false,
						canManageSiteContent: false,
						canManageMembers: false,
						canEditOwnMemberProfile: false,
						canEditOwnMemberAccounts: false
					},
					propertyPermissions: {
						canManageProperties: false,
						canEditOwnProperty: false
					},
					serviceTicketPermissions: {
						canCreateTickets: false,
						canManageTickets: false,
						canAssignTickets: false,
						canWorkOnTickets: false
					},
					servicePermissions: {
						canManageServices: false
					},
					violationTicketPermissions: {
						canCreateTickets: false,
						canManageTickets: false,
						canAssignTickets: false,
						canWorkOnTickets: false
					}
				},
				roleType: 'test-type',
				createdAt: new Date(),
				updatedAt: new Date(),
				schemaVersion: '1.0.0',
				get community() {
					return jest.mocked({} as CommunityEntityReference);
				},
				set community(_community: CommunityEntityReference) {
					// Mock setter
				},
			} as VendorUserRoleProps);
			const endUserRole = new VendorUserRole(roleProps, givenValidPassport);
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
