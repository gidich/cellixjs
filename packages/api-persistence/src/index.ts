import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { Models } from '@ocom/api-data-sources-mongoose-models';
import type { DomainDataSource } from '@ocom/api-domain';
import { DataSourcesImpl } from './datasources/index.ts';
import type { ReadonlyDataSource } from './datasources/readonly/index.ts';

export type ModelsContext = ReturnType<typeof Models.mongooseContextBuilder>;

export interface DataSources {
    domainDataSource: DomainDataSource;
    readonlyDataSource: ReadonlyDataSource;
}

export const Persistence = (
	initializedService: MongooseSeedwork.MongooseContextFactory,
): DataSources => {
	if (!initializedService?.service) {
		throw new Error('MongooseSeedwork.MongooseContextFactory is required');
	}

	const models: ModelsContext = {
		...Models.mongooseContextBuilder(initializedService),
	};

	return DataSourcesImpl(models);
};