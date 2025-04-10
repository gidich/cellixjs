"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modelFactory = modelFactory;
function modelFactory(modelName, schema) {
    return (initializedService) => {
        if (!initializedService || !initializedService.service) {
            throw new Error('MongooseContextFactory is not initialized');
        }
        //return initializedService.GetModel(modelName, schema);
        return initializedService.service.model(modelName, schema);
        //return mongoose.model<ModelType>(modelName, schema);
    };
}
//# sourceMappingURL=mongo-connection.js.map