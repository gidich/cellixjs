"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffRole = void 0;
const cellix_domain_seedwork_1 = require("cellix-domain-seedwork");
const role_deleted_reassign_1 = require("../../../../events/types/role-deleted-reassign");
const staff_role_permissions_1 = require("./staff-role-permissions");
const ValueObjects = __importStar(require("./staff-role.value-objects"));
class StaffRole extends cellix_domain_seedwork_1.DomainSeedwork.AggregateRoot {
    constructor(props, context) {
        super(props);
        this.context = context;
        this.isNew = false;
        this.visa = context.domainVisa.forStaffRole(this);
    }
    get roleName() {
        return this.props.roleName;
    }
    get isDefault() {
        return this.props.isDefault;
    }
    get permissions() {
        return new staff_role_permissions_1.StaffRolePermissions(this.props.permissions, this.visa);
    }
    get roleType() {
        return this.props.roleType;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    get schemaVersion() {
        return this.props.schemaVersion;
    }
    static getNewInstance(newProps, roleName, isDefault, context) {
        const role = new StaffRole(newProps, context);
        role.isNew = true;
        role.RoleName = roleName;
        role.IsDefault = isDefault;
        role.isNew = false;
        return role;
    }
    // using setter from TS 5.1
    set DeleteAndReassignTo(roleRef) {
        if (!this.isDeleted && !this.isDefault && !this.visa.determineIf((permissions) => permissions.canManageStaffRolesAndPermissions)) {
            throw new Error('You do not have permission to delete this role');
        }
        super.isDeleted = true;
        this.addIntegrationEvent(role_deleted_reassign_1.RoleDeletedReassignEvent, { deletedRoleId: this.props.id, newRoleId: roleRef.id });
    }
    set IsDefault(isDefault) {
        if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageStaffRolesAndPermissions || permissions.isSystemAccount)) {
            throw new Error('You do not have permission to update this role');
        }
        this.props.isDefault = isDefault;
    }
    set RoleName(roleName) {
        if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageStaffRolesAndPermissions || permissions.isSystemAccount)) {
            throw new Error('Cannot set role name');
        }
        this.props.roleName = new ValueObjects.RoleName(roleName).valueOf();
    }
}
exports.StaffRole = StaffRole;
//# sourceMappingURL=staff-role.js.map