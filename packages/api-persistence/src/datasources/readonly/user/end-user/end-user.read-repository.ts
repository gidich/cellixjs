import type { Domain } from '@ocom/api-domain';
import type { ModelsContext } from '../../../../index.ts';
import { EndUserDataSourceImpl, type EndUserDataSource } from './end-user.data.ts';
import type { FindOneOptions, FindOptions } from '../../mongo-data-source.ts';
import { EndUserConverter } from '../../../domain/user/end-user/end-user.domain-adapter.ts';

export interface EndUserReadRepository {
    getAll: (options?: FindOptions) => Promise<Domain.Contexts.User.EndUser.EndUserEntityReference[]>;
    getById: (passport: Domain.Passport, id: string, options?: FindOneOptions) => Promise<Domain.Contexts.User.EndUser.EndUserEntityReference | null>;
    getByName: (passport: Domain.Passport, displayName: string, options?: FindOneOptions) => Promise<Domain.Contexts.User.EndUser.EndUserEntityReference[]>;
}

export class EndUserReadRepositoryImpl implements EndUserReadRepository {
    private readonly mongoDataSource: EndUserDataSource;
    private readonly converter: EndUserConverter;

    constructor(models: ModelsContext, ) {
        this.mongoDataSource = new EndUserDataSourceImpl(models.User.EndUser);
        this.converter = new EndUserConverter();
    }

    async getAll(options?: FindOptions): Promise<Domain.Contexts.User.EndUser.EndUserEntityReference[]> {
        return await this.mongoDataSource.find({}, options);
    }

    async getById(passport: Domain.Passport, id: string, options?: FindOneOptions): Promise<Domain.Contexts.User.EndUser.EndUserEntityReference | null> {
        const result = await this.mongoDataSource.findById(id, options);
        if (!result) { return null; }
        return this.converter.toEntityReference(result, passport);
    }

    async getByName(passport: Domain.Passport, displayName: string, options?: FindOneOptions): Promise<Domain.Contexts.User.EndUser.EndUserEntityReference[]> {
        const result = await this.mongoDataSource.find({ displayName }, options);
        return result.map(item => this.converter.toEntityReference(item, passport));
    }
}

export const getEndUserReadRepository = (
    models: ModelsContext
) => {
    return new EndUserReadRepositoryImpl(models);
};