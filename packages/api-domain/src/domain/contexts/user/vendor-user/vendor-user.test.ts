import { VendorUser, type VendorUserProps } from './vendor-user.ts';
import { VendorUserCreatedEvent } from '../../../events/types/vendor-user-created.ts';
import type { CommunityVisa } from '../../community/community.visa.ts';
import type { CommunityDomainPermissions } from '../../community/community.domain-permissions.ts';
import type { CommunityPassport } from '../../community/community.passport.ts';
import type { Passport } from '../../passport.ts';
import type { UserDomainPermissions } from '../user.domain-permissions.ts';

describe('domain.contexts.end-user', () => {
	/**
	 * @param {Partial<CommunityDomainPermissions>} partialPermissions - Only need to define permissions that you want to be true, others will be false
	 * @returns {Passport}
	 */
	const getMockedPassport: (
		partialPermissions: Partial<UserDomainPermissions>,
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

	describe('when creating a new end user', () => {
		const givenValidPassport = getMockedPassport({
			canManageVendorUsers: true,
		});
		const userProps = jest.mocked({
			personalInformation: { contactInformation: {}, identityDetails: {} },
		} as VendorUserProps);
		const givenValidExternalId = '9b5b121b-7726-460c-8ead-58378c9ab29e';
		const givenValidRestOfName = 'John';
		const givenValidLastName = 'Doe';

		it('should reject an invalid externalId', () => {
			// Arrange
			const givenInvalidExternalId = 'this-is-an-invalid-external-id';

			// Act
			const creatingInvalidUser = () => {
				VendorUser.getNewUser(
					userProps,
					givenValidPassport,
					givenInvalidExternalId,
					givenValidLastName,
					givenValidRestOfName,
				);
			};

			// Assert
			expect(creatingInvalidUser).toThrow('Too short');
		});

		it('should reject an invalid restOfName', () => {
			// Arrange
			const givenInvalidRestOfName =
				'U3edLYh3jCG6qVcJyp4VYbWVBHCD72tEWxveuKM52pp5VV77otbhztgp5HJrvRshhHxjxDTiWEsuskVBFKd2WosKOvBCvXHZMy0sE7iXzLA9q8m6vevUK0UUnUsImby5uuun3R1LbjsQucbLO9R1GLnvYBWBbvVbpT6Wycq4JDfJWfjamxLmCqxjlhFMyUDMm2XMvkKdBVfYVJ9zx13HInjGSliPOgY5Ab3gVTx0r7v6VJ5gOxfoe762uemL9u3LvNvQaR89UgopJEwIYe3UanhkqXshFxK9Ryk7C38KLRzrTqbsfLedIISlBlrGaIQlWw44ehMaFx1D7eupzO49NQn5gCMiZN3lVwK1P6Ipq2w8hLjDY17rjLYo9HIF1cTVXzIB01n7ecQfP5YB7nIAT8uFEV34RPRCS3OU6WSLuFkOeC1xb2ssMATDvRfBiuZr9yraH43jipwV3QE2g3q3FrTGvmhZrrjjjedmj0iqpRGGHZRN9z9jU';

			// Act
			const creatingInvalidUser = () => {
				VendorUser.getNewUser(
					userProps,
					givenValidPassport,
					givenValidExternalId,
					givenValidLastName,
					givenInvalidRestOfName,
				);
			};

			// Assert
			expect(creatingInvalidUser).toThrow('Too long');
		});

		it('should reject an invalid lastName', () => {
			// Arrange
			const userProps = jest.mocked({
				personalInformation: { contactInformation: {}, identityDetails: {} },
			} as VendorUserProps);
			const givenInvalidLastName =
				'U3edLYh3jCG6qVcJyp4VYbWVBHCD72tEWxveuKM52pp5VV77otbhztgp5HJrvRshhHxjxDTiWEsuskVBFKd2WosKOvBCvXHZMy0sE7iXzLA9q8m6vevUK0UUnUsImby5uuun3R1LbjsQucbLO9R1GLnvYBWBbvVbpT6Wycq4JDfJWfjamxLmCqxjlhFMyUDMm2XMvkKdBVfYVJ9zx13HInjGSliPOgY5Ab3gVTx0r7v6VJ5gOxfoe762uemL9u3LvNvQaR89UgopJEwIYe3UanhkqXshFxK9Ryk7C38KLRzrTqbsfLedIISlBlrGaIQlWw44ehMaFx1D7eupzO49NQn5gCMiZN3lVwK1P6Ipq2w8hLjDY17rjLYo9HIF1cTVXzIB01n7ecQfP5YB7nIAT8uFEV34RPRCS3OU6WSLuFkOeC1xb2ssMATDvRfBiuZr9yraH43jipwV3QE2g3q3FrTGvmhZrrjjjedmj0iqpRGGHZRN9z9jU';

			// Act
			const creatingInvalidUser = () => {
				VendorUser.getNewUser(
					userProps,
					givenValidPassport,
					givenValidExternalId,
					givenInvalidLastName,
					givenValidRestOfName,
				);
			};

			// Assert
			expect(creatingInvalidUser).toThrow('Too long');
		});

		it('should raise an VendorUserCreatedEvent', () => {
			// Arrange
			const expectedNewId = '12345';
			const userProps = jest.mocked({
				id: expectedNewId,
				personalInformation: { contactInformation: {}, identityDetails: {} },
			} as VendorUserProps);

			// Act
			const user = VendorUser.getNewUser(
				userProps,
				givenValidPassport,
				givenValidExternalId,
				givenValidLastName,
				givenValidRestOfName,
			);

			// Assert
			const integrationEvent = user
				.getIntegrationEvents()
				.find(
					(e) =>
						e.aggregateId === expectedNewId &&
						e instanceof VendorUserCreatedEvent,
				) as VendorUserCreatedEvent;
			expect(integrationEvent.payload.userId).toBe(expectedNewId);
		});

		it('should set legalNameConsistsOfOneName to true when restOfName is not provided', () => {
			// Arrange
			const userProps = jest.mocked({
				personalInformation: { contactInformation: {}, identityDetails: {} },
			} as VendorUserProps);

			// Act
			const user = VendorUser.getNewUser(
				userProps,
				givenValidPassport,
				givenValidExternalId,
				givenValidLastName,
			);

			// Assert
			expect(
				user.personalInformation.identityDetails.legalNameConsistsOfOneName,
			).toBe(true);
		});

		it('should set legalNameConsistsOfOneName to false when restOfName is provided', () => {
			// Arrange
			const userProps = jest.mocked({
				personalInformation: { contactInformation: {}, identityDetails: {} },
			} as VendorUserProps);

			// Act
			const user = VendorUser.getNewUser(
				userProps,
				givenValidPassport,
				givenValidExternalId,
				givenValidLastName,
				givenValidRestOfName,
			);

			// Assert
			expect(
				user.personalInformation.identityDetails.legalNameConsistsOfOneName,
			).toBe(false);
		});
	});

	describe('when updating an end user', () => {
		const givenValidPassport = getMockedPassport({
			canManageVendorUsers: true,
		});
		it('should reject an invalid email', () => {
			// Arrange
			const userProps = jest.mocked({
				personalInformation: { contactInformation: {}, identityDetails: {} },
			} as VendorUserProps);
			const user = new VendorUser(userProps, givenValidPassport);
			const givenInvalidEmail = 'bad-email';

			// Act
			const updatingUserWithInvalidProperty = () => {
				user.personalInformation.contactInformation.email = givenInvalidEmail;
			};

			// Assert
			expect(updatingUserWithInvalidProperty).toThrow(
				"Value doesn't match pattern",
			);
		});

		it('should update a valid email', () => {
			// Arrange
			const userProps = jest.mocked({
				personalInformation: { contactInformation: {} },
			} as VendorUserProps);

			const user = new VendorUser(userProps, givenValidPassport);
			const givenValidEmail = 'test@email.com';

			// Act
			const updatingUserWithValidProperty = () => {
				user.personalInformation.contactInformation.email = givenValidEmail;
			};

			// Assert
			expect(updatingUserWithValidProperty).not.toThrow();
		});
	});
});
