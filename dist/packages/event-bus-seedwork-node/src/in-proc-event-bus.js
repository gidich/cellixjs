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
exports.InProcEventBusInstance = void 0;
class InProcEventBusImpl {
    constructor() {
        this.eventSubscribers = {};
    }
    dispatch(event, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            console.log(`Dispatching in-proc event ${event.constructor.name} with data ${JSON.stringify(data)}`);
            if (this.eventSubscribers[event.constructor.name]) {
                try {
                    for (var _d = true, _e = __asyncValues(this.eventSubscribers[event.constructor.name]), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                        _c = _f.value;
                        _d = false;
                        const subscriber = _c;
                        yield subscriber(JSON.stringify(data));
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
        });
    }
    register(event, func) {
        console.log(`Registering in-proc event handler for: ${event.name}`);
        if (!this.eventSubscribers[event.name]) {
            this.eventSubscribers[event.name] = [];
        }
        this.eventSubscribers[event.name].push((rawpayload) => __awaiter(this, void 0, void 0, function* () {
            console.log(`Received in-proc event ${event.name} with data ${rawpayload}`);
            yield func(JSON.parse(rawpayload));
        }));
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new this();
        }
        return this.instance;
    }
}
exports.InProcEventBusInstance = InProcEventBusImpl.getInstance();
//# sourceMappingURL=in-proc-event-bus.js.map