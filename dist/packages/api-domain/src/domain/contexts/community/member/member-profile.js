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
exports.MemberProfile = void 0;
const cellix_domain_seedwork_1 = require("cellix-domain-seedwork");
const ValueObjects = __importStar(require("./member-profile.value-objects"));
class MemberProfile extends cellix_domain_seedwork_1.DomainSeedwork.ValueObject {
    constructor(props, visa) {
        super(props);
        this.visa = visa;
    }
    get name() {
        return this.props.name;
    }
    get email() {
        return this.props.email;
    }
    get bio() {
        return this.props.bio;
    }
    get avatarDocumentId() {
        return this.props.avatarDocumentId;
    }
    get interests() {
        return this.props.interests;
    }
    get showInterests() {
        return this.props.showInterests;
    }
    get showEmail() {
        return this.props.showEmail;
    }
    get showProfile() {
        return this.props.showProfile;
    }
    get showLocation() {
        return this.props.showLocation;
    }
    get showProperties() {
        return this.props.showProperties;
    }
    validateVisa() {
        if (!this.visa.determineIf((permissions) => permissions.canManageMembers || (permissions.canEditOwnMemberProfile && permissions.isEditingOwnMemberAccount))) {
            throw new Error('You do not have permission to update this profile');
        }
    }
    // setters using TS 5.1
    // it can't be called "name" as there is already name
    // property of this class so am calling is Name instead
    set Name(name) {
        this.validateVisa();
        this.props.name = new ValueObjects.Name(name).valueOf();
    }
    set Email(email) {
        this.validateVisa();
        this.props.email = new ValueObjects.NullableEmail(email).valueOf();
    }
    set Bio(bio) {
        this.validateVisa();
        this.props.bio = new ValueObjects.Bio(bio).valueOf();
    }
    set AvatarDocumentId(avatarDocumentId) {
        this.validateVisa();
        this.props.avatarDocumentId = avatarDocumentId;
    }
    set Interests(interests) {
        this.validateVisa();
        this.props.interests = new ValueObjects.Interests(interests).valueOf();
    }
    set ShowInterests(showInterests) {
        this.validateVisa();
        this.props.showInterests = showInterests;
    }
    set ShowEmail(showEmail) {
        this.validateVisa();
        this.props.showEmail = showEmail;
    }
    set ShowProfile(showProfile) {
        this.validateVisa();
        this.props.showProfile = showProfile;
    }
    set ShowLocation(showLocation) {
        this.validateVisa();
        this.props.showLocation = showLocation;
    }
    set ShowProperties(showProperties) {
        this.validateVisa();
        this.props.showProperties = showProperties;
    }
}
exports.MemberProfile = MemberProfile;
//# sourceMappingURL=member-profile.js.map