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
exports.MemberCustomView = void 0;
const cellix_domain_seedwork_1 = require("cellix-domain-seedwork");
const ValueObjects = __importStar(require("./member-custom-view.value-objects"));
class MemberCustomView extends cellix_domain_seedwork_1.DomainSeedwork.DomainEntity {
    constructor(props, context, visa) {
        super(props);
        this.context = context;
        this.visa = visa;
    }
    get name() {
        return this.props.name;
    }
    get type() {
        return this.props.type;
    }
    get filters() {
        return this.props.filters;
    }
    get sortOrder() {
        return this.props.sortOrder;
    }
    get columnsToDisplay() {
        return this.props.columnsToDisplay;
    }
    validateVisa() {
        if (!this.visa.determineIf((permissions) => permissions.isSystemAccount || permissions.canManageMembers || (permissions.canEditOwnMemberAccounts && permissions.isEditingOwnMemberAccount))) {
            throw new Error('You do not have permission to update this account');
        }
    }
    // implementing setters  from TS 5.1
    set Name(name) {
        this.validateVisa();
        this.props.name = new ValueObjects.CustomViewName(name).valueOf();
    }
    set Type(type) {
        this.validateVisa();
        this.props.type = new ValueObjects.CustomViewType(type).valueOf();
    }
    set Order(sortOrder) {
        this.validateVisa();
        this.props.sortOrder = new ValueObjects.CustomViewSortOrder(sortOrder).valueOf();
    }
    set Filters(filters) {
        this.validateVisa();
        this.props.filters = new ValueObjects.CustomViewFilters(filters).valueOf();
    }
    set ColumnsToDisplay(columnsToDisplay) {
        this.validateVisa();
        this.props.columnsToDisplay = new ValueObjects.CustomViewColumnsToDisplay(columnsToDisplay).valueOf();
    }
}
exports.MemberCustomView = MemberCustomView;
//# sourceMappingURL=member-custom-view.js.map