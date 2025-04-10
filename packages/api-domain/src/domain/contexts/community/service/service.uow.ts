import { DomainSeedwork } from 'cellix-domain-seedwork';
import { DomainExecutionContext } from '../../../domain-execution-context';
import { Service, ServiceProps } from './service';
import { ServiceRepository } from './service.repository';

export interface ServiceUnitOfWork extends DomainSeedwork.UnitOfWork<DomainExecutionContext, ServiceProps,  Service<ServiceProps>, ServiceRepository<ServiceProps>> {
}
