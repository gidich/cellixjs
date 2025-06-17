import { VOOptional, VOString } from '@lucaspaganini/value-objects';
import { Email as EmailBase } from '../../value-objects.ts';
export { ExternalId } from '../../value-objects.ts';
export class RestOfName extends VOString({ trim: true, maxLength: 50 }) {}
export class LastName extends VOString({ trim: true, maxLength: 50 }) {}
export class DisplayName extends VOString({ trim: true, maxLength: 100 }) {}
export class Email extends VOOptional(EmailBase, [undefined]) {}
