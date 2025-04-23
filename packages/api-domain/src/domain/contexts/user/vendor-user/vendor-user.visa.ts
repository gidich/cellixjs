import { PassportSeedwork } from '@cellix/domain-seedwork';
import { type VendorUserEntityReference } from './vendor-user.ts';

export interface VendorUserPermissionsSpec {
  isEditingOwnAccount: boolean;
}

export interface VendorUserVisa extends PassportSeedwork.Visa{
  determineIf(func:((permissions:VendorUserPermissionsSpec) => boolean)) :  boolean ;
}

export class VendorUserVisaImpl<root extends VendorUserEntityReference> implements VendorUserVisa {
  constructor(private root: root, private user: VendorUserEntityReference) {
  }

  determineIf(func: ((permissions: VendorUserPermissionsSpec) => boolean)): boolean {
    const isEditingOwnAccount = this.user.id === this.root.id;
    const result: Partial<VendorUserPermissionsSpec> = {
      isEditingOwnAccount: isEditingOwnAccount
    };
    return func(result as VendorUserPermissionsSpec);
  }
}

