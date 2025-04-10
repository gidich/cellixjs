"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadOnlyDomainExecutionContext = exports.SystemDomainExecutionContext = void 0;
const domain_visa_1 = require("./domain.visa");
const SystemDomainExecutionContext = () => {
    const context = {
        domainVisa: domain_visa_1.SystemDomainVisa.GetInstance(),
    };
    return context;
};
exports.SystemDomainExecutionContext = SystemDomainExecutionContext;
const ReadOnlyDomainExecutionContext = () => {
    const context = {
        domainVisa: domain_visa_1.ReadOnlyDomainVisa.GetInstance(),
    };
    return context;
};
exports.ReadOnlyDomainExecutionContext = ReadOnlyDomainExecutionContext;
//# sourceMappingURL=domain-execution-context.js.map