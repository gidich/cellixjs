"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleEventImpl = void 0;
class HandleEventImpl {
    constructor(eventHandler) {
        this.eventHandler = eventHandler;
    }
    static register(eventHandler) {
        return new HandleEventImpl(eventHandler);
    }
    registerAll(eventHandlers) {
        return new HandleEventImpl((event) => {
            eventHandlers.forEach((eh) => eh.handle(event));
        });
    }
    handle(event) {
        this.eventHandler(event);
    }
}
exports.HandleEventImpl = HandleEventImpl;
//# sourceMappingURL=handle-event.js.map