import { StaffUser, type StaffUserProps } from './staff-user.ts';
import { StaffUserCreatedEvent } from '../../../events/types/staff-user-created.ts';
import type { Passport } from '../../passport.ts';
import type { UserDomainPermissions } from '../user.domain-permissions.ts';
import type { UserPassport } from '../user.passport.ts';
import type { UserVisa } from '../user.visa.ts';

describe('domain.contexts.staff-user', () => {
	/**
	 * @param {Partial<CommunityDomainPermissions>} partialPermissions - Only need to define permissions that you want to be true, others will be false
	 * @returns {Passport}
	 */
	const getMockedPassport: (
		partialPermissions: Partial<UserDomainPermissions>
	) => Passport = (partialPermissions) => {
		const mockUserVisa = jest.mocked({
			determineIf: (
				fn: (permissions: Readonly<UserDomainPermissions>) => boolean
			) => {
				return fn(partialPermissions as UserDomainPermissions);
			}
		} as UserVisa);

		const givenValidPassport = jest.mocked({} as Passport);
		givenValidPassport.user = jest.mocked({
			forStaffRole: jest.fn(() => mockUserVisa),
			forEndUser: jest.fn(() => mockUserVisa),
			forStaffUser: jest.fn(() => mockUserVisa),
			forVendorUser: jest.fn(() => mockUserVisa)
		} as UserPassport);

		return givenValidPassport;
	};

	describe('when creating a new staff user', () => {
		const givenValidPassport = getMockedPassport({
			canManageStaffRolesAndPermissions: true
		});
		const givenValidExternalId = '9b5b121b-7726-460c-8ead-58378c9ab29e';
		const givenValidRestOfName = 'John';
		const givenValidLastName = 'Doe';
		const givenValidEmail = 'john.doe@email.com';

		it('should reject an invalid externalId', () => {
			// Arrange
			const givenInvalidExternalId = 'this-is-an-invalid-external-id';
			const userProps = jest.mocked({} as StaffUserProps);

			// Act
			const creatingInvalidUser = () => {
				StaffUser.getNewUser(
					userProps,
					givenValidPassport,
					givenInvalidExternalId,
					givenValidRestOfName,
					givenValidLastName,
					givenValidEmail
				);
			};

			// Assert
			expect(creatingInvalidUser).toThrow('Too short');
		});

		it('should reject an invalid restOfName', () => {
			// Arrange
			const userProps = jest.mocked({} as StaffUserProps);
			const givenInvalidRestOfName =
				'U3edLYh3jCG6qVcJyp4VYbWVBHCD72tEWxveuKM52pp5VV77otbhztgp5HJrvRshhHxjxDTiWEsuskVBFKd2WosKOvBCvXHZMy0sE7iXzLA9q8m6vevUK0UUnUsImby5uuun3R1LbjsQucbLO9R1GLnvYBWBbvVbpT6Wycq4JDfJWfjamxLmCqxjlhFMyUDMm2XMvkKdBVfYVJ9zx13HInjGSliPOgY5Ab3gVTx0r7v6VJ5gOxfoe762uemL9u3LvNvQaR89UgopJEwIYe3UanhkqXshFxK9Ryk7C38KLRzrTqbsfLedIISlBlrGaIQlWw44ehMaFx1D7eupzO49NQn5gCMiZN3lVwK1P6Ipq2w8hLjDY17rjLYo9HIF1cTVXzIB01n7ecQfP5YB7nIAT8uFEV34RPRCS3OU6WSLuFkOeC1xb2ssMATDvRfBiuZr9yraH43jipwV3QE2g3q3FrTGvmhZrrjjjedmj0iqpRGGHZRN9z9jU';

			// Act
			const creatingInvalidUser = () => {
				StaffUser.getNewUser(
					userProps,
					givenValidPassport,
					givenValidExternalId,
					givenInvalidRestOfName,
					givenValidLastName,
					givenValidEmail
				);
			};

			// Assert
			expect(creatingInvalidUser).toThrow('Too long');
		});

		it('should reject an invalid lastName', () => {
			// Arrange
			const userProps = jest.mocked({} as StaffUserProps);
			const givenInvalidLastName =
				'U3edLYh3jCG6qVcJyp4VYbWVBHCD72tEWxveuKM52pp5VV77otbhztgp5HJrvRshhHxjxDTiWEsuskVBFKd2WosKOvBCvXHZMy0sE7iXzLA9q8m6vevUK0UUnUsImby5uuun3R1LbjsQucbLO9R1GLnvYBWBbvVbpT6Wycq4JDfJWfjamxLmCqxjlhFMyUDMm2XMvkKdBVfYVJ9zx13HInjGSliPOgY5Ab3gVTx0r7v6VJ5gOxfoe762uemL9u3LvNvQaR89UgopJEwIYe3UanhkqXshFxK9Ryk7C38KLRzrTqbsfLedIISlBlrGaIQlWw44ehMaFx1D7eupzO49NQn5gCMiZN3lVwK1P6Ipq2w8hLjDY17rjLYo9HIF1cTVXzIB01n7ecQfP5YB7nIAT8uFEV34RPRCS3OU6WSLuFkOeC1xb2ssMATDvRfBiuZr9yraH43jipwV3QE2g3q3FrTGvmhZrrjjjedmj0iqpRGGHZRN9z9jU';

			// Act
			const creatingInvalidUser = () => {
				StaffUser.getNewUser(
					userProps,
					givenValidPassport,
					givenValidExternalId,
					givenValidRestOfName,
					givenInvalidLastName,
					givenValidEmail
				);
			};

			// Assert
			expect(creatingInvalidUser).toThrow('Too long');
		});

		it('should raise a StaffUserCreatedEvent', () => {
			// Arrange
			const expectedNewId = '12345';
			const userProps = jest.mocked({ id: expectedNewId } as StaffUserProps);

			// Act
			const user = StaffUser.getNewUser(
				userProps,
				givenValidPassport,
				givenValidExternalId,
				givenValidRestOfName,
				givenValidLastName,
				givenValidEmail
			);

			// Assert
			const integrationEvent = user
				.getIntegrationEvents()
				.find(
					(e) =>
						e.aggregateId === expectedNewId &&
						e instanceof StaffUserCreatedEvent
				) as StaffUserCreatedEvent;
			expect(integrationEvent.payload.externalId).toBe(givenValidExternalId);
		});
	});

	describe('when updating a staff user', () => {
		const givenValidPassport = getMockedPassport({
			canManageStaffRolesAndPermissions: true
		});
		it('should reject an invalid email', () => {
			// Arrange
			const userProps = jest.mocked({} as StaffUserProps);

			const user = new StaffUser(userProps, givenValidPassport);
			const givenInvalidEmail = 'bad-email';

			// Act
			const updatingUserWithInvalidProperty = () => {
				user.email = givenInvalidEmail;
			};

			// Assert
			expect(updatingUserWithInvalidProperty).toThrow(
				"Value doesn't match pattern"
			);
		});
	});
});
