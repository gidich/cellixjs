"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceDescription = exports.ServiceName = exports.ExternalId = exports.NullableEmail = exports.Email = void 0;
const value_objects_1 = require("@lucaspaganini/value-objects");
/* Regex Source: https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address */
const EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const NULLABLE_EMAIL_PATTERN = /^$|^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
class Email extends (0, value_objects_1.VOString)({
    trim: true,
    maxLength: 254,
    pattern: EMAIL_PATTERN,
}) {
}
exports.Email = Email;
class NullableEmail extends (0, value_objects_1.VOString)({
    trim: true,
    maxLength: 254,
    pattern: NULLABLE_EMAIL_PATTERN,
}) {
}
exports.NullableEmail = NullableEmail;
const GUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
class ExternalId extends (0, value_objects_1.VOString)({
    trim: true,
    minLength: 36,
    maxLength: 36,
    pattern: GUID_PATTERN,
}) {
}
exports.ExternalId = ExternalId;
class ServiceName extends (0, value_objects_1.VOString)({
    trim: true,
    maxLength: 100,
}) {
}
exports.ServiceName = ServiceName;
class ServiceDescription extends (0, value_objects_1.VOString)({
    trim: true,
    maxLength: 500,
}) {
}
exports.ServiceDescription = ServiceDescription;
//# sourceMappingURL=value-objects.js.map