import { Member, type MemberProps } from './member.ts';
import { type DomainExecutionContext } from '../../../domain-execution-context.ts';
import { type DomainVisa } from '../../../domain.visa.ts';
import { type CommunityVisa } from '../community.visa.ts';
import { type CommunityEntityReference } from '../community/community.ts';

describe('domain.contexts.member', () => {
  describe('when creating a new member', () => {
    const givenValidCommunity = jest.mocked({} as CommunityEntityReference);
    const givenValidName = 'John Doe';
    const givenValidContext = jest.mocked({} as DomainExecutionContext);
    givenValidContext.domainVisa = jest.mocked({} as DomainVisa);
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
    it('should reject an invalid name', () => {
      // Arrange
      const givenInvalidName = 'x'.repeat(201);
      const memberProps = jest.mocked({} as MemberProps);
      
      // Act
      const creatingInvalidMember = () => { 
        Member.getNewInstance(memberProps, givenInvalidName, givenValidCommunity, givenValidContext); 
      };

      // Assert
      expect(creatingInvalidMember).toThrowError('Too long');
    });

    it('should accept valid input', () => {
      // Arrange
      const memberProps = jest.mocked({ setCommunityRef(community) {
        community;
      },} as MemberProps);
      
      // Act
      const creatingValidMember = () => { 
        Member.getNewInstance(memberProps, givenValidName, givenValidCommunity, givenValidContext); 
      };

      // Assert
      expect(creatingValidMember).not.toThrow();
    });

  });

  describe('when updating a member', () => {
    const memberProps = jest.mocked({} as MemberProps);
    const givenValidContext = jest.mocked({} as DomainExecutionContext);
    givenValidContext.domainVisa = jest.mocked({} as DomainVisa);
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


    it('should reject an invalid email', () => {
      // Arrange
      const member = new Member(memberProps, givenValidContext);
      const givenInvalidEmail = 'bad-email';
      
      // Act
      const updatingUserWithInvalidProperty = () => { 
        member.profile.email=(givenInvalidEmail);
      };

      // Assert
      expect(updatingUserWithInvalidProperty).toThrowError('Value doesn\'t match pattern');
    });

    it('should reject an invalid cybersource id', () => {
      // Arrange
      const member = new Member(memberProps, givenValidContext);
      const givenInvalidCybersourceId = 'x'.repeat(51);
      
      // Act
      const updatingUserWithInvalidProperty = () => { 
        member.CyberSourceCustomerId=(givenInvalidCybersourceId);
      };

      // Assert
      expect(updatingUserWithInvalidProperty).toThrowError('Too long');
    });

    it('should reject an invalid name', () => {
      // Arrange
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
      const member = new Member(memberProps, givenValidContext);
      const givenInvalidName = 'x'.repeat(501);
      
      // Act
      const updatingUserWithInvalidProperty = () => { 
        member.MemberName=(givenInvalidName);
      };

      // Assert
      expect(updatingUserWithInvalidProperty).toThrowError('Too long');
    })

  });

  it('should reject an invalid bio', () => {
    // Arrange
    const memberProps = jest.mocked({} as MemberProps);
    const givenValidContext = jest.mocked({} as DomainExecutionContext);
    givenValidContext.domainVisa = jest.mocked({} as DomainVisa);
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
    const member = new Member(memberProps, givenValidContext);
    const givenInvalidBio = 'x'.repeat(2001);
    
    // Act
    const updatingUserWithInvalidProperty = () => { 
      member.profile.bio=(givenInvalidBio);
    };

    // Assert
    expect(updatingUserWithInvalidProperty).toThrowError('Too long');
  })

  it('should reject more than 20 interests', () => {
    // Arrange
    const memberProps = jest.mocked({} as MemberProps);
    const givenValidContext = jest.mocked({} as DomainExecutionContext);
    givenValidContext.domainVisa = jest.mocked({} as DomainVisa);
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
    const member = new Member(memberProps, givenValidContext);
    const givenInvalidInterests = Array(21).fill('interest');
    
    // Act
    const updatingUserWithInvalidProperty = () => { 
      member.profile.interests=(givenInvalidInterests);
    };

    // Assert
    expect(updatingUserWithInvalidProperty).toThrowError('Too long');
  });

});