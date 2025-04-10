"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffUserVisaImpl = void 0;
class StaffUserVisaImpl {
    constructor(root, user) {
        this.root = root;
        this.user = user;
    }
    determineIf(func) {
        const isEditingOwnAccount = this.user.id === this.root.id;
        const result = {
            isEditingOwnAccount: isEditingOwnAccount
        };
        return func(result);
    }
}
exports.StaffUserVisaImpl = StaffUserVisaImpl;
//# sourceMappingURL=staff-user.visa.js.map