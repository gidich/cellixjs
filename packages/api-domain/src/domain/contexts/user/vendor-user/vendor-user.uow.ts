import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { DomainExecutionContext } from '../../../domain-execution-context.ts';
import { VendorUser, type VendorUserProps } from './vendor-user.ts';
import type { VendorUserRepository } from './vendor-user.repository.ts';

export interface VendorUserUnitOfWork extends DomainSeedwork.UnitOfWork<DomainExecutionContext, VendorUserProps, VendorUser<VendorUserProps>, VendorUserRepository<VendorUserProps>> {
}
