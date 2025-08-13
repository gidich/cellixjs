import type { Domain } from "@ocom/api-domain";
import type { ModelsContext } from "../index.ts";
import { DomainDataSourceImplementation } from "./domain/index.ts";
import { ReadonlyDataSourceImplementation } from "./readonly/index.ts";

// export const DataSourcesImpl = (models: ModelsContext): DataSources => ({
//     domainDataSource: DomainDataSourceImplementation(models),
//     readonlyDataSource: ReadonlyDataSourceImplementation(models)
// });

export type DataSources = {
    domainDataSource: ReturnType<typeof DomainDataSourceImplementation>;
    readonlyDataSource: ReturnType<typeof ReadonlyDataSourceImplementation>;
}

export type DataSourcesFactory = {
    withPassport: (passport: Domain.Passport) => DataSources
}

export const DataSourcesFactoryImpl = (models: ModelsContext): DataSourcesFactory => {
    function withPassport(passport: Domain.Passport): DataSources {
        return {
            domainDataSource: DomainDataSourceImplementation(models, passport),
            readonlyDataSource: ReadonlyDataSourceImplementation(models, passport)
        };
    };

    return {
        withPassport: withPassport
    }
}
