import { DomainSeedwork } from 'cellix-domain-seedwork';
import { DomainExecutionContext } from '../../../domain-execution-context';
import { VendorUserPersonalInformation, VendorUserPersonalInformationEntityReference, VendorUserPersonalInformationProps } from './vendor-user-personal-information';
export interface VendorUserProps extends DomainSeedwork.DomainEntityProps {
    readonly personalInformation: VendorUserPersonalInformationProps;
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
export interface VendorUserEntityReference extends Readonly<Omit<VendorUserProps, 'personalInformation'>> {
    readonly personalInformation: VendorUserPersonalInformationEntityReference;
}
export declare class VendorUser<props extends VendorUserProps> extends DomainSeedwork.AggregateRoot<props> implements VendorUserEntityReference {
    private readonly context;
    private isNew;
    private readonly visa;
    constructor(props: props, context: DomainExecutionContext);
    get id(): string;
    get personalInformation(): VendorUserPersonalInformation;
    get email(): string;
    get displayName(): string;
    get externalId(): string;
    get accessBlocked(): boolean;
    get tags(): string[];
    get userType(): string;
    get updatedAt(): Date;
    get createdAt(): Date;
    get schemaVersion(): string;
    static getNewUser<props extends VendorUserProps>(newProps: props, externalId: string, lastName: string, context: DomainExecutionContext, restOfName?: string): VendorUser<props>;
    private MarkAsNew;
    private validateVisa;
    set Email(email: string);
    set DisplayName(displayName: string);
    set ExternalId(externalId: string);
    set AccessBlocked(accessBlocked: boolean);
    set Tags(tags: string[]);
}
