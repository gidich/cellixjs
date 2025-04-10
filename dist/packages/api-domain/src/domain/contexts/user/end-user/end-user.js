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
exports.EndUser = void 0;
const cellix_domain_seedwork_1 = require("cellix-domain-seedwork");
const end_user_created_1 = require("../../../events/types/end-user-created");
const ValueObjects = __importStar(require("./end-user.value-objects"));
const end_user_personal_information_1 = require("./end-user-personal-information");
class EndUser extends cellix_domain_seedwork_1.DomainSeedwork.AggregateRoot {
    constructor(props, context) {
        super(props);
        this.isNew = false;
        this.visa = context.domainVisa.forEndUser(this);
    }
    get id() { return this.props.id; }
    get personalInformation() {
        return new end_user_personal_information_1.EndUserPersonalInformation(this.props.personalInformation);
    }
    get email() { return this.props.email; }
    get displayName() { return this.props.displayName; }
    get externalId() { return this.props.externalId; }
    get accessBlocked() { return this.props.accessBlocked; }
    get tags() { return this.props.tags; }
    get userType() { return this.props.userType; }
    get updatedAt() { return this.props.updatedAt; }
    get createdAt() { return this.props.createdAt; }
    get schemaVersion() { return this.props.schemaVersion; }
    static getNewUser(newProps, externalId, lastName, restOfName, context) {
        newProps.externalId = externalId;
        let user = new EndUser(newProps, context);
        user.MarkAsNew();
        user.ExternalId = (externalId);
        if (restOfName !== undefined) {
            user.personalInformation.identityDetails.RestOfName = (restOfName);
            user.personalInformation.identityDetails.LegalNameConsistsOfOneName = (false);
            user.DisplayName = (`${restOfName} ${lastName}`);
        }
        else {
            user.personalInformation.identityDetails.LegalNameConsistsOfOneName = (true);
            user.DisplayName = (lastName);
        }
        user.personalInformation.identityDetails.LastName = (lastName);
        user.isNew = false;
        return user;
    }
    MarkAsNew() {
        this.isNew = true;
        this.addIntegrationEvent(end_user_created_1.EndUserCreatedEvent, { userId: this.props.id });
    }
    validateVisa() {
        if (!this.isNew && !this.visa.determineIf((permissions) => permissions.isEditingOwnAccount)) {
            throw new Error('Unauthorized');
        }
    }
    set Email(email) {
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
exports.EndUser = EndUser;
//# sourceMappingURL=end-user.js.map