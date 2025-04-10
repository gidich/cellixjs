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
const staff_user_1 = require("./staff-user");
const staff_user_created_1 = require("../../../events/types/staff-user-created");
describe('domain.contexts.staff-user', () => {
    describe('when creating a new staff user', () => {
        const givenValidExternalId = '9b5b121b-7726-460c-8ead-58378c9ab29e';
        const givenValidRestOfName = 'John';
        const givenValidLastName = 'Doe';
        const givenValidEmail = 'john.doe@email.com';
        const givenValidContext = jest.mocked({});
        givenValidContext.domainVisa = jest.mocked({});
        const mockCommunityVisa = jest.mocked({});
        const mockStaffUserVisa = jest.mocked({}); // Mock the constructor
        givenValidContext.domainVisa = jest.mocked({
            forCommunity: jest.fn(() => mockCommunityVisa),
            forUser: jest.fn(() => ({ determineIf: () => false })),
            forStaffRole: jest.fn(() => mockCommunityVisa),
            forVendorUserRole: jest.fn(() => mockCommunityVisa),
            forService: jest.fn(() => ({ determineIf: () => false })),
            forEndUser: jest.fn(() => ({ determineIf: () => false })),
            forStaffUser: jest.fn(() => mockStaffUserVisa),
            forVendorUser: jest.fn(() => ({ determineIf: () => false })),
            forServiceTicketV1: jest.fn(() => ({ determineIf: () => false })),
            forViolationTicketV1: jest.fn(() => ({ determineIf: () => false })),
            forEndUserRole: jest.fn(() => mockCommunityVisa),
        });
        it('should reject an invalid externalId', () => {
            // Arrange
            const givenInvalidExternalId = 'this-is-an-invalid-external-id';
            const userProps = jest.mocked({});
            // Act
            const creatingInvalidUser = () => {
                staff_user_1.StaffUser.getNewUser(userProps, givenInvalidExternalId, givenValidRestOfName, givenValidLastName, givenValidEmail, givenValidContext);
            };
            // Assert
            expect(creatingInvalidUser).toThrowError('Too short');
        });
        it('should reject an invalid restOfName', () => {
            // Arrange
            const userProps = jest.mocked({});
            const givenInvalidRestOfName = 'U3edLYh3jCG6qVcJyp4VYbWVBHCD72tEWxveuKM52pp5VV77otbhztgp5HJrvRshhHxjxDTiWEsuskVBFKd2WosKOvBCvXHZMy0sE7iXzLA9q8m6vevUK0UUnUsImby5uuun3R1LbjsQucbLO9R1GLnvYBWBbvVbpT6Wycq4JDfJWfjamxLmCqxjlhFMyUDMm2XMvkKdBVfYVJ9zx13HInjGSliPOgY5Ab3gVTx0r7v6VJ5gOxfoe762uemL9u3LvNvQaR89UgopJEwIYe3UanhkqXshFxK9Ryk7C38KLRzrTqbsfLedIISlBlrGaIQlWw44ehMaFx1D7eupzO49NQn5gCMiZN3lVwK1P6Ipq2w8hLjDY17rjLYo9HIF1cTVXzIB01n7ecQfP5YB7nIAT8uFEV34RPRCS3OU6WSLuFkOeC1xb2ssMATDvRfBiuZr9yraH43jipwV3QE2g3q3FrTGvmhZrrjjjedmj0iqpRGGHZRN9z9jU';
            // Act
            const creatingInvalidUser = () => {
                staff_user_1.StaffUser.getNewUser(userProps, givenValidExternalId, givenInvalidRestOfName, givenValidLastName, givenValidEmail, givenValidContext);
            };
            // Assert
            expect(creatingInvalidUser).toThrowError('Too long');
        });
        it('should reject an invalid lastName', () => {
            // Arrange
            const userProps = jest.mocked({});
            const givenInvalidLastName = 'U3edLYh3jCG6qVcJyp4VYbWVBHCD72tEWxveuKM52pp5VV77otbhztgp5HJrvRshhHxjxDTiWEsuskVBFKd2WosKOvBCvXHZMy0sE7iXzLA9q8m6vevUK0UUnUsImby5uuun3R1LbjsQucbLO9R1GLnvYBWBbvVbpT6Wycq4JDfJWfjamxLmCqxjlhFMyUDMm2XMvkKdBVfYVJ9zx13HInjGSliPOgY5Ab3gVTx0r7v6VJ5gOxfoe762uemL9u3LvNvQaR89UgopJEwIYe3UanhkqXshFxK9Ryk7C38KLRzrTqbsfLedIISlBlrGaIQlWw44ehMaFx1D7eupzO49NQn5gCMiZN3lVwK1P6Ipq2w8hLjDY17rjLYo9HIF1cTVXzIB01n7ecQfP5YB7nIAT8uFEV34RPRCS3OU6WSLuFkOeC1xb2ssMATDvRfBiuZr9yraH43jipwV3QE2g3q3FrTGvmhZrrjjjedmj0iqpRGGHZRN9z9jU';
            // Act
            const creatingInvalidUser = () => {
                staff_user_1.StaffUser.getNewUser(userProps, givenValidExternalId, givenValidRestOfName, givenInvalidLastName, givenValidEmail, givenValidContext);
            };
            // Assert
            expect(creatingInvalidUser).toThrowError('Too long');
        });
        it('should raise a StaffUserCreatedEvent', () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const expectedNewId = '12345';
            const userProps = jest.mocked({ id: expectedNewId });
            // Act
            const user = staff_user_1.StaffUser.getNewUser(userProps, givenValidExternalId, givenValidRestOfName, givenValidLastName, givenValidEmail, givenValidContext);
            // Assert
            const integrationEvent = user.getIntegrationEvents().find(e => e.aggregateId === expectedNewId && e instanceof staff_user_created_1.StaffUserCreatedEvent);
            expect(integrationEvent.payload.externalId).toBe(givenValidExternalId);
        }));
    });
    describe('when updating a staff user', () => {
        it('should reject an invalid email', () => {
            // Arrange
            const userProps = jest.mocked({});
            const givenValidContext = jest.mocked({});
            givenValidContext.domainVisa = jest.mocked({});
            const mockCommunityVisa = jest.mocked({});
            const mockStaffUserVisa = jest.mocked({
                determineIf: jest.fn(func => func({ isEditingOwnAccount: true }))
            });
            givenValidContext.domainVisa = jest.mocked({
                forCommunity: jest.fn(() => mockCommunityVisa),
                forUser: jest.fn(() => ({ determineIf: () => false })),
                forStaffRole: jest.fn(() => mockCommunityVisa),
                forVendorUserRole: jest.fn(() => mockCommunityVisa),
                forService: jest.fn(() => ({ determineIf: () => false })),
                forEndUser: jest.fn(() => ({ determineIf: () => false })),
                forStaffUser: jest.fn(() => mockStaffUserVisa),
                forVendorUser: jest.fn(() => ({ determineIf: () => false })),
                forServiceTicketV1: jest.fn(() => ({ determineIf: () => false })),
                forViolationTicketV1: jest.fn(() => ({ determineIf: () => false })),
                forEndUserRole: jest.fn(() => mockCommunityVisa),
            });
            const user = new staff_user_1.StaffUser(userProps, givenValidContext);
            const givenInvalidEmail = 'bad-email';
            // Act
            const updatingUserWithInvalidProperty = () => {
                user.Email = (givenInvalidEmail);
            };
            // Assert
            expect(updatingUserWithInvalidProperty).toThrowError('Value doesn\'t match pattern');
        });
    });
});
//# sourceMappingURL=staff-user.test.js.map