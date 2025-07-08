import { jest } from '@jest/globals';
import { actorCalled, Question, Task } from '@serenity-js/core';
import type { Actor, AnswersQuestions, UsesAbilities } from '@serenity-js/core';
import { Community, type CommunityProps } from './community.ts';
import type { EndUserEntityReference } from '../../user/end-user/end-user.ts';
import type { CommunityVisa } from '../community.visa.ts';
import type { Passport } from '../../passport.ts';
import { CommunityCreatedEvent } from '../../../events/types/community-created.ts';
import type { CommunityPassport } from '../community.passport.ts';
import type { CommunityDomainPermissions } from '../community.domain-permissions.ts';

/**
 * Community Domain Tests
 * 
 * Feature: Community Management
 * As a community administrator
 * I want to create and manage communities
 * So that users can organize themselves into groups
 */

// Memory store for test state (Serenity approach)
const testMemory = new Map<string, any>();

// Helper functions for test memory management
const remember = (key: string, value: any) => {
	testMemory.set(key, value);
};

const recall = <T>(key: string): T => {
	return testMemory.get(key);
};

const clearMemory = () => {
	testMemory.clear();
};

// Serenity Tasks
class SetupCommunityCreationContext extends Task {
	static with(
		communityName: string, 
		permissions: Partial<CommunityDomainPermissions>
	) {
		return new SetupCommunityCreationContext(communityName, permissions);
	}

	private communityName: string;
	private permissions: Partial<CommunityDomainPermissions>;
	
	constructor(communityName: string, permissions: Partial<CommunityDomainPermissions>) {
		super(`Setup community creation context for "${communityName}" with specified permissions`);
		this.communityName = communityName;
		this.permissions = permissions;
	}

	performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
		const expectedNewId = '12345';
		const communityProps = jest.mocked({
			id: expectedNewId,
		} as CommunityProps);
		
		const createdBy = jest.mocked({} as EndUserEntityReference);
		communityProps.createdBy = createdBy;

		const mockCommunityVisa = jest.mocked({
			determineIf: (
				fn: (permissions: Readonly<CommunityDomainPermissions>) => boolean,
			) => {
				return fn(this.permissions as CommunityDomainPermissions);
			},
		} as CommunityVisa);

		const passport = jest.mocked({} as Passport);
		// @ts-expect-error - Assigning to read-only property for test mocking
		passport.community = jest.mocked({
			forCommunity: jest.fn(() => mockCommunityVisa),
		} as CommunityPassport);

		remember('communityProps', communityProps);
		remember('createdBy', createdBy);
		remember('communityName', this.communityName);
		remember('passport', passport);
		remember('expectedId', expectedNewId);

		return Promise.resolve();
	}
}

class CreateCommunity extends Task {
	static withValidData() {
		return new CreateCommunity();
	}

	constructor() {
		super(`Create a new community using valid data and proper permissions`);
	}

	performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
		const props = recall<CommunityProps>('communityProps');
		const communityName = recall<string>('communityName');
		const createdBy = recall<EndUserEntityReference>('createdBy');
		const passport = recall<Passport>('passport');

		try {
			const community = Community.getNewInstance(
				props,
				communityName,
				createdBy,
				passport,
			);
			remember('createdCommunity', community);
			remember('communityCreationResult', 'success');
		} catch (error) {
			remember('communityCreationError', error);
			remember('communityCreationResult', 'error');
		}

		return Promise.resolve();
	}
}

class AttemptToCreateCommunityWithInvalidName extends Task {
	static withName(invalidName: string) {
		return new AttemptToCreateCommunityWithInvalidName(invalidName);
	}

	private invalidName: string;
	
	constructor(invalidName: string) {
		super(`Attempt to create community with invalid name (${invalidName.length} characters)`);
		this.invalidName = invalidName;
	}

	performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
		const props = recall<CommunityProps>('communityProps');
		const createdBy = recall<EndUserEntityReference>('createdBy');
		const passport = recall<Passport>('passport');

		try {
			const community = Community.getNewInstance(
				props,
				this.invalidName,
				createdBy,
				passport,
			);
			remember('createdCommunity', community);
			remember('communityCreationResult', 'success');
		} catch (error) {
			remember('communityCreationError', error);
			remember('communityCreationResult', 'error');
		}

		return Promise.resolve();
	}
}

// Serenity Questions - Using function-based approach for better reporting
const TheCommunityCreationResult = () => 
	Question.about<string>('the result of the community creation attempt', () => {
		return recall<string>('communityCreationResult');
	});

const TheCommunityCreationError = () => 
	Question.about<Error>('the error details from the failed community creation', () => {
		return recall<Error>('communityCreationError');
	});

const TheCreatedCommunity = () => 
	Question.about<Community<CommunityProps>>('the successfully created community', () => {
		return recall<Community<CommunityProps>>('createdCommunity');
	});

const TheCommunityEvents = (eventType: any) => 
	Question.about<any[]>(`the ${eventType.name} events raised by the community`, () => {
		const community = recall<Community<CommunityProps>>('createdCommunity');
		if (!community) {
			return [];
		}
		return community.getIntegrationEvents().filter(e => e instanceof eventType);
	});

const TheExpectedCommunityId = () => 
	Question.about<string>('the expected ID for the new community', () => {
		return recall<string>('expectedId');
	});

describe('Community Domain', () => {
	describe('Feature: Creating a new community', () => {
		beforeEach(() => {
			clearMemory();
		});

		describe('Scenario: Community creation with valid data', () => {
			const givenValidCommunityName = 'valid-community-name';
			let communityAdmin: Actor;

			beforeEach(() => {
				communityAdmin = actorCalled('Community Admin');
			});

			it('should successfully create a community and raise a CommunityCreatedEvent', async () => {
				// Given - Setup context using Serenity tasks
				await communityAdmin.attemptsTo(
					SetupCommunityCreationContext.with(givenValidCommunityName, {
						canManageCommunitySettings: true,
					})
				);

				// When - Create a valid community
				await communityAdmin.attemptsTo(CreateCommunity.withValidData());

				// Then - Verify the community was created and events were raised
				expect(await communityAdmin.answer(TheCommunityCreationResult())).toBe('success');
				
				const communityEvents = await communityAdmin.answer(TheCommunityEvents(CommunityCreatedEvent));
				expect(communityEvents).toHaveLength(1);
				
				const createdEvent = communityEvents[0] as CommunityCreatedEvent;
				const expectedId = await communityAdmin.answer(TheExpectedCommunityId());
				expect(createdEvent.payload.communityId).toBe(expectedId);
				
				const createdCommunity = await communityAdmin.answer(TheCreatedCommunity());
				expect(createdCommunity).toBeDefined();
			});
		});

		describe('Scenario: Community creation with invalid data', () => {
			const givenValidCommunityName = 'valid-community-name';
			let communityAdmin: Actor;

			beforeEach(() => {
				communityAdmin = actorCalled('Community Admin');
			});

			it('should reject a community with an invalid name that is too long', async () => {
				// Given - Setup context using Serenity tasks
				await communityAdmin.attemptsTo(
					SetupCommunityCreationContext.with(givenValidCommunityName, {
						canManageCommunitySettings: true,
					})
				);

				// 201 characters -> http://www.unit-conversion.info/texttools/random-string-generator/
				const givenInvalidCommunityName =
					'REcK03mhSslLPAmidGzyRvc16iOyrZ9VDfgnOcTlBEZzDFlbl8FdPcpLGZXLAXJxbScF96qRhGkqnPgDWMYAHst56OZwIxVb4b8mX4FvmiqwjpY51pBG5C9EOwlWhELc7mi74z977jnaR4IpMlP3cZpUY0bkRLJAUVprG2jfHQymztv4KbQzDUcmbwjnXiBIxO9faxcV0';

				// When - Attempt to create community with invalid name
				await communityAdmin.attemptsTo(
					AttemptToCreateCommunityWithInvalidName.withName(givenInvalidCommunityName)
				);

				// Then - Verify the result using Serenity questions
				expect(await communityAdmin.answer(TheCommunityCreationResult())).toBe('error');
				const error = await communityAdmin.answer(TheCommunityCreationError());
				expect(error).toEqual(
					expect.objectContaining({
						message: expect.stringContaining('Too long'),
					})
				);
			});
		});
	});
});
