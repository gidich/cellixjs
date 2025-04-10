import { EndUserRolePermissions, EndUserRolePermissionsEntityReference, EndUserRolePermissionsProps } from './end-user-role-permissions';
import { CommunityProps, CommunityEntityReference } from '../../community/community';
import { CommunityVisa } from "../../community.visa";
import { DomainExecutionContext } from '../../../../domain-execution-context';
import { DomainSeedwork } from 'cellix-domain-seedwork';
export interface EndUserRoleProps extends DomainSeedwork.DomainEntityProps {
    roleName: string;
    readonly community: CommunityProps;
    setCommunityRef: (community: CommunityEntityReference) => void;
    isDefault: boolean;
    permissions: EndUserRolePermissionsProps;
    readonly roleType?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly schemaVersion: string;
}
export interface EndUserRoleEntityReference extends Readonly<Omit<EndUserRoleProps, 'community' | 'setCommunityRef' | 'permissions'>> {
    readonly community: CommunityEntityReference;
    readonly permissions: EndUserRolePermissionsEntityReference;
}
export declare class EndUserRole<props extends EndUserRoleProps> extends DomainSeedwork.AggregateRoot<props> implements EndUserRoleEntityReference {
    private readonly context;
    private isNew;
    visa: CommunityVisa;
    constructor(props: props, context: DomainExecutionContext);
    get roleName(): any;
    get community(): CommunityEntityReference;
    get isDefault(): any;
    get permissions(): EndUserRolePermissions;
    get roleType(): any;
    get createdAt(): any;
    get updatedAt(): any;
    get schemaVersion(): any;
    static getNewInstance<props extends EndUserRoleProps>(newProps: props, roleName: string, isDefault: boolean, community: CommunityEntityReference, context: DomainExecutionContext): EndUserRole<props>;
    private set Community(value);
    set DeleteAndReassignTo(roleRef: EndUserRoleEntityReference);
    set IsDefault(isDefault: boolean);
    set RoleName(roleName: string);
}
