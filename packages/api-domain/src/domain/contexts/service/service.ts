import { DomainSeedwork } from '@cellix/domain-seedwork';
import { Community, type CommunityProps, type CommunityEntityReference } from '../community/community/community.ts';
import type { DomainExecutionContext } from '../../domain-execution-context.ts';
import * as ValueObjects from './service.value-objects.ts';
import type { ServiceVisa } from './service.visa.ts';

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
  private readonly context: DomainExecutionContext;
  
  constructor(props: props, context: DomainExecutionContext) {
    super(props)
    this.context = context;
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
    service.serviceName = serviceName;
    service.description = description;
    service.community = community;
    service.isActive = true;
    service.isNew = false;
    return service;
  }

  get community() {
    return new Community(this.props.community, this.context);
  }
  private set community(community: CommunityEntityReference) {
    if (!this.isNew) {
      throw new Error('Unauthorized');
    }
    this.props.setCommunityRef(community);
  }
  get serviceName() {
    return this.props.serviceName;
  }
  set serviceName(serviceName: string) {
    if(!this.visa.determineIf((permissions) => permissions.canManageServices)) {
      throw new Error('You do not have permission to change the service name');
    }
    this.props.serviceName = new ValueObjects.ServiceName(serviceName).valueOf();
  }
  get description() {
    return this.props.description;
  }
  set description(description: string) {
    if(!this.visa.determineIf((permissions) => permissions.canManageServices)) {
      throw new Error('You do not have permission to change the service description');
    }
    this.props.description = new ValueObjects.Description(description).valueOf();
  }
  get isActive() {
    return this.props.isActive;
  }
  set isActive(isActive: boolean) {
    if(!this.visa.determineIf((permissions) => permissions.canManageServices)) {
      throw new Error('You do not have permission to change the service status');
    }
    this.props.isActive = isActive;
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

}
