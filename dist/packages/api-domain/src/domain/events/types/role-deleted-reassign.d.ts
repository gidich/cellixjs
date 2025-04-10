import { DomainSeedwork } from 'cellix-domain-seedwork';
export interface RoleDeletedReassignProps {
    deletedRoleId: string;
    newRoleId: string;
}
export declare class RoleDeletedReassignEvent extends DomainSeedwork.CustomDomainEventImpl<RoleDeletedReassignProps> {
}
