import type { StaffUserEntityReference } from '../../contexts/user/staff-user/staff-user.ts';

export abstract class StaffUserPassportBase {
  protected readonly user: StaffUserEntityReference;
  constructor(
    user: StaffUserEntityReference
  ) {
    // [NN] [ESLINT] commenting this out to avoid ESLint rule @typescript-eslint/no-unnecessary-condition
    // if (!user) {
    //   throw new Error("User is required");
    // }


    this.user = user;
  }
}