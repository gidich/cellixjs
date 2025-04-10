import * as opentelemetry from '@opentelemetry/sdk-node';
import { AzureMonitorTraceExporter, AzureMonitorMetricExporter, AzureMonitorLogExporter } from "@azure/monitor-opentelemetry-exporter";
import { ConsoleLogRecordExporter } from "@opentelemetry/sdk-logs";
import { ConsoleSpanExporter } from "@opentelemetry/sdk-trace-node";
import { ConsoleMetricExporter } from "@opentelemetry/sdk-metrics";
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { DataloaderInstrumentation } from "@opentelemetry/instrumentation-dataloader";
import { GraphQLInstrumentation } from "@opentelemetry/instrumentation-graphql";
import { AzureFunctionsInstrumentation } from '@azure/functions-opentelemetry-instrumentation';
import { MongooseInstrumentation } from '@opentelemetry/instrumentation-mongoose';
interface Exporters {
    traceExporter: AzureMonitorTraceExporter | ConsoleSpanExporter;
    metricExporter: AzureMonitorMetricExporter | ConsoleMetricExporter;
    logExporter: AzureMonitorLogExporter | ConsoleLogRecordExporter;
}
export declare class OtelBuilder {
    buildExporters(exportToConsole?: boolean): Exporters;
    buildProcessors(useSimpleProcessors: boolean, exporters: Exporters): Partial<opentelemetry.NodeSDKConfiguration>;
    buildMetricReader(exporters: Exporters): opentelemetry.metrics.PeriodicExportingMetricReader;
    buildInstrumentations(): (HttpInstrumentation | AzureFunctionsInstrumentation | GraphQLInstrumentation | DataloaderInstrumentation | MongooseInstrumentation)[];
}
export {};
