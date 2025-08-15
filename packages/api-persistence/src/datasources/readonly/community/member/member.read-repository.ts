import { MongooseSeedwork } from '@cellix/data-sources-mongoose'; 
import type { Domain } from '@ocom/api-domain';
import type { ModelsContext } from '../../../../index.ts';
import { MemberConverter } from '../../../domain/community/member/member.domain-adapter.ts';
import type { FindOneOptions, FindOptions } from '../../mongo-data-source.ts';
import { type MemberDataSource, MemberDataSourceImpl } from './member.data.ts';



export interface MemberReadRepository {
    getByCommunityId: (communityId: string, options?: FindOptions) => Promise<Domain.Contexts.Community.Member.MemberEntityReference[]>;
    getById: (id: string, options?: FindOneOptions) => Promise<Domain.Contexts.Community.Member.MemberEntityReference | null>;
    getByIdWithRole: (id: string, options?: FindOneOptions) => Promise<Domain.Contexts.Community.Member.MemberEntityReference | null>;
}

export class MemberReadRepositoryImpl implements MemberReadRepository {
    private readonly mongoDataSource: MemberDataSource;
    private readonly converter: MemberConverter;
    private readonly passport: Domain.Passport;

    /**
     * Constructs a new MemberReadRepositoryImpl.
     * @param models - The models context containing the Member model.
     * @param passport - The passport object for domain access.
     */
    constructor(models: ModelsContext, passport: Domain.Passport) {
        this.mongoDataSource = new MemberDataSourceImpl(models.Community.Member);
        this.converter = new MemberConverter();
        this.passport = passport;
    }

    /**
     * Retrieves all Member entities for a given community ID.
     * @param communityId - The ID of the community to retrieve members for.
     * @param options - Optional find options for querying.
     * @returns A promise that resolves to an array of MemberEntityReference objects that belong to the specified community.
     */
    async getByCommunityId(communityId: string, options?: FindOptions): Promise<Domain.Contexts.Community.Member.MemberEntityReference[]> {
        const result = await this.mongoDataSource.find({ community: new MongooseSeedwork.ObjectId(communityId) }, options);
        return result.map(doc => this.converter.toDomain(doc, this.passport));
    }

    /**
     * Retrieves a Member entity by its ID.
     * @param id - The ID of the Member entity.
     * @param options - Optional find options for querying.
     * @returns A promise that resolves to a MemberEntityReference object or null if not found.
     */
    async getById(id: string, options?: FindOneOptions): Promise<Domain.Contexts.Community.Member.MemberEntityReference | null> {
        const result = await this.mongoDataSource.findById(id, options);
        if (!result) { return null; }
        return this.converter.toDomain(result, this.passport);
    }

    /**
     * Retrieves a Member entity by its ID, including the 'createdBy' field.
     * @param id - The ID of the Member entity.
     * @param options - Optional find options for querying.
     * @returns A promise that resolves to a MemberEntityReference object or null if not found.
     */
    async getByIdWithRole(id: string, options?: FindOneOptions): Promise<Domain.Contexts.Community.Member.MemberEntityReference | null> {
        const finalOptions: FindOneOptions = {
            ...options,
            populateFields: ['role']
        };
        const result = await this.mongoDataSource.findById(id, finalOptions);
        if (!result) { return null; }
        return this.converter.toDomain(result, this.passport);
    }
}

export const getMemberReadRepository = (
    models: ModelsContext,
    passport: Domain.Passport
) => {
    return new MemberReadRepositoryImpl(models, passport);
};