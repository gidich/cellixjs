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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeEventBusInstance = void 0;
const events_1 = __importDefault(require("events"));
const api_1 = __importStar(require("@opentelemetry/api"));
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
class BroadCaster {
    constructor() {
        this.eventEmitter = new events_1.default();
    }
    broadcast(event, data) {
        this.eventEmitter.emit(event, data);
    }
    on(event, listener) {
        this.eventEmitter.on(event, listener);
    }
    removeAllListeners() {
        this.eventEmitter.removeAllListeners();
        console.log('All listeners removed');
    }
}
class NodeEventBusImpl {
    constructor() {
        this.broadcaster = new BroadCaster();
    }
    removeAllListeners() {
        this.broadcaster.removeAllListeners();
    }
    dispatch(event, data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Dispatching node event ${event.constructor.name} with data ${JSON.stringify(data)}`);
            let contextObject = {};
            api_1.default.propagation.inject(api_1.default.context.active(), contextObject);
            // console.log(`Trace context: ${JSON.stringify(contextObject)}`);
            const tracer = api_1.trace.getTracer('PG:data-access');
            tracer.startActiveSpan('node-event-bus.publish', (span) => __awaiter(this, void 0, void 0, function* () {
                span.setAttribute('message.system', 'node-event-bus');
                span.setAttribute('messaging.operation', 'publish');
                span.setAttribute('messaging.destination.name', event.constructor.name);
                span.addEvent('dispatching node event', { name: event.constructor.name, data: JSON.stringify(data) }, new Date());
                try {
                    this.broadcaster.broadcast(event.constructor.name, { data: JSON.stringify(data), context: contextObject });
                    span.setStatus({ code: api_1.SpanStatusCode.OK, message: `NodeEventBus: Executed ${event.name}` });
                }
                catch (err) {
                    span.setStatus({ code: api_1.SpanStatusCode.ERROR });
                    span.recordException(err);
                }
                finally {
                    span.end();
                }
            }));
        });
    }
    register(event, func) {
        console.log(`custom-log | registering-node-event-handler | ${event.name}`);
        this.broadcaster.on(event.name, (rawPayload) => __awaiter(this, void 0, void 0, function* () {
            console.log(`Received node event ${event.name} with data ${JSON.stringify(rawPayload)}`);
            const activeContext = api_1.default.propagation.extract(api_1.default.context.active(), rawPayload['context']);
            api_1.default.context.with(activeContext, () => __awaiter(this, void 0, void 0, function* () {
                // all descendants of this context will have the active context set
                const tracer = api_1.trace.getTracer('PG:data-access');
                tracer.startActiveSpan(`node-event-bus.process`, (span) => __awaiter(this, void 0, void 0, function* () {
                    span.setAttribute('message.system', 'node-event-bus');
                    span.setAttribute('messaging.operation', 'process');
                    span.setAttribute('messaging.destination.name', event.name);
                    span.setStatus({ code: api_1.SpanStatusCode.UNSET, message: `NodeEventBus: Executing ${event.name}` });
                    span.setAttribute('data', rawPayload['data']);
                    // hack to create dependency title in App Insights to show up nicely in trace details
                    // see : https://github.com/Azure/azure-sdk-for-js/blob/main/sdk/monitor/monitor-opentelemetry-exporter/src/utils/spanUtils.ts#L191
                    span.setAttribute(semantic_conventions_1.SEMATTRS_DB_SYSTEM, 'node-event-bus'); // hack (becomes upper case)
                    span.setAttribute(semantic_conventions_1.SEMATTRS_DB_NAME, event.name); // hack
                    span.setAttribute(semantic_conventions_1.SEMATTRS_DB_STATEMENT, `handling event: ${event.name} with payload: ${rawPayload['data']}`); // hack - dumps payload in command
                    span.addEvent(`NodeEventBus: Executing ${event.name}`, { data: rawPayload['data'] }, performance.now());
                    try {
                        yield func(JSON.parse(rawPayload['data']));
                        span.setStatus({ code: api_1.SpanStatusCode.OK, message: `NodeEventBus: Executed ${event.name}` });
                    }
                    catch (e) {
                        span.recordException(e);
                        span.setStatus({ code: api_1.SpanStatusCode.ERROR, message: `NodeEventBus: Error executing ${event.name}` });
                        console.error(`Error handling node event ${event.name} with data ${rawPayload}`);
                        console.error(e);
                    }
                    finally {
                        span.end();
                    }
                }));
            }));
        }));
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new this();
        }
        return this.instance;
    }
}
exports.NodeEventBusInstance = NodeEventBusImpl.getInstance();
//# sourceMappingURL=node-event-bus.js.map