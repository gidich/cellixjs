import { EndUserIdentityDetails } from './end-user-identity-details.ts';
import type { UserVisa } from '../user.visa.ts';
import { describe, it, expect, vi } from 'vitest';

describe('domain.contexts.end-user-identity-details', () => {
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
		}) as unknown as UserVisa;

	describe('when creating a new instance', () => {
		it('should accept valid input', () => {
			// Arrange
			const visa = getMockedVisa({});

			// Act
			const details = EndUserIdentityDetails.getNewInstance(
				{ lastName: 'Doe', legalNameConsistsOfOneName: true, restOfName: undefined },
				visa,
				'Doe',
				true,
				undefined
			);

			// Assert
			expect(details.lastName).toBe('Doe');
			expect(details.legalNameConsistsOfOneName).toBe(true);
			expect(details.restOfName).toBeUndefined();
		});

		it('should reject an invalid lastName - too long', () => {
			// Arrange
			const visa = getMockedVisa({});

			// Act
			const createInvalid = () =>
				EndUserIdentityDetails.getNewInstance(
					{ lastName: 'a'.repeat(51), legalNameConsistsOfOneName: true, restOfName: undefined },
					visa,
					'a'.repeat(51),
					true,
					undefined
				);

			// Assert
			expect(createInvalid).toThrow('Too long');
		});

		it('should reject an invalid restOfName - too long', () => {
			// Arrange
			const visa = getMockedVisa({});

			// Act
			const createInvalid = () =>
				EndUserIdentityDetails.getNewInstance(
					{ lastName: 'Doe', legalNameConsistsOfOneName: false, restOfName: 'a'.repeat(51) },
					visa,
					'Doe',
					false,
					'a'.repeat(51)
				);

			// Assert
			expect(createInvalid).toThrow('Too long');
		});
	});

	describe('when updating an existing instance', () => {
		const baseProps = {
			lastName: 'Doe',
			legalNameConsistsOfOneName: true,
			restOfName: undefined,
		};

		it('should throw when updating lastName without any permissions', () => {
			// Arrange
			const visa = getMockedVisa({});
			const details = new EndUserIdentityDetails(baseProps, visa);

			// Act
			const update = () => {
				details.lastName = 'Smith';
			};

			// Assert
			expect(update).toThrow('Cannot set identity details');
		});

		it('should allow updating lastName with isEditingOwnAccount permission', () => {
			// Arrange
			const visa = getMockedVisa({ isEditingOwnAccount: true });
			const details = new EndUserIdentityDetails(baseProps, visa);

			// Act
			const update = () => {
				details.lastName = 'Smith';
			};

			// Assert
			expect(update).not.toThrow();
			expect(details.lastName).toBe('Smith');
		});

		it('should allow updating lastName with canManageEndUsers permission', () => {
			// Arrange
			const visa = getMockedVisa({ canManageEndUsers: true });
			const details = new EndUserIdentityDetails(baseProps, visa);

			// Act
			const update = () => {
				details.lastName = 'Smith';
			};

			// Assert
			expect(update).not.toThrow();
			expect(details.lastName).toBe('Smith');
		});

		it('should throw for invalid lastName when updating', () => {
			// Arrange
			const visa = getMockedVisa({ isEditingOwnAccount: true });
			const details = new EndUserIdentityDetails(baseProps, visa);

			// Act
			const update = () => {
				details.lastName = 'a'.repeat(51);
			};

			// Assert
			expect(update).toThrow('Too long');
		});

		it('should allow updating legalNameConsistsOfOneName with permission', () => {
			// Arrange
			const visa = getMockedVisa({ canManageEndUsers: true });
			const details = new EndUserIdentityDetails(baseProps, visa);

			// Act
			const update = () => {
				details.legalNameConsistsOfOneName = false;
			};

			// Assert
			expect(update).not.toThrow();
			expect(details.legalNameConsistsOfOneName).toBe(false);
		});

		it('should throw when updating legalNameConsistsOfOneName without permission', () => {
			// Arrange
			const visa = getMockedVisa({});
			const details = new EndUserIdentityDetails(baseProps, visa);

			// Act
			const update = () => {
				details.legalNameConsistsOfOneName = false;
			};

			// Assert
			expect(update).toThrow('Cannot set identity details');
		});

		it('should allow updating restOfName with permission', () => {
			// Arrange
			const visa = getMockedVisa({ isEditingOwnAccount: true });
			const details = new EndUserIdentityDetails(baseProps, visa);

			// Act
			const update = () => {
				details.restOfName = 'John';
			};

			// Assert
			expect(update).not.toThrow();
			expect(details.restOfName).toBe('John');
		});

		it('should throw when updating restOfName without permission', () => {
			// Arrange
			const visa = getMockedVisa({});
			const details = new EndUserIdentityDetails(baseProps, visa);

			// Act
			const update = () => {
				details.restOfName = 'John';
			};

			// Assert
			expect(update).toThrow('Cannot set identity details');
		});

		it('should throw for invalid restOfName when updating', () => {
			// Arrange
			const visa = getMockedVisa({ canManageEndUsers: true });
			const details = new EndUserIdentityDetails(baseProps, visa);

			// Act
			const update = () => {
				details.restOfName = 'a'.repeat(51);
			};

			// Assert
			expect(update).toThrow('Too long');
		});

		it('should set legalNameConsistsOfOneName to false when restOfName is set to a value', () => {
			// Arrange
			const visa = getMockedVisa({ isEditingOwnAccount: true });
			const details = new EndUserIdentityDetails(
				{ lastName: 'Doe', legalNameConsistsOfOneName: true, restOfName: undefined },
				visa
			);
			
			// Act
			details.restOfName = 'John';

			// Assert
			expect(details.legalNameConsistsOfOneName).toBe(false);
		});

		it('should set legalNameConsistsOfOneName to true when restOfName is set to undefined', () => {
			// Arrange
			const visa = getMockedVisa({ isEditingOwnAccount: true });
			const details = new EndUserIdentityDetails(
				{ lastName: 'Doe', legalNameConsistsOfOneName: false, restOfName: 'John' },
				visa
			);

			// Act
			details.restOfName = undefined;

			// Assert
			expect(details.legalNameConsistsOfOneName).toBe(true);
		});

		it('should set legalNameConsistsOfOneName to true when restOfName is set to empty string', () => {
			// Arrange
			const visa = getMockedVisa({ isEditingOwnAccount: true });
			const details = new EndUserIdentityDetails(
				{ lastName: 'Doe', legalNameConsistsOfOneName: false, restOfName: 'John' },
				visa
			);

			// Act
			details.restOfName = '';
			
			// Assert
			expect(details.legalNameConsistsOfOneName).toBe(true);
		});
	});
});
