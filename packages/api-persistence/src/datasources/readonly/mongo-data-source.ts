import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import type { FilterQuery, Model } from 'mongoose';

export interface MongoDataSource<TDoc extends MongooseSeedwork.Base> {
    find(filter: Partial<TDoc>, fields?: (keyof TDoc)[]): Promise<TDoc[]>;
    findOne(filter: Partial<TDoc>, fields?: (keyof TDoc)[]): Promise<TDoc | null>;
    findById(id: string, fields?: (keyof TDoc)[]): Promise<TDoc | null>;
}

export class MongoDataSourceImpl<TDoc extends MongooseSeedwork.Base> implements MongoDataSource<TDoc> {
    private readonly model: Model<TDoc>;
    constructor(model: Model<TDoc>) {
        this.model = model;
    }

    private buildProjection(fields?: (keyof TDoc)[], include: boolean = true): Record<string, 1 | 0> {
        const projection: Record<string, 1 | 0> = {};
        if (fields) {
            for (const key of fields) {
                projection[key as string] = include ? 1 : 0;
            }
        }
        return projection;
    }

    private buildFilterQuery(filter: Partial<TDoc>): FilterQuery<TDoc> {
        const query: FilterQuery<TDoc> = {};
        for (const key of Object.keys(filter)) {
            const value = filter[key as keyof TDoc];
            if (value !== undefined) {
                query[key as keyof FilterQuery<TDoc>] = value as FilterQuery<TDoc>[keyof TDoc];
            }
        }
        return query;
    }

    async find(filter: FilterQuery<TDoc>, fields?: (keyof TDoc)[]): Promise<TDoc[]> {
        return await this.model.find(this.buildFilterQuery(filter), this.buildProjection(fields)).exec();
    }

    async findOne(filter: FilterQuery<TDoc>, fields?: (keyof TDoc)[]): Promise<TDoc | null> {
        return await this.model.findOne(this.buildFilterQuery(filter), this.buildProjection(fields)).exec();
    }

    async findById(id: string, fields?: (keyof TDoc)[]): Promise<TDoc | null> {
        return await this.model.findById(id, this.buildProjection(fields)).exec();
    }

}