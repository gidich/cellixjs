import {
  VOString,
  VOArray
} from '@lucaspaganini/value-objects';

export { Email, NullableEmail } from '../../value-objects'

export class Name extends VOString({trim:true, maxLength:500}) {}
export class Bio extends VOString({trim:true, maxLength:2000}) {}

class Interest extends VOString({trim:true, maxLength:40}) {}
export class Interests extends VOArray(Interest, {maxLength:20}) {}