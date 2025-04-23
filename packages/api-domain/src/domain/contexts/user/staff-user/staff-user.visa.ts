import { PassportSeedwork } from '@cellix/domain-seedwork';
import { type StaffUserEntityReference } from './staff-user.ts';

export interface StaffUserPermissionsSpec {
  isEditingOwnAccount?: boolean;
  isSystemAccount?: boolean;
}

export interface StaffUserVisa extends PassportSeedwork.Visa{
  determineIf(func:((permissions:StaffUserPermissionsSpec) => boolean)) :  boolean ;
}

export class StaffUserVisaImpl<root extends StaffUserEntityReference> implements StaffUserVisa {
  constructor(private root: root, private user: StaffUserEntityReference) {
  }

  determineIf(func: ((permissions: StaffUserPermissionsSpec) => boolean)): boolean {
    const isEditingOwnAccount = this.user.id === this.root.id;
    const result: Partial<StaffUserPermissionsSpec> = {
      isEditingOwnAccount: isEditingOwnAccount
    };
    return func(result as StaffUserPermissionsSpec);
  }
}

