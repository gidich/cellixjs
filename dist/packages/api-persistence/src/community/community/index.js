"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityPersistence = void 0;
const api_data_sources_mongoose_models_1 = require("api-data-sources-mongoose-models");
const community_uow_1 = require("./community.uow");
const CommunityPersistence = (initializedService) => {
    const CommunityModel = api_data_sources_mongoose_models_1.Models.Community.CommunityModelFactory(initializedService);
    return {
        CommunityUnitOfWork: (0, community_uow_1.getCommunityUnitOfWork)(CommunityModel),
    };
};
exports.CommunityPersistence = CommunityPersistence;
//# sourceMappingURL=index.js.map