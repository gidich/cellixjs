import { MongoDBInstrumentationConfig } from "@opentelemetry/instrumentation-mongodb";
import { AzureMonitorOpenTelemetryOptions } from "@azure/monitor-opentelemetry";

export const customOptions = {
       instrumentationOptions: {
           mongoDb: {
               enabled: true,
               enhancedDatabaseReporting: true // adds query parameters to telemetry
           } as MongoDBInstrumentationConfig,
       } as AzureMonitorOpenTelemetryOptions,
   }