"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorUserRoleModel = exports.VendorUserRoleSchema = void 0;
const mongoose_1 = require("mongoose");
const community_model_1 = require("../community/community.model");
const role_model_1 = require("./role.model");
exports.VendorUserRoleSchema = new mongoose_1.Schema({
    community: { type: mongoose_1.Schema.Types.ObjectId, ref: community_model_1.CommunityModelName, required: true, index: true },
    permissions: {
        servicePermissions: {
            canManageServices: { type: Boolean, required: true, default: false },
        },
        serviceTicketPermissions: {
            canCreateTickets: { type: Boolean, required: true, default: false },
            canManageTickets: { type: Boolean, required: true, default: false },
            canAssignTickets: { type: Boolean, required: true, default: false },
            canWorkOnTickets: { type: Boolean, required: true, default: false, index: true },
        },
        violationTicketPermissions: {
            canCreateTickets: { type: Boolean, required: true, default: false },
            canManageTickets: { type: Boolean, required: true, default: false },
            canAssignTickets: { type: Boolean, required: true, default: false },
            canWorkOnTickets: { type: Boolean, required: true, default: false, index: true },
        },
        communityPermissions: {
            canManageRolesAndPermissions: { type: Boolean, required: true, default: false },
            canManageCommunitySettings: { type: Boolean, required: true, default: false },
            canManageSiteContent: { type: Boolean, required: true, default: false },
            canManageMembers: { type: Boolean, required: true, default: false },
            canEditOwnMemberProfile: { type: Boolean, required: true, default: false },
            canEditOwnMemberAccounts: { type: Boolean, required: true, default: false },
        },
        propertyPermissions: {
            canManageProperties: { type: Boolean, required: true, default: false },
            canEditOwnProperty: { type: Boolean, required: true, default: false },
        },
    },
    schemaVersion: { type: String, default: '1.0.0' },
    roleName: { type: String, required: true, maxlength: 50 },
    isDefault: { type: Boolean, required: true, default: false },
}, role_model_1.roleOptions).index({ roleName: 1, community: 1 }, { unique: true });
exports.VendorUserRoleModel = role_model_1.RoleModel.discriminator('vendor-user-roles', exports.VendorUserRoleSchema);
//# sourceMappingURL=vendor-user-role.model.js.map