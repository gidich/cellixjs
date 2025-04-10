import { DomainSeedwork } from 'cellix-domain-seedwork';
import { EndUserCreatedEvent } from '../../../events/types/end-user-created';
import { DomainExecutionContext } from '../../../domain-execution-context';
import * as ValueObjects from './end-user.value-objects';
import { EndUserVisa } from './end-user.visa';
import { EndUserPersonalInformation, EndUserPersonalInformationEntityReference, EndUserPersonalInformationProps } from './end-user-personal-information';

export interface EndUserProps extends DomainSeedwork.DomainEntityProps {
  readonly personalInformation: EndUserPersonalInformationProps;
  email?: string;
  displayName: string;
  externalId:string;
  accessBlocked: boolean;
  tags?: string[];
  readonly userType?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly schemaVersion: string;
}
export interface EndUserEntityReference extends Readonly<Omit<EndUserProps, 'personalInformation' >> {
  readonly personalInformation: EndUserPersonalInformationEntityReference;
}


export class EndUser<props extends EndUserProps> extends DomainSeedwork.AggregateRoot<props> implements EndUserEntityReference  {
  private isNew: boolean = false;
  private readonly visa: EndUserVisa;
  constructor(props: props, context: DomainExecutionContext) { 
    super(props);
    this.visa = context.domainVisa.forEndUser(this);
  }

  get id(): string {return this.props.id;}
  get personalInformation() {
    return new EndUserPersonalInformation(this.props.personalInformation);
  }

  get email(): string {return this.props.email;}
  get displayName(): string {return this.props.displayName;}
  get externalId(): string {return this.props.externalId;}
  get accessBlocked(): boolean {return this.props.accessBlocked;}
  get tags(): string[] {return this.props.tags;}
  get userType(): string {return this.props.userType;}
  get updatedAt(): Date {return this.props.updatedAt;}
  get createdAt(): Date {return this.props.createdAt;}
  get schemaVersion(): string {return this.props.schemaVersion;}

  public static getNewUser<props extends EndUserProps> (newProps:props,externalId:string, lastName:string, restOfName:string, context:DomainExecutionContext): EndUser<props> {
    newProps.externalId = externalId;
    let user = new EndUser(newProps, context);
    user.MarkAsNew();
    user.ExternalId=(externalId);
    if (restOfName !== undefined) {
      user.personalInformation.identityDetails.RestOfName=(restOfName);
      user.personalInformation.identityDetails.LegalNameConsistsOfOneName=(false);
      user.DisplayName=(`${restOfName} ${lastName}`);
    } else {
      user.personalInformation.identityDetails.LegalNameConsistsOfOneName=(true);
      user.DisplayName=(lastName);
    }
    user.personalInformation.identityDetails.LastName=(lastName);
    user.isNew = false;
    return user;
  }

  private MarkAsNew(): void {
    this.isNew = true;
    this.addIntegrationEvent(EndUserCreatedEvent,{userId: this.props.id});
  }

  private validateVisa(): void {
    if (!this.isNew && !this.visa.determineIf((permissions) => permissions.isEditingOwnAccount)) {
      throw new Error('Unauthorized');
    }
  }

  set Email(email:string) {
    this.props.email = (new ValueObjects.Email(email)).valueOf();
  }

  set DisplayName(displayName:string) {
    this.validateVisa();
    this.props.displayName = (new ValueObjects.DisplayName(displayName)).valueOf();
  }

  set ExternalId(externalId:string) {
    this.validateVisa();
    this.props.externalId = (new ValueObjects.ExternalId(externalId)).valueOf();
  }

  set AccessBlocked(accessBlocked:boolean) {
    this.validateVisa();
    this.props.accessBlocked = accessBlocked;
  }

  set Tags(tags:string[]) {
    this.validateVisa();
    this.props.tags = tags;
  }
}