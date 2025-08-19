import { Domain, type DomainDataSource } from "@ocom/api-domain";
import type { ModelsContext } from "../index.ts";
import { DomainDataSourceImplementation } from "./domain/index.ts";
import { type ReadonlyDataSource, ReadonlyDataSourceImplementation } from "./readonly/index.ts";

export type DataSources = {
    domainDataSource: DomainDataSource;
    readonlyDataSource: ReadonlyDataSource;
}

export type DataSourcesFactory = {
    withPassport: (passport: Domain.Passport) => DataSources,
    withSystemPassport: () => Omit<DataSources, 'domainDataSource'>
}

export const DataSourcesFactoryImpl = (models: ModelsContext): DataSourcesFactory => {
    const withPassport = (passport: Domain.Passport): DataSources => {
        return {
            domainDataSource: DomainDataSourceImplementation(models, passport),
            readonlyDataSource: ReadonlyDataSourceImplementation(models, passport)
        };
    };

    const withSystemPassport = (): Omit<DataSources, 'domainDataSource'> => {
        const systemPassport = Domain.PassportFactory.forSystem();
        return {
            readonlyDataSource: ReadonlyDataSourceImplementation(models, systemPassport)
        };
    }

    return {
        withPassport: withPassport,
        withSystemPassport: withSystemPassport
    }
}
