import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../passport.ts';
import type { Community, CommunityProps } from './community.ts';
import type { CommunityRepository } from './community.repository.ts';
import type { Domain } from '../../../../index.ts';

export interface CommunityUnitOfWork
	extends DomainSeedwork.UnitOfWork<
		Passport,
		CommunityProps,
		Community<CommunityProps, Domain.Services>,
		CommunityRepository<CommunityProps, Domain.Services>,
        Domain.Services
	> {}
