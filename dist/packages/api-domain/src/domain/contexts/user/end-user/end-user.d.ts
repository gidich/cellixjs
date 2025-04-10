import { DomainSeedwork } from 'cellix-domain-seedwork';
import { DomainExecutionContext } from '../../../domain-execution-context';
import { EndUserPersonalInformation, EndUserPersonalInformationEntityReference, EndUserPersonalInformationProps } from './end-user-personal-information';
export interface EndUserProps extends DomainSeedwork.DomainEntityProps {
    readonly personalInformation: EndUserPersonalInformationProps;
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
export interface EndUserEntityReference extends Readonly<Omit<EndUserProps, 'personalInformation'>> {
    readonly personalInformation: EndUserPersonalInformationEntityReference;
}
export declare class EndUser<props extends EndUserProps> extends DomainSeedwork.AggregateRoot<props> implements EndUserEntityReference {
    private isNew;
    private readonly visa;
    constructor(props: props, context: DomainExecutionContext);
    get id(): string;
    get personalInformation(): EndUserPersonalInformation;
    get email(): string;
    get displayName(): string;
    get externalId(): string;
    get accessBlocked(): boolean;
    get tags(): string[];
    get userType(): string;
    get updatedAt(): Date;
    get createdAt(): Date;
    get schemaVersion(): string;
    static getNewUser<props extends EndUserProps>(newProps: props, externalId: string, lastName: string, restOfName: string, context: DomainExecutionContext): EndUser<props>;
    private MarkAsNew;
    private validateVisa;
    set Email(email: string);
    set DisplayName(displayName: string);
    set ExternalId(externalId: string);
    set AccessBlocked(accessBlocked: boolean);
    set Tags(tags: string[]);
}
