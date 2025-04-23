import { PassportSeedwork } from '@cellix/domain-seedwork';
import { type EndUserEntityReference } from './end-user.ts';

export interface EndUserPermissionsSpec {
  isEditingOwnAccount: boolean;
}

export interface EndUserVisa extends PassportSeedwork.Visa{
  determineIf(func:((permissions:EndUserPermissionsSpec) => boolean)) :  boolean ;
}

export class EndUserVisaImpl<root extends EndUserEntityReference> implements EndUserVisa {
  private root: root;
  private user: EndUserEntityReference;

  constructor(root: root, user: EndUserEntityReference) {
    this.root = root;
    this.user = user;
  }

  determineIf(func: ((permissions: EndUserPermissionsSpec) => boolean)): boolean {
    const isEditingOwnAccount = this.user.id === this.root.id;
    const result: Partial<EndUserPermissionsSpec> = {
      isEditingOwnAccount: isEditingOwnAccount
    };
    return func(result as EndUserPermissionsSpec);
  }
}

