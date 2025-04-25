export interface Visa {
  determineIf(func: (permissions:Readonly<any>) => boolean): boolean;
}