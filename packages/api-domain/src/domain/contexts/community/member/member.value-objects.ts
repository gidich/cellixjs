import { VOString } from '@lucaspaganini/value-objects';

export class MemberName extends VOString({ trim: true, maxLength: 200 }) {}
export class CyberSourceCustomerId extends VOString({ maxLength: 50 }) {}
