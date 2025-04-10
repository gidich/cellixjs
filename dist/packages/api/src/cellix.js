"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.Cellix = void 0;
const functions_1 = require("@azure/functions");
const api_1 = __importStar(require("@opentelemetry/api"));
class Cellix {
    constructor() {
        //typescript dictionary of services including each services type and service instance
        this.servicesInternal = new Map();
        this.tracer = api_1.trace.getTracer("cellix:data-access");
    }
    static registerAndStartLoggingService(service) {
        console.log('Logging service starting');
        const newInstance = new Cellix();
        newInstance.loggingService = service;
        // newInstance.loggingService.StartUp();
        console.log('Logging service started');
        return newInstance;
    }
    registerService(service) {
        this.servicesInternal.set(service.constructor.name, service);
        return this;
    }
    getService(serviceType) {
        const service = this.servicesInternal.get(serviceType.name);
        if (!service) {
            throw new Error(`Service ${serviceType.name} not found`);
        }
        return service;
    }
    initializeServices(serviceRegister) {
        serviceRegister(this);
        return this;
    }
    setContext(contextCreator) {
        return __awaiter(this, void 0, void 0, function* () {
            const self = yield this.StartServices();
            this.contextInternal = contextCreator(self);
        });
    }
    registerAzureFunctionHandler(name, options, handlerCreator) {
        functions_1.app.http(name, Object.assign(Object.assign({}, options), { handler: (request, context) => {
                return handlerCreator(this.context)(request, context);
            } }));
        return this;
    }
    get context() {
        return this.contextInternal;
    }
    StartServices() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                functions_1.app.hook.appStart((context) => {
                    const emptyRootContext = api_1.default.trace.setSpan(api_1.default.context.active(), api_1.default.trace.wrapSpanContext(undefined));
                    api_1.default.context.with(emptyRootContext, () => __awaiter(this, void 0, void 0, function* () {
                        this.tracer.startActiveSpan("azure-function.appStart", (span) => __awaiter(this, void 0, void 0, function* () {
                            var _a, e_1, _b, _c;
                            try {
                                try {
                                    //this should be done in parallel rather than sequential
                                    for (var _d = true, _e = __asyncValues(this.servicesInternal.entries()), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                                        _c = _f.value;
                                        _d = false;
                                        const [key, service] = _c;
                                        yield this.tracer.startActiveSpan(`Service ${key} starting`, (serviceSpan) => __awaiter(this, void 0, void 0, function* () {
                                            try {
                                                console.log(`StartService: Service ${key} starting`);
                                                yield service.StartUp();
                                                serviceSpan.setStatus({ code: api_1.SpanStatusCode.OK, message: `Service ${key} started` });
                                                console.log(`StartService: Service ${key} started`);
                                            }
                                            catch (err) {
                                                serviceSpan.setStatus({ code: api_1.SpanStatusCode.ERROR });
                                                serviceSpan.recordException(err);
                                                throw err;
                                            }
                                            finally {
                                                serviceSpan.end();
                                            }
                                        }));
                                    }
                                }
                                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                                finally {
                                    try {
                                        if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                                    }
                                    finally { if (e_1) throw e_1.error; }
                                }
                                ;
                                span.setStatus({ code: api_1.SpanStatusCode.OK, message: `azure-function.appStart: Started` });
                                console.log('Cellix started');
                                resolve(this);
                            }
                            catch (err) {
                                span.setStatus({ code: api_1.SpanStatusCode.ERROR });
                                span.recordException(err);
                                reject(err);
                                throw err;
                            }
                            finally {
                                span.end();
                            }
                        }));
                    }));
                });
                functions_1.app.hook.appTerminate((context) => {
                    this.servicesInternal.forEach((service) => {
                        service.ShutDown();
                    });
                    console.log('Cellix stopped');
                });
            });
        });
    }
}
exports.Cellix = Cellix;
//# sourceMappingURL=cellix.js.map