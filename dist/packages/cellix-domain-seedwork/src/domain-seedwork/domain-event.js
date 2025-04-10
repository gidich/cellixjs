"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomDomainEventImpl = exports.DomainEventBase = void 0;
class DomainEventBase {
    constructor(_aggregateId) {
        this._aggregateId = _aggregateId;
    }
    get aggregateId() {
        return this._aggregateId;
    }
}
exports.DomainEventBase = DomainEventBase;
class CustomDomainEventImpl extends DomainEventBase {
    get payload() {
        return this._payload;
    }
    set payload(payload) {
        this._payload = payload;
    }
}
exports.CustomDomainEventImpl = CustomDomainEventImpl;
//# sourceMappingURL=domain-event.js.map