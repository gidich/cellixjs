import { Community, CommunityProps, CommunityEntityReference } from '../community/community';
import { DomainExecutionContext } from '../../../domain-execution-context';
import { DomainSeedwork } from 'cellix-domain-seedwork';
export interface ServiceProps extends DomainSeedwork.DomainEntityProps {
    readonly community: CommunityProps;
    setCommunityRef(community: CommunityEntityReference): void;
    serviceName: string;
    description: string;
    isActive: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly schemaVersion: string;
}
export interface ServiceEntityReference extends Readonly<Omit<ServiceProps, 'community' | 'setCommunityRef'>> {
    readonly community: CommunityEntityReference;
}
export declare class Service<props extends ServiceProps> extends DomainSeedwork.AggregateRoot<props> implements ServiceEntityReference {
    private readonly context;
    private isNew;
    private readonly visa;
    constructor(props: props, context: DomainExecutionContext);
    static getNewInstance<props extends ServiceProps>(newProps: props, serviceName: string, description: string, community: CommunityEntityReference, context: DomainExecutionContext): Service<props>;
    get community(): Community<any>;
    get serviceName(): any;
    get description(): any;
    get isActive(): any;
    get createdAt(): Date;
    get updatedAt(): Date;
    get schemaVersion(): string;
    private set Community(value);
    set ServiceName(serviceName: string);
    set Description(description: string);
    set IsActive(isActive: boolean);
}
