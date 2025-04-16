export abstract class ChildEntity<PropType> {
  public readonly props: PropType;

  public constructor(props: PropType) {
    this.props = props;
  }

}
