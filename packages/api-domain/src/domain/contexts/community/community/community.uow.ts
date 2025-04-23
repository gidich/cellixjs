import { DomainSeedwork } from '@cellix/domain-seedwork';
import { type DomainExecutionContext } from '../../../domain-execution-context.ts';
import { Community, type CommunityProps } from './community.ts';
import { type CommunityRepository } from './community.repository.ts';


export interface CommunityUnitOfWork extends DomainSeedwork.UnitOfWork<DomainExecutionContext, CommunityProps, Community<CommunityProps>, CommunityRepository<CommunityProps>> {}