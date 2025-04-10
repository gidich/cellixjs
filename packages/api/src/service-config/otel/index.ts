import { MongoDBInstrumentationConfig } from "@opentelemetry/instrumentation-mongodb";
import { AzureMonitorOpenTelemetryOptions } from "@azure/monitor-opentelemetry";

export const customOptions:AzureMonitorOpenTelemetryOptions = {
  azureMonitorExporterOptions: {
    connectionString: process.env["APPLICATIONINSIGHTS_CONNECTION_STRING"],
    storageDirectory: "./temp", //Offline storage directory
    disableOfflineStorage: false, // Disable offline storage
  },
  instrumentationOptions:{
    mongoDb: {
      enabled: true,
      enhancedDatabaseReporting: true // adds query parameters to telemetry
    } as MongoDBInstrumentationConfig,
  }
}

