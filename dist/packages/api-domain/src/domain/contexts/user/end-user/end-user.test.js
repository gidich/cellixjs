"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const end_user_1 = require("./end-user");
const end_user_created_1 = require("../../../events/types/end-user-created");
describe('domain.contexts.end-user', () => {
    describe('when creating a new end user', () => {
        const userProps = jest.mocked({ personalInformation: { contactInformation: {}, identityDetails: {} } });
        const givenValidExternalId = '9b5b121b-7726-460c-8ead-58378c9ab29e';
        const givenValidFirstName = 'John';
        const givenValidLastName = 'Doe';
        const givenValidContext = jest.mocked({});
        givenValidContext.domainVisa = jest.mocked({});
        const mockCommunityVisa = jest.mocked({});
        const mockEndUserVisa = jest.mocked({});
        givenValidContext.domainVisa = jest.mocked({
            forCommunity: jest.fn(() => mockCommunityVisa),
            forUser: jest.fn(() => mockEndUserVisa),
            forStaffRole: jest.fn(() => mockCommunityVisa),
            forVendorUserRole: jest.fn(() => mockCommunityVisa),
            forService: jest.fn(() => ({ determineIf: () => false })),
            forEndUser: jest.fn(() => mockEndUserVisa),
            forStaffUser: jest.fn(() => ({ determineIf: () => false })),
            forVendorUser: jest.fn(() => ({ determineIf: () => false })),
            forServiceTicketV1: jest.fn(() => ({ determineIf: () => false })),
            forViolationTicketV1: jest.fn(() => ({ determineIf: () => false })),
            forEndUserRole: jest.fn(() => mockCommunityVisa),
        });
        it('should reject an invalid externalId', () => {
            // Arrange
            const givenInvalidExternalId = 'this-is-an-invalid-external-id';
            // Act
            const creatingInvalidUser = () => {
                end_user_1.EndUser.getNewUser(userProps, givenInvalidExternalId, givenValidLastName, givenValidFirstName, givenValidContext);
            };
            // Assert
            expect(creatingInvalidUser).toThrowError('Too short');
        });
        it('should reject an invalid restOfName', () => {
            // Arrange
            const givenInvalidRestOfName = 'U3edLYh3jCG6qVcJyp4VYbWVBHCD72tEWxveuKM52pp5VV77otbhztgp5HJrvRshhHxjxDTiWEsuskVBFKd2WosKOvBCvXHZMy0sE7iXzLA9q8m6vevUK0UUnUsImby5uuun3R1LbjsQucbLO9R1GLnvYBWBbvVbpT6Wycq4JDfJWfjamxLmCqxjlhFMyUDMm2XMvkKdBVfYVJ9zx13HInjGSliPOgY5Ab3gVTx0r7v6VJ5gOxfoe762uemL9u3LvNvQaR89UgopJEwIYe3UanhkqXshFxK9Ryk7C38KLRzrTqbsfLedIISlBlrGaIQlWw44ehMaFx1D7eupzO49NQn5gCMiZN3lVwK1P6Ipq2w8hLjDY17rjLYo9HIF1cTVXzIB01n7ecQfP5YB7nIAT8uFEV34RPRCS3OU6WSLuFkOeC1xb2ssMATDvRfBiuZr9yraH43jipwV3QE2g3q3FrTGvmhZrrjjjedmj0iqpRGGHZRN9z9jU';
            // Act
            const creatingInvalidUser = () => {
                end_user_1.EndUser.getNewUser(userProps, givenValidExternalId, givenValidLastName, givenInvalidRestOfName, givenValidContext);
            };
            // Assert
            expect(creatingInvalidUser).toThrowError('Too long');
        });
        it('should reject an invalid lastName', () => {
            // Arrange
            const userProps = jest.mocked({ personalInformation: { contactInformation: {}, identityDetails: {} } });
            const givenInvalidLastName = 'U3edLYh3jCG6qVcJyp4VYbWVBHCD72tEWxveuKM52pp5VV77otbhztgp5HJrvRshhHxjxDTiWEsuskVBFKd2WosKOvBCvXHZMy0sE7iXzLA9q8m6vevUK0UUnUsImby5uuun3R1LbjsQucbLO9R1GLnvYBWBbvVbpT6Wycq4JDfJWfjamxLmCqxjlhFMyUDMm2XMvkKdBVfYVJ9zx13HInjGSliPOgY5Ab3gVTx0r7v6VJ5gOxfoe762uemL9u3LvNvQaR89UgopJEwIYe3UanhkqXshFxK9Ryk7C38KLRzrTqbsfLedIISlBlrGaIQlWw44ehMaFx1D7eupzO49NQn5gCMiZN3lVwK1P6Ipq2w8hLjDY17rjLYo9HIF1cTVXzIB01n7ecQfP5YB7nIAT8uFEV34RPRCS3OU6WSLuFkOeC1xb2ssMATDvRfBiuZr9yraH43jipwV3QE2g3q3FrTGvmhZrrjjjedmj0iqpRGGHZRN9z9jU';
            // Act
            const creatingInvalidUser = () => {
                end_user_1.EndUser.getNewUser(userProps, givenValidExternalId, givenInvalidLastName, givenValidFirstName, givenValidContext);
            };
            // Assert
            expect(creatingInvalidUser).toThrowError('Too long');
        });
        it('should raise an EndUserCreatedEvent', () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const expectedNewId = '12345';
            const userProps = jest.mocked({ id: expectedNewId, personalInformation: { contactInformation: {}, identityDetails: {} } });
            // Act
            const user = end_user_1.EndUser.getNewUser(userProps, givenValidExternalId, givenValidLastName, givenValidFirstName, givenValidContext);
            // Assert
            const integrationEvent = user.getIntegrationEvents().find(e => e.aggregateId === expectedNewId && e instanceof end_user_created_1.EndUserCreatedEvent);
            expect(integrationEvent.payload.userId).toBe(expectedNewId);
        }));
        it('should set legalNameConsistsOfOneName to true when restOfName is not provided', () => {
            // Arrange
            const userProps = jest.mocked({ personalInformation: { contactInformation: {}, identityDetails: {} } });
            // Act
            const user = end_user_1.EndUser.getNewUser(userProps, givenValidExternalId, givenValidLastName, "", givenValidContext);
            // Assert
            expect(user.personalInformation.identityDetails.legalNameConsistsOfOneName).toBe(true);
        });
        it('should set legalNameConsistsOfOneName to false when restOfName is provided', () => {
            // Arrange
            const userProps = jest.mocked({ personalInformation: { contactInformation: {}, identityDetails: {} } });
            // Act
            const user = end_user_1.EndUser.getNewUser(userProps, givenValidExternalId, givenValidLastName, givenValidFirstName, givenValidContext);
            // Assert
            expect(user.personalInformation.identityDetails.legalNameConsistsOfOneName).toBe(false);
        });
    });
    describe('when updating an end user', () => {
        it('should reject an invalid email', () => {
            // Arrange
            const userProps = jest.mocked({ personalInformation: { contactInformation: {}, identityDetails: {} } });
            const givenValidContext = jest.mocked({});
            givenValidContext.domainVisa = jest.mocked({});
            const mockCommunityVisa = jest.mocked({});
            const mockEndUserVisa = jest.mocked({});
            givenValidContext.domainVisa = jest.mocked({
                forCommunity: jest.fn(() => mockCommunityVisa),
                forUser: jest.fn(() => mockEndUserVisa),
                forStaffRole: jest.fn(() => mockCommunityVisa),
                forVendorUserRole: jest.fn(() => mockCommunityVisa),
                forService: jest.fn(() => ({ determineIf: () => false })),
                forEndUser: jest.fn(() => mockEndUserVisa),
                forStaffUser: jest.fn(() => ({ determineIf: () => false })),
                forVendorUser: jest.fn(() => ({ determineIf: () => false })),
                forServiceTicketV1: jest.fn(() => ({ determineIf: () => false })),
                forViolationTicketV1: jest.fn(() => ({ determineIf: () => false })),
                forEndUserRole: jest.fn(() => mockCommunityVisa),
            });
            const user = new end_user_1.EndUser(userProps, givenValidContext);
            const givenInvalidEmail = 'bad-email';
            // Act
            const updatingUserWithInvalidProperty = () => {
                user.personalInformation.contactInformation.Email = (givenInvalidEmail);
            };
            // Assert
            expect(updatingUserWithInvalidProperty).toThrowError('Value doesn\'t match pattern');
        });
        it('should update a valid email', () => {
            // Arrange
            const userProps = jest.mocked({ personalInformation: { contactInformation: {} } });
            const givenValidContext = jest.mocked({});
            givenValidContext.domainVisa = jest.mocked({});
            const mockCommunityVisa = jest.mocked({});
            const mockEndUserVisa = jest.mocked({});
            givenValidContext.domainVisa = jest.mocked({
                forCommunity: jest.fn(() => mockCommunityVisa),
                forUser: jest.fn(() => mockEndUserVisa),
                forStaffRole: jest.fn(() => mockCommunityVisa),
                forVendorUserRole: jest.fn(() => mockCommunityVisa),
                forService: jest.fn(() => ({ determineIf: () => false })),
                forEndUser: jest.fn(() => mockEndUserVisa),
                forStaffUser: jest.fn(() => ({ determineIf: () => false })),
                forVendorUser: jest.fn(() => ({ determineIf: () => false })),
                forServiceTicketV1: jest.fn(() => ({ determineIf: () => false })),
                forViolationTicketV1: jest.fn(() => ({ determineIf: () => false })),
                forEndUserRole: jest.fn(() => mockCommunityVisa),
            });
            const user = new end_user_1.EndUser(userProps, givenValidContext);
            const givenValidEmail = 'test@email.com';
            // Act
            const updatingUserWithValidProperty = () => {
                user.personalInformation.contactInformation.Email = (givenValidEmail);
            };
            // Assert
            expect(updatingUserWithValidProperty).not.toThrow();
        });
    });
});
//# sourceMappingURL=end-user.test.js.map