"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndUserContactInformationDomainAdapter = exports.EndUserIdentityDetailsDomainAdapter = exports.EndUserPersonalInformationDomainAdapter = exports.EndUserDomainAdapter = exports.EndUserConverter = void 0;
const api_domain_1 = require("api-domain");
const api_data_sources_mongoose_seedwork_1 = require("api-data-sources-mongoose-seedwork");
class EndUserConverter extends api_data_sources_mongoose_seedwork_1.MongooseSeedwork.MongoTypeConverter {
    constructor() {
        super(EndUserDomainAdapter, (api_domain_1.Domain.Contexts.User.EndUser.EndUser));
    }
}
exports.EndUserConverter = EndUserConverter;
class EndUserDomainAdapter extends api_data_sources_mongoose_seedwork_1.MongooseSeedwork.MongooseDomainAdapter {
    get externalId() {
        return this.doc.externalId;
    }
    set externalId(externalId) {
        this.doc.externalId = externalId;
    }
    get personalInformation() {
        if (!this.doc.personalInformation) {
            this.doc.set('personalInformation', {});
        }
        return new EndUserPersonalInformationDomainAdapter(this.doc.personalInformation);
    }
    get email() {
        return this.doc.email;
    }
    set email(email) {
        this.doc.email = email;
    }
    get displayName() {
        return this.doc.displayName;
    }
    set displayName(displayName) {
        this.doc.displayName = displayName;
    }
    get accessBlocked() {
        return this.doc.accessBlocked;
    }
    set accessBlocked(accessBlocked) {
        this.doc.accessBlocked = accessBlocked;
    }
    get tags() {
        return this.doc.tags;
    }
    set tags(tags) {
        this.doc.tags = tags;
    }
}
exports.EndUserDomainAdapter = EndUserDomainAdapter;
class EndUserPersonalInformationDomainAdapter {
    constructor(props) {
        this.props = props;
    }
    get identityDetails() {
        if (!this.props.identityDetails) {
            this.props.set('identityDetails', {});
        }
        return new EndUserIdentityDetailsDomainAdapter(this.props.identityDetails);
    }
    get contactInformation() {
        if (!this.props.contactInformation) {
            this.props.set('contactInformation', {});
        }
        return new EndUserContactInformationDomainAdapter(this.props.contactInformation);
    }
}
exports.EndUserPersonalInformationDomainAdapter = EndUserPersonalInformationDomainAdapter;
class EndUserIdentityDetailsDomainAdapter {
    constructor(props) {
        this.props = props;
    }
    get lastName() {
        return this.props.lastName;
    }
    set lastName(lastName) {
        this.props.lastName = lastName;
    }
    get legalNameConsistsOfOneName() {
        return this.props.legalNameConsistsOfOneName;
    }
    set legalNameConsistsOfOneName(legalNameConsistsOfOneName) {
        this.props.legalNameConsistsOfOneName = legalNameConsistsOfOneName;
    }
    get restOfName() {
        return this.props.restOfName;
    }
    set restOfName(restOfName) {
        this.props.restOfName = restOfName;
    }
}
exports.EndUserIdentityDetailsDomainAdapter = EndUserIdentityDetailsDomainAdapter;
class EndUserContactInformationDomainAdapter {
    constructor(props) {
        this.props = props;
    }
    get email() {
        return this.props.email;
    }
    set email(email) {
        this.props.email = email;
    }
}
exports.EndUserContactInformationDomainAdapter = EndUserContactInformationDomainAdapter;
//# sourceMappingURL=end-user.domain-adapter.js.map