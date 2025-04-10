import { DomainSeedwork } from 'cellix-domain-seedwork';
import { DomainExecutionContext } from '../../../domain-execution-context';
import { VendorUser, VendorUserProps } from './vendor-user';
import { VendorUserRepository } from './vendor-user.repository';
export interface VendorUserUnitOfWork extends DomainSeedwork.UnitOfWork<DomainExecutionContext, VendorUserProps, VendorUser<VendorUserProps>, VendorUserRepository<VendorUserProps>> {
}
