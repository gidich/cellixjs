import { DomainSeedwork } from '@cellix/domain-seedwork';
import { EndUserCreatedEvent } from '../../../events/types/end-user-created.ts';
import type { DomainExecutionContext } from '../../../domain-execution-context.ts';
import * as ValueObjects from './end-user.value-objects.ts';
import type { EndUserVisa } from './end-user.visa.ts';
import { EndUserPersonalInformation, type EndUserPersonalInformationEntityReference, type EndUserPersonalInformationProps } from './end-user-personal-information.ts';

export interface EndUserProps extends DomainSeedwork.DomainEntityProps {
  readonly personalInformation: EndUserPersonalInformationProps;
  email: string | undefined;
  displayName: string;
  externalId:string;
  accessBlocked: boolean;
  tags: string[] | undefined;
  readonly userType: string | undefined;
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

  get email(): string | undefined {return this.props.email;}
  set email(email:string) {
    this.props.email = (new ValueObjects.Email(email)).valueOf();
  }
  get displayName(): string {return this.props.displayName;}
  set displayName(displayName:string) {
    this.validateVisa();
    this.props.displayName = (new ValueObjects.DisplayName(displayName)).valueOf();
  }
  get externalId(): string {return this.props.externalId;}
  set externalId(externalId:string) {
    this.validateVisa();
    this.props.externalId = (new ValueObjects.ExternalId(externalId)).valueOf();
  }
  get accessBlocked(): boolean {return this.props.accessBlocked;}
  set accessBlocked(accessBlocked:boolean) {
    this.validateVisa();
    this.props.accessBlocked = accessBlocked;
  }

  get tags(): string[] {return this.props.tags;}
  set tags(tags:string[]) {
    this.validateVisa();
    this.props.tags = tags;
  }
  get personalInformation() {
    return new EndUserPersonalInformation(this.props.personalInformation);
  }
  get userType(): string {return this.props.userType;}
  get updatedAt(): Date {return this.props.updatedAt;}
  get createdAt(): Date {return this.props.createdAt;}
  get schemaVersion(): string {return this.props.schemaVersion;}

  public static getNewUser<props extends EndUserProps> (newProps:props,externalId:string, lastName:string, restOfName:string, context:DomainExecutionContext): EndUser<props> {
    newProps.externalId = externalId;
    let user = new EndUser(newProps, context);
    user.markAsNew();
    user.externalId=(externalId);
    if (restOfName !== undefined) {
      user.personalInformation.identityDetails.restOfName=(restOfName);
      user.personalInformation.identityDetails.legalNameConsistsOfOneName=(false);
      user.displayName=(`${restOfName} ${lastName}`);
    } else {
      user.personalInformation.identityDetails.legalNameConsistsOfOneName=(true);
      user.displayName=(lastName);
    }
    user.personalInformation.identityDetails.lastName=(lastName);
    user.isNew = false;
    return user;
  }

  private markAsNew(): void {
    this.isNew = true;
    this.addIntegrationEvent(EndUserCreatedEvent,{userId: this.props.id});
  }

  private validateVisa(): void {
    if (!this.isNew && !this.visa.determineIf((permissions) => permissions.isEditingOwnAccount)) {
      throw new Error('Unauthorized');
    }
  }

}