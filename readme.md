

VSCode Extensions Required:

Azurite - used for storage emulation


Ideas:

VSCode Sorter Plugin
https://marketplace.visualstudio.com/items?itemName=aljazsim.tsco

Decisions:

Use [TSConfig Bases](https://github.com/tsconfig/bases) for TS Configuration


Begin

nvm install v20
nvm install-latest-npm

nvm use v20
npm run clean
npm install
npm run build

Startup:

nvm use v20
npm run start



Recipe:

npm i -D concurrently


npm init -w ./packages/api-graphql
npm install @as-integrations/azure-functions @apollo/server graphql @azure/functions -w api-graphql

npm init -w ./packages/api-event-handler

npm init -w ./packages/api-services
npm init -w ./packages/api-rest
npm install @azure/functions -w api-rest

npm init -w ./packages/api-data-sources-domain


npm init -w ./packages/service-otel
npm install @azure/monitor-opentelemetry -w service-otel



npm init -w ./packages/api-persistence


npm init -w ./packages/event-bus-seedwork-node



npm install --save-dev @tsconfig/node20
npm install --save-dev @tsconfig/node-ts
npm install --save-dev vitest @vitest/coverage-v8

## Dependencies

```mermaid
graph BT
  %% Group by scope for readability
  subgraph Cellix
    cellix_api_services_spec["@cellix/api-services-spec"]
    cellix_domain_seedwork["@cellix/domain-seedwork"]
    cellix_event_bus_seedwork_node["@cellix/event-bus-seedwork-node"]
    cellix_data_sources_mongoose["@cellix/data-sources-mongoose"]
  end

  subgraph OCom
    ocom_api["@ocom/api"]
    ocom_api_application_services["@ocom/api-application-services"]
    ocom_api_context_spec["@ocom/api-context-spec"]
    ocom_api_domain["@ocom/api-domain"]
    ocom_api_event_handler["@ocom/api-event-handler"]
    ocom_api_graphql["@ocom/api-graphql"]
    ocom_api_persistence["@ocom/api-persistence"]
    ocom_api_rest["@ocom/api-rest"]
    ocom_api_ds_mongoose_models["@ocom/api-data-sources-mongoose-models"]
    ocom_service_blob_storage["@ocom/service-blob-storage"]
    ocom_service_mongoose["@ocom/service-mongoose"]
    ocom_service_otel["@ocom/service-otel"]
    ocom_service_token_validation["@ocom/service-token-validation"]
    ocom_service_oauth2_mock_server["@ocom/service-oauth2-mock-server"]
    ocom_ui_community["@ocom/ui-community"]
  end

  %% Base seedwork relations
  cellix_event_bus_seedwork_node --> cellix_domain_seedwork
  cellix_data_sources_mongoose --> cellix_domain_seedwork
  cellix_data_sources_mongoose --> cellix_event_bus_seedwork_node

  %% Domain and persistence
  ocom_api_domain --> cellix_domain_seedwork
  ocom_api_domain --> cellix_event_bus_seedwork_node

  ocom_api_ds_mongoose_models --> cellix_data_sources_mongoose

  ocom_api_persistence --> cellix_domain_seedwork
  ocom_api_persistence --> cellix_event_bus_seedwork_node
  ocom_api_persistence --> cellix_data_sources_mongoose
  ocom_api_persistence --> ocom_api_domain
  ocom_api_persistence --> ocom_api_ds_mongoose_models

  %% Context and app services
  ocom_api_context_spec --> ocom_api_persistence
  ocom_api_context_spec --> ocom_service_token_validation

  ocom_api_application_services --> ocom_api_context_spec
  ocom_api_application_services --> ocom_api_domain
  ocom_api_application_services --> ocom_api_event_handler

  %% APIs
  ocom_api_rest --> ocom_api_application_services
  ocom_api_rest --> ocom_api_context_spec

  ocom_api_graphql --> ocom_api_application_services
  ocom_api_graphql --> ocom_api_context_spec

  ocom_api_event_handler --> ocom_api_domain
  ocom_api_event_handler --> ocom_api_persistence

  %% Services
  ocom_service_mongoose --> cellix_api_services_spec
  ocom_service_mongoose --> cellix_data_sources_mongoose

  ocom_service_blob_storage --> cellix_api_services_spec
  ocom_service_token_validation --> cellix_api_services_spec
  ocom_service_otel --> cellix_api_services_spec

  %% Top-level function app (composes most)
  ocom_api --> cellix_api_services_spec
  ocom_api --> ocom_api_context_spec
  ocom_api --> ocom_api_application_services
  ocom_api --> ocom_api_graphql
  ocom_api --> ocom_api_persistence
  ocom_api --> ocom_api_rest
  ocom_api --> ocom_service_blob_storage
  ocom_api --> ocom_service_mongoose
  ocom_api --> ocom_service_otel
  ocom_api --> ocom_service_token_validation

  %% Isolated/independent local packages (no internal deps)
  ocom_ui_community
  ocom_service_oauth2_mock_server
  cellix_api_services_spec
  cellix_domain_seedwork
  ```