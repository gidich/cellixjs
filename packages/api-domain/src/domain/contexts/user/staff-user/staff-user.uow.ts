import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { DomainExecutionContext } from '../../../domain-execution-context.ts';
import { StaffUser, type StaffUserProps } from './staff-user.ts'
import type { StaffUserRepository } from './staff-user.repository.ts';

export interface StaffUserUnitOfWork extends DomainSeedwork.UnitOfWork<DomainExecutionContext, StaffUserProps,  StaffUser<StaffUserProps>, StaffUserRepository<StaffUserProps>> {
}
