"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongooseContextBuilder = exports.mongooseConnectionString = exports.mongooseConnectOptions = void 0;
const api_persistence_1 = require("api-persistence");
const isUsingCosmosDBEmulator = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
exports.mongooseConnectOptions = {
    tlsInsecure: isUsingCosmosDBEmulator, //only true for local development - required for Azure Cosmos DB emulator
    minPoolSize: 10, //default is zero
    // maxPoolSize: 100, //default is 100
    //keepAlive and keepAliveInitialDelay is deprecated as of Mongoose 7.2.0
    autoIndex: true, //default is true - there is debate on whether this should be true or false, leaving as true for now
    autoCreate: true, //default is true - there is debate on whether this should be true or false, leaving as true for now
    dbName: process.env.COSMOSDB_DBNAME,
};
exports.mongooseConnectionString = process.env["COSMOSDB_CONNECTION_STRING"];
const mongooseContextBuilder = (initializedService) => {
    return (0, api_persistence_1.Persistence)(initializedService);
};
exports.mongooseContextBuilder = mongooseContextBuilder;
//# sourceMappingURL=index.js.map