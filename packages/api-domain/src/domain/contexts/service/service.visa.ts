import { PassportSeedwork } from '@cellix/domain-seedwork';
import { type ServicePermissions } from './service.permissions.ts';

export interface ServiceVisa extends PassportSeedwork.Visa {
  determineIf(func:((permissions:ServicePermissions) => boolean)) :  boolean ;
}