import { DomainSeedwork } from 'cellix-domain-seedwork';
import { DomainExecutionContext } from '../../../domain-execution-context';
import { EndUserEntityReference, EndUserProps } from '../../user/end-user/end-user';
export interface CommunityProps extends DomainSeedwork.DomainEntityProps {
    name: string;
    domain: string;
    whiteLabelDomain: string;
    handle: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly schemaVersion: string;
    readonly createdBy: EndUserProps;
    setCreatedByRef(user: EndUserEntityReference): void;
}
export interface CommunityEntityReference extends Readonly<Omit<CommunityProps, 'createdBy' | 'setCreatedByRef'>> {
    readonly createdBy: EndUserEntityReference;
}
export declare class Community<props extends CommunityProps> extends DomainSeedwork.AggregateRoot<props> implements CommunityEntityReference {
    private readonly context;
    private isNew;
    private readonly visa;
    constructor(props: props, context: DomainExecutionContext);
    static getNewInstance<props extends CommunityProps>(newProps: props, communityName: string, createdByUser: EndUserEntityReference, context: DomainExecutionContext): Community<props>;
    private markAsNew;
    get id(): string;
    get name(): string;
    set name(name: string);
    get domain(): string;
    set domain(domain: string);
    get whiteLabelDomain(): string;
    set whiteLabelDomain(whiteLabelDomain: string);
    get handle(): string;
    set handle(handle: string);
    get createdBy(): EndUserEntityReference;
    set createdBy(createdBy: EndUserEntityReference);
    get updatedAt(): Date;
    get createdAt(): Date;
    get schemaVersion(): string;
}
