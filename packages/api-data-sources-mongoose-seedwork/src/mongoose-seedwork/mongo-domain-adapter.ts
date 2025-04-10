import { Base } from './base';
import { DomainSeedwork } from 'cellix-domain-seedwork';
import mongoose from 'mongoose';

export abstract class MongooseDomainAdapter<T extends Base> implements MongooseDomainAdapterType<T> {
  constructor(public readonly doc: T) {}
  get id() {
    return this.doc.id;
  }
  get createdAt() {
    return this.doc.createdAt;
  }
  get updatedAt() {
    return this.doc.updatedAt;
  }
  get schemaVersion() {
    return this.doc.schemaVersion;
  }
}

export interface MongooseDomainAdapterType<T extends Base> extends DomainSeedwork.DomainEntityProps {
  readonly doc: T;
}

export class MongoosePropArray<propType extends DomainSeedwork.DomainEntityProps, docType extends mongoose.Document> implements DomainSeedwork.PropArray<propType> {
  constructor(protected docArray: mongoose.Types.DocumentArray<docType>, protected adapter: new (doc: docType) => propType) {}
  addItem(item: propType): propType {
    const itemId = this.docArray.push(item['doc']);
    return this.docArray[itemId] as any as propType;
  }
  removeItem(item: propType): void {
    this.docArray.pull({ _id: item['props']['_id'] });
  }
  removeAll(): void {
    const ids = this.docArray.map((doc) => doc._id);
    ids.forEach((id) => this.docArray.pull({ _id: id }));
  }
  getNewItem(): propType {
    if (!this.docArray) {
      this.docArray = new mongoose.Types.DocumentArray<docType>([]);
    }
    const item = this.docArray.create({ _id: new mongoose.Types.ObjectId() });
    this.docArray.push(item);
    return new this.adapter(item);
  }
  get items(): ReadonlyArray<propType> {
    return this.docArray.map((doc) => new this.adapter(doc));
  }
}

/*
export class EntityPropArray<propType extends EntityProps, docType extends mongoose.Document, entity extends Entity<propType>> extends MongoosePropArray<propType,docType>{
  removeDoc(doc: entity): void {
    this.docArray.pull(doc.props);
  }
  addItem(item: entity): entity {
    var itemId = this.docArray.push(item.props);
    var prop = this.docArray[itemId] as any as propType;
    new this.adapter(prop)
    
  }
}
*/
