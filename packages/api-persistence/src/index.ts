import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { Models } from '@ocom/api-data-sources-mongoose-models';
import { type DataSources, DataSourcesFactoryImpl, type DataSourcesFactory } from './datasources/index.ts';

type ModelsContext = ReturnType<typeof Models.mongooseContextBuilder>;


const Persistence = (
	initializedService: MongooseSeedwork.MongooseContextFactory,
) => {
	if (!initializedService?.service) {
		throw new Error('MongooseSeedwork.MongooseContextFactory is required');
	}

	const models: ModelsContext = {
		...Models.mongooseContextBuilder(initializedService),
	};

	return DataSourcesFactoryImpl(models);
};

export {
    type DataSources,
    type DataSourcesFactory,
    type ModelsContext,
    Persistence
}