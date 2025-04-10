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
exports.Member = void 0;
const cellix_domain_seedwork_1 = require("cellix-domain-seedwork");
//import { AggregateRoot } from '../../../../../../seedwork/domain-seedwork/aggregate-root';
//import { DomainEntityProps } from '../../../../../../seedwork/domain-seedwork/domain-entity';
const ValueObjects = __importStar(require("./member.value-objects"));
const community_1 = require("../community/community");
//import { PropArray } from '../../../../../../seedwork/domain-seedwork/prop-array';
const member_account_1 = require("./member-account");
const end_user_role_1 = require("../roles/end-user-role/end-user-role");
const member_profile_1 = require("./member-profile");
const member_custom_view_1 = require("./member-custom-view");
class Member extends cellix_domain_seedwork_1.DomainSeedwork.AggregateRoot {
    constructor(props, context) {
        super(props);
        this.context = context;
        this.isNew = false;
    }
    get id() {
        return this.props.id;
    }
    get memberName() {
        return this.props.memberName;
    }
    get cybersourceCustomerId() {
        return this.props.cybersourceCustomerId;
    }
    get community() {
        return new community_1.Community(this.props.community, this.context);
    }
    get accounts() {
        return this.props.accounts.items.map((account) => new member_account_1.MemberAccount(account, this.context, this.visa));
    } // return account as it's an embedded document not a reference (allows editing)
    get role() {
        return new end_user_role_1.EndUserRole(this.props.role, this.context);
    }
    get profile() {
        return new member_profile_1.MemberProfile(this.props.profile, this.visa);
    } // return profile as it's an embedded document not a reference (allows editing)
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    get schemaVersion() {
        return this.props.schemaVersion;
    }
    get customViews() {
        return this.props.customViews.items.map((customView) => new member_custom_view_1.MemberCustomView(customView, this.context, this.visa));
    } // return customView as it's an embedded document not a reference (allows editing)
    static getNewInstance(newProps, name, community, context) {
        let member = new Member(newProps, context);
        member.isNew = true;
        member.MemberName = name;
        member.Community = community;
        member.isNew = false;
        return member;
    }
    // using SET from TS 5.1
    set MemberName(memberName) {
        if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageMembers || permissions.isSystemAccount)) {
            throw new Error('Cannot set member name');
        }
        this.props.memberName = new ValueObjects.MemberName(memberName).valueOf();
    }
    set CyberSourceCustomerId(cybersourceCustomerId) {
        this.props.cybersourceCustomerId = new ValueObjects.CyberSourceCustomerId(cybersourceCustomerId).valueOf();
    }
    set Community(community) {
        this.props.setCommunityRef(community);
    }
    set Role(role) {
        if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageMembers || permissions.isSystemAccount)) {
            throw new Error('Cannot set role');
        }
        this.props.setRoleRef(role);
    }
    requestNewAccount() {
        if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageMembers || permissions.isSystemAccount)) {
            throw new Error('Cannot set role');
        }
        return new member_account_1.MemberAccount(this.props.accounts.getNewItem(), this.context, this.visa);
    }
    requestRemoveAccount(accountRef) {
        if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageMembers || permissions.isSystemAccount)) {
            throw new Error('Cannot set role');
        }
        this.props.accounts.removeItem(accountRef);
    }
    // CustomViews
    requestNewCustomView() {
        if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageMembers || permissions.isSystemAccount)) {
            throw new Error('Cannot set custom view');
        }
        return new member_custom_view_1.MemberCustomView(this.props.customViews.getNewItem(), this.context, this.visa);
    }
    requestRemoveCustomView(customView) {
        if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageMembers || permissions.isSystemAccount)) {
            throw new Error('Cannot set custom view');
        }
        console.log(customView.name);
        this.props.customViews.removeItem(customView.props);
    }
}
exports.Member = Member;
//# sourceMappingURL=member.js.map