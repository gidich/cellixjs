"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffUserModelFactory = exports.StaffUserModelName = exports.StaffUserSchema = void 0;
const mongoose_1 = require("mongoose");
const staff_role_model_1 = require("../role/staff-role.model");
const user_model_1 = require("./user.model");
const patterns_1 = require("../../patterns");
exports.StaffUserSchema = new mongoose_1.Schema({
    role: { type: mongoose_1.Schema.Types.ObjectId, ref: staff_role_model_1.StaffRoleModel.modelName, required: false },
    firstName: {
        type: String,
        required: false,
        maxlength: 500,
    },
    lastName: {
        type: String,
        required: false,
        maxlength: 500,
    },
    email: {
        type: String,
        match: patterns_1.Patterns.EMAIL_PATTERN,
        maxlength: 254,
        required: false,
    },
    schemaVersion: {
        type: String,
        default: '1.0.0',
        required: false,
    },
    externalId: {
        type: String,
        match: patterns_1.Patterns.GUID_PATTERN,
        minlength: [36, 'External ID must be 36 characters long'],
        maxlength: [36, 'External ID must be 36 characters long'],
        required: true,
        index: true,
        unique: true,
    },
    displayName: {
        type: String,
        required: true,
        maxlength: 500,
    },
    accessBlocked: {
        type: Boolean,
        required: true,
        default: false
    },
    tags: {
        type: [String],
        required: false,
    }
}, user_model_1.userOptions).index({ email: 1 }, { sparse: true });
exports.StaffUserModelName = 'internal-staff'; //TODO: This should be in singular form
const StaffUserModelFactory = (UserModel) => {
    return UserModel.discriminator(exports.StaffUserModelName, exports.StaffUserSchema);
};
exports.StaffUserModelFactory = StaffUserModelFactory;
//# sourceMappingURL=staff-user.model.js.map