export declare const CustomViewTypes: {
    Property: string;
    ServiceTicket: string;
};
declare const CustomViewName_base: import("@lucaspaganini/value-objects").VOStringConstructor;
export declare class CustomViewName extends CustomViewName_base {
}
declare const CustomViewType_base: import("@lucaspaganini/value-objects").VOStringConstructor;
export declare class CustomViewType extends CustomViewType_base {
}
declare const CustomViewSortOrder_base: import("@lucaspaganini/value-objects").VOStringConstructor;
export declare class CustomViewSortOrder extends CustomViewSortOrder_base {
}
declare const CustomViewFilter_base: import("@lucaspaganini/value-objects").VOStringConstructor;
declare class CustomViewFilter extends CustomViewFilter_base {
}
declare const CustomViewFilters_base: import("@lucaspaganini/value-objects").VOArrayConstructor<typeof CustomViewFilter>;
export declare class CustomViewFilters extends CustomViewFilters_base {
}
declare const CustomViewColumnsToDisplay_base: import("@lucaspaganini/value-objects").VOArrayConstructor<typeof CustomViewFilter>;
export declare class CustomViewColumnsToDisplay extends CustomViewColumnsToDisplay_base {
}
export {};
