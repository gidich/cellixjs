import { Community, CommunityProps, CommunityEntityReference } from '../community/community';
import { DomainExecutionContext, SystemDomainExecutionContext } from '../../../domain-execution-context';
import * as ValueObjects from './service.value-objects';
import { ServiceVisa } from './service.visa';
import { DomainSeedwork } from 'api-data-sources-seedwork';

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

export class Service<props extends ServiceProps> extends DomainSeedwork.AggregateRoot<props> implements ServiceEntityReference {
  private isNew: boolean = false;
  private readonly visa: ServiceVisa;
  
  constructor(props: props, private readonly context: DomainExecutionContext) {
    super(props)
    this.visa = context.domainVisa.forService(this);
  }

  public static getNewInstance<props extends ServiceProps>(
    newProps: props,
    serviceName: string,
    description: string,
    community: CommunityEntityReference,
    context: DomainExecutionContext
  ): Service<props> {
    let service = new Service(newProps, context);
    service.isNew = true;
    service.ServiceName = serviceName;
    service.Description = description;
    service.Community = community;
    service.IsActive = true;
    service.isNew = false;
    return service;
  }

  get community() {
    return new Community(this.props.community, this.context);
  }
  get serviceName() {
    return this.props.serviceName;
  }
  get description() {
    return this.props.description;
  }
  get isActive() {
    return this.props.isActive;
  }
  get createdAt(): Date {
    return this.props.createdAt;
  }
  get updatedAt(): Date {
    return this.props.updatedAt;
  }
  get schemaVersion(): string {
    return this.props.schemaVersion;
  }

  // using set from TS 5.1

  private set Community(community: CommunityEntityReference) {
    if (!this.isNew) {
      throw new Error('Unauthorized');
    }
    this.props.setCommunityRef(community);
  }

  set ServiceName(serviceName: string) {
    this.props.serviceName = new ValueObjects.ServiceName(serviceName).valueOf();
  }

  set Description(description: string) {
    this.props.description = new ValueObjects.Description(description).valueOf();
  }

  set IsActive(isActive: boolean) {
    this.props.isActive = isActive;
  }

  //
}
