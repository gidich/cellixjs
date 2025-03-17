import { VendorUser, VendorUserProps } from './vendor-user';
import { VendorUserCreatedEvent } from '../../../events/types/vendor-user-created';
import { DomainExecutionContext } from '../../../domain-execution-context';
import { DomainVisa } from '../../../domain.visa';
import { VendorUserVisa } from './vendor-user.visa';
import { CommunityVisa } from '../../community/community.visa';

describe('domain.contexts.end-user', () => {
  describe('when creating a new end user', () => {
    const userProps = jest.mocked({ personalInformation: { contactInformation: {}, identityDetails: {} }} as VendorUserProps);
    const givenValidExternalId = '9b5b121b-7726-460c-8ead-58378c9ab29e';
    const givenValidFirstName = 'John';
    const givenValidLastName = 'Doe';
    const givenValidContext = jest.mocked({} as DomainExecutionContext);
    givenValidContext.domainVisa = jest.mocked({} as DomainVisa);
    const mockCommunityVisa = jest.mocked({} as CommunityVisa);
    const mockVendorUserVisa = jest.mocked({} as VendorUserVisa);
    givenValidContext.domainVisa = jest.mocked({
      forCommunity: jest.fn(() => mockCommunityVisa),
      forUser: jest.fn(() => mockVendorUserVisa),
      forStaffRole: jest.fn(() => mockCommunityVisa),
      forVendorUserRole: jest.fn(() => mockCommunityVisa),
      forService: jest.fn(() => ({ determineIf: () => false })),
      forEndUser: jest.fn(() => ({ determineIf: () => false })),
      forStaffUser: jest.fn(() => ({ determineIf: () => false })),
      forVendorUser: jest.fn(() => mockVendorUserVisa),
      forServiceTicketV1: jest.fn(() => ({ determineIf: () => false })),
      forViolationTicketV1: jest.fn(() => ({ determineIf: () => false })),
      forEndUserRole: jest.fn(() => mockCommunityVisa),
    } as DomainVisa);

    it('should reject an invalid externalId', () => {
      // Arrange
      const givenInvalidExternalId = 'this-is-an-invalid-external-id';
      
      // Act
      const creatingInvalidUser = () => { 
        VendorUser.getNewUser(userProps,givenInvalidExternalId,givenValidLastName, givenValidContext, givenValidFirstName) 
      };

      // Assert
      expect(creatingInvalidUser).toThrowError('Too short');
    });

    it('should reject an invalid restOfName', () => {
      // Arrange
      const givenInvalidRestOfName = 'U3edLYh3jCG6qVcJyp4VYbWVBHCD72tEWxveuKM52pp5VV77otbhztgp5HJrvRshhHxjxDTiWEsuskVBFKd2WosKOvBCvXHZMy0sE7iXzLA9q8m6vevUK0UUnUsImby5uuun3R1LbjsQucbLO9R1GLnvYBWBbvVbpT6Wycq4JDfJWfjamxLmCqxjlhFMyUDMm2XMvkKdBVfYVJ9zx13HInjGSliPOgY5Ab3gVTx0r7v6VJ5gOxfoe762uemL9u3LvNvQaR89UgopJEwIYe3UanhkqXshFxK9Ryk7C38KLRzrTqbsfLedIISlBlrGaIQlWw44ehMaFx1D7eupzO49NQn5gCMiZN3lVwK1P6Ipq2w8hLjDY17rjLYo9HIF1cTVXzIB01n7ecQfP5YB7nIAT8uFEV34RPRCS3OU6WSLuFkOeC1xb2ssMATDvRfBiuZr9yraH43jipwV3QE2g3q3FrTGvmhZrrjjjedmj0iqpRGGHZRN9z9jU';
      
      // Act
      const creatingInvalidUser = () => { 
        VendorUser.getNewUser(userProps,givenValidExternalId,givenValidLastName,givenValidContext,givenInvalidRestOfName) 
      };

      // Assert
      expect(creatingInvalidUser).toThrowError('Too long');
    });

    it('should reject an invalid lastName', () => {
      // Arrange
      const userProps = jest.mocked({ personalInformation: { contactInformation: {}, identityDetails: {} }} as VendorUserProps);
      const givenInvalidLastName = 'U3edLYh3jCG6qVcJyp4VYbWVBHCD72tEWxveuKM52pp5VV77otbhztgp5HJrvRshhHxjxDTiWEsuskVBFKd2WosKOvBCvXHZMy0sE7iXzLA9q8m6vevUK0UUnUsImby5uuun3R1LbjsQucbLO9R1GLnvYBWBbvVbpT6Wycq4JDfJWfjamxLmCqxjlhFMyUDMm2XMvkKdBVfYVJ9zx13HInjGSliPOgY5Ab3gVTx0r7v6VJ5gOxfoe762uemL9u3LvNvQaR89UgopJEwIYe3UanhkqXshFxK9Ryk7C38KLRzrTqbsfLedIISlBlrGaIQlWw44ehMaFx1D7eupzO49NQn5gCMiZN3lVwK1P6Ipq2w8hLjDY17rjLYo9HIF1cTVXzIB01n7ecQfP5YB7nIAT8uFEV34RPRCS3OU6WSLuFkOeC1xb2ssMATDvRfBiuZr9yraH43jipwV3QE2g3q3FrTGvmhZrrjjjedmj0iqpRGGHZRN9z9jU';
      
      // Act
      const creatingInvalidUser = () => { 
        VendorUser.getNewUser(userProps,givenValidExternalId,givenInvalidLastName,givenValidContext,givenValidFirstName) 
      };

      // Assert
      expect(creatingInvalidUser).toThrowError('Too long');
    });

    it('should raise an VendorUserCreatedEvent', async () => {
      // Arrange
      const expectedNewId = '12345';
      const userProps = jest.mocked({id:expectedNewId, personalInformation: { contactInformation: {}, identityDetails: {} }} as VendorUserProps);
      
      // Act
      const user = VendorUser.getNewUser(userProps, givenValidExternalId, givenValidLastName, givenValidContext, givenValidFirstName);
    
      // Assert
      const integrationEvent = user.getIntegrationEvents().find(e => e.aggregateId === expectedNewId && e instanceof VendorUserCreatedEvent) as VendorUserCreatedEvent;
      expect(integrationEvent.payload.userId).toBe(expectedNewId);
    
    });

    it('should set legalNameConsistsOfOneName to true when restOfName is not provided', () => {
      // Arrange
      const userProps = jest.mocked({ personalInformation: { contactInformation: {}, identityDetails: {} }} as VendorUserProps);
      
      // Act
      const user = VendorUser.getNewUser(userProps, givenValidExternalId, givenValidLastName, givenValidContext);
    
      // Assert
      expect(user.personalInformation.identityDetails.legalNameConsistsOfOneName).toBe(true);
    });

    it('should set legalNameConsistsOfOneName to false when restOfName is provided', () => {
      // Arrange
      const userProps = jest.mocked({ personalInformation: { contactInformation: {}, identityDetails: {} }} as VendorUserProps);
      
      // Act
      const user = VendorUser.getNewUser(userProps, givenValidExternalId, givenValidLastName, givenValidContext, givenValidFirstName);
    
      // Assert
      expect(user.personalInformation.identityDetails.legalNameConsistsOfOneName).toBe(false);
    });

  });

  describe('when updating an end user', () => {
    it('should reject an invalid email', () => {
      // Arrange
      const userProps = jest.mocked({personalInformation: { contactInformation: {}, identityDetails: {} }} as VendorUserProps);
      const givenValidContext = jest.mocked({} as DomainExecutionContext);
      givenValidContext.domainVisa = jest.mocked({} as DomainVisa);
      const mockCommunityVisa = jest.mocked({} as CommunityVisa);
      
      const mockVendorUserVisa = jest.mocked({} as VendorUserVisa);
      givenValidContext.domainVisa = jest.mocked({
        forCommunity: jest.fn(() => mockCommunityVisa),
        forUser: jest.fn(() => mockVendorUserVisa),
        forStaffRole: jest.fn(() => mockCommunityVisa),
        forVendorUserRole: jest.fn(() => mockCommunityVisa),
        forService: jest.fn(() => ({ determineIf: () => false })),
        forEndUser: jest.fn(() => ({ determineIf: () => false })),
        forStaffUser: jest.fn(() => ({ determineIf: () => false })),
        forVendorUser: jest.fn(() => mockVendorUserVisa),
        forServiceTicketV1: jest.fn(() => ({ determineIf: () => false })),
        forViolationTicketV1: jest.fn(() => ({ determineIf: () => false })),
        forEndUserRole: jest.fn(() => mockCommunityVisa),
      } as DomainVisa);

      const user = new VendorUser(userProps, givenValidContext);
      const givenInvalidEmail = 'bad-email';
      
      // Act
      const updatingUserWithInvalidProperty = () => { 
        user.personalInformation.contactInformation.Email=(givenInvalidEmail);
      };

      // Assert
      expect(updatingUserWithInvalidProperty).toThrowError('Value doesn\'t match pattern');
    });

    it('should update a valid email', () => {
      // Arrange
      const userProps = jest.mocked({personalInformation: { contactInformation: {} }} as VendorUserProps);
      const givenValidContext = jest.mocked({} as DomainExecutionContext);
      givenValidContext.domainVisa = jest.mocked({} as DomainVisa);
      const mockCommunityVisa = jest.mocked({} as CommunityVisa);
      const mockVendorUserVisa = jest.mocked({} as VendorUserVisa);
      givenValidContext.domainVisa = jest.mocked({
        forCommunity: jest.fn(() => mockCommunityVisa),
        forUser: jest.fn(() => mockVendorUserVisa),
        forStaffRole: jest.fn(() => mockCommunityVisa),
        forVendorUserRole: jest.fn(() => mockCommunityVisa),
        forService: jest.fn(() => ({ determineIf: () => false })),
        forEndUser: jest.fn(() => ({ determineIf: () => false })),
        forStaffUser: jest.fn(() => ({ determineIf: () => false })),
        forVendorUser: jest.fn(() => mockVendorUserVisa),
        forServiceTicketV1: jest.fn(() => ({ determineIf: () => false })),
        forViolationTicketV1: jest.fn(() => ({ determineIf: () => false })),
        forEndUserRole: jest.fn(() => mockCommunityVisa),
      } as DomainVisa);

      const user = new VendorUser(userProps, givenValidContext);
      const givenValidEmail = 'test@email.com';

      // Act
      const updatingUserWithValidProperty = () => {
        user.personalInformation.contactInformation.Email=(givenValidEmail);
      };

      // Assert
      expect(updatingUserWithValidProperty).not.toThrow();

    });
  });

});