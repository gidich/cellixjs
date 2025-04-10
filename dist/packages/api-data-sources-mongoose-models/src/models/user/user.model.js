"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModelFactory = exports.UserModelName = exports.userOptions = void 0;
const mongoose_1 = require("mongoose");
const api_data_sources_mongoose_seedwork_1 = require("api-data-sources-mongoose-seedwork");
exports.userOptions = {
    discriminatorKey: "userType",
    timestamps: true,
};
const UserSchema = new mongoose_1.Schema({}, exports.userOptions);
exports.UserModelName = "User";
//export const UserModel = model<User>("User", UserSchema);
exports.UserModelFactory = api_data_sources_mongoose_seedwork_1.MongooseSeedwork.modelFactory(exports.UserModelName, UserSchema);
//# sourceMappingURL=user.model.js.map