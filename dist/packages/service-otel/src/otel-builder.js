"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtelBuilder = void 0;
const monitor_opentelemetry_exporter_1 = require("@azure/monitor-opentelemetry-exporter");
const sdk_logs_1 = require("@opentelemetry/sdk-logs");
const sdk_trace_node_1 = require("@opentelemetry/sdk-trace-node");
const sdk_metrics_1 = require("@opentelemetry/sdk-metrics");
const instrumentation_http_1 = require("@opentelemetry/instrumentation-http");
const instrumentation_dataloader_1 = require("@opentelemetry/instrumentation-dataloader");
const instrumentation_graphql_1 = require("@opentelemetry/instrumentation-graphql");
const functions_opentelemetry_instrumentation_1 = require("@azure/functions-opentelemetry-instrumentation");
const instrumentation_mongoose_1 = require("@opentelemetry/instrumentation-mongoose");
const http_config_1 = require("./http-config");
class OtelBuilder {
    buildExporters(exportToConsole = false) {
        if (exportToConsole) {
            return {
                traceExporter: new sdk_trace_node_1.ConsoleSpanExporter(),
                metricExporter: new sdk_metrics_1.ConsoleMetricExporter(),
                logExporter: new sdk_logs_1.ConsoleLogRecordExporter()
            };
        }
        else {
            return {
                traceExporter: new monitor_opentelemetry_exporter_1.AzureMonitorTraceExporter({
                    connectionString: process.env["APPLICATIONINSIGHTS_CONNECTION_STRING"]
                }),
                metricExporter: new monitor_opentelemetry_exporter_1.AzureMonitorMetricExporter({
                    connectionString: process.env["APPLICATIONINSIGHTS_CONNECTION_STRING"]
                }),
                logExporter: new monitor_opentelemetry_exporter_1.AzureMonitorLogExporter({
                    connectionString: process.env["APPLICATIONINSIGHTS_CONNECTION_STRING"]
                })
            };
        }
    }
    buildProcessors(useSimpleProcessors, exporters) {
        if (useSimpleProcessors) {
            return {
                spanProcessors: [new sdk_trace_node_1.SimpleSpanProcessor(exporters.traceExporter)],
                logRecordProcessors: [new sdk_logs_1.SimpleLogRecordProcessor(exporters.logExporter)],
            };
        }
        else {
            return {
                spanProcessors: [new sdk_trace_node_1.BatchSpanProcessor(exporters.traceExporter, {
                        exportTimeoutMillis: 15000,
                        maxQueueSize: 1000,
                    })],
                logRecordProcessors: [new sdk_logs_1.BatchLogRecordProcessor(exporters.logExporter, {
                        exportTimeoutMillis: 15000,
                        maxQueueSize: 1000,
                    })],
            };
        }
    }
    buildMetricReader(exporters) {
        return new sdk_metrics_1.PeriodicExportingMetricReader({
            exporter: exporters.metricExporter,
            exportIntervalMillis: 60000,
        });
    }
    buildInstrumentations() {
        return [
            new instrumentation_http_1.HttpInstrumentation(http_config_1.httpInstrumentationConfig), //required by AzureFunctionsInstrumentation
            new functions_opentelemetry_instrumentation_1.AzureFunctionsInstrumentation({ enabled: true }),
            new instrumentation_graphql_1.GraphQLInstrumentation({ allowValues: true }),
            new instrumentation_dataloader_1.DataloaderInstrumentation(),
            new instrumentation_mongoose_1.MongooseInstrumentation(),
        ];
    }
}
exports.OtelBuilder = OtelBuilder;
//# sourceMappingURL=otel-builder.js.map