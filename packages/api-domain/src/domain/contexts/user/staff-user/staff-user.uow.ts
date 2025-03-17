import { DomainSeedwork } from 'api-data-sources-seedwork';
import { DomainExecutionContext } from '../../../domain-execution-context';
import { StaffUser, StaffUserProps } from './staff-user';
import { StaffUserRepository } from './staff-user.repository';

export interface StaffUserUnitOfWork extends DomainSeedwork.UnitOfWork<DomainExecutionContext, StaffUserProps,  StaffUser<StaffUserProps>, StaffUserRepository<StaffUserProps>> {
}
