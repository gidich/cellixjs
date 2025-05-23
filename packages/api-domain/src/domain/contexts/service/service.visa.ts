import { PassportSeedwork } from '@cellix/domain-seedwork';
import { type ServiceDomainPermissions } from './service.domain-permissions.ts';

export interface ServiceVisa extends PassportSeedwork.Visa {
  determineIf(func:((permissions:ServiceDomainPermissions) => boolean)) :  boolean ;
}