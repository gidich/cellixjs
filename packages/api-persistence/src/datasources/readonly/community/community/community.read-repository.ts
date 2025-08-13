import type { Domain } from '@ocom/api-domain';
import type { ModelsContext } from '../../../../index.ts';
import { CommunityDataSourceImpl, type CommunityDataSource } from './community.data.ts';
import type { FindOneOptions, FindOptions } from '../../mongo-data-source.ts';
import { CommunityConverter } from '../../../domain/community/community/community.domain-adapter.ts';

export interface CommunityReadRepository {
    getAll: (options?: FindOptions) => Promise<Domain.Contexts.Community.Community.CommunityEntityReference[]>;
    getById: (id: string, options?: FindOneOptions) => Promise<Domain.Contexts.Community.Community.CommunityEntityReference | null>;
    getByIdWithCreatedBy: (id: string, options?: FindOneOptions) => Promise<Domain.Contexts.Community.Community.CommunityEntityReference | null>;
}

export class CommunityReadRepositoryImpl implements CommunityReadRepository {
    private readonly mongoDataSource: CommunityDataSource;
    private readonly converter: CommunityConverter;
    private readonly passport: Domain.Passport;

    /**
     * Constructs a new CommunityReadRepositoryImpl.
     * @param models - The models context containing the Community model.
     * @param passport - The passport object for domain access.
     */
    constructor(models: ModelsContext, passport: Domain.Passport) {
        this.mongoDataSource = new CommunityDataSourceImpl(models.Community.Community);
        this.converter = new CommunityConverter();
        this.passport = passport;
    }

    /**
     * Retrieves all Community entities.
     * @param options - Optional find options for querying.
     * @returns A promise that resolves to an array of CommunityEntityReference objects.
     */
    async getAll(options?: FindOptions): Promise<Domain.Contexts.Community.Community.CommunityEntityReference[]> {
        const result = await this.mongoDataSource.find({}, options);
        return result.map(doc => this.converter.toDomain(doc, this.passport));
    }

    /**
     * Retrieves a Community entity by its ID.
     * @param id - The ID of the Community entity.
     * @param options - Optional find options for querying.
     * @returns A promise that resolves to a CommunityEntityReference object or null if not found.
     */
    async getById(id: string, options?: FindOneOptions): Promise<Domain.Contexts.Community.Community.CommunityEntityReference | null> {
        const result = await this.mongoDataSource.findById(id, options);
        if (!result) { return null; }
        return this.converter.toDomain(result, this.passport);
    }

    /**
     * Retrieves a Community entity by its ID, including the 'createdBy' field.
     * @param id - The ID of the Community entity.
     * @param options - Optional find options for querying.
     * @returns A promise that resolves to a CommunityEntityReference object or null if not found.
     */
    async getByIdWithCreatedBy(id: string, options?: FindOneOptions): Promise<Domain.Contexts.Community.Community.CommunityEntityReference | null> {
        const finalOptions: FindOneOptions = {
            ...options,
            populateFields: ['createdBy']
        };
        const result = await this.mongoDataSource.findById(id, finalOptions);
        if (!result) { return null; }
        return this.converter.toDomain(result, this.passport);
    }
}

export const getCommunityReadRepository = (
    models: ModelsContext,
    passport: Domain.Passport
) => {
    return new CommunityReadRepositoryImpl(models, passport);
};