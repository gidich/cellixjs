import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type { Passport } from '../../../passport.ts';
import type { EndUserRole, EndUserRoleProps } from './end-user-role.ts';
import type { EndUserRoleRepository } from './end-user-role.repository.ts';

export interface EndUserRoleUnitOfWork extends DomainSeedwork.UnitOfWork<Passport, EndUserRoleProps, EndUserRole<EndUserRoleProps>, EndUserRoleRepository<EndUserRoleProps>> {}
