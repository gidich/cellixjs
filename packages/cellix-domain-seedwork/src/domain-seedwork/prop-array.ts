import { type DomainEntityProps } from './domain-entity.ts';

export interface PropArray<propType extends DomainEntityProps> {
  get items(): ReadonlyArray<propType>;
  addItem(item: propType): void;
  getNewItem(): propType;
  removeItem(item: propType): void;
  removeAll(): void;
}
