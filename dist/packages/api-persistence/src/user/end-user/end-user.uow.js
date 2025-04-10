"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEndUserUnitOfWork = void 0;
const api_data_sources_mongoose_seedwork_1 = require("api-data-sources-mongoose-seedwork");
const end_user_domain_adapter_1 = require("./end-user.domain-adapter");
const end_user_repository_1 = require("./end-user.repository");
const event_bus_seedwork_node_1 = require("event-bus-seedwork-node");
const getEndUserUnitOfWork = (endUserModel) => {
    return new api_data_sources_mongoose_seedwork_1.MongooseSeedwork.MongoUnitOfWork(endUserModel, new end_user_domain_adapter_1.EndUserConverter(), event_bus_seedwork_node_1.InProcEventBusInstance, event_bus_seedwork_node_1.NodeEventBusInstance, end_user_repository_1.EndUserRepository);
};
exports.getEndUserUnitOfWork = getEndUserUnitOfWork;
//# sourceMappingURL=end-user.uow.js.map