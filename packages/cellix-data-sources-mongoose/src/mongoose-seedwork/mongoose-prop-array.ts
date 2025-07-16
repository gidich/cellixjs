import type { DomainSeedwork } from '@cellix/domain-seedwork';
import type mongoose from 'mongoose';
import { Types } from 'mongoose';
import type { Base } from './base.ts';
import type { MongooseDomainAdapter } from './mongo-domain-adapter.ts';

export interface HasDoc<docType> {
	doc: docType;
}
export interface HasProps<docType extends Base> {
	props: docType;
}

export class MongoosePropArray<
	docType extends Base,
	propType extends MongooseDomainAdapter<docType>,
> implements DomainSeedwork.PropArray<propType>
{
	protected docArray: mongoose.Types.DocumentArray<docType>;
	protected adapter: new (
		doc: docType,
	) => propType;

	constructor(
		docArray: mongoose.Types.DocumentArray<docType>,
		adapter: new (doc: docType) => propType,
	) {
		this.docArray = docArray;
		this.adapter = adapter;
	}
	addItem(item: propType): propType {
		const itemId = this.docArray.push(item.doc) - 1;
		const doc = this.docArray[itemId];
		if (!doc) {
			throw new Error('Failed to add item to the document array');
		}
		return new this.adapter(doc);
	}
	removeItem(item: propType & HasProps<docType>): void {
		this.docArray.pull({ _id: item.props._id });
	}
	removeAll(): void {
		const ids = this.docArray.map((doc) => doc._id);
		ids.forEach((id) => this.docArray.pull({ _id: id }));
	}
	/**
	 * Creates a new Mongoose document with a generated ObjectId, adds it to the document array,
	 * and returns a new domain adapter instance wrapping the created document.
	 *
	 * @returns {propType} The domain adapter instance for the newly created and added document.
	 *
	 * @remarks
	 * - The new document is created using the Mongoose DocumentArray's `create` method.
	 * - The document is immediately pushed to the underlying document array.
	 * - The returned value is a new instance of the provided adapter, wrapping the created document.
	 * - The document array is mutated by this operation.
	 */
	getNewItem(): propType {
		/*
    if (!this.docArray) {
      this.docArray = new Types.DocumentArray<docType>([]);
    }
    */
		const item = this.docArray.create({ _id: new Types.ObjectId() });
		this.docArray.push(item);
		return new this.adapter(item);
	}
	get items(): ReadonlyArray<propType> {
		return this.docArray.map((doc) => new this.adapter(doc));
	}
}
