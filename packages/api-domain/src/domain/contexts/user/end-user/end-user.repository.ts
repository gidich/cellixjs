import { EndUser, EndUserProps } from './end-user';
import { DomainSeedwork } from 'api-data-sources-seedwork';

export interface EndUserRepository<props extends EndUserProps> extends DomainSeedwork.Repository<EndUser<props>> {
  delete(id:string): Promise<void>;
  getByExternalId(externalId:string): Promise<EndUser<props>>;
  getNewInstance(externalId: string, lastName: string, restOfName?: string): Promise<EndUser<props>>;
}