import { Domain } from './domain';

export interface DomainEntityProps {
  readonly id: string;
}

export abstract class DomainEntity<PropType extends DomainEntityProps> implements Domain {
  get id(): string {
    return this.props.id;
  }

  public constructor(public readonly props: PropType) {}
}
