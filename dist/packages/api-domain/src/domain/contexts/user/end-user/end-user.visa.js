"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndUserVisaImpl = void 0;
class EndUserVisaImpl {
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
exports.EndUserVisaImpl = EndUserVisaImpl;
//# sourceMappingURL=end-user.visa.js.map