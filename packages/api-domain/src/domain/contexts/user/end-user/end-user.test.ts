import { EndUser, type EndUserProps } from './end-user.ts';
import { EndUserCreatedEvent } from '../../../events/types/end-user-created.ts';
import type { Passport } from '../../passport.ts';
import type { UserDomainPermissions } from '../user.domain-permissions.ts';
import type { UserPassport } from '../user.passport.ts';
import type { UserVisa } from '../user.visa.ts';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('domain.contexts.end-user', () => {
	/**
	 * @param {Partial<CommunityDomainPermissions>} partialPermissions - Only need to define permissions that you want to be true, others will be false
	 * @returns {Passport}
	 */
	const getMockedPassport: (
		partialPermissions: Partial<UserDomainPermissions>,
	) => Passport = (partialPermissions) => {
		const givenValidPassport = vi.mocked({} as Passport);
		givenValidPassport.user = vi.mocked({
			forStaffRole: vi.fn((_root) => ({
				determineIf: (
					fn: (permissions: Readonly<UserDomainPermissions>) => boolean,
				) => fn(partialPermissions as UserDomainPermissions),
			} as UserVisa)),
			forEndUser: vi.fn((_root) => ({
				determineIf: (
					fn: (permissions: Readonly<UserDomainPermissions>) => boolean,
				) => fn(partialPermissions as UserDomainPermissions),
			} as UserVisa)),
			forStaffUser: vi.fn((_root) => ({
				determineIf: (
					fn: (permissions: Readonly<UserDomainPermissions>) => boolean,
				) => fn(partialPermissions as UserDomainPermissions),
			} as UserVisa)),
			forVendorUser: vi.fn((_root) => ({
				determineIf: (
					fn: (permissions: Readonly<UserDomainPermissions>) => boolean,
				) => fn(partialPermissions as UserDomainPermissions),
			} as UserVisa)),
		} as UserPassport);

		return givenValidPassport;
	};

	describe('when creating a new end user', () => {
		const givenValidPassport = getMockedPassport({
			canManageEndUsers: false,
            isEditingOwnAccount: false,
		});
		const userProps = vi.mocked({
			personalInformation: { contactInformation: {}, identityDetails: {} },
		} as EndUserProps);
		const givenValidExternalId = '9b5b121b-7726-460c-8ead-58378c9ab29e';
		const givenRestOfName = 'John';
		const givenValidLastName = 'Doe';
		const givenEmail = 'john.doe@example.com';

		it('should reject an invalid externalId', () => {
			// Arrange
			const givenInvalidExternalId = 'this-is-an-invalid-external-id';

			// Act
			const creatingInvalidUser = () => {
				EndUser.getNewInstance(
					userProps,
					givenValidPassport,
					givenInvalidExternalId,
					givenValidLastName,
					givenRestOfName,
					givenEmail,
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
				EndUser.getNewInstance(
					userProps,
					givenValidPassport,
					givenValidExternalId,
					givenValidLastName,
					givenInvalidRestOfName,
					givenEmail,
				);
			};

			// Assert
			expect(creatingInvalidUser).toThrow('Too long');
		});

		it('should reject an invalid lastName', () => {
			// Arrange
			const userProps = vi.mocked({
				personalInformation: { contactInformation: {}, identityDetails: {} },
			} as EndUserProps);
			const givenInvalidLastName =
				'U3edLYh3jCG6qVcJyp4VYbWVBHCD72tEWxveuKM52pp5VV77otbhztgp5HJrvRshhHxjxDTiWEsuskVBFKd2WosKOvBCvXHZMy0sE7iXzLA9q8m6vevUK0UUnUsImby5uuun3R1LbjsQucbLO9R1GLnvYBWBbvVbpT6Wycq4JDfJWfjamxLmCqxjlhFMyUDMm2XMvkKdBVfYVJ9zx13HInjGSliPOgY5Ab3gVTx0r7v6VJ5gOxfoe762uemL9u3LvNvQaR89UgopJEwIYe3UanhkqXshFxK9Ryk7C38KLRzrTqbsfLedIISlBlrGaIQlWw44ehMaFx1D7eupzO49NQn5gCMiZN3lVwK1P6Ipq2w8hLjDY17rjLYo9HIF1cTVXzIB01n7ecQfP5YB7nIAT8uFEV34RPRCS3OU6WSLuFkOeC1xb2ssMATDvRfBiuZr9yraH43jipwV3QE2g3q3FrTGvmhZrrjjjedmj0iqpRGGHZRN9z9jU';

			// Act
			const creatingInvalidUser = () => {
				EndUser.getNewInstance(
					userProps,
					givenValidPassport,
					givenValidExternalId,
					givenInvalidLastName,
					givenRestOfName,
					givenEmail,
				);
			};

			// Assert
			expect(creatingInvalidUser).toThrow('Too long');
		});

		it('should raise an EndUserCreatedEvent', () => {
			// Arrange
			const expectedNewId = '12345';
			const userProps = vi.mocked({
				id: expectedNewId,
				personalInformation: { contactInformation: {}, identityDetails: {} },
			} as EndUserProps);

			// Act
			const user = EndUser.getNewInstance(
				userProps,
				givenValidPassport,
				givenValidExternalId,
				givenValidLastName,
				givenRestOfName,
				givenEmail,
			);

			// Assert
			const integrationEvent = user
				.getIntegrationEvents()
				.find(
					(e) =>
						e.aggregateId === expectedNewId && e instanceof EndUserCreatedEvent,
				) as EndUserCreatedEvent;
			expect(integrationEvent.payload.userId).toBe(expectedNewId);
            expect(user.externalId).toBe(givenValidExternalId);
            expect(user.tags).toEqual([]);
		});

		it('should set legalNameConsistsOfOneName to true when restOfName is not provided', () => {
			// Arrange
			const userProps = vi.mocked({
				personalInformation: { contactInformation: {}, identityDetails: {} },
			} as EndUserProps);

			// Act
			const user = EndUser.getNewInstance(
				userProps,
				givenValidPassport,
				givenValidExternalId,
				givenValidLastName,
				'',
				givenEmail,
			);

            const user2 = EndUser.getNewInstance(
				userProps,
				givenValidPassport,
				givenValidExternalId,
				givenValidLastName,
				undefined,
				givenEmail,
			);

			// Assert
			expect(
				user.personalInformation.identityDetails.legalNameConsistsOfOneName,
			).toBe(true);
            expect(
                user2.personalInformation.identityDetails.legalNameConsistsOfOneName,
            ).toBe(true);
            expect(user.displayName).toBe(givenValidLastName);
            expect(user2.displayName).toBe(givenValidLastName);
		});

		it('should set legalNameConsistsOfOneName to false when restOfName is provided', () => {
			// Arrange
			const userProps = vi.mocked({
                personalInformation: { contactInformation: {}, identityDetails: {} },
			} as EndUserProps);

			// Act
			const user = EndUser.getNewInstance(
				userProps,
				givenValidPassport,
				givenValidExternalId,
				givenValidLastName,
				givenRestOfName,
				givenEmail,
			);

			// Assert
			expect(
				user.personalInformation.identityDetails.legalNameConsistsOfOneName,
			).toBe(false);
		});
	});

	describe('when updating an end user', () => {
        const now = new Date();
        let user: EndUser<EndUserProps>;
        let userProps: EndUserProps;

        const baseUserProps = vi.mocked({
            userType: "end-user",
            tags: [],
            email: "old@email.com",
            displayName: "Test User",
            externalId: "some-external-id",
            accessBlocked: false,
            createdAt: now,
            updatedAt: now,
            id: "user-id",
            schemaVersion: "1",
            personalInformation: {
                contactInformation: {
                    email: "old@email.com",
                },
                identityDetails: {
                    lastName: "Test",
                    legalNameConsistsOfOneName: true,
                    restOfName: undefined,
                },
            },
        } as EndUserProps);

		beforeEach(() => {
            userProps = JSON.parse(JSON.stringify(baseUserProps));
            const givenValidPassport = getMockedPassport({
                isEditingOwnAccount: true,
            });

            user = new EndUser(userProps, givenValidPassport);
        });

        it('should throw when setting email without validated visa', () => {
            // Arrange
            const noPermissionsPassport = getMockedPassport({
                isEditingOwnAccount: false,
                canManageEndUsers: false,
            });
            const userWithoutPermissions = new EndUser(userProps, noPermissionsPassport);
            const givenValidEmail = 'test@email.com';

            // Act
            const updatingUserWithValidProperty = () => {
                userWithoutPermissions.email = givenValidEmail;
            };

            // Assert
            expect(updatingUserWithValidProperty).toThrow('Unauthorized');
        });
        
		it('should reject an invalid email - bad pattern', () => {
			// Arrange
			const givenInvalidEmail = 'bad-email';

			// Act
			const updatingUserWithInvalidProperty = () => {
				user.email = givenInvalidEmail;
			};

			// Assert
			expect(updatingUserWithInvalidProperty).toThrow(
				"Value doesn't match pattern",
			);
		});
                
		it('should reject an invalid email - too long', () => {
			// Arrange
			const givenInvalidEmail = `${'a'.repeat(245)}@email.com`;

			// Act
			const updatingUserWithInvalidProperty = () => {
				user.email = givenInvalidEmail;
			};

			// Assert
			expect(updatingUserWithInvalidProperty).toThrow('Too long');
		});

		it('should update a valid email', () => {
			// Arrange
			const givenValidEmail = `${'a'.repeat(244)}@email.com`;

			// Act
			const updatingUserWithValidProperty = () => {
				user.email = givenValidEmail;
			};

			// Assert
			expect(updatingUserWithValidProperty).not.toThrow();
            expect(user.email).toBe(givenValidEmail);
		});

        it('should throw when setting displayName without validated visa', () => {
            // Arrange
            const noPermissionsPassport = getMockedPassport({
                isEditingOwnAccount: false,
                canManageEndUsers: false,   
            });
            const userProps = JSON.parse(JSON.stringify(baseUserProps));
            const userWithoutPermissions = new EndUser(userProps, noPermissionsPassport);
            const givenValidDisplayName = 'Test User';

            // Act
            const updatingUserWithValidProperty = () => {
                userWithoutPermissions.displayName = givenValidDisplayName;
            };

            // Assert
            expect(updatingUserWithValidProperty).toThrow('Unauthorized');
        });

        it('should reject an invalid displayName - too long', () => {
            // Arrange
            const givenInvalidDisplayName = 'a'.repeat(101);

            // Act
            const updatingUserWithInvalidProperty = () => {
                user.displayName = givenInvalidDisplayName;
            };

            // Assert
            expect(updatingUserWithInvalidProperty).toThrow('Too long');
        });

        it('should accept a valid displayName', () => {
            // Arrange
            const givenValidDisplayName = 'a'.repeat(100);

            // Act
            const updatingUserWithValidProperty = () => {
                user.displayName = givenValidDisplayName;
            };

            // Assert
            expect(updatingUserWithValidProperty).not.toThrow();
            expect(user.displayName).toBe(givenValidDisplayName);
        });

        it('should throw when setting externalId if not new', () => {
            // Arrange
            const elevatedPassport = getMockedPassport({ canManageEndUsers: true });
            const elevatedUser = new EndUser(user.props, elevatedPassport);

            // Act
            const updatingUserWithValidProperty = () => {
                elevatedUser.externalId = '9b5b121b-7726-460c-8ead-58378c9ab29e';
            };

            // Assert
            expect(updatingUserWithValidProperty).toThrow('Cannot set personal information');
        });

        it('should throw when setting accessBlocked without validated elevated visa', () => {
            // Arrange
            const givenValidAccessBlocked = true;

            // Act
            const updatingUserWithValidProperty = () => {
                user.accessBlocked = givenValidAccessBlocked;
            };

            // Assert
            expect(updatingUserWithValidProperty).toThrow('Unauthorized');
        });

        it('should update accessBlocked with validated elevated visa', () => {
            // Arrange
            const elevatedPassport = getMockedPassport({ canManageEndUsers: true });
            const elevatedUser = new EndUser(user.props, elevatedPassport);
            const givenValidAccessBlocked = true;

            // Act
            const updatingUserWithValidProperty = () => {
                elevatedUser.accessBlocked = givenValidAccessBlocked;
            };

            // Assert
            expect(updatingUserWithValidProperty).not.toThrow();
            expect(elevatedUser.accessBlocked).toBe(givenValidAccessBlocked);
        });

        it('should throw setting tags without validated elevated visa', () => {
            // Arrange
            const givenValidTags = ['tag1', 'tag2'];

            // Act
            const updatingUserWithValidProperty = () => {
                user.tags = givenValidTags;
            };

            // Assert
            expect(updatingUserWithValidProperty).toThrow('Unauthorized');
        });

        it('should update tags with validated elevated visa', () => {
            // Arrange
            const elevatedPassport = getMockedPassport({ canManageEndUsers: true });
            const elevatedUser = new EndUser(user.props, elevatedPassport);
            const givenValidTags = ['tag1', 'tag2'];

            // Act
            const updatingUserWithValidProperty = () => {
                elevatedUser.tags = givenValidTags;
            };

            // Assert
            expect(updatingUserWithValidProperty).not.toThrow();
            expect(elevatedUser.tags).toEqual(givenValidTags);
        });

        it('should get all readonly properties', () => {
			expect(user.userType).toBe("end-user");
			expect(new Date(user.createdAt).getTime()).toEqual(new Date(now).getTime());
			expect(new Date(user.updatedAt).getTime()).toEqual(new Date(now).getTime());
			expect(user.schemaVersion).toBe("1");
			expect(user.tags).toEqual([]);
		});
	});
});
