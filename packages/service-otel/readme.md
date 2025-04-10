 






Notes:

Azure Application Insights is Azure's hosted service for receiving OpenTelemetry

Azure Libraries:


* @azure/monitor-opentelemetry-exporter
  * used to export OpenTelemetry Logs/Metics/Traces to Azure Monitor (Application Insights)
* @azure/monitor-opentelemetry
  * relies on:
    * @azure/monitor-opentelemetry-exporter (^1.0.0-beta.28)
    * @azure/opentelemetry-instrumentation-azure-sdk (^1.0.0-beta.7)






Microsoft as of Mar 28, 2025 currently only supports v1 of the OpenTelemetry at this time - do not use @opentelemetry/sdk-node

* Reference:[GitHub Issue Response from Microsoft](https://github.com/Azure/azure-sdk-for-js/issues/33567#issuecomment-2762721988)

* Instructions Adapated from :[Microsoft's Documentation for Using OpenTelemetry with Azure Functions](https://learn.microsoft.com/en-us/azure/azure-functions/opentelemetry-howto?tabs=app-insights&pivots=programming-language-typescript) (in previiew as of 3/28/2025)


The following commands will ensure installation of the non 2.x of OTEL:

```console
// npm i -w service-otel @opentelemetry/api@^1.9.0
npm i -w service-otel @opentelemetry/sdk-node@^0.57.2
npm i -w service-otel @azure/functions-opentelemetry-instrumentation
npm i -w service-otel @azure/monitor-opentelemetry-exporter


npm i -w service-otel @opentelemetry/instrumentation-mongoose


npm i -w service-otel @opentelemetry/auto-instrumentations-node@^0.56.0
npm i -w service-otel @azure/monitor-opentelemetry-exporter


```


Decisions

While in local development mode, we want to enable SimpleProcessors to see logs immediately as they happen, and when deployed we want to use BatchProcessors for performance reasons
