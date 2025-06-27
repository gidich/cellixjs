import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.ts';
import { StaffUser, type StaffUserProps } from './staff-user.ts';
import type { StaffUserRepository } from './staff-user.repository.ts';

export interface StaffUserUnitOfWork
	extends DomainSeedwork.UnitOfWork<
		Passport,
		StaffUserProps,
		StaffUser<StaffUserProps>,
		StaffUserRepository<StaffUserProps>
	> {}
