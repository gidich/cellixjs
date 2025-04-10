export declare const AccountStatusCodes: {
    Created: string;
    Accepted: string;
    Rejected: string;
};
declare const FirstName_base: import("@lucaspaganini/value-objects").VOStringConstructor;
export declare class FirstName extends FirstName_base {
}
declare const LastName_base: import("@lucaspaganini/value-objects").VOStringConstructor;
export declare class LastName extends LastName_base {
}
declare const AccountStatusCode_base: import("@lucaspaganini/value-objects").VOSetConstructor<string, boolean>;
export declare class AccountStatusCode extends AccountStatusCode_base {
}
export {};
