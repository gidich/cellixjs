"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffRoleModel = exports.StaffRoleSchema = void 0;
const mongoose_1 = require("mongoose");
const role_model_1 = require("./role.model");
exports.StaffRoleSchema = new mongoose_1.Schema({
    permissions: {
        servicePermissions: {
        // canManageServices: { type: Boolean, required: true, default: false },
        },
        serviceTicketPermissions: {
        // canCreateTickets: { type: Boolean, required: true, default: false },
        // canManageTickets: { type: Boolean, required: true, default: false },
        // canAssignTickets: { type: Boolean, required: true, default: false },
        // canWorkOnTickets: { type: Boolean, required: true, default: false, index: true },
        },
        violationTicketPermissions: {
        // canCreateTickets: { type: Boolean, required: true, default: false },
        // canManageTickets: { type: Boolean, required: true, default: false },
        // canAssignTickets: { type: Boolean, required: true, default: false },
        // canWorkOnTickets: { type: Boolean, required: true, default: false, index: true },
        },
        communityPermissions: {
            canManageStaffRolesAndPermissions: { type: Boolean, required: true, default: false },
            canManageAllCommunities: { type: Boolean, required: true, default: false },
            canDeleteCommunities: { type: Boolean, required: true, default: false },
            canChangeCommunityOwner: { type: Boolean, required: true, default: false },
            canReIndexSearchCollections: { type: Boolean, required: true, default: false },
        },
        propertyPermissions: {
        // canManageProperties: { type: Boolean, required: true, default: false },
        // canEditOwnProperty: { type: Boolean, required: true, default: false },
        },
    },
    schemaVersion: { type: String, default: '1.0.0' },
    roleName: { type: String, required: true, maxlength: 50 },
    isDefault: { type: Boolean, required: true, default: false },
}, role_model_1.roleOptions).index({ roleName: 1 }, { unique: true });
exports.StaffRoleModel = role_model_1.RoleModel.discriminator('staff-roles', exports.StaffRoleSchema);
//# sourceMappingURL=staff-role.model.js.map