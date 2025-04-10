"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityModelFactory = exports.CommunityModelName = void 0;
const mongoose_1 = require("mongoose");
const api_data_sources_mongoose_seedwork_1 = require("api-data-sources-mongoose-seedwork");
const EndUser = __importStar(require("../user/end-user.model"));
//export const CommunityModel = model<Community>('Community',
const CommunitySchema = new mongoose_1.Schema({
    schemaVersion: { type: String, default: '1.0.0' },
    name: {
        type: String,
        required: true,
        maxlength: 200,
    },
    domain: { type: String, required: false, maxlength: 500 },
    whiteLabelDomain: { type: String, required: false, maxlength: 500 },
    handle: {
        type: String,
        required: false,
        maxlength: 50,
    },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: EndUser.EndUserModelName, required: true },
}, {
    timestamps: true,
    versionKey: 'version',
}).index({ domain: 1 }, { unique: true,
    partialFilterExpression: {
        domain: { $exists: true }
    }
})
    .index({ whiteLabelDomain: 1 }, { unique: true,
    partialFilterExpression: {
        whiteLabelDomain: { $exists: true }
    }
})
    .index({ handle: 1 }, { unique: true,
    partialFilterExpression: {
        handle: { $exists: true }
    }
});
exports.CommunityModelName = 'Community';
exports.CommunityModelFactory = api_data_sources_mongoose_seedwork_1.MongooseSeedwork.modelFactory(exports.CommunityModelName, CommunitySchema);
//# sourceMappingURL=community.model.js.map