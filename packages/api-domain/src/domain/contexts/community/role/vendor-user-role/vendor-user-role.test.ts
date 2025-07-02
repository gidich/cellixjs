import { jest } from '@jest/globals';
import {
	VendorUserRole,
	type VendorUserRoleProps,
} from './vendor-user-role.ts';
import type { CommunityVisa } from '../../community.visa.ts';
import type { CommunityEntityReference } from '../../community/community.ts';
import type { Passport } from '../../../passport.ts';
import type { CommunityDomainPermissions } from '../../community.domain-permissions.ts';

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
			user: {} as any,
			service: {} as any,
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
      let _community: CommunityEntityReference;
			const roleProps = jest.mocked({
				set community(community: CommunityEntityReference) {
					_community = community;
				},
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
				roleName: 'test-role',
				isDefault: false,
				permissions: { 
					communityPermissions: {
						CanManageMembers: false
					} 
				},
				get community() {
					return {} as any;
				},
				set community(_community: CommunityEntityReference) {
					// Mock setter
				},
			} as any as VendorUserRoleProps);
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
				roleName: 'valid-role',
				isDefault: false,
				permissions: { communityPermissions: {} },
				get community() {
					return {} as any;
				},
				set community(_community: CommunityEntityReference) {
					// Mock setter
				},
			} as any as VendorUserRoleProps);
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
