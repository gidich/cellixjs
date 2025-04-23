import { DomainSeedwork } from '@cellix/domain-seedwork';
import { type CommunityVisa } from '../community.visa.ts';
import { CommunityCreatedEvent } from '../../../events/types/community-created.ts';
import { CommunityDomainUpdatedEvent } from '../../../events/types/community-domain-updated.ts';
import { type DomainExecutionContext } from '../../../domain-execution-context.ts';
import { EndUser, type EndUserEntityReference, type EndUserProps } from '../../user/end-user/end-user.ts';
import * as ValueObjects from './community.value-objects.ts';

export interface CommunityProps extends DomainSeedwork.DomainEntityProps {
  name: string;
  domain: string;
  whiteLabelDomain: string | null ;
  handle: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly schemaVersion: string;
  readonly createdBy: EndUserProps;
  setCreatedByRef(user: EndUserEntityReference): void;
}

export interface CommunityEntityReference extends Readonly<Omit<CommunityProps, 'createdBy' | 'setCreatedByRef'>> {
  readonly createdBy: EndUserEntityReference;
}

export class Community<props extends CommunityProps> extends DomainSeedwork.AggregateRoot<props> implements CommunityEntityReference {

  //#region Fields
  private isNew: boolean = false;
  private readonly visa: CommunityVisa;
  private readonly context: DomainExecutionContext;
  //#endregion Fields

  //#region Constructors
  constructor(props: props, context: DomainExecutionContext) {
    super(props);
    this.context = context;
    this.visa = context.domainVisa.forCommunity(this);
  }
  //#endregion Constructors

  //#region Methods
  public static getNewInstance<props extends CommunityProps>(
    newProps: props,
    communityName: string,
    createdByUser: EndUserEntityReference,
    context: DomainExecutionContext
  ): Community<props> {
    let community = new Community(newProps, context);
    community.markAsNew();
    community.name = communityName;
    community.createdBy = createdByUser;
    community.isNew = false;
    return community;
  }

  private markAsNew(): void {
    this.isNew = true;
    this.addIntegrationEvent(CommunityCreatedEvent, { communityId: this.props.id });
  }
  //#endregion Methods

  //#region Properties

  get name() : string {
    return this.props.name;
  }
  set name(name: string) {
    if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageCommunitySettings)) {
      throw new Error('You do not have permission to change the name of this community');
    }
    this.props.name = new ValueObjects.Name(name).valueOf();
  }

  get domain() : string {
    return this.props.domain;
  }
  set domain(domain: string) {
    if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageCommunitySettings)) {
      throw new Error('You do not have permission to change the domain of this community');
    }
    const oldDomain = this.props.domain;
    if (this.props.domain !== domain) {
      this.props.domain = new ValueObjects.Domain(domain).valueOf();
      this.addIntegrationEvent(CommunityDomainUpdatedEvent, { communityId: this.props.id, domain, oldDomain: oldDomain });
    }
  }

  get whiteLabelDomain() : string | null {
    return this.props.whiteLabelDomain;
  }
  set whiteLabelDomain(whiteLabelDomain: string | null) {
    if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageCommunitySettings)) {
      throw new Error('You do not have permission to change the white label domain of this community');
    }
    this.props.whiteLabelDomain = whiteLabelDomain ? new ValueObjects.WhiteLabelDomain(whiteLabelDomain).valueOf() : null;
  }

  get handle() : string | null {
    return this.props.handle;
  }
  set handle(handle: string | null) {
    if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageCommunitySettings)) {
      throw new Error('You do not have permission to change the handle of this community');
    }
    this.props.handle = handle ? new ValueObjects.Handle(handle).valueOf() : null;
  }

  get createdBy() : EndUserEntityReference {
    return new EndUser(this.props.createdBy, this.context);
  }
  set createdBy(createdBy: EndUserEntityReference) {
    if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageCommunitySettings)) {
      throw new Error('You do not have permission to change the created by of this community');
    }
    if (createdBy === null || createdBy === undefined) {
      throw new Error('createdBy cannot be null or undefined');
    }
    this.props.setCreatedByRef(createdBy);
  }

  get updatedAt() : Date {
    return this.props.updatedAt;
  }

  get createdAt() : Date {
    return this.props.createdAt;
  }

  get schemaVersion() : string {
    return this.props.schemaVersion;
  }
  //#endregion Properties

}