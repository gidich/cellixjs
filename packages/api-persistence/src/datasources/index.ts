import { Domain } from "@ocom/api-domain";
import type { ModelsContext } from "../index.ts";
import { DomainDataSourceImplementation } from "./domain/index.ts";
import { ReadonlyDataSourceImplementation } from "./readonly/index.ts";

export type DataSources = {
    domainDataSource: ReturnType<typeof DomainDataSourceImplementation>;
    readonlyDataSource: ReturnType<typeof ReadonlyDataSourceImplementation>;
}

export type DataSourcesFactory = {
    withPassport: (passport: Domain.Passport) => DataSources,
    withReadonly: () => Omit<DataSources, 'domainDataSource'>
}

export const DataSourcesFactoryImpl = (models: ModelsContext): DataSourcesFactory => {
    const withPassport = (passport: Domain.Passport): DataSources => {
        return {
            domainDataSource: DomainDataSourceImplementation(models, passport),
            readonlyDataSource: ReadonlyDataSourceImplementation(models, passport)
        };
    };

    const withReadonly = (): Omit<DataSources, 'domainDataSource'> => {
        const readonlyPassport = Domain.PassportFactory.forReadOnly();
        return {
            readonlyDataSource: ReadonlyDataSourceImplementation(models, readonlyPassport)
        };
    }

    return {
        withPassport: withPassport,
        withReadonly: withReadonly
    }
}
