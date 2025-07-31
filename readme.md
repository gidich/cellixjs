

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