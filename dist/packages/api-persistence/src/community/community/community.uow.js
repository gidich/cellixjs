"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommunityUnitOfWork = void 0;
const api_data_sources_mongoose_seedwork_1 = require("api-data-sources-mongoose-seedwork");
const community_domain_adapter_1 = require("./community.domain-adapter");
const community_repository_1 = require("./community.repository");
const event_bus_seedwork_node_1 = require("event-bus-seedwork-node");
const getCommunityUnitOfWork = (communityModel) => {
    return new api_data_sources_mongoose_seedwork_1.MongooseSeedwork.MongoUnitOfWork(communityModel, new community_domain_adapter_1.CommunityConverter(), event_bus_seedwork_node_1.InProcEventBusInstance, event_bus_seedwork_node_1.NodeEventBusInstance, community_repository_1.CommunityRepository);
};
exports.getCommunityUnitOfWork = getCommunityUnitOfWork;
//# sourceMappingURL=community.uow.js.map