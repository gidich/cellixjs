"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customOptions = void 0;
exports.customOptions = {
    azureMonitorExporterOptions: {
        connectionString: process.env["APPLICATIONINSIGHTS_CONNECTION_STRING"],
        storageDirectory: "./temp", //Offline storage directory
        disableOfflineStorage: false, // Disable offline storage
    },
    instrumentationOptions: {
        mongoDb: {
            enabled: true,
            enhancedDatabaseReporting: true // adds query parameters to telemetry
        },
    }
};
//# sourceMappingURL=index.js.map