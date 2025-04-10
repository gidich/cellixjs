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
const community_1 = require("./community");
const community_created_1 = require("../../../events/types/community-created");
describe('domain.contexts.community::community', () => {
    describe('when creating a new community', () => {
        const givenValidCommunityName = 'valid-community-name';
        const givenValidCreatedBy = jest.mocked({});
        const givenValidContext = jest.mocked({});
        it('should reject an invalid Name', () => {
            // Arrange
            const newProps = jest.mocked({});
            newProps.setCreatedByRef = jest.fn();
            givenValidContext.domainVisa = jest.mocked({});
            //givenValidContext.domainVisa.forCommunity = jest.fn(() => ({}) as CommunityVisa);
            const mockCommunityVisa = jest.mocked({});
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
            });
            //201 characters ->  http://www.unit-conversion.info/texttools/random-string-generator/
            const givenInvalidCommunityName = 'REcK03mhSslLPAmidGzyRvc16iOyrZ9VDfgnOcTlBEZzDFlbl8FdPcpLGZXLAXJxbScF96qRhGkqnPgDWMYAHst56OZwIxVb4b8mX4FvmiqwjpY51pBG5C9EOwlWhELc7mi74z977jnaR4IpMlP3cZpUY0bkRLJAUVprG2jfHQymztv4KbQzDUcmbwjnXiBIxO9faxcV0';
            // Act
            const creatingInvalidCommunity = () => {
                community_1.Community.getNewInstance(newProps, givenInvalidCommunityName, givenValidCreatedBy, givenValidContext);
            };
            // Assert
            expect(creatingInvalidCommunity).toThrowError('Too long');
        });
        it('should reject an invalid CreatedBy', () => {
            // Arrange
            const newProps = jest.mocked({});
            newProps.setCreatedByRef = jest.fn();
            givenValidContext.domainVisa = jest.mocked({});
            const mockCommunityVisa = jest.mocked({});
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
            });
            const givenInvalidCreatedBy = null;
            // Act
            const creatingInvalidCommunity = () => {
                community_1.Community.getNewInstance(newProps, givenValidCommunityName, givenInvalidCreatedBy, givenValidContext);
            };
            // Assert
            expect(creatingInvalidCommunity).toThrowError('createdBy cannot be null or undefined');
        });
        it('should raise a CommunityCreatedEvent', () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const expectedNewId = '12345';
            const newProps = jest.mocked({ id: expectedNewId });
            newProps.setCreatedByRef = jest.fn();
            // Act
            const community = community_1.Community.getNewInstance(newProps, givenValidCommunityName, givenValidCreatedBy, givenValidContext);
            // Assert
            const integrationEvent = community.getIntegrationEvents().find(e => e.aggregateId === expectedNewId && e instanceof community_created_1.CommunityCreatedEvent);
            expect(integrationEvent.payload.communityId).toBe(expectedNewId);
        }));
    });
});
//# sourceMappingURL=community.test.js.map