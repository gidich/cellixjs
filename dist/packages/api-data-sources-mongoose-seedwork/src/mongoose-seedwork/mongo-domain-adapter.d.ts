import { Base } from './base';
import { DomainSeedwork } from 'cellix-domain-seedwork';
import mongoose from 'mongoose';
export declare abstract class MongooseDomainAdapter<T extends Base> implements MongooseDomainAdapterType<T> {
    readonly doc: T;
    constructor(doc: T);
    get id(): any;
    get createdAt(): Date;
    get updatedAt(): Date;
    get schemaVersion(): string;
}
export interface MongooseDomainAdapterType<T extends Base> extends DomainSeedwork.DomainEntityProps {
    readonly doc: T;
}
export declare class MongoosePropArray<propType extends DomainSeedwork.DomainEntityProps, docType extends mongoose.Document> implements DomainSeedwork.PropArray<propType> {
    protected docArray: mongoose.Types.DocumentArray<docType>;
    protected adapter: new (doc: docType) => propType;
    constructor(docArray: mongoose.Types.DocumentArray<docType>, adapter: new (doc: docType) => propType);
    addItem(item: propType): propType;
    removeItem(item: propType): void;
    removeAll(): void;
    getNewItem(): propType;
    get items(): ReadonlyArray<propType>;
}
