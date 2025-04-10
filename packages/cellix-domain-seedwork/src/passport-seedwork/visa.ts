
export interface Visa {
  determineIf(func: (permissions) => boolean): boolean;
}
