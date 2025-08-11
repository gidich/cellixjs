import type { MongooseSeedwork } from "@cellix/data-sources-mongoose";
import { DomainDataSourceImplementation } from "./domain/index.ts";
import type { DataSources } from "../index.ts";
import { ReadonlyDataSourceImplementation } from "./readonly/index.ts";

export const DataSourcesImpl = (
    initializedService: MongooseSeedwork.MongooseContextFactory
): DataSources => {
    return {
        domainDataSource: DomainDataSourceImplementation(initializedService),
        readonlyDataSource: ReadonlyDataSourceImplementation(initializedService)
    };
};
