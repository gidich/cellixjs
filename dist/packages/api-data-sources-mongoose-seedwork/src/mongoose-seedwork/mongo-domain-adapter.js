"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoosePropArray = exports.MongooseDomainAdapter = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class MongooseDomainAdapter {
    constructor(doc) {
        this.doc = doc;
    }
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
exports.MongooseDomainAdapter = MongooseDomainAdapter;
class MongoosePropArray {
    constructor(docArray, adapter) {
        this.docArray = docArray;
        this.adapter = adapter;
    }
    addItem(item) {
        const itemId = this.docArray.push(item['doc']);
        return this.docArray[itemId];
    }
    removeItem(item) {
        this.docArray.pull({ _id: item['props']['_id'] });
    }
    removeAll() {
        const ids = this.docArray.map((doc) => doc._id);
        ids.forEach((id) => this.docArray.pull({ _id: id }));
    }
    getNewItem() {
        if (!this.docArray) {
            this.docArray = new mongoose_1.default.Types.DocumentArray([]);
        }
        const item = this.docArray.create({ _id: new mongoose_1.default.Types.ObjectId() });
        this.docArray.push(item);
        return new this.adapter(item);
    }
    get items() {
        return this.docArray.map((doc) => new this.adapter(doc));
    }
}
exports.MongoosePropArray = MongoosePropArray;
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
//# sourceMappingURL=mongo-domain-adapter.js.map