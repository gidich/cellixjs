"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisplayName = exports.LastName = exports.FirstName = exports.ExternalId = exports.Email = void 0;
const value_objects_1 = require("@lucaspaganini/value-objects");
var value_objects_2 = require("../../value-objects");
Object.defineProperty(exports, "Email", { enumerable: true, get: function () { return value_objects_2.Email; } });
Object.defineProperty(exports, "ExternalId", { enumerable: true, get: function () { return value_objects_2.ExternalId; } });
class FirstName extends (0, value_objects_1.VOString)({ trim: true, maxLength: 50 }) {
}
exports.FirstName = FirstName;
class LastName extends (0, value_objects_1.VOString)({ trim: true, maxLength: 50 }) {
}
exports.LastName = LastName;
class DisplayName extends (0, value_objects_1.VOString)({ trim: true, maxLength: 100 }) {
}
exports.DisplayName = DisplayName;
//# sourceMappingURL=staff-user.value-objects.js.map