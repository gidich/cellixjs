"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoRepositoryBase = void 0;
class MongoRepositoryBase {
    constructor(model, typeConverter, eventBus, session, context) {
        this.model = model;
        this.typeConverter = typeConverter;
        this.eventBus = eventBus;
        this.session = session;
        this.context = context;
        this.itemsInTransaction = [];
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.typeConverter.toDomain(yield this.model.findById(id).exec(), this.context);
        });
    }
    save(item) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            item.onSave(this.typeConverter.toPersistence(item).isModified());
            console.log('saving item');
            try {
                for (var _d = true, _e = __asyncValues(item.getDomainEvents()), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                    _c = _f.value;
                    _d = false;
                    let event = _c;
                    console.log(`Repo dispatching DomainEvent : ${JSON.stringify(event)}`);
                    yield this.eventBus.dispatch(event, event['payload']);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                }
                finally { if (e_1) throw e_1.error; }
            }
            item.clearDomainEvents();
            this.itemsInTransaction.push(item);
            try {
                if (item.isDeleted === true) {
                    yield this.model.deleteOne({ _id: item.id }, { session: this.session }).exec();
                    return item;
                }
                else {
                    console.log('saving item id', item.id);
                    const mongoObj = this.typeConverter.toPersistence(item);
                    return this.typeConverter.toDomain(yield mongoObj.save({ session: this.session }), this.context);
                }
            }
            catch (error) {
                console.log(`Error saving item : ${error}`);
                throw error;
            }
        });
    }
    getIntegrationEvents() {
        const integrationEventsGroup = this.itemsInTransaction.map((item) => {
            const integrationEvents = item.getIntegrationEvents();
            item.clearIntegrationEvents();
            return integrationEvents;
        });
        return integrationEventsGroup.reduce((acc, curr) => acc.concat(curr), []);
    }
    static create(model, typeConverter, bus, session, context, repoClass) {
        return new repoClass(model, typeConverter, bus, session, context);
    }
}
exports.MongoRepositoryBase = MongoRepositoryBase;
//# sourceMappingURL=mongo-repository.js.map