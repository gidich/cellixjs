"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const service_otel_1 = require("service-otel");
const Otel = new service_otel_1.ServiceOtel({
    exportToConsole: process.env.NODE_ENV === "development"
});
Otel.StartUp();
exports.default = () => Otel;
//# sourceMappingURL=otel-starter.js.map