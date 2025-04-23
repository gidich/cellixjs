import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { DomainExecutionContext } from '../../../domain-execution-context.ts';
import { Service, type ServiceProps } from './service.ts';
import type { ServiceRepository } from './service.repository.ts';

export interface ServiceUnitOfWork extends DomainSeedwork.UnitOfWork<DomainExecutionContext, ServiceProps,  Service<ServiceProps>, ServiceRepository<ServiceProps>> {
}
