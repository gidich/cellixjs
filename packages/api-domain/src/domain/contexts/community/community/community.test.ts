import { Community, type CommunityProps } from './community.ts';
import { type EndUserEntityReference } from '../../user/end-user/end-user.ts';
import { type DomainExecutionContext } from '../../../domain-execution-context.ts';
import { type CommunityVisa } from "../community.visa.ts";
import { type DomainVisa } from '../../../domain.visa.ts';
import { CommunityCreatedEvent } from '../../../events/types/community-created.ts';

describe('domain.contexts.community::community', () => {
  describe('when creating a new community', () => {
    const givenValidCommunityName = 'valid-community-name';
    const givenValidCreatedBy = jest.mocked({} as EndUserEntityReference);
    const givenValidContext = jest.mocked({} as DomainExecutionContext);
    
    it('should reject an invalid Name', () => {
      // Arrange
      const newProps = jest.mocked({} as CommunityProps);
      newProps.createdBy = jest.mocked({} as EndUserEntityReference);
      givenValidContext.domainVisa = jest.mocked({} as DomainVisa);
      //givenValidContext.domainVisa.forCommunity = jest.fn(() => ({}) as CommunityVisa);
      const mockCommunityVisa = jest.mocked({} as CommunityVisa);
      givenValidContext.domainVisa = jest.mocked({
        forCommunity: jest.fn(() => mockCommunityVisa),
        forUser: jest.fn(() => ({ determineIf: () => false })),
        forStaffRole: jest.fn(() => mockCommunityVisa),
        forVendorUserRole: jest.fn(() => mockCommunityVisa),
        forService: jest.fn(() => ({ determineIf: () => false })),
        forEndUser: jest.fn(() => ({ determineIf: () => false })),
        forStaffUser: jest.fn(() => ({ determineIf: () => false })),
        forVendorUser: jest.fn(() => ({ determineIf: () => false })),
        forServiceTicketV1: jest.fn(() => ({ determineIf: () => false })),
        forViolationTicketV1: jest.fn(() => ({ determineIf: () => false })),
        forEndUserRole: jest.fn(() => mockCommunityVisa),
      } as DomainVisa);
      //201 characters ->  http://www.unit-conversion.info/texttools/random-string-generator/
      const givenInvalidCommunityName = 'REcK03mhSslLPAmidGzyRvc16iOyrZ9VDfgnOcTlBEZzDFlbl8FdPcpLGZXLAXJxbScF96qRhGkqnPgDWMYAHst56OZwIxVb4b8mX4FvmiqwjpY51pBG5C9EOwlWhELc7mi74z977jnaR4IpMlP3cZpUY0bkRLJAUVprG2jfHQymztv4KbQzDUcmbwjnXiBIxO9faxcV0';  

      // Act
      const creatingInvalidCommunity = () => { 
        Community.getNewInstance(newProps, givenInvalidCommunityName,givenValidCreatedBy,givenValidContext);
      };

      // Assert
      expect(creatingInvalidCommunity).toThrowError('Too long');
    });


    it('should raise a CommunityCreatedEvent', async () => {
      // Arrange
      const expectedNewId = '12345';
      const newProps = jest.mocked({id:expectedNewId} as CommunityProps);
      newProps.createdBy = jest.mocked({} as EndUserEntityReference);
      
      // Act
      const community = Community.getNewInstance(newProps, givenValidCommunityName,givenValidCreatedBy,givenValidContext);
    
      // Assert
      const integrationEvent = community.getIntegrationEvents().find(e => e.aggregateId === expectedNewId && e instanceof CommunityCreatedEvent) as CommunityCreatedEvent;
      expect(integrationEvent.payload.communityId).toBe(expectedNewId);
    
    });

  });

}); 