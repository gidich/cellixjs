import assert from 'node:assert';
import { beforeEach, describe, mock, test } from 'node:test';
import { Community, type CommunityProps } from './community.ts';
import { CommunityCreatedEvent } from '../../../events/types/community-created.ts';
import type { CommunityDomainPermissions } from '../community.domain-permissions.ts';
import type { CommunityPassport } from '../community.passport.ts';
import type { CommunityVisa } from '../community.visa.ts';
import type { EndUserEntityReference } from '../../user/end-user/end-user.ts';
import type { Passport } from '../../passport.ts';

// Helper function to create mock visa
function createMockVisa(partialPermissions: Partial<CommunityDomainPermissions>): CommunityVisa {
	const determineIfFn = (fn: (permissions: Readonly<CommunityDomainPermissions>) => boolean) => {
		return fn(partialPermissions as CommunityDomainPermissions);
	};
	
	return {
		determineIf: determineIfFn,
	} as CommunityVisa;
}

// Helper function to create mock passport
function createMockPassport(partialPermissions: Partial<CommunityDomainPermissions>): Passport {
	const mockVisa = createMockVisa(partialPermissions);
	const forCommunityFn = mock.fn(() => mockVisa);
	
	const mockCommunityPassport = {
		forCommunity: forCommunityFn,
	} as CommunityPassport;
	
	return {
		community: mockCommunityPassport,
	} as Passport;
}

describe('domain.contexts.community::community', () => {
	describe('when creating a new community', () => {
		const givenValidCommunityName = 'valid-community-name';
		let givenValidCreatedBy: EndUserEntityReference;

		beforeEach(() => {
			givenValidCreatedBy = {} as EndUserEntityReference;
		});

		test('should reject an invalid Name', () => {
			// Arrange
			const givenValidNewProps = {
				id: '12345',
				createdBy: {} as EndUserEntityReference,
			} as CommunityProps;
			const givenValidPassport = createMockPassport({
				canManageCommunitySettings: true,
			});

			// 201 characters -> should exceed the maxLength of 200
			const generateStringOfLength = (length: number) => 'a'.repeat(length);
			const givenInvalidCommunityName = generateStringOfLength(201);

			// Act & Assert
			assert.throws(
				() => {
					Community.getNewInstance(
						givenValidNewProps,
						givenInvalidCommunityName,
						givenValidCreatedBy,
						givenValidPassport,
					);
				},
				/Too long/,
				'Should throw error for name that is too long'
			);
		});

		test('should raise a CommunityCreatedEvent', () => {
			// Arrange
			const expectedNewId = '12345';
			const givenValidNewProps = {
				id: expectedNewId,
				createdBy: {} as EndUserEntityReference,
			} as CommunityProps;
			const givenValidPassport = createMockPassport({
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
			const integrationEvents = community.getIntegrationEvents();
			const communityCreatedEvent = integrationEvents.find(
				(e) => e.aggregateId === expectedNewId && e instanceof CommunityCreatedEvent,
			) as CommunityCreatedEvent;

			assert.ok(communityCreatedEvent, 'Should have a CommunityCreatedEvent');
			assert.strictEqual(
				communityCreatedEvent.payload.communityId,
				expectedNewId,
				'Event should contain the correct community ID'
			);
		});

		test.skip('should successfully create a new community with valid data', () => {
			// Arrange
			const expectedNewId = '12345';
			const givenValidNewProps = {
				id: expectedNewId,
				createdBy: {} as EndUserEntityReference,
			} as CommunityProps;
			const givenValidPassport = createMockPassport({
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
			assert.ok(community, 'Community should be created');
			assert.strictEqual(community.name, givenValidCommunityName, 'Name should be set correctly');
			assert.strictEqual(community.createdBy, givenValidCreatedBy, 'CreatedBy should be set correctly');
		});

		test.skip('should reject empty community name', () => {
			// Arrange
			const givenValidNewProps = {
				id: '12345',
				createdBy: {} as EndUserEntityReference,
			} as CommunityProps;
			const givenValidPassport = createMockPassport({
				canManageCommunitySettings: true,
			});
			const givenEmptyName = '';

			// Act & Assert
			assert.throws(
				() => {
					Community.getNewInstance(
						givenValidNewProps,
						givenEmptyName,
						givenValidCreatedBy,
						givenValidPassport,
					);
				},
				Error,
				'Should throw error for empty name'
			);
		});
	});

	describe('when modifying community properties', () => {
		let community: Community<CommunityProps>;
		let givenValidProps: CommunityProps;

		beforeEach(() => {
			givenValidProps = {
				id: '12345',
				name: 'Test Community',
				domain: 'test.com',
				whiteLabelDomain: null,
				handle: null,
				createdBy: {} as EndUserEntityReference,
				createdAt: new Date(),
				updatedAt: new Date(),
				schemaVersion: '1.0.0',
			} as CommunityProps;
		});

		test('should allow name change with proper permissions', () => {
			// Arrange
			const passport = createMockPassport({ canManageCommunitySettings: true });
			community = new Community(givenValidProps, passport);
			const newName = 'Updated Community Name';

			// Act
			community.name = newName;

			// Assert
			assert.strictEqual(community.name, newName, 'Name should be updated');
		});

		test('should reject name change without proper permissions', () => {
			// Arrange
			const passport = createMockPassport({ canManageCommunitySettings: false });
			community = new Community(givenValidProps, passport);
			const newName = 'Updated Community Name';

			// Act & Assert
			assert.throws(
				() => {
					community.name = newName;
				},
				/You do not have permission to change the name/,
				'Should throw permission error'
			);
		});

		test('should allow domain change with proper permissions', () => {
			// Arrange
			const passport = createMockPassport({ canManageCommunitySettings: true });
			community = new Community(givenValidProps, passport);
			const newDomain = 'newdomain.com';

			// Act
			community.domain = newDomain;

			// Assert
			assert.strictEqual(community.domain, newDomain, 'Domain should be updated');
		});

		test('should reject domain change without proper permissions', () => {
			// Arrange
			const passport = createMockPassport({ canManageCommunitySettings: false });
			community = new Community(givenValidProps, passport);
			const newDomain = 'newdomain.com';

			// Act & Assert
			assert.throws(
				() => {
					community.domain = newDomain;
				},
				/You do not have permission to change the domain/,
				'Should throw permission error'
			);
		});

		test('should allow whiteLabelDomain change with proper permissions', () => {
			// Arrange
			const passport = createMockPassport({ canManageCommunitySettings: true });
			community = new Community(givenValidProps, passport);
			const newWhiteLabelDomain = 'whitelabel.example.com';

			// Act
			community.whiteLabelDomain = newWhiteLabelDomain;

			// Assert
			assert.strictEqual(community.whiteLabelDomain, newWhiteLabelDomain, 'WhiteLabelDomain should be updated');
		});

		test('should allow handle change with proper permissions', () => {
			// Arrange
			const passport = createMockPassport({ canManageCommunitySettings: true });
			community = new Community(givenValidProps, passport);
			const newHandle = 'newhandle';

			// Act
			community.handle = newHandle;

			// Assert
			assert.strictEqual(community.handle, newHandle, 'Handle should be updated');
		});

		test('should return correct readonly properties', () => {
			// Arrange
			const passport = createMockPassport({ canManageCommunitySettings: true });
			community = new Community(givenValidProps, passport);

			// Assert
			assert.strictEqual(community.createdAt, givenValidProps.createdAt, 'CreatedAt should match');
			assert.strictEqual(community.updatedAt, givenValidProps.updatedAt, 'UpdatedAt should match');
			assert.strictEqual(community.schemaVersion, givenValidProps.schemaVersion, 'SchemaVersion should match');
		});
	});
});