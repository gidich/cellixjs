import { DomainVisa } from './domain.visa';
import { DomainSeedwork } from 'cellix-domain-seedwork';
export interface DomainExecutionContext extends DomainSeedwork.BaseDomainExecutionContext {
    domainVisa: DomainVisa;
}
export declare const SystemDomainExecutionContext: () => DomainExecutionContext;
export declare const ReadOnlyDomainExecutionContext: () => DomainExecutionContext;
