import { VendorUserCreatedEvent } from '../../../events/types/vendor-user-created.ts';
import { DomainSeedwork } from '@cellix/domain-seedwork';
import type { DomainExecutionContext } from '../../../domain-execution-context.ts';
import * as ValueObjects from './vendor-user.value-objects.ts';
import type { VendorUserVisa } from './vendor-user.visa.ts';
import { VendorUserPersonalInformation, type VendorUserPersonalInformationEntityReference, type VendorUserPersonalInformationProps } from './vendor-user-personal-information.ts';

export interface VendorUserProps extends DomainSeedwork.DomainEntityProps {
  readonly personalInformation: VendorUserPersonalInformationProps;
  
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

export interface VendorUserEntityReference extends Readonly<Omit<VendorUserProps, 'personalInformation' >> {
  readonly personalInformation: VendorUserPersonalInformationEntityReference;
}

export class VendorUser<props extends VendorUserProps> extends DomainSeedwork.AggregateRoot<props> implements VendorUserEntityReference  {
  private isNew: boolean = false;
  private readonly visa: VendorUserVisa;
  constructor(props: props, private readonly context: DomainExecutionContext) { 
    super(props);
    this.visa =  context.domainVisa.forVendorUser(this);
  }

  get id(): string {return this.props.id;}
  get personalInformation() {
    return new VendorUserPersonalInformation(this.props.personalInformation);
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

  public static getNewUser<props extends VendorUserProps> (newProps:props,externalId:string,lastName:string, context: DomainExecutionContext, restOfName?:string): VendorUser<props> {
    newProps.externalId = externalId;
    let user = new VendorUser(newProps, context);
    user.MarkAsNew();
    user.ExternalId=(externalId);
    
    const { identityDetails } = user.personalInformation;

    if (restOfName !== undefined) {
      identityDetails.RestOfName = restOfName;
      identityDetails.LegalNameConsistsOfOneName = false;
      user.DisplayName = `${restOfName} ${lastName}`;
    } else {
      identityDetails.LegalNameConsistsOfOneName = true;
      user.DisplayName = lastName;
    }

    user.personalInformation.identityDetails.LastName=(lastName);
    user.isNew = false;
    return user;
  }

  private MarkAsNew(): void {
    this.isNew = true;
    this.addIntegrationEvent(VendorUserCreatedEvent,{userId: this.props.id});
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

