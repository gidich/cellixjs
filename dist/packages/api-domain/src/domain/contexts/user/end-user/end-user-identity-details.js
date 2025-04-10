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
exports.EndUserIdentityDetails = void 0;
const cellix_domain_seedwork_1 = require("cellix-domain-seedwork");
const ValueObjects = __importStar(require("./end-user.value-objects"));
class EndUserIdentityDetails extends cellix_domain_seedwork_1.DomainSeedwork.ValueObject {
    constructor(props) {
        super(props);
    }
    get lastName() {
        return this.props.lastName;
    }
    get legalNameConsistsOfOneName() {
        return this.props.legalNameConsistsOfOneName;
    }
    get restOfName() {
        return this.props.restOfName;
    }
    set LastName(lastName) {
        this.props.lastName = (new ValueObjects.LastName(lastName).valueOf());
    }
    set LegalNameConsistsOfOneName(legalNameConsistsOfOneName) {
        this.props.legalNameConsistsOfOneName = legalNameConsistsOfOneName;
    }
    set RestOfName(restOfName) {
        this.props.restOfName = (new ValueObjects.FirstName(restOfName).valueOf());
    }
}
exports.EndUserIdentityDetails = EndUserIdentityDetails;
//# sourceMappingURL=end-user-identity-details.js.map