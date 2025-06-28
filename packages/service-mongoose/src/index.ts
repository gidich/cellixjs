import mongoose, { type Mongoose, type ConnectOptions } from 'mongoose';
import type { ServiceBase } from '@cellix/api-services-spec';
import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';

export class ServiceMongoose
	implements
		ServiceBase<MongooseSeedwork.MongooseContextFactory>,
		MongooseSeedwork.MongooseContextFactory
{
	private readonly uri: string;
	private readonly options: ConnectOptions;
	private serviceInternal: Mongoose | undefined;
	constructor(uri: string, options?: ConnectOptions) {
		if (!uri || uri.trim() === '') {
			throw new Error('MongoDB uri is required');
		}
		this.uri = uri;
		this.options = options ?? {};
	}
	public async startUp() {
		this.serviceInternal = await mongoose.connect(this.uri, this.options);
		return this;
	}
	public async shutDown() {
		if (!this.serviceInternal) {
			throw new Error(
				'ServiceMongoose is not started - shutdown cannot proceed',
			);
		}
		await this.serviceInternal.disconnect();
		console.log('ServiceMongoose stopped');
	}
	public get service(): Mongoose {
		if (!this.serviceInternal) {
			throw new Error('ServiceMongoose is not started - cannot access service');
		}
		return this.serviceInternal;
	}
}
