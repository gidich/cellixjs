"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorUserVisaImpl = void 0;
class VendorUserVisaImpl {
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
exports.VendorUserVisaImpl = VendorUserVisaImpl;
//# sourceMappingURL=vendor-user.visa.js.map