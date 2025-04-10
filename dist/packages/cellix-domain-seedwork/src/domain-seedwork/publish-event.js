"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventPublisher = void 0;
class EventPublisher {
    constructor(eventBus) {
        this.eventBus = eventBus;
    }
    publish(eventToPublish, data) {
        this.eventBus.dispatch(eventToPublish, data);
    }
}
exports.EventPublisher = EventPublisher;
//# sourceMappingURL=publish-event.js.map