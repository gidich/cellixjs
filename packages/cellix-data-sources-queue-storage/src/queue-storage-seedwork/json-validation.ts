import { Ajv, type JSONSchemaType } from 'ajv';

export default function<T> (data: T, schema: JSONSchemaType<T>) {
    if(data) {
        let dataJson = JSON.parse(JSON.stringify(data));
        const  ajv = new Ajv();
        const schemaValidator = ajv.compile(schema);
        if (schemaValidator(dataJson)) {
            return;
        }
        throw new Error ('Data is not valid' + JSON.stringify(schemaValidator.errors));
    }
    throw new Error ('Data is empty');
};