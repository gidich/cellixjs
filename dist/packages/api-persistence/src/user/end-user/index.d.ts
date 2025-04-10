import { MongooseSeedwork } from 'api-data-sources-mongoose-seedwork';
export declare const EndUserPersistence: (initializedService: MongooseSeedwork.MongooseContextFactory) => {
    EndUserUnitOfWork: import("api-domain/dist/src/domain/contexts/user/end-user").EndUserUnitOfWork;
};
