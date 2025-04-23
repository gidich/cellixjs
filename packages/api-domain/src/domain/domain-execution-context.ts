import { type DomainVisa, ReadOnlyDomainVisa, SystemDomainVisa } from './domain.visa.ts'
import { DomainSeedwork } from '@cellix/domain-seedwork';

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