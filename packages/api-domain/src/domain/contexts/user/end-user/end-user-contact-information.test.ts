import { describe, it, expect, vi } from 'vitest';
import { EndUserContactInformation } from './end-user-contact-information.ts';
import type { UserVisa } from '../user.visa.ts';

describe('domain.contexts.end-user-contact-information', () => {
	const getMockedVisa = (permissions: {
		isEditingOwnAccount?: boolean;
		canManageEndUsers?: boolean;
	}) =>
		({
			determineIf: vi.fn((fn) =>
				fn({
					isEditingOwnAccount: !!permissions.isEditingOwnAccount,
					canManageEndUsers: !!permissions.canManageEndUsers,
				}),
			),
		}) as unknown as UserVisa;

	describe('when creating a new instance', () => {
		it('should reject an invalid email - bad pattern', () => {
			const visa = getMockedVisa({
				isEditingOwnAccount: false,
				canManageEndUsers: false,
			});
			expect(() =>
				EndUserContactInformation.getNewInstance(
					{ email: 'bad-email' },
					visa,
					'bad-email',
				),
			).toThrow("Value doesn't match pattern");
		});

		it('should reject an invalid email - too long', () => {
			const visa = getMockedVisa({
				isEditingOwnAccount: false,
				canManageEndUsers: false,
			});
			expect(() =>
				EndUserContactInformation.getNewInstance(
					{ email: 'a'.repeat(245) + '@email.com' },
					visa,
					'a'.repeat(245) + '@email.com',
				),
			).toThrow('Too long');
		});

		it('should accept a valid email on creation', () => {
			const visa = getMockedVisa({
				isEditingOwnAccount: false,
				canManageEndUsers: false,
			});
			const info = EndUserContactInformation.getNewInstance(
				{ email: 'test@email.com' },
				visa,
				'test@email.com',
			);
			expect(info.email).toBe('test@email.com');
		});
	});

	describe('when updating an existing instance', () => {
        it('should throw when updating email without any permissions', () => {
			const visa = getMockedVisa({ isEditingOwnAccount: false, canManageEndUsers: false });
			const info = new EndUserContactInformation(
				{ email: 'old@email.com' },
				visa,
			);
			expect(() => {
				info.email = 'new@email.com';
			}).toThrow('Cannot set email');
		});

		it('should allow updating email with isEditingOwnAccount permission', () => {
			const visa = getMockedVisa({ isEditingOwnAccount: true, canManageEndUsers: false });
			const info = new EndUserContactInformation(
				{ email: 'old@email.com' },
				visa,
			);
			expect(() => {
				info.email = 'new@email.com';
			}).not.toThrow();
			expect(info.email).toBe('new@email.com');
		});

		it('should allow updating email with canManageEndUsers permission', () => {
			const visa = getMockedVisa({ isEditingOwnAccount: false, canManageEndUsers: true });
			const info = new EndUserContactInformation(
				{ email: 'old@email.com' },
				visa,
			);
			expect(() => {
				info.email = 'new@email.com';
			}).not.toThrow();
			expect(info.email).toBe('new@email.com');
		});
	});
});
