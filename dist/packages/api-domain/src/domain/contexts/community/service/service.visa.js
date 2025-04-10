"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceVisaImpl = void 0;
class ServiceVisaImpl {
    constructor(root, member) {
        this.root = root;
        this.member = member;
    }
    determineIf(func) {
        //ensure that the member is a member of this community
        if (!this.member || this.member.community.id !== this.root.community.id) {
            console.log("Service Visa : member is not a member of this community", this.member, this.root);
            return false;
        }
        const { servicePermissions } = this.member.role.permissions;
        if (!servicePermissions) {
            console.log("Service Visa : no community permissions");
            return false;
        }
        return func(servicePermissions);
    }
}
exports.ServiceVisaImpl = ServiceVisaImpl;
//# sourceMappingURL=service.visa.js.map