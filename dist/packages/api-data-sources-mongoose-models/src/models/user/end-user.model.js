"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndUserModelFactory = exports.EndUserModelName = exports.EndUserSchema = exports.EndUserPersonalInformationType = exports.EndUserIdentityDetailsType = exports.EndUserContactInformationType = void 0;
const mongoose_1 = require("mongoose");
const api_data_sources_mongoose_seedwork_1 = require("api-data-sources-mongoose-seedwork");
const user_model_1 = require("./user.model");
const patterns_1 = require("../../patterns");
exports.EndUserContactInformationType = {
    email: { type: String, match: patterns_1.Patterns.EMAIL_PATTERN, maxlength: 254, required: false },
};
exports.EndUserIdentityDetailsType = {
    lastName: { type: String, required: true, maxlength: 50 },
    legalNameConsistsOfOneName: { type: Boolean, required: true, default: false },
    restOfName: { type: String, required: false, maxlength: 50 },
};
exports.EndUserPersonalInformationType = {
    identityDetails: Object.assign({ type: exports.EndUserIdentityDetailsType, required: true }, api_data_sources_mongoose_seedwork_1.MongooseSeedwork.NestedPathOptions),
    contactInformation: Object.assign({ type: exports.EndUserContactInformationType, required: true }, api_data_sources_mongoose_seedwork_1.MongooseSeedwork.NestedPathOptions),
};
exports.EndUserSchema = new mongoose_1.Schema({
    personalInformation: Object.assign({ type: exports.EndUserPersonalInformationType, required: true }, api_data_sources_mongoose_seedwork_1.MongooseSeedwork.NestedPathOptions),
    schemaVersion: {
        type: String,
        default: '1.0.0',
        required: false,
    },
    email: { type: String, match: patterns_1.Patterns.EMAIL_PATTERN, maxlength: 254, required: false },
    externalId: {
        type: String,
        match: patterns_1.Patterns.GUID_PATTERN,
        minlength: [36, 'External ID must be 36 characters long'],
        maxlength: [36, 'External ID must be 36 characters long'],
        required: true,
        index: true,
        unique: true,
    },
    displayName: {
        type: String,
        required: true,
        maxlength: 500,
    },
    accessBlocked: {
        type: Boolean,
        required: true,
        default: false
    },
    tags: {
        type: [String],
        required: false,
    }
}, user_model_1.userOptions).index({ 'personalInformation.contactInformation.email': 1 }, { sparse: true });
exports.EndUserModelName = 'end-users'; //TODO: This should be in singular form
const EndUserModelFactory = (UserModel) => {
    return UserModel.discriminator('end-users', exports.EndUserSchema);
};
exports.EndUserModelFactory = EndUserModelFactory;
//# sourceMappingURL=end-user.model.js.map