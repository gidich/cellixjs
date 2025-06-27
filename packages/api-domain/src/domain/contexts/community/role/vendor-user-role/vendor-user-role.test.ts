import {
	VendorUserRole,
	type VendorUserRoleProps,
} from './vendor-user-role.ts';
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

		const givenValidPassport = jest.mocked({} as Passport);
		givenValidPassport.community = jest.mocked({
			forCommunity: jest.fn(() => mockCommunityVisa),
		} as CommunityPassport);

		return givenValidPassport;
	};
	describe('when creating a new end user role', () => {
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
				set community(community: CommunityEntityReference) {
					this.community = community;
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

	describe('when updating an end user role', () => {
		const givenValidPassport = getMockedPassport({
			canManageVendorUserRolesAndPermissions: true,
		});
		const roleProps = jest.mocked({} as VendorUserRoleProps);

		it('should reject without proper permission', () => {
			// Arrange
			const roleProps = jest.mocked({
				permissions: { communityPermissions: {} },
				set community(community: CommunityEntityReference) {
					this.community = community;
				},
			} as VendorUserRoleProps);
			const endUserRole = new VendorUserRole(roleProps, givenValidPassport);

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
