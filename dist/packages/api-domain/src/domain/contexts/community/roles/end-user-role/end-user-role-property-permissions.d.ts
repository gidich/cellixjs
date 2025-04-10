import { DomainSeedwork } from 'cellix-domain-seedwork';
import { CommunityVisa } from "../../community.visa";
export interface EndUserRolePropertyPermissionsSpec {
    canManageProperties?: boolean;
    canEditOwnProperty?: boolean;
    isEditingOwnProperty?: boolean;
    isSystemAccount?: boolean;
}
export interface EndUserRolePropertyPermissionsProps extends EndUserRolePropertyPermissionsSpec, DomainSeedwork.ValueObjectProps {
}
export declare class EndUserRolePropertyPermissions extends DomainSeedwork.ValueObject<EndUserRolePropertyPermissionsProps> implements EndUserRolePropertyPermissionsEntityReference {
    private visa;
    constructor(props: EndUserRolePropertyPermissionsProps, visa: CommunityVisa);
    get canManageProperties(): boolean;
    get canEditOwnProperty(): boolean;
    get isEditingOwnProperty(): boolean;
    get isSystemAccount(): boolean;
    set CanManageProperties(value: boolean);
    set CanEditOwnProperty(value: boolean);
}
export interface EndUserRolePropertyPermissionsEntityReference extends Readonly<EndUserRolePropertyPermissionsProps> {
}
