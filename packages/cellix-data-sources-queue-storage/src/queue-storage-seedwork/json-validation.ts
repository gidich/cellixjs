import { Ajv2020, type JSONSchemaType } from 'ajv/dist/2020.js';

export default function<T> (data: T, schema: JSONSchemaType<T>) {
    if(data) {
        let dataJson = JSON.parse(JSON.stringify(data));
        const  ajv = new Ajv2020();
        const schemaValidator = ajv.compile(schema);
        if (schemaValidator(dataJson)) {
            return;
        }
        throw new Error ('Data is not valid' + JSON.stringify(schemaValidator.errors));
    }
    throw new Error ('Data is empty');
};