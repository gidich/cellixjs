import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { DomainDataSource } from '@ocom/api-domain';
import { DataSourcesImpl } from './datasources/index.ts';
import type { ReadonlyDataSource } from './datasources/readonly/index.ts';

export interface DataSources {
    domainDataSource: DomainDataSource;
    readonlyDataSource: ReadonlyDataSource;
}

export const Persistence = (
	initializedService: MongooseSeedwork.MongooseContextFactory,
): DataSources => {
	// [NN] [ESLINT] disabling the ESLint rule here to ensure that the initializedService is checked for null or undefined
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (!initializedService?.service) {
		throw new Error('MongooseSeedwork.MongooseContextFactory is required');
	}

    // expose domain data source and readonly data source (wrappers for mongoose find, findOne, findById, allows projection)

    // create a generic base MongoDataSource for exposing methods like find, findById and findOne, allowing the ability to specify projection on each

    // each collection should implement its own data source and wire through imports similar to the DomainDataSource

    // top level exports object containing domainDataSource and readonlyDataSource

	return DataSourcesImpl(initializedService);
};