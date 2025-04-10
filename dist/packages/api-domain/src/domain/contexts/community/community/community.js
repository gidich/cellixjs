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
exports.Community = void 0;
const cellix_domain_seedwork_1 = require("cellix-domain-seedwork");
const community_created_1 = require("../../../events/types/community-created");
const community_domain_updated_1 = require("../../../events/types/community-domain-updated");
const end_user_1 = require("../../user/end-user/end-user");
const ValueObjects = __importStar(require("./community.value-objects"));
class Community extends cellix_domain_seedwork_1.DomainSeedwork.AggregateRoot {
    //#endregion Fields
    //#region Constructors
    constructor(props, context) {
        super(props);
        this.context = context;
        //#region Fields
        this.isNew = false;
        this.visa = context.domainVisa.forCommunity(this);
    }
    //#endregion Constructors
    //#region Methods
    static getNewInstance(newProps, communityName, createdByUser, context) {
        let community = new Community(newProps, context);
        community.markAsNew();
        community.name = communityName;
        community.createdBy = createdByUser;
        community.isNew = false;
        return community;
    }
    markAsNew() {
        this.isNew = true;
        this.addIntegrationEvent(community_created_1.CommunityCreatedEvent, { communityId: this.props.id });
    }
    //#endregion Methods
    //#region Properties
    get id() {
        return this.props.id;
    }
    get name() {
        return this.props.name;
    }
    set name(name) {
        if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageCommunitySettings)) {
            throw new Error('You do not have permission to change the name of this community');
        }
        this.props.name = new ValueObjects.Name(name).valueOf();
    }
    get domain() {
        return this.props.domain;
    }
    set domain(domain) {
        if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageCommunitySettings)) {
            throw new Error('You do not have permission to change the domain of this community');
        }
        const oldDomain = this.props.domain;
        if (this.props.domain !== domain) {
            this.props.domain = new ValueObjects.Domain(domain).valueOf();
            this.addIntegrationEvent(community_domain_updated_1.CommunityDomainUpdatedEvent, { communityId: this.props.id, domain, oldDomain: oldDomain });
        }
    }
    get whiteLabelDomain() {
        return this.props.whiteLabelDomain;
    }
    set whiteLabelDomain(whiteLabelDomain) {
        if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageCommunitySettings)) {
            throw new Error('You do not have permission to change the white label domain of this community');
        }
        this.props.whiteLabelDomain = whiteLabelDomain ? new ValueObjects.WhiteLabelDomain(whiteLabelDomain).valueOf() : null;
    }
    get handle() {
        return this.props.handle;
    }
    set handle(handle) {
        if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageCommunitySettings)) {
            throw new Error('You do not have permission to change the handle of this community');
        }
        this.props.handle = handle ? new ValueObjects.Handle(handle).valueOf() : null;
    }
    get createdBy() {
        return new end_user_1.EndUser(this.props.createdBy, this.context);
    }
    set createdBy(createdBy) {
        if (!this.isNew && !this.visa.determineIf((permissions) => permissions.canManageCommunitySettings)) {
            throw new Error('You do not have permission to change the created by of this community');
        }
        if (createdBy === null || createdBy === undefined) {
            throw new Error('createdBy cannot be null or undefined');
        }
        this.props.setCreatedByRef(createdBy);
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get schemaVersion() {
        return this.props.schemaVersion;
    }
}
exports.Community = Community;
//# sourceMappingURL=community.js.map