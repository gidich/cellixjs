import { DomainSeedwork } from 'api-data-sources-seedwork';

export interface RoleDeletedReassignProps {
  deletedRoleId: string;
  newRoleId: string;
}

export class RoleDeletedReassignEvent extends DomainSeedwork.CustomDomainEventImpl<RoleDeletedReassignProps> {}
