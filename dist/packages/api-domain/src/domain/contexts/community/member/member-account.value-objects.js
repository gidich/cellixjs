"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountStatusCode = exports.LastName = exports.FirstName = exports.AccountStatusCodes = void 0;
const value_objects_1 = require("@lucaspaganini/value-objects");
exports.AccountStatusCodes = {
    Created: 'CREATED',
    Accepted: 'ACCEPTED',
    Rejected: 'REJECTED'
};
class FirstName extends (0, value_objects_1.VOString)({ trim: true, maxLength: 500 }) {
}
exports.FirstName = FirstName;
class LastName extends (0, value_objects_1.VOString)({ trim: true, maxLength: 500 }) {
}
exports.LastName = LastName;
class AccountStatusCode extends (0, value_objects_1.VOSet)(Object.values(exports.AccountStatusCodes)) {
}
exports.AccountStatusCode = AccountStatusCode;
//# sourceMappingURL=member-account.value-objects.js.map