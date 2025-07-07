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
		super();
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
		super();
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
		super();
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

// Serenity Questions
class TheCommunityCreationResult extends Question<Promise<string>> {
	static value() {
		return new TheCommunityCreationResult();
	}

	constructor() {
		super('the community creation result');
	}

	answeredBy(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<string> {
		return Promise.resolve(recall<string>('communityCreationResult'));
	}
}

class TheCommunityCreationError extends Question<Promise<Error>> {
	static details() {
		return new TheCommunityCreationError();
	}

	constructor() {
		super('the community creation error details');
	}

	answeredBy(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<Error> {
		return Promise.resolve(recall<Error>('communityCreationError'));
	}
}

class TheCreatedCommunity extends Question<Promise<Community<CommunityProps>>> {
	static details() {
		return new TheCreatedCommunity();
	}

	constructor() {
		super('the created community details');
	}

	answeredBy(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<Community<CommunityProps>> {
		return Promise.resolve(recall<Community<CommunityProps>>('createdCommunity'));
	}
}

class TheCommunityEvents extends Question<Promise<any[]>> {
	static ofType(eventType: any) {
		return new TheCommunityEvents(eventType);
	}

	private eventType: any;

	constructor(eventType: any) {
		super(`the community events of type ${eventType.name}`);
		this.eventType = eventType;
	}

	answeredBy(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<any[]> {
		const community = recall<Community<CommunityProps>>('createdCommunity');
		if (!community) {
			return Promise.resolve([]);
		}
		return Promise.resolve(community.getIntegrationEvents().filter(e => e instanceof this.eventType));
	}
}

class TheExpectedCommunityId extends Question<Promise<string>> {
	static value() {
		return new TheExpectedCommunityId();
	}

	constructor() {
		super('the expected community ID');
	}

	answeredBy(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<string> {
		return Promise.resolve(recall<string>('expectedId'));
	}
}

describe('domain.contexts.community::community', () => {
	beforeEach(() => {
		clearMemory();
	});

	describe('when creating a new community', () => {
		const givenValidCommunityName = 'valid-community-name';
		let communityAdmin: Actor;

		beforeEach(() => {
			communityAdmin = actorCalled('Community Admin');
		});

		it('should reject an invalid Name', async () => {
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
			expect(await communityAdmin.answer(TheCommunityCreationResult.value())).toBe('error');
			const error = await communityAdmin.answer(TheCommunityCreationError.details());
			expect(error).toEqual(
				expect.objectContaining({
					message: expect.stringContaining('Too long'),
				})
			);
		});

		it('should raise a CommunityCreatedEvent', async () => {
			// Given - Setup context using Serenity tasks
			await communityAdmin.attemptsTo(
				SetupCommunityCreationContext.with(givenValidCommunityName, {
					canManageCommunitySettings: true,
				})
			);

			// When - Create a valid community
			await communityAdmin.attemptsTo(CreateCommunity.withValidData());

			// Then - Verify the community was created and events were raised
			expect(await communityAdmin.answer(TheCommunityCreationResult.value())).toBe('success');
			
			const communityEvents = await communityAdmin.answer(TheCommunityEvents.ofType(CommunityCreatedEvent));
			expect(communityEvents).toHaveLength(1);
			
			const createdEvent = communityEvents[0] as CommunityCreatedEvent;
			const expectedId = await communityAdmin.answer(TheExpectedCommunityId.value());
			expect(createdEvent.payload.communityId).toBe(expectedId);
			
			const createdCommunity = await communityAdmin.answer(TheCreatedCommunity.details());
			expect(createdCommunity).toBeDefined();
		});
	});
});
