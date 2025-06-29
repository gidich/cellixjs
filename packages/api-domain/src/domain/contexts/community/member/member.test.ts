import { Member, type MemberProps } from './member.ts';
import type { CommunityVisa } from '../community.visa.ts';
import type { CommunityEntityReference } from '../community/community.ts';
import type { CommunityDomainPermissions } from '../community.domain-permissions.ts';
import type { Passport } from '../../passport.ts';
import type { CommunityPassport } from '../community.passport.ts';
import { describe, expect, it, vi } from 'vitest';

describe('domain.contexts.member', () => {
	/**
	 * @param {Partial<CommunityDomainPermissions>} partialPermissions - Only need to define permissions that you want to be true, others will be false
	 * @returns {Passport}
	 */
	const getMockedPassport: (
		partialPermissions: Partial<CommunityDomainPermissions>,
	) => Passport = (partialPermissions) => {
		const mockCommunityVisa = vi.mocked({
			determineIf: (
				fn: (permissions: Readonly<CommunityDomainPermissions>) => boolean,
			) => {
				return fn(partialPermissions as CommunityDomainPermissions);
			},
		} as CommunityVisa);

		const givenValidPassport = vi.mocked({} as Passport);
		givenValidPassport.community = vi.mocked({
			forCommunity: vi.fn(() => mockCommunityVisa),
		} as CommunityPassport);

		return givenValidPassport;
	};

	describe('when creating a new member', () => {
		const givenValidCommunity = vi.mocked({} as CommunityEntityReference);
		const givenValidName = 'John Doe';

		it('should reject an invalid name', () => {
			// Arrange
			const givenInvalidName = 'x'.repeat(201);
			const givenMemberProps = vi.mocked({} as MemberProps);
			const givenValidPassport = getMockedPassport({
				canManageMembers: true,
			});

			// Act
			const creatingInvalidMember = () => {
				Member.getNewInstance(
					givenMemberProps,
					givenValidPassport,
					givenInvalidName,
					givenValidCommunity,
				);
			};

			// Assert
			expect(creatingInvalidMember).toThrow('Too long');
		});

		it('should accept valid input', () => {
			// Arrange
			const memberProps = vi.mocked({
                profile: {}
			} as MemberProps);
			const givenValidPassport = getMockedPassport({
				canManageMembers: true,
			});

			// Act
			const creatingValidMember = () => {
				Member.getNewInstance(
					memberProps,
					givenValidPassport,
					givenValidName,
					givenValidCommunity,
				);
			};

			// Assert
			expect(creatingValidMember).not.toThrow();
		});
	});

	describe('when updating a member', () => {
		const memberProps = vi.mocked({} as MemberProps);
		const givenValidPassport = getMockedPassport({
			canManageMembers: true,
		});

		it('should reject an invalid email', () => {
			// Arrange
			const member = new Member(memberProps, givenValidPassport);
			const givenInvalidEmail = 'bad-email';

			// Act
			const updatingUserWithInvalidProperty = () => {
				member.profile.email = givenInvalidEmail;
			};

			// Assert
			expect(updatingUserWithInvalidProperty).toThrow(
				"Value doesn't match pattern",
			);
		});

		it('should reject an invalid cybersource id', () => {
			// Arrange

			const member = new Member(memberProps, givenValidPassport);
			const givenInvalidCybersourceId = 'x'.repeat(51);

			// Act
			const updatingUserWithInvalidProperty = () => {
				member.cybersourceCustomerId = givenInvalidCybersourceId;
			};

			// Assert
			expect(updatingUserWithInvalidProperty).toThrow('Too long');
		});

		it('should reject an invalid name', () => {
			// Arrange
			const member = new Member(memberProps, givenValidPassport);
			const givenInvalidName = 'x'.repeat(501);

			// Act
			const updatingUserWithInvalidProperty = () => {
				member.memberName = givenInvalidName;
			};

			// Assert
			expect(updatingUserWithInvalidProperty).toThrow('Too long');
		});

		it('should reject an invalid bio', () => {
			// Arrange
			const member = new Member(memberProps, givenValidPassport);
			const givenInvalidBio = 'x'.repeat(2001);

			// Act
			const updatingUserWithInvalidProperty = () => {
				member.profile.bio = givenInvalidBio;
			};

			// Assert
			expect(updatingUserWithInvalidProperty).toThrow('Too long');
		});

		it('should reject more than 20 interests', () => {
			// Arrange
			const member = new Member(memberProps, givenValidPassport);
			const givenInvalidInterests = Array(21).fill('interest') as string[];

			// Act
			const updatingUserWithInvalidProperty = () => {
				member.profile.interests = givenInvalidInterests;
			};

			// Assert
			expect(updatingUserWithInvalidProperty).toThrow('Too long');
		});
	});
});
