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
exports.MemberAccount = void 0;
const cellix_domain_seedwork_1 = require("cellix-domain-seedwork");
const end_user_1 = require("../../user/end-user/end-user");
const ValueObjects = __importStar(require("./member-account.value-objects"));
class MemberAccount extends cellix_domain_seedwork_1.DomainSeedwork.DomainEntity {
    constructor(props, context, visa) {
        super(props);
        this.context = context;
        this.visa = visa;
    }
    get firstName() {
        return this.props.firstName;
    }
    get lastName() {
        return this.props.lastName;
    }
    get user() {
        return new end_user_1.EndUser(this.props.user, this.context);
    }
    get statusCode() {
        return this.props.statusCode;
    }
    get createdBy() {
        return new end_user_1.EndUser(this.props.createdBy, this.context);
    }
    validateVisa() {
        if (!this.visa.determineIf((permissions) => permissions.isSystemAccount || permissions.canManageMembers || (permissions.canEditOwnMemberAccounts && permissions.isEditingOwnMemberAccount))) {
            throw new Error('You do not have permission to update this account');
        }
    }
    // using ts 5.1 setters
    set FirstName(firstName) {
        this.validateVisa();
        this.props.firstName = new ValueObjects.FirstName(firstName).valueOf();
    }
    set LastName(lastName) {
        this.validateVisa();
        this.props.lastName = new ValueObjects.LastName(lastName).valueOf();
    }
    set User(user) {
        this.validateVisa();
        this.props.setUserRef(user);
    }
    set StatusCode(statusCode) {
        if (!this.visa.determineIf((permissions) => permissions.isSystemAccount || permissions.canManageMembers)) {
            throw new Error('You do not have permission to update this account');
        }
        this.props.statusCode = new ValueObjects.AccountStatusCode(statusCode).valueOf();
    }
    set CreatedBy(createdBy) {
        this.validateVisa();
        this.props.setCreatedByRef(createdBy);
    }
}
exports.MemberAccount = MemberAccount;
//# sourceMappingURL=member-account.js.map