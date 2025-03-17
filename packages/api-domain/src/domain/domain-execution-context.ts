import { DomainVisa, ReadOnlyDomainVisa, SystemDomainVisa } from './domain.visa'
import { DomainSeedwork } from 'api-data-sources-seedwork';

export interface DomainExecutionContext extends DomainSeedwork.BaseDomainExecutionContext {
  domainVisa: DomainVisa;
}

export const SystemDomainExecutionContext = (): DomainExecutionContext => {
  const context: DomainExecutionContext = {
    domainVisa: SystemDomainVisa.GetInstance(),
  };
  return context;
};

export const ReadOnlyDomainExecutionContext = (): DomainExecutionContext => {
  const context: DomainExecutionContext = {
    domainVisa: ReadOnlyDomainVisa.GetInstance(),
  };
  return context;
};