import type { Domain } from '@ocom/api-domain';
import type { ModelsContext } from '../../../../index.ts';
import { EndUserDataSourceImpl, type EndUserDataSource } from './end-user.data.ts';
import type { FindOneOptions, FindOptions } from '../../mongo-data-source.ts';
import { EndUserConverter } from '../../../domain/user/end-user/end-user.domain-adapter.ts';

export interface EndUserReadRepository {
    getAll: (options?: FindOptions) => Promise<Domain.Contexts.User.EndUser.EndUserEntityReference[]>;
    getById: (id: string, options?: FindOneOptions) => Promise<Domain.Contexts.User.EndUser.EndUserEntityReference | null>;
    getByName: (displayName: string, options?: FindOneOptions) => Promise<Domain.Contexts.User.EndUser.EndUserEntityReference[]>;
}

export class EndUserReadRepositoryImpl implements EndUserReadRepository {
    private readonly mongoDataSource: EndUserDataSource;
    private readonly converter: EndUserConverter;
    private readonly passport: Domain.Passport;

    constructor(models: ModelsContext, passport: Domain.Passport) {
        this.mongoDataSource = new EndUserDataSourceImpl(models.User.EndUser);
        this.converter = new EndUserConverter();
        this.passport = passport;
    }

    async getAll(options?: FindOptions): Promise<Domain.Contexts.User.EndUser.EndUserEntityReference[]> {
        return await this.mongoDataSource.find({}, options);
    }

    async getById(id: string, options?: FindOneOptions): Promise<Domain.Contexts.User.EndUser.EndUserEntityReference | null> {
        const result = await this.mongoDataSource.findById(id, options);
        if (!result) { return null; }
        return this.converter.toEntityReference(result, this.passport);
    }

    async getByName(displayName: string, options?: FindOneOptions): Promise<Domain.Contexts.User.EndUser.EndUserEntityReference[]> {
        const result = await this.mongoDataSource.find({ displayName }, options);
        return result.map(item => this.converter.toEntityReference(item, this.passport));
    }
}

export const getEndUserReadRepository = (
    models: ModelsContext,
    passport: Domain.Passport
) => {
    return new EndUserReadRepositoryImpl(models, passport);
};