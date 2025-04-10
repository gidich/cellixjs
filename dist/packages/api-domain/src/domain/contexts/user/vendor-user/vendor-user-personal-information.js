"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorUserPersonalInformation = void 0;
const cellix_domain_seedwork_1 = require("cellix-domain-seedwork");
const vendor_user_contact_information_1 = require("./vendor-user-contact-information");
const vendor_user_identity_details_1 = require("./vendor-user-identity-details");
class VendorUserPersonalInformation extends cellix_domain_seedwork_1.DomainSeedwork.ValueObject {
    constructor(props) {
        super(props);
    }
    get identityDetails() {
        return new vendor_user_identity_details_1.VendorUserIdentityDetails(this.props.identityDetails);
    }
    get contactInformation() {
        return new vendor_user_contact_information_1.VendorUserContactInformation(this.props.contactInformation);
    }
}
exports.VendorUserPersonalInformation = VendorUserPersonalInformation;
//# sourceMappingURL=vendor-user-personal-information.js.map