import { Community, type CommunityProps } from './community.ts';
import { type EndUserEntityReference } from '../../user/end-user/end-user.ts';
import { type CommunityVisa } from '../community.visa.ts';
import { type Passport } from '../../passport.ts';
import { CommunityCreatedEvent } from '../../../events/types/community-created.ts';
import type { CommunityPassport } from '../community.passport.ts';
import type { CommunityDomainPermissions } from '../community.domain-permissions.ts';

describe('domain.contexts.community::community', () => {
	describe('when creating a new community', () => {
		const givenValidCommunityName = 'valid-community-name';
		const givenValidCreatedBy = jest.mocked({} as EndUserEntityReference);

		/**
		 * @param {Partial<CommunityDomainPermissions>} partialPermissions - Only need to define permissions that you want to be true, others will be false
		 * @returns {Passport}
		 */
		const getMockedPassport: (
			partialPermissions: Partial<CommunityDomainPermissions>,
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

		it('should reject an invalid Name', () => {
			// Arrange
			const givenValidNewProps = jest.mocked({} as CommunityProps);
			givenValidNewProps.createdBy = jest.mocked({} as EndUserEntityReference);
			const givenValidPassport = getMockedPassport({
				canManageCommunitySettings: true,
			});

			//201 characters ->  http://www.unit-conversion.info/texttools/random-string-generator/
			const givenInvalidCommunityName =
				'REcK03mhSslLPAmidGzyRvc16iOyrZ9VDfgnOcTlBEZzDFlbl8FdPcpLGZXLAXJxbScF96qRhGkqnPgDWMYAHst56OZwIxVb4b8mX4FvmiqwjpY51pBG5C9EOwlWhELc7mi74z977jnaR4IpMlP3cZpUY0bkRLJAUVprG2jfHQymztv4KbQzDUcmbwjnXiBIxO9faxcV0';

			// Act
			const creatingInvalidCommunity = () => {
				Community.getNewInstance(
					givenValidNewProps,
					givenInvalidCommunityName,
					givenValidCreatedBy,
					givenValidPassport,
				);
			};

			// Assert
			expect(creatingInvalidCommunity).toThrow('Too long');
		});

		it('should raise a CommunityCreatedEvent', () => {
			// Arrange
			const expectedNewId = '12345';
			const givenValidNewProps = jest.mocked({
				id: expectedNewId,
			} as CommunityProps);
			givenValidNewProps.createdBy = jest.mocked({} as EndUserEntityReference);
			const givenValidPassport = getMockedPassport({
				canManageCommunitySettings: true,
			});

			// Act
			const community = Community.getNewInstance(
				givenValidNewProps,
				givenValidCommunityName,
				givenValidCreatedBy,
				givenValidPassport,
			);

			// Assert
			const integrationEvent = community
				.getIntegrationEvents()
				.find(
					(e) =>
						e.aggregateId === expectedNewId &&
						e instanceof CommunityCreatedEvent,
				) as CommunityCreatedEvent;
			expect(integrationEvent.payload.communityId).toBe(expectedNewId);
		});
	});
});
