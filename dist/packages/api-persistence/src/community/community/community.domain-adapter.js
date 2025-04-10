"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityDomainAdapter = exports.CommunityConverter = void 0;
const api_domain_1 = require("api-domain");
const api_data_sources_mongoose_seedwork_1 = require("api-data-sources-mongoose-seedwork");
const end_user_domain_adapter_1 = require("../../user/end-user/end-user.domain-adapter");
class CommunityConverter extends api_data_sources_mongoose_seedwork_1.MongooseSeedwork.MongoTypeConverter {
    constructor() {
        super(CommunityDomainAdapter, (api_domain_1.Domain.Contexts.Community.Community.Community));
    }
}
exports.CommunityConverter = CommunityConverter;
class CommunityDomainAdapter extends api_data_sources_mongoose_seedwork_1.MongooseSeedwork.MongooseDomainAdapter {
    get name() {
        return this.doc.name;
    }
    set name(name) {
        this.doc.name = name;
    }
    get domain() {
        return this.doc.domain;
    }
    set domain(domain) {
        this.doc.domain = domain;
    }
    get whiteLabelDomain() {
        return this.doc.whiteLabelDomain;
    }
    set whiteLabelDomain(whiteLabelDomain) {
        this.doc.whiteLabelDomain = whiteLabelDomain;
    }
    get handle() {
        return this.doc.handle;
    }
    set handle(handle) {
        this.doc.handle = handle;
    }
    get createdBy() {
        if (!this.doc.createdBy) {
            throw new Error('createdBy is not populated');
        }
        if (this.doc.createdBy instanceof api_data_sources_mongoose_seedwork_1.MongooseSeedwork.ObjectId) {
            throw new Error('createdBy is not populated or is not of the correct type');
        }
        return new end_user_domain_adapter_1.EndUserDomainAdapter(this.doc.createdBy);
    }
    setCreatedByRef(user) {
        this.doc.set('createdBy', user['props']['doc']);
    }
}
exports.CommunityDomainAdapter = CommunityDomainAdapter;
//# sourceMappingURL=community.domain-adapter.js.map