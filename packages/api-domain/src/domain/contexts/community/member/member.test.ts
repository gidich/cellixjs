import { jest } from '@jest/globals';
import { actorCalled, Question, Task } from '@serenity-js/core';
import type { Actor, AnswersQuestions, UsesAbilities } from '@serenity-js/core';
import { Member, type MemberProps } from './member.ts';
import type { CommunityVisa } from '../community.visa.ts';
import type { CommunityEntityReference } from '../community/community.ts';
import type { CommunityDomainPermissions } from '../community.domain-permissions.ts';
import type { Passport } from '../../passport.ts';
import type { CommunityPassport } from '../community.passport.ts';

/**
 * Member Domain Tests
 * 
 * Feature: Member Management
 * As a member administrator
 * I want to create and manage members
 * So that users can join communities and have profiles
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
class SetupMemberCreationContext extends Task {
	static with(
		memberName: string, 
		permissions: Partial<CommunityDomainPermissions>
	) {
		return new SetupMemberCreationContext(memberName, permissions);
	}

	private memberName: string;
	private permissions: Partial<CommunityDomainPermissions>;
	
	constructor(memberName: string, permissions: Partial<CommunityDomainPermissions>) {
		super(`Setup member creation context for "${memberName}" with specified permissions`);
		this.memberName = memberName;
		this.permissions = permissions;
	}

	performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
		const expectedNewId = '67890';
		const memberProps = jest.mocked({
			id: expectedNewId,
		} as MemberProps);
		
		const validCommunity = jest.mocked({} as CommunityEntityReference);

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

		remember('memberProps', memberProps);
		remember('validCommunity', validCommunity);
		remember('memberName', this.memberName);
		remember('passport', passport);
		remember('expectedId', expectedNewId);

		return Promise.resolve();
	}
}

class CreateMember extends Task {
	static withValidData() {
		return new CreateMember();
	}

	constructor() {
		super(`Create a new member using valid data and proper permissions`);
	}

	performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
		const props = recall<MemberProps>('memberProps');
		const memberName = recall<string>('memberName');
		const validCommunity = recall<CommunityEntityReference>('validCommunity');
		const passport = recall<Passport>('passport');

		try {
			const member = Member.getNewInstance(
				props,
				passport,
				memberName,
				validCommunity,
			);
			remember('createdMember', member);
			remember('memberCreationResult', 'success');
		} catch (error) {
			remember('memberCreationError', error);
			remember('memberCreationResult', 'error');
		}

		return Promise.resolve();
	}
}

class AttemptToCreateMemberWithInvalidName extends Task {
	static withName(invalidName: string) {
		return new AttemptToCreateMemberWithInvalidName(invalidName);
	}

	private invalidName: string;
	
	constructor(invalidName: string) {
		super(`Attempt to create member with invalid name (${invalidName.length} characters)`);
		this.invalidName = invalidName;
	}

	performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
		const props = recall<MemberProps>('memberProps');
		const validCommunity = recall<CommunityEntityReference>('validCommunity');
		const passport = recall<Passport>('passport');

		try {
			const member = Member.getNewInstance(
				props,
				passport,
				this.invalidName,
				validCommunity,
			);
			remember('createdMember', member);
			remember('memberCreationResult', 'success');
		} catch (error) {
			remember('memberCreationError', error);
			remember('memberCreationResult', 'error');
		}

		return Promise.resolve();
	}
}

class UpdateMemberProperty extends Task {
	static withEmail(email: string) {
		return new UpdateMemberProperty('email', email);
	}

	static withCybersourceId(cybersourceId: string) {
		return new UpdateMemberProperty('cybersourceId', cybersourceId);
	}

	static withMemberName(memberName: string) {
		return new UpdateMemberProperty('memberName', memberName);
	}

	static withBio(bio: string) {
		return new UpdateMemberProperty('bio', bio);
	}

	static withInterests(interests: string[]) {
		return new UpdateMemberProperty('interests', interests);
	}

	private property: string;
	private value: any;
	
	constructor(property: string, value: any) {
		super(`Update member ${property} with value: ${JSON.stringify(value)}`);
		this.property = property;
		this.value = value;
	}

	performAs(_actor: Actor & AnswersQuestions & UsesAbilities): Promise<void> {
		const member = recall<Member<MemberProps>>('createdMember');

		try {
			switch (this.property) {
				case 'email':
					member.profile.email = this.value;
					break;
				case 'cybersourceId':
					member.cybersourceCustomerId = this.value;
					break;
				case 'memberName':
					member.memberName = this.value;
					break;
				case 'bio':
					member.profile.bio = this.value;
					break;
				case 'interests':
					member.profile.interests = this.value;
					break;
				default:
					throw new Error(`Unknown property: ${this.property}`);
			}
			remember('memberUpdateResult', 'success');
		} catch (error) {
			remember('memberUpdateError', error);
			remember('memberUpdateResult', 'error');
		}

		return Promise.resolve();
	}
}

// Serenity Questions - Using function-based approach for better reporting
const TheMemberCreationResult = () => 
	Question.about<string>('the result of the member creation attempt', () => {
		return recall<string>('memberCreationResult');
	});

const TheMemberCreationError = () => 
	Question.about<Error>('the error details from the failed member creation', () => {
		return recall<Error>('memberCreationError');
	});

const TheCreatedMember = () => 
	Question.about<Member<MemberProps>>('the successfully created member', () => {
		return recall<Member<MemberProps>>('createdMember');
	});

const TheMemberUpdateResult = () => 
	Question.about<string>('the result of the member update attempt', () => {
		return recall<string>('memberUpdateResult');
	});

const TheMemberUpdateError = () => 
	Question.about<Error>('the error details from the failed member update', () => {
		return recall<Error>('memberUpdateError');
	});

describe('Member Domain', () => {
	describe('Feature: Creating a new member', () => {
		beforeEach(() => {
			clearMemory();
		});

		describe('Scenario: Member creation with valid data', () => {
			const givenValidMemberName = 'John Doe';
			let memberAdmin: Actor;

			beforeEach(() => {
				memberAdmin = actorCalled('Member Admin');
			});

			it('should successfully create a member', async () => {
				// Given - Setup context using Serenity tasks
				await memberAdmin.attemptsTo(
					SetupMemberCreationContext.with(givenValidMemberName, {
						canManageMembers: true,
					})
				);

				// When - Create a valid member
				await memberAdmin.attemptsTo(CreateMember.withValidData());

				// Then - Verify the member was created
				expect(await memberAdmin.answer(TheMemberCreationResult())).toBe('success');
				
				const createdMember = await memberAdmin.answer(TheCreatedMember());
				expect(createdMember).toBeDefined();
			});
		});

		describe('Scenario: Member creation with invalid data', () => {
			const givenValidMemberName = 'John Doe';
			let memberAdmin: Actor;

			beforeEach(() => {
				memberAdmin = actorCalled('Member Admin');
			});

			it('should reject a member with an invalid name that is too long', async () => {
				// Given - Setup context using Serenity tasks
				await memberAdmin.attemptsTo(
					SetupMemberCreationContext.with(givenValidMemberName, {
						canManageMembers: true,
					})
				);

				// When - Attempt to create member with invalid name
				const givenInvalidMemberName = 'x'.repeat(201);
				await memberAdmin.attemptsTo(
					AttemptToCreateMemberWithInvalidName.withName(givenInvalidMemberName)
				);

				// Then - Verify the result using Serenity questions
				expect(await memberAdmin.answer(TheMemberCreationResult())).toBe('error');
				const error = await memberAdmin.answer(TheMemberCreationError());
				expect(error).toEqual(
					expect.objectContaining({
						message: expect.stringContaining('Too long'),
					})
				);
			});
		});
	});

	describe('Feature: Updating a member', () => {
		beforeEach(() => {
			clearMemory();
		});

		describe('Scenario: Member property validation', () => {
			const givenValidMemberName = 'John Doe';
			let memberAdmin: Actor;

			beforeEach(async () => {
				memberAdmin = actorCalled('Member Admin');
				
				// Setup and create a valid member for testing updates
				await memberAdmin.attemptsTo(
					SetupMemberCreationContext.with(givenValidMemberName, {
						canManageMembers: true,
					})
				);
				await memberAdmin.attemptsTo(CreateMember.withValidData());
			});

			it('should reject an invalid email', async () => {
				// When - Update member with invalid email
				await memberAdmin.attemptsTo(
					UpdateMemberProperty.withEmail('bad-email')
				);

				// Then - Verify the update failed with correct error
				expect(await memberAdmin.answer(TheMemberUpdateResult())).toBe('error');
				const error = await memberAdmin.answer(TheMemberUpdateError());
				expect(error).toEqual(
					expect.objectContaining({
						message: expect.stringContaining("Value doesn't match pattern"),
					})
				);
			});

			it('should reject an invalid cybersource id', async () => {
				// When - Update member with invalid cybersource id
				const givenInvalidCybersourceId = 'x'.repeat(51);
				await memberAdmin.attemptsTo(
					UpdateMemberProperty.withCybersourceId(givenInvalidCybersourceId)
				);

				// Then - Verify the update failed with correct error
				expect(await memberAdmin.answer(TheMemberUpdateResult())).toBe('error');
				const error = await memberAdmin.answer(TheMemberUpdateError());
				expect(error).toEqual(
					expect.objectContaining({
						message: expect.stringContaining('Too long'),
					})
				);
			});

			it('should reject an invalid name', async () => {
				// When - Update member with invalid name
				const givenInvalidName = 'x'.repeat(501);
				await memberAdmin.attemptsTo(
					UpdateMemberProperty.withMemberName(givenInvalidName)
				);

				// Then - Verify the update failed with correct error
				expect(await memberAdmin.answer(TheMemberUpdateResult())).toBe('error');
				const error = await memberAdmin.answer(TheMemberUpdateError());
				expect(error).toEqual(
					expect.objectContaining({
						message: expect.stringContaining('Too long'),
					})
				);
			});

			it('should reject an invalid bio', async () => {
				// When - Update member with invalid bio
				const givenInvalidBio = 'x'.repeat(2001);
				await memberAdmin.attemptsTo(
					UpdateMemberProperty.withBio(givenInvalidBio)
				);

				// Then - Verify the update failed with correct error
				expect(await memberAdmin.answer(TheMemberUpdateResult())).toBe('error');
				const error = await memberAdmin.answer(TheMemberUpdateError());
				expect(error).toEqual(
					expect.objectContaining({
						message: expect.stringContaining('Too long'),
					})
				);
			});

			it('should reject more than 20 interests', async () => {
				// When - Update member with too many interests
				const givenInvalidInterests = Array(21).fill('interest') as string[];
				await memberAdmin.attemptsTo(
					UpdateMemberProperty.withInterests(givenInvalidInterests)
				);

				// Then - Verify the update failed with correct error
				expect(await memberAdmin.answer(TheMemberUpdateResult())).toBe('error');
				const error = await memberAdmin.answer(TheMemberUpdateError());
				expect(error).toEqual(
					expect.objectContaining({
						message: expect.stringContaining('Too long'),
					})
				);
			});
		});
	});

	// Legacy test helper - keeping for backward compatibility
	/**
	 * @param {Partial<CommunityDomainPermissions>} partialPermissions - Only need to define permissions that you want to be true, others will be false
	 * @returns {Passport}
	 */
	const getMockedPassport: (
		partialPermissions: Partial<CommunityDomainPermissions>,
	) => Passport = (partialPermissions) => {
		const mockCommunityVisa = {
			determineIf: (
				fn: (permissions: Readonly<CommunityDomainPermissions>) => boolean,
			) => {
				return fn(partialPermissions as CommunityDomainPermissions);
			},
		} as CommunityVisa;

		return {
			community: {
				forCommunity: jest.fn(() => mockCommunityVisa),
			} as CommunityPassport,
		} as Passport;
	};
});
