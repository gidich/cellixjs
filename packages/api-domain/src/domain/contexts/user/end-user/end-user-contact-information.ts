import { DomainSeedwork } from '@cellix/domain-seedwork';
import { Email } from './end-user.value-objects.ts';
import type { UserVisa } from '../user.visa.ts';

export interface EndUserContactInformationProps extends DomainSeedwork.ValueObjectProps {
  email: string;
}

export interface EndUserContactInformationEntityReference extends Readonly<EndUserContactInformationProps> {}

export class EndUserContactInformation extends DomainSeedwork.ValueObject<EndUserContactInformationProps> implements EndUserContactInformationEntityReference {
  private isNew: boolean = false;
  private readonly visa: UserVisa;
  public constructor(props: EndUserContactInformationProps, visa: UserVisa) {
    super(props);
    this.visa = visa
  }

  public static getNewInstance(props: EndUserContactInformationProps, visa: UserVisa, email:string): EndUserContactInformation {
    const newInstance = new EndUserContactInformation(props, visa);
    newInstance.markAsNew();
    newInstance.email = email;
    newInstance.isNew = false
    return newInstance;
  }
    

  private markAsNew():void {
    this.isNew = true;
  }

  public get email(): string {
    return this.props.email;
  }
  public set email(email: string) {
    if(!this.isNew || !this.visa.determineIf((permissions) => permissions.isEditingOwnAccount || permissions.canManageEndUsers)){
      throw new Error('Cannot set email');
    }
    this.props.email = (new Email(email)).valueOf();
  }
}