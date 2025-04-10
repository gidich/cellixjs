"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpInstrumentationConfig = void 0;
exports.httpInstrumentationConfig = {
    enabled: true,
    ignoreIncomingRequestHook: (request) => {
        // Ignore OPTIONS incoming requests
        if (request.method === "OPTIONS") {
            return true;
        }
        return false;
    },
    ignoreOutgoingRequestHook: (options) => {
        // Ignore outgoing requests with /api/graphql path
        if (options.path === "/api/graphql") {
            return true;
        }
        return false;
    },
};
//# sourceMappingURL=http-config.js.map