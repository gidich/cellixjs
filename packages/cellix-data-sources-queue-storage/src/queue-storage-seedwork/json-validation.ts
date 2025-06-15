import { Ajv2020, type JSONSchemaType, type ValidateFunction } from 'ajv/dist/2020.js';

const ajv = new Ajv2020();
const validatorCache = new WeakMap<object, ValidateFunction>();

export default function<T> (data: T, schema: JSONSchemaType<T>) {
    if(data) {        
        let schemaValidator = validatorCache.get(schema);
        if (!schemaValidator) {
            schemaValidator = ajv.compile(schema);
            validatorCache.set(schema, schemaValidator);
        }

        if (schemaValidator(data)) {
            return;
        }
        throw new Error ('Data is not valid' + JSON.stringify(schemaValidator.errors));
    }
    throw new Error ('Data is empty');
};