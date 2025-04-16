import { type Domain } from './domain.ts';

export interface DomainEntityProps {
  readonly id: string;
}

export abstract class DomainEntity<PropType extends DomainEntityProps> implements Domain {
  public readonly props: PropType;
  get id(): string {
    return this.props.id;
  }

  public constructor(props: PropType) {
    this.props = props;
  }
}
