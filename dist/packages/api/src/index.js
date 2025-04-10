"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("./service-config/otel-starter");
const service_otel_1 = require("service-otel");
const service_mongoose_1 = require("service-mongoose");
const cellix_1 = require("./cellix");
const api_graphql_1 = require("api-graphql");
const api_rest_1 = require("api-rest");
const MongooseConfig = __importStar(require("./service-config/mongoose"));
cellix_1.Cellix
    .registerAndStartLoggingService(new service_otel_1.ServiceOtel({ exportToConsole: process.env.NODE_ENV === "development" }))
    .initializeServices((serviceRegistry) => serviceRegistry
    .registerService(new service_mongoose_1.ServiceMongoose(MongooseConfig.mongooseConnectionString, MongooseConfig.mongooseConnectOptions)))
    .registerAzureFunctionHandler('graphql', { route: 'graphql' }, api_graphql_1.graphHandlerCreator)
    .registerAzureFunctionHandler('rest', { route: 'rest' }, api_rest_1.restHandlerCreator)
    .setContext((serviceRegistry) => {
    return {
        // dataSources: 
        domainDataSource: MongooseConfig.mongooseContextBuilder(serviceRegistry.getService(service_mongoose_1.ServiceMongoose))
    };
});
//# sourceMappingURL=index.js.map