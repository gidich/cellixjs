"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorUserContactInformation = void 0;
const cellix_domain_seedwork_1 = require("cellix-domain-seedwork");
const vendor_user_value_objects_1 = require("./vendor-user.value-objects");
class VendorUserContactInformation extends cellix_domain_seedwork_1.DomainSeedwork.ValueObject {
    constructor(props) {
        super(props);
    }
    get email() {
        return this.props.email;
    }
    set Email(email) {
        this.props.email = (new vendor_user_value_objects_1.Email(email)).valueOf();
    }
}
exports.VendorUserContactInformation = VendorUserContactInformation;
//# sourceMappingURL=vendor-user-contact-information.js.map