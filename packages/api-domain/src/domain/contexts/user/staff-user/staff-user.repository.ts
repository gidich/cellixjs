import { StaffUser, StaffUserProps } from './staff-user';
import { DomainSeedwork } from 'cellix-domain-seedwork';

export interface StaffUserRepository<props extends StaffUserProps> extends DomainSeedwork.Repository<StaffUser<props>> {
  delete(id:string): Promise<void>;
  getByExternalId(externalId:string): Promise<StaffUser<props>>;
  getNewInstance(externalId: string, firstName: string, lastName: string, email: string): Promise<StaffUser<props>>;
}