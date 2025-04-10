"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityVisaImplForVendorUserRole = void 0;
class CommunityVisaImplForVendorUserRole {
    constructor(root, member) {
        this.root = root;
        this.member = member;
    }
    determineIf(func) {
        //ensure that the member is a member of the community
        if (!this.member || this.member.community.id !== this.root.community.id) {
            console.log("Vendor User Role Visa : member is not a member of this community", this.member, this.root);
            return false;
        }
        const { communityPermissions } = this.member.role.permissions;
        if (!communityPermissions) {
            console.log("Vendor User Role Visa : no community permissions");
            return false;
        }
        return func(communityPermissions);
    }
}
exports.CommunityVisaImplForVendorUserRole = CommunityVisaImplForVendorUserRole;
//# sourceMappingURL=community.visa-impl.for-vendor-user-role.js.map