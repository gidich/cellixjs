"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndUserPersistence = void 0;
const api_data_sources_mongoose_models_1 = require("api-data-sources-mongoose-models");
const end_user_uow_1 = require("./end-user.uow");
const EndUserPersistence = (initializedService) => {
    const UserModel = api_data_sources_mongoose_models_1.Models.User.UserModelFactory(initializedService);
    const EndUserModel = api_data_sources_mongoose_models_1.Models.User.EndUserModelFactory(UserModel);
    return {
        EndUserUnitOfWork: (0, end_user_uow_1.getEndUserUnitOfWork)(EndUserModel),
    };
};
exports.EndUserPersistence = EndUserPersistence;
//# sourceMappingURL=index.js.map