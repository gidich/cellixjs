"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityVisaImplForCommunity = void 0;
class CommunityVisaImplForCommunity {
    constructor(root, member, user) {
        this.root = root;
        this.member = member;
        this.user = user;
    }
    determineIf(func) {
        let communityPermissions;
        if (this.member && this.member !== null) {
            //ensure that the member is a member of this community
            if (this.member.community.id !== this.root.id) {
                console.log("member is not a member of this community");
                return false;
            }
            communityPermissions = this.member.role.permissions.communityPermissions;
        }
        else if (this.user && this.user !== null && this.user.userType === 'internal-staff') {
            //ensure that the user is a staff user
            const user = this.user;
            communityPermissions = user.role.permissions.communityPermissions;
        }
        if (!communityPermissions) {
            console.log("no community permissions");
            return false;
        }
        console.log("communityPermissions", communityPermissions);
        return func(communityPermissions);
    }
}
exports.CommunityVisaImplForCommunity = CommunityVisaImplForCommunity;
//# sourceMappingURL=community.visa-impl.for-community.js.map