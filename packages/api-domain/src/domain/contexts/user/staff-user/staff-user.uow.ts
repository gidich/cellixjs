import { DomainSeedwork } from 'cellix-domain-seedwork';
import { DomainExecutionContext } from '../../../domain-execution-context';
import { StaffUser, StaffUserProps } from './staff-user';
import { StaffUserRepository } from './staff-user.repository';

export interface StaffUserUnitOfWork extends DomainSeedwork.UnitOfWork<DomainExecutionContext, StaffUserProps,  StaffUser<StaffUserProps>, StaffUserRepository<StaffUserProps>> {
}
