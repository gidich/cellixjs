"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CyberSourceCustomerId = exports.MemberName = void 0;
const value_objects_1 = require("@lucaspaganini/value-objects");
class MemberName extends (0, value_objects_1.VOString)({ trim: true, maxLength: 200 }) {
}
exports.MemberName = MemberName;
class CyberSourceCustomerId extends (0, value_objects_1.VOString)({ maxLength: 50 }) {
}
exports.CyberSourceCustomerId = CyberSourceCustomerId;
//# sourceMappingURL=member.value-objects.js.map