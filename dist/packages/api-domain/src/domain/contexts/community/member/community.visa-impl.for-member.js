"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityVisaImplForMember = void 0;
class CommunityVisaImplForMember {
    constructor(root, member) {
        this.root = root;
        this.member = member;
    }
    determineIf(func) {
        //ensure that the member is a member of this community
        if (!this.member || this.member.community.id !== this.root.community.id) {
            console.log("Member Visa: member is not a member of this community", this.member, this.root);
            return false;
        }
        const { communityPermissions } = this.member.role.permissions;
        if (!communityPermissions) {
            console.log("Member Visa: no community permissions");
            return false;
        }
        const updatedPermissions = Object.create(communityPermissions, {
            isEditingOwnMemberAccount: { value: (this.member.id === this.root.id) } // override isEditingOwnMemberAccount
        });
        return func(updatedPermissions);
    }
}
exports.CommunityVisaImplForMember = CommunityVisaImplForMember;
//# sourceMappingURL=community.visa-impl.for-member.js.map