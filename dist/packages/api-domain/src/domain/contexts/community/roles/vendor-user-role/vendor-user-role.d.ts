import { VendorUserRolePermissions, VendorUserRolePermissionsEntityReference, VendorUserRolePermissionsProps } from './vendor-user-role-permissions';
import { CommunityProps, CommunityEntityReference } from '../../community/community';
import { DomainExecutionContext } from '../../../../domain-execution-context';
import { DomainSeedwork } from 'cellix-domain-seedwork';
export interface VendorUserRoleProps extends DomainSeedwork.DomainEntityProps {
    roleName: string;
    readonly community: CommunityProps;
    setCommunityRef: (community: CommunityEntityReference) => void;
    isDefault: boolean;
    permissions: VendorUserRolePermissionsProps;
    readonly roleType?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly schemaVersion: string;
}
export interface VendorUserRoleEntityReference extends Readonly<Omit<VendorUserRoleProps, 'community' | 'setCommunityRef' | 'permissions'>> {
    readonly community: CommunityEntityReference;
    readonly permissions: VendorUserRolePermissionsEntityReference;
}
export declare class VendorUserRole<props extends VendorUserRoleProps> extends DomainSeedwork.AggregateRoot<props> implements VendorUserRoleEntityReference {
    private readonly context;
    private isNew;
    private readonly visa;
    constructor(props: props, context: DomainExecutionContext);
    get roleName(): any;
    get community(): CommunityEntityReference;
    get isDefault(): any;
    get permissions(): VendorUserRolePermissions;
    get roleType(): any;
    get createdAt(): any;
    get updatedAt(): any;
    get schemaVersion(): any;
    static getNewInstance<props extends VendorUserRoleProps>(newProps: props, roleName: string, isDefault: boolean, community: CommunityEntityReference, context: DomainExecutionContext): VendorUserRole<props>;
    private set Community(value);
    set DeleteAndReassignTo(roleRef: VendorUserRoleEntityReference);
    set IsDefault(isDefault: boolean);
    set RoleName(roleName: string);
}
