import {
  VOString,
  VOSet
} from '@lucaspaganini/value-objects';

export const AccountStatusCodes = {
  Created : 'CREATED',
  Accepted : 'ACCEPTED',
  Rejected : 'REJECTED'
}

export class FirstName extends VOString({trim:true, maxLength:500}) {}
export class LastName extends VOString({trim:true, maxLength:500}) {}
export class AccountStatusCode extends VOSet(Object.values(AccountStatusCodes)) {}