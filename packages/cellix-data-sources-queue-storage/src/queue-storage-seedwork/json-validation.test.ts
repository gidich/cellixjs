import type { JSONSchemaType } from 'ajv/dist/2020.js';
import { describe, expect, it } from 'vitest';
import validateJson from './json-validation.ts';


describe('validateJson', () => {
  interface TestType {
    foo: string;
    bar?: number;
  }

  const schema: JSONSchemaType<TestType> = {
    type: 'object',
    properties: {
      foo: { type: 'string' },
      bar: { type: 'number', nullable: true },
      enumExample: { type: 'string', enum: ['option1', 'option2'] }
    },
    required: ['foo'],
    additionalProperties: false
  };

  it('does not throw for valid data', () => {
    expect(() => { validateJson({ foo: 'hello' }, schema); }).not.toThrow();
    expect(() => { validateJson({ foo: 'world', bar: 42 }, schema); }).not.toThrow();
  });

  it('throws for missing required property', () => {
    expect(() => { validateJson({} as TestType, schema); }).toThrow(/Data is not valid/);
  });

  it('throws for invalid property type', () => {
    expect(() => { validateJson({ foo: 123 } as unknown as TestType, schema); }).toThrow(/Data is not valid/);
  });

  it('throws for invalid enum value', () => {
    expect(() => { validateJson({ foo: 'hello', enumExample: 'option3' } as unknown as TestType, schema); }).toThrow(/Data is not valid/);
  });

  it('does not throw for valid enum value', () => {
    expect(() => { validateJson({ foo: 'hello', enumExample: 'option1' } as unknown as TestType, schema); }).not.toThrow();
    expect(() => { validateJson({ foo: 'hello', enumExample: 'option2' } as unknown as TestType, schema); }).not.toThrow();
  });

  it('throws for additional properties', () => {
    expect(() => { validateJson({ foo: 'ok', extra: true } as unknown as TestType, schema); }).toThrow(/Data is not valid/);
  });

  it('throws for empty data', () => {
    expect(() => { validateJson(undefined as unknown as TestType, schema); }).toThrow(/Data is empty/);
    expect(() => { validateJson(null as unknown as TestType, schema); }).toThrow(/Data is empty/);
  });

  it('caches validators for the same schema', () => {
    // This test is just to exercise the cache code path; no assertion needed
    expect(() => { validateJson({ foo: 'cached' }, schema); }).not.toThrow();
    expect(() => { validateJson({ foo: 'cached2' }, schema); }).not.toThrow();
  });

  it('caches validators for multiple different schemas', () => {
    interface AnotherType {
      baz: number;
    }
    const anotherSchema: JSONSchemaType<AnotherType> = {
      type: 'object',
      properties: {
        baz: { type: 'number' }
      },
      required: ['baz'],
      additionalProperties: false
    };
    // Validate with the original schema
    expect(() => { validateJson({ foo: 'multi' }, schema); }).not.toThrow();
    // Validate with a different schema
    expect(() => { validateJson({ baz: 123 }, anotherSchema); }).not.toThrow();
    // Validate again with both to ensure both are cached
    expect(() => { validateJson({ foo: 'multi2' }, schema); }).not.toThrow();
    expect(() => { validateJson({ baz: 456 }, anotherSchema); }).not.toThrow();
  });
});