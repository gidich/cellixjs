## CellixJS Monorepo

Domain-driven architecture for Azure Functions with GraphQL/REST, MongoDB (Mongoose), and OpenTelemetry. This repo contains the API app, domain, infrastructure, and local dev services.

## Prerequisites

- Node.js v22+
- VS Code (recommended) with Azurite extension for local Storage emulation
- npm v11+ (nvm recommended)

## First Time Setup

```bash
nvm install v22
nvm install-latest-npm
nvm use v22
npm run clean
npm install
npm run build
```

## Developer usage

- Full local dev (builds, starts Azurite, emulators, and the OwnerCommunity app):

  ```bash
  npm run dev
  ```

- Start only the API app:

  ```bash
  npm run start:api
  ```

- Start the UI (frontend):

  ```bash
  npm run start:ui-community
  ```

- Start emulators individually:

  ```bash
  # MongoDB in-memory replica set
  npm run start-emulator:mongo-memory-server

  # OAuth2/OIDC mock server
  npm run start-emulator:auth-server
  ```

## Scripts

- Build all workspaces: `npm run build`
- Lint all: `npm run lint`
- Format all: `npm run format`
- Tests: 
    - `npm run test`
    - `npm run test:coverage`
    - `npm run test:integration`
    - `npm run test:serenity`
    - `npm run test:unit`
    - `npm run test:watch` (typically run per workspace package)

## Decisions

- Architecture docs and ADRs in `docusaurus/decisions`

## VS Code tips

- Install recommend VSCode extensions for best developer experience.
- Use built-in tasks to run the Functions host and watch builds.

## Dependency Graph

```mermaid
---
config:
    layout: elk
---
flowchart BT
  %% Keep two top-level groups for clarity
  subgraph ocom
    direction TB
    %% API and services
    ocom_api["@ocom/api"]
    ocom_api_graphql["@ocom/api-graphql"]
    ocom_api_rest["@ocom/api-rest"]
    ocom_api_application_services["@ocom/api-application-services"]
    ocom_api_context_spec["@ocom/api-context-spec"]
    ocom_api_event_handler["@ocom/api-event-handler"]
    ocom_api_domain["@ocom/api-domain"]
    ocom_api_persistence["@ocom/api-persistence"]
    ocom_api_ds_mongoose_models["@ocom/api-data-sources-mongoose-models"]

    %% Infra services (OCom)
    ocom_service_mongoose["@ocom/service-mongoose"]
    ocom_service_blob_storage["@ocom/service-blob-storage"]
    ocom_service_otel["@ocom/service-otel"]
    ocom_service_token_validation["@ocom/service-token-validation"]

    %% Local dev + UI
    ocom_service_oauth2_mock_server["@ocom/service-oauth2-mock-server"]
    ocom_service_mongodb_memory_server["@ocom/service-mongodb-memory-server"]
    ocom_ui_community["@ocom/ui-community"]
  end

  subgraph cellix
    direction TB
    cellix_api_services_spec["@cellix/api-services-spec"]
    cellix_data_sources_mongoose["@cellix/data-sources-mongoose"]
    cellix_domain_seedwork["@cellix/domain-seedwork"]
    cellix_event_bus_seedwork_node["@cellix/event-bus-seedwork-node"]
  end

  %% Dependencies (left -> right for cleaner routing)
  %% Cellix base
  cellix_data_sources_mongoose --> cellix_domain_seedwork
  cellix_data_sources_mongoose --> cellix_event_bus_seedwork_node

  %% OCom -> Cellix
  ocom_api_ds_mongoose_models --> cellix_data_sources_mongoose
  ocom_api_domain --> cellix_domain_seedwork
  ocom_api_domain --> cellix_event_bus_seedwork_node
  ocom_api_persistence --> cellix_domain_seedwork
  ocom_api_persistence --> cellix_event_bus_seedwork_node
  ocom_api_persistence --> cellix_data_sources_mongoose
  ocom_service_mongoose --> cellix_api_services_spec
  ocom_service_mongoose --> cellix_data_sources_mongoose
  ocom_service_blob_storage --> cellix_api_services_spec
  ocom_service_otel --> cellix_api_services_spec
  ocom_service_token_validation --> cellix_api_services_spec

  %% OCom internal
  ocom_api_persistence --> ocom_api_domain
  ocom_api_persistence --> ocom_api_ds_mongoose_models
  ocom_api_context_spec --> ocom_api_persistence
  ocom_api_context_spec --> ocom_service_token_validation
  ocom_api_application_services --> ocom_api_context_spec
  ocom_api_application_services --> ocom_api_domain
  ocom_api_application_services --> ocom_api_persistence
  ocom_api_event_handler --> ocom_api_domain
  ocom_api_event_handler --> ocom_api_persistence
  ocom_api_graphql --> ocom_api_application_services
  ocom_api_graphql --> ocom_api_context_spec
  ocom_api_rest --> ocom_api_application_services
  ocom_api_rest --> ocom_api_context_spec

  %% Composition
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

  %% Keep these as standalone to avoid clutter
  ocom_service_oauth2_mock_server
  ocom_service_mongodb_memory_server
  ocom_ui_community
```

## Recipe History

This section preserves prior setup notes and commands for reference as the repo evolved.

```bash
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

npm install --save-dev @tsconfig/node20 @tsconfig/node-ts vitest @vitest/coverage-v8
```