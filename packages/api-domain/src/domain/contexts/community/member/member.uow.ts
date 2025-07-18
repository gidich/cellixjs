import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.ts';
import type { Member, MemberProps } from './member.ts';
import type { MemberRepository } from './member.repository.ts';

export interface MemberUnitOfWork
	extends DomainSeedwork.UnitOfWork<
		Passport,
		MemberProps,
		Member<MemberProps>,
		MemberRepository<MemberProps>
	> {}
