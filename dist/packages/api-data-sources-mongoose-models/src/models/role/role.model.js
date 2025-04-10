"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleModel = exports.roleOptions = void 0;
const mongoose_1 = require("mongoose");
// TODO: Discriminator key and Version can't exist together, if we don't use version key it will fall back to __v
exports.roleOptions = {
    discriminatorKey: 'roleType',
    timestamps: true,
    // versionKey: 'version',
};
const RoleSchema = new mongoose_1.Schema({}, exports.roleOptions);
exports.RoleModel = (0, mongoose_1.model)('Role', RoleSchema);
//# sourceMappingURL=role.model.js.map