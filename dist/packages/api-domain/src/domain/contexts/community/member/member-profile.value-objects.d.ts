export { Email, NullableEmail } from '../../value-objects';
declare const Name_base: import("@lucaspaganini/value-objects").VOStringConstructor;
export declare class Name extends Name_base {
}
declare const Bio_base: import("@lucaspaganini/value-objects").VOStringConstructor;
export declare class Bio extends Bio_base {
}
declare const Interest_base: import("@lucaspaganini/value-objects").VOStringConstructor;
declare class Interest extends Interest_base {
}
declare const Interests_base: import("@lucaspaganini/value-objects").VOArrayConstructor<typeof Interest>;
export declare class Interests extends Interests_base {
}
