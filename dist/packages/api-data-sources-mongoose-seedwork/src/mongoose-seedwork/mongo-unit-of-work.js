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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoUnitOfWork = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const mongo_repository_1 = require("./mongo-repository");
const cellix_domain_seedwork_1 = require("cellix-domain-seedwork");
class MongoUnitOfWork extends cellix_domain_seedwork_1.DomainSeedwork.PersistenceUnitOfWork {
    constructor(model, typeConverter, bus, integrationEventBus, repoClass) {
        super();
        this.model = model;
        this.typeConverter = typeConverter;
        this.bus = bus;
        this.integrationEventBus = integrationEventBus;
        this.repoClass = repoClass;
    }
    withTransaction(context, func) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            let repoEvents = []; //todo: can we make this an arry of CustomDomainEvents?
            console.log('withTransaction');
            yield mongoose_1.default.connection.transaction((session) => __awaiter(this, void 0, void 0, function* () {
                console.log('transaction');
                let repo = mongo_repository_1.MongoRepositoryBase.create(this.model, this.typeConverter, this.bus, session, context, this.repoClass);
                console.log('repo created');
                try {
                    yield func(repo);
                    // console.log('func done');
                }
                catch (e) {
                    console.log('func failed');
                    console.log(e);
                    throw e;
                }
                repoEvents = repo.getIntegrationEvents();
            }));
            console.log('integration events');
            try {
                //Send integration events after transaction is completed
                for (var _d = true, repoEvents_1 = __asyncValues(repoEvents), repoEvents_1_1; repoEvents_1_1 = yield repoEvents_1.next(), _a = repoEvents_1_1.done, !_a; _d = true) {
                    _c = repoEvents_1_1.value;
                    _d = false;
                    let event = _c;
                    yield this.integrationEventBus.dispatch(event, event['payload']);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = repoEvents_1.return)) yield _b.call(repoEvents_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
}
exports.MongoUnitOfWork = MongoUnitOfWork;
//# sourceMappingURL=mongo-unit-of-work.js.map