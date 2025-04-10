import { DomainSeedwork } from 'cellix-domain-seedwork';
import { DomainExecutionContext } from "../../../../domain-execution-context";
import { StaffRolePermissionsProps, StaffRolePermissionsEntityReference, StaffRolePermissions } from "./staff-role-permissions";
export interface StaffRoleProps extends DomainSeedwork.DomainEntityProps {
    roleName: string;
    isDefault: boolean;
    readonly permissions: StaffRolePermissionsProps;
    readonly roleType?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly schemaVersion: string;
}
export interface StaffRoleEntityReference extends Readonly<Omit<StaffRoleProps, 'permissions'>> {
    readonly permissions: StaffRolePermissionsEntityReference;
}
export declare class StaffRole<props extends StaffRoleProps> extends DomainSeedwork.AggregateRoot<props> implements StaffRoleEntityReference {
    private readonly context;
    private isNew;
    private visa;
    constructor(props: props, context: DomainExecutionContext);
    get roleName(): any;
    get isDefault(): any;
    get permissions(): StaffRolePermissions;
    get roleType(): any;
    get createdAt(): any;
    get updatedAt(): any;
    get schemaVersion(): any;
    static getNewInstance<props extends StaffRoleProps>(newProps: props, roleName: string, isDefault: boolean, context: DomainExecutionContext): StaffRole<props>;
    set DeleteAndReassignTo(roleRef: StaffRoleEntityReference);
    set IsDefault(isDefault: boolean);
    set RoleName(roleName: string);
}
