import { DomainSeedwork } from 'api-data-sources-seedwork';
import { DomainExecutionContext } from '../../../domain-execution-context';
import { Community, CommunityProps } from './community';
import { CommunityRepository } from './community.repository';


export interface CommunityUnitOfWork extends DomainSeedwork.UnitOfWork<DomainExecutionContext, CommunityProps, Community<CommunityProps>, CommunityRepository<CommunityProps>> {
}
