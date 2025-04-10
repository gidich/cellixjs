import { MongooseSeedwork } from 'api-data-sources-mongoose-seedwork';
export declare const CommunityPersistence: (initializedService: MongooseSeedwork.MongooseContextFactory) => {
    Community: {
        CommunityUnitOfWork: import("api-domain/dist/src/domain/contexts/community/community").CommunityUnitOfWork;
    };
};
