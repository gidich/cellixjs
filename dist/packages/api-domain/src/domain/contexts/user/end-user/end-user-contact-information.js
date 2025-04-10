"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndUserContactInformation = void 0;
const cellix_domain_seedwork_1 = require("cellix-domain-seedwork");
const end_user_value_objects_1 = require("./end-user.value-objects");
class EndUserContactInformation extends cellix_domain_seedwork_1.DomainSeedwork.ValueObject {
    constructor(props) {
        super(props);
    }
    get email() {
        return this.props.email;
    }
    set Email(email) {
        this.props.email = (new end_user_value_objects_1.Email(email)).valueOf();
    }
}
exports.EndUserContactInformation = EndUserContactInformation;
//# sourceMappingURL=end-user-contact-information.js.map