import type { StaffUserEntityReference } from '../../contexts/user/staff-user/staff-user.ts';

export abstract class StaffUserPassportBase {
  protected readonly user: StaffUserEntityReference;
  constructor(
    user: StaffUserEntityReference
  ) {
    if (!user) {
      throw new Error("User is required");
    }


    this.user = user;
  }
}