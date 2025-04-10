import { MongooseSeedwork } from 'api-data-sources-mongoose-seedwork';
export declare const UserPersistence: (initializedService: MongooseSeedwork.MongooseContextFactory) => {
    EndUser: {
        EndUserUnitOfWork: import("api-domain/dist/src/domain/contexts/user/end-user").EndUserUnitOfWork;
    };
};
