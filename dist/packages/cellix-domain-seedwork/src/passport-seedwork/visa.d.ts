export interface Visa {
    determineIf(func: (permissions: any) => boolean): boolean;
}
