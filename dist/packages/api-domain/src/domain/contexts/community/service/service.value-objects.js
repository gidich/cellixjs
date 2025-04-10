"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Description = exports.ServiceName = void 0;
const value_objects_1 = require("@lucaspaganini/value-objects");
class ServiceName extends (0, value_objects_1.VOString)({ trim: true, maxLength: 100, minLength: 3 }) {
}
exports.ServiceName = ServiceName;
class Description extends (0, value_objects_1.VOString)({ trim: true, maxLength: 500 }) {
}
exports.Description = Description;
//# sourceMappingURL=service.value-objects.js.map