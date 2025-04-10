"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityVisaImplForStaffRole = void 0;
class CommunityVisaImplForStaffRole {
    constructor(root, user) {
        this.root = root;
        this.user = user;
    }
    determineIf(func) {
        //ensure that the member is a member of the community
        if (!this.user || !this.root) {
            console.log("Staff Role Visa : undefined user or role", this.user, this.root);
            return false;
        }
        // const communityPermissions = this.user.role.permissions.communityPermissions;
        // if(!communityPermissions) {
        //   console.log("Staff Role Visa : no community permissions");
        //   return false;
        // }
        // change this after implementing user discriminator
        const communityPermissions = {
            canManageStaffRolesAndPermissions: true,
            canChangeCommunityOwner: true,
            canDeleteCommunities: true,
            canManageAllCommunities: true,
            canReIndexSearchCollections: true
        };
        return func(communityPermissions);
    }
}
exports.CommunityVisaImplForStaffRole = CommunityVisaImplForStaffRole;
//# sourceMappingURL=community.visa-impl.for-staff-role.js.map