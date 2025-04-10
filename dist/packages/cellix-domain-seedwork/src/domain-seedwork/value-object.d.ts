export interface ValueObjectProps {
}
export declare abstract class ValueObject<PropType extends ValueObjectProps> {
    protected readonly props: PropType;
    constructor(props: PropType);
}
