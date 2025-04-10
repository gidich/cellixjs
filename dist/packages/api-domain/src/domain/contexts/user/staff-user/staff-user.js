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
exports.StaffUser = void 0;
const cellix_domain_seedwork_1 = require("cellix-domain-seedwork");
const ValueObjects = __importStar(require("./staff-user.value-objects"));
const staff_role_1 = require("../../community/roles/staff-role/staff-role");
const staff_user_created_1 = require("../../../events/types/staff-user-created");
class StaffUser extends cellix_domain_seedwork_1.DomainSeedwork.AggregateRoot {
    constructor(props, context) {
        super(props);
        this.context = context;
        this.isNew = false;
        this.visa = context.domainVisa.forStaffUser(this);
    }
    get id() { return this.props.id; }
    get role() { return this.props.role ? new staff_role_1.StaffRole(this.props.role, this.context) : undefined; }
    get firstName() { return this.props.firstName; }
    get lastName() { return this.props.lastName; }
    get email() { return this.props.email; }
    get displayName() { return this.props.displayName; }
    get externalId() { return this.props.externalId; }
    get accessBlocked() { return this.props.accessBlocked; }
    get tags() { return this.props.tags; }
    get userType() { return this.props.userType; }
    get updatedAt() { return this.props.updatedAt; }
    get createdAt() { return this.props.createdAt; }
    get schemaVersion() { return this.props.schemaVersion; }
    static getNewUser(newProps, externalId, firstName, lastName, email, context) {
        newProps.externalId = externalId;
        let user = new StaffUser(newProps, context);
        user.MarkAsNew();
        user.ExternalId = (externalId);
        user.FirstName = (firstName);
        user.LastName = (lastName);
        user.DisplayName = (`${firstName} ${lastName}`);
        user.Email = (email);
        user.isNew = false;
        return user;
    }
    MarkAsNew() {
        this.isNew = true;
        this.addIntegrationEvent(staff_user_created_1.StaffUserCreatedEvent, {
            externalId: this.props.externalId
        });
    }
    validateVisa() {
        if (!this.isNew && !this.visa.determineIf((permissions) => permissions.isEditingOwnAccount)) {
            throw new Error('Unauthorized');
        }
    }
    set Role(role) {
        if (!this.visa.determineIf((permissions) => permissions.isEditingOwnAccount || permissions.isSystemAccount)) {
            throw new Error('Unauthorized');
        }
        this.props.setRoleRef(role);
    }
    set FirstName(firstName) {
        this.validateVisa();
        this.props.firstName = (new ValueObjects.FirstName(firstName)).valueOf();
    }
    set LastName(lastName) {
        this.validateVisa();
        this.props.lastName = (new ValueObjects.LastName(lastName)).valueOf();
    }
    set Email(email) {
        this.validateVisa();
        this.props.email = (new ValueObjects.Email(email)).valueOf();
    }
    set DisplayName(displayName) {
        this.validateVisa();
        this.props.displayName = (new ValueObjects.DisplayName(displayName)).valueOf();
    }
    set ExternalId(externalId) {
        this.validateVisa();
        this.props.externalId = (new ValueObjects.ExternalId(externalId)).valueOf();
    }
    set AccessBlocked(accessBlocked) {
        this.validateVisa();
        this.props.accessBlocked = accessBlocked;
    }
    set Tags(tags) {
        this.validateVisa();
        this.props.tags = tags;
    }
}
exports.StaffUser = StaffUser;
//# sourceMappingURL=staff-user.js.map