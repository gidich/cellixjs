import { AzureMonitorOpenTelemetryOptions, useAzureMonitor } from "@azure/monitor-opentelemetry";
import { httpInstrumentationConfig } from "./http-config";
import type { ServiceBase } from "api-services-spec";

export interface OtelContext {}

export class ServiceOtel implements ServiceBase<OtelContext> {
  private readonly options: AzureMonitorOpenTelemetryOptions;
  constructor(customOptions: AzureMonitorOpenTelemetryOptions) {
    const defaultOptions: AzureMonitorOpenTelemetryOptions = {
        instrumentationOptions: {
          http: httpInstrumentationConfig,
        },
      };
    // Merge the default options with the custom options
    this.options = {
      ...defaultOptions,
      ...customOptions,
    };
  }
  public async StartUp() {
    console.log('ServiceOtel starting');
    useAzureMonitor(this.options);
    console.log('ServiceOtel started');
    return this;
  }
  public async ShutDown() {
    console.log('ServiceOtel stopped');
  }
}