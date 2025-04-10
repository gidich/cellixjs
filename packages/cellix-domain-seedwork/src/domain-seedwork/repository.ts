export interface Repository<T> {
  get(id: string): Promise<T>;
  save(item: T): Promise<T>;
}
