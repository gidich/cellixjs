"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoTypeConverter = void 0;
class MongoTypeConverter {
    constructor(adapter, domainObject) {
        this.adapter = adapter;
        this.domainObject = domainObject;
    }
    toDomain(mongoType, context) {
        if (!mongoType) {
            return null;
        }
        return new this.domainObject(this.toAdapter(mongoType), context);
    }
    toPersistence(domainType) {
        return domainType.props.doc;
    }
    toAdapter(mongoType) {
        if (mongoType instanceof this.domainObject) {
            return mongoType.props;
        }
        return new this.adapter(mongoType);
    }
}
exports.MongoTypeConverter = MongoTypeConverter;
//# sourceMappingURL=mongo-type-converter.js.map