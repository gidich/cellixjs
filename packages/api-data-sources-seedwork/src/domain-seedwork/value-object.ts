export interface ValueObjectProps {}

export abstract class ValueObject<PropType extends ValueObjectProps> {
  public constructor(protected readonly props: PropType) {}
}
