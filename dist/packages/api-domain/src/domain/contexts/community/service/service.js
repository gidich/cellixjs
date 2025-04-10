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
exports.Service = void 0;
const community_1 = require("../community/community");
const ValueObjects = __importStar(require("./service.value-objects"));
const cellix_domain_seedwork_1 = require("cellix-domain-seedwork");
class Service extends cellix_domain_seedwork_1.DomainSeedwork.AggregateRoot {
    constructor(props, context) {
        super(props);
        this.context = context;
        this.isNew = false;
        this.visa = context.domainVisa.forService(this);
    }
    static getNewInstance(newProps, serviceName, description, community, context) {
        let service = new Service(newProps, context);
        service.isNew = true;
        service.ServiceName = serviceName;
        service.Description = description;
        service.Community = community;
        service.IsActive = true;
        service.isNew = false;
        return service;
    }
    get community() {
        return new community_1.Community(this.props.community, this.context);
    }
    get serviceName() {
        return this.props.serviceName;
    }
    get description() {
        return this.props.description;
    }
    get isActive() {
        return this.props.isActive;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    get schemaVersion() {
        return this.props.schemaVersion;
    }
    // using set from TS 5.1
    set Community(community) {
        if (!this.isNew) {
            throw new Error('Unauthorized');
        }
        this.props.setCommunityRef(community);
    }
    set ServiceName(serviceName) {
        this.props.serviceName = new ValueObjects.ServiceName(serviceName).valueOf();
    }
    set Description(description) {
        this.props.description = new ValueObjects.Description(description).valueOf();
    }
    set IsActive(isActive) {
        this.props.isActive = isActive;
    }
}
exports.Service = Service;
//# sourceMappingURL=service.js.map