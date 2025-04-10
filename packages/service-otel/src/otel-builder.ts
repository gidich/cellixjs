import * as opentelemetry from '@opentelemetry/sdk-node';
import { AzureMonitorTraceExporter, AzureMonitorMetricExporter, AzureMonitorLogExporter } from "@azure/monitor-opentelemetry-exporter";
import { BatchLogRecordProcessor, SimpleLogRecordProcessor, ConsoleLogRecordExporter } from "@opentelemetry/sdk-logs";
import { BatchSpanProcessor, SimpleSpanProcessor, ConsoleSpanExporter } from "@opentelemetry/sdk-trace-node";
import { PeriodicExportingMetricReader, ConsoleMetricExporter } from "@opentelemetry/sdk-metrics";
import { HttpInstrumentation }  from '@opentelemetry/instrumentation-http';
import { DataloaderInstrumentation} from "@opentelemetry/instrumentation-dataloader";
import { GraphQLInstrumentation } from "@opentelemetry/instrumentation-graphql";
import { AzureFunctionsInstrumentation } from '@azure/functions-opentelemetry-instrumentation';
import { MongooseInstrumentation } from '@opentelemetry/instrumentation-mongoose';


import { httpInstrumentationConfig } from './http-config';

interface Exporters {
  traceExporter: AzureMonitorTraceExporter | ConsoleSpanExporter;
  metricExporter: AzureMonitorMetricExporter | ConsoleMetricExporter;
  logExporter: AzureMonitorLogExporter | ConsoleLogRecordExporter;
}

export class OtelBuilder {

  public buildExporters(exportToConsole:boolean = false):Exporters{
    if(exportToConsole) {
      return {
        traceExporter: new ConsoleSpanExporter(),
        metricExporter: new ConsoleMetricExporter(),
        logExporter: new ConsoleLogRecordExporter()
      }
    }else {
      return {
        traceExporter: new AzureMonitorTraceExporter({
          connectionString: process.env["APPLICATIONINSIGHTS_CONNECTION_STRING"] 
        }),
        metricExporter: new AzureMonitorMetricExporter({
          connectionString: process.env["APPLICATIONINSIGHTS_CONNECTION_STRING"] 
        }),
        logExporter: new AzureMonitorLogExporter({
          connectionString: process.env["APPLICATIONINSIGHTS_CONNECTION_STRING"]
        })
      }
    }
  }
  
  public buildProcessors(useSimpleProcessors:boolean, exporters:Exporters):Partial<opentelemetry.NodeSDKConfiguration> {
    if(useSimpleProcessors) {
      return {
        spanProcessors: [new SimpleSpanProcessor(exporters.traceExporter)],
        logRecordProcessors: [new SimpleLogRecordProcessor(exporters.logExporter)],
      }
    }else {
      return {
        spanProcessors: [new BatchSpanProcessor(exporters.traceExporter,{
          exportTimeoutMillis: 15000,
          maxQueueSize: 1000,
        })],
        logRecordProcessors: [new BatchLogRecordProcessor(exporters.logExporter,{
          exportTimeoutMillis: 15000,
          maxQueueSize: 1000,
        })],
      }
    }
  }
  
  public buildMetricReader(exporters:Exporters) {
    return new PeriodicExportingMetricReader({
      exporter: exporters.metricExporter,
      exportIntervalMillis: 60000,
    });
  }

  public buildInstrumentations() {
    return [
      new HttpInstrumentation(httpInstrumentationConfig), //required by AzureFunctionsInstrumentation
      new AzureFunctionsInstrumentation({enabled: true}),
      new GraphQLInstrumentation({ allowValues: true }),
      new DataloaderInstrumentation(),
      new MongooseInstrumentation(),
    ]
  }
}