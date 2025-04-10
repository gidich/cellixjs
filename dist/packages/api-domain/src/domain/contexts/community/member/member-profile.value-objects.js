"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Interests = exports.Bio = exports.Name = exports.NullableEmail = exports.Email = void 0;
const value_objects_1 = require("@lucaspaganini/value-objects");
var value_objects_2 = require("../../value-objects");
Object.defineProperty(exports, "Email", { enumerable: true, get: function () { return value_objects_2.Email; } });
Object.defineProperty(exports, "NullableEmail", { enumerable: true, get: function () { return value_objects_2.NullableEmail; } });
class Name extends (0, value_objects_1.VOString)({ trim: true, maxLength: 500 }) {
}
exports.Name = Name;
class Bio extends (0, value_objects_1.VOString)({ trim: true, maxLength: 2000 }) {
}
exports.Bio = Bio;
class Interest extends (0, value_objects_1.VOString)({ trim: true, maxLength: 40 }) {
}
class Interests extends (0, value_objects_1.VOArray)(Interest, { maxLength: 20 }) {
}
exports.Interests = Interests;
//# sourceMappingURL=member-profile.value-objects.js.map