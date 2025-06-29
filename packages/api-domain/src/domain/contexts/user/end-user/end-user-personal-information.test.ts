import { describe, expect, it, vi } from 'vitest';
import type { UserVisa } from '../user.visa.ts';
import { EndUserPersonalInformation } from './end-user-personal-information.ts';

describe('domain.contexts.end-user-personal-information', () => {
	const getMockedVisa = (permissions: {
		isEditingOwnAccount?: boolean;
		canManageEndUsers?: boolean;
	}) =>
		({
			determineIf: vi.fn((fn) =>
				fn({
					isEditingOwnAccount: !!permissions.isEditingOwnAccount,
					canManageEndUsers: !!permissions.canManageEndUsers,
				}),
			),
		}) as UserVisa;

	const identityDetails = {
		lastName: 'Doe',
		legalNameConsistsOfOneName: true,
		restOfName: undefined,
	};
	const contactInformation = { email: 'test@email.com' };
	const props = {
		identityDetails,
		contactInformation,
	};

	describe('when creating a new instance', () => {
		it('should return contactInformation via getter', () => {
			// Arrange
			const visa = getMockedVisa({
				isEditingOwnAccount: false,
				canManageEndUsers: false,
			});
			// Act
			const user = EndUserPersonalInformation.getNewInstance(props, visa, identityDetails, contactInformation);
			// Assert
			expect(user.contactInformation.email).toBe('test@email.com');
		});

		it('should return identityDetails via getter', () => {
			// Arrange
			const visa = getMockedVisa({
				isEditingOwnAccount: false,
				canManageEndUsers: false,
			});
			// Act
			const user = EndUserPersonalInformation.getNewInstance(props, visa, identityDetails, contactInformation);
			// Assert
			expect(user.identityDetails.lastName).toBe('Doe');
			expect(user.identityDetails.legalNameConsistsOfOneName).toBe(true);
			expect(user.identityDetails.restOfName).toBeUndefined();
		});
	});
});
