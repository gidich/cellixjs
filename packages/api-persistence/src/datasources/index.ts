import type { DataSources, ModelsContext } from "../index.ts";
import { DomainDataSourceImplementation } from "./domain/index.ts";
import { ReadonlyDataSourceImplementation } from "./readonly/index.ts";

export const DataSourcesImpl = (models: ModelsContext): DataSources => ({
    domainDataSource: DomainDataSourceImplementation(models),
    readonlyDataSource: ReadonlyDataSourceImplementation(models)
});
