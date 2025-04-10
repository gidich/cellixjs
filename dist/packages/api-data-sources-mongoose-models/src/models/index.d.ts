export * as Community from './community';
export * as Role from './role';
export * as User from './user';
import { MongooseSeedwork } from 'api-data-sources-mongoose-seedwork';
export declare const mongooseContextBuilder: (initializedService: MongooseSeedwork.MongooseContextFactory) => {
    Community: {
        Community: import("mongoose").Model<import("./community").Community, {}, {}, {}, import("mongoose").Document<unknown, {}, import("./community").Community> & import("./community").Community & Required<{
            _id: unknown;
        }> & {
            __v: number;
        }, any>;
    };
};
