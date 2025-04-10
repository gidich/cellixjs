import { DomainSeedwork } from 'cellix-domain-seedwork';
import { DomainExecutionContext } from '../../../domain-execution-context';
import { StaffRoleEntityReference, StaffRoleProps } from '../../community/roles/staff-role/staff-role';
export interface StaffUserProps extends DomainSeedwork.DomainEntityProps {
    readonly role?: StaffRoleProps;
    setRoleRef: (role: StaffRoleEntityReference) => void;
    firstName?: string;
    lastName?: string;
    email?: string;
    displayName: string;
    externalId: string;
    accessBlocked: boolean;
    tags?: string[];
    readonly userType?: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly schemaVersion: string;
}
export interface StaffUserEntityReference extends Readonly<Omit<StaffUserProps, 'role' | 'setRoleRef'>> {
    readonly role: StaffRoleEntityReference;
}
export declare class StaffUser<props extends StaffUserProps> extends DomainSeedwork.AggregateRoot<props> implements StaffUserEntityReference {
    private readonly context;
    private isNew;
    private readonly visa;
    constructor(props: props, context: DomainExecutionContext);
    get id(): string;
    get role(): StaffRoleEntityReference;
    get firstName(): string;
    get lastName(): string;
    get email(): string;
    get displayName(): string;
    get externalId(): string;
    get accessBlocked(): boolean;
    get tags(): string[];
    get userType(): string;
    get updatedAt(): Date;
    get createdAt(): Date;
    get schemaVersion(): string;
    static getNewUser<props extends StaffUserProps>(newProps: props, externalId: string, firstName: string, lastName: string, email: string, context: DomainExecutionContext): StaffUser<props>;
    private MarkAsNew;
    private validateVisa;
    set Role(role: StaffRoleEntityReference);
    set FirstName(firstName: string);
    set LastName(lastName: string);
    set Email(email: string);
    set DisplayName(displayName: string);
    set ExternalId(externalId: string);
    set AccessBlocked(accessBlocked: boolean);
    set Tags(tags: string[]);
}
