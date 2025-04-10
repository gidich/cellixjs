import { Domain } from './domain';
export interface DomainEntityProps {
    readonly id: string;
}
export declare abstract class DomainEntity<PropType extends DomainEntityProps> implements Domain {
    readonly props: PropType;
    get id(): string;
    constructor(props: PropType);
}
