import { DomainSeedwork } from 'cellix-domain-seedwork';
import { CommunityVisa } from "../../community.visa";
export interface EndUserRoleServicePermissionsSpec {
    canManageServices?: boolean;
    isSystemAccount?: boolean;
}
export interface EndUserRoleServicePermissionsProps extends EndUserRoleServicePermissionsSpec, DomainSeedwork.ValueObjectProps {
}
export declare class EndUserRoleServicePermissions extends DomainSeedwork.ValueObject<EndUserRoleServicePermissionsProps> implements EndUserRoleServicePermissionsEntityReference {
    private visa;
    constructor(props: EndUserRoleServicePermissionsProps, visa: CommunityVisa);
    get canManageServices(): boolean;
    get isSystemAccount(): boolean;
    set CanManageServices(value: boolean);
}
export interface EndUserRoleServicePermissionsEntityReference extends Readonly<EndUserRoleServicePermissionsProps> {
}
