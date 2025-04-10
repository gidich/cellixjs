"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndUserPersonalInformation = void 0;
const cellix_domain_seedwork_1 = require("cellix-domain-seedwork");
const end_user_contact_information_1 = require("./end-user-contact-information");
const end_user_identity_details_1 = require("./end-user-identity-details");
class EndUserPersonalInformation extends cellix_domain_seedwork_1.DomainSeedwork.ValueObject {
    constructor(props) {
        super(props);
    }
    get identityDetails() {
        return new end_user_identity_details_1.EndUserIdentityDetails(this.props.identityDetails);
    }
    get contactInformation() {
        return new end_user_contact_information_1.EndUserContactInformation(this.props.contactInformation);
    }
}
exports.EndUserPersonalInformation = EndUserPersonalInformation;
//# sourceMappingURL=end-user-personal-information.js.map