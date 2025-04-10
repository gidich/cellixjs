"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregateRoot = void 0;
const domain_entity_1 = require("./domain-entity");
class AggregateRoot extends domain_entity_1.DomainEntity {
    constructor() {
        super(...arguments);
        this._isDeleted = false;
        this.domainEvents = [];
        this.integrationEvents = [];
    }
    get isDeleted() {
        return this._isDeleted;
    }
    set isDeleted(value) {
        this._isDeleted = value;
    }
    addDomainEvent(event, props) {
        let eventToAdd = new event(this.props.id);
        eventToAdd.payload = props;
        this.domainEvents.push(eventToAdd);
    }
    clearDomainEvents() {
        this.domainEvents = [];
    }
    getDomainEvents() {
        return this.domainEvents;
    }
    addIntegrationEvent(event, props) {
        let eventToAdd = new event(this.props.id);
        eventToAdd.payload = props;
        this.integrationEvents.push(eventToAdd);
    }
    clearIntegrationEvents() {
        this.integrationEvents = [];
    }
    getIntegrationEvents() {
        return this.integrationEvents;
    }
    onSave(isModified) {
        //override this method to do something on save
    }
}
exports.AggregateRoot = AggregateRoot;
//# sourceMappingURL=aggregate-root.js.map