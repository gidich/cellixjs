Startup:
nvm use v20
npm run start



Recipe:

npm i -D concurrently


npm init -w ./packages/api-graphql
npm install @as-integrations/azure-functions @apollo/server graphql @azure/functions -w api-graphql

npm init -w ./packages/api-services
npm init -w ./packages/api-rest
npm install @azure/functions -w api-rest


npm init -w ./packages/service-otel
npm install @azure/monitor-opentelemetry -w service-otel