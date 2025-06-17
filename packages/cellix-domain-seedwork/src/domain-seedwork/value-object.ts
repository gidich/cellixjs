// [NN] [ESLINT] disabling @typescript/eslint/no-empty-object-type
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ValueObjectProps {}

export abstract class ValueObject<PropType extends ValueObjectProps> {
  protected readonly props: PropType;

  public constructor(props: PropType) {
    this.props = props;
  }
}
