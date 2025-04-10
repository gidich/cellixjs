"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handle = exports.WhiteLabelDomain = exports.Domain = exports.Name = void 0;
const value_objects_1 = require("@lucaspaganini/value-objects");
class Name extends (0, value_objects_1.VOString)({ trim: true, maxLength: 200 }) {
}
exports.Name = Name;
class Domain extends (0, value_objects_1.VOString)({ trim: true, maxLength: 500 }) {
}
exports.Domain = Domain;
class WhiteLabelDomain extends (0, value_objects_1.VOString)({ trim: true, maxLength: 500 }) {
}
exports.WhiteLabelDomain = WhiteLabelDomain;
class Handle extends (0, value_objects_1.VOString)({ trim: true, maxLength: 50 }) {
}
exports.Handle = Handle;
//# sourceMappingURL=community.value-objects.js.map