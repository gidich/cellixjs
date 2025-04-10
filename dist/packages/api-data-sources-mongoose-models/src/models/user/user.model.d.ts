import { Model } from 'mongoose';
import { MongooseSeedwork } from 'api-data-sources-mongoose-seedwork';
export interface User extends MongooseSeedwork.Base {
    discriminatorKey: string;
}
export declare const userOptions: {
    discriminatorKey: string;
    timestamps: boolean;
};
export declare const UserModelName = "User";
export declare const UserModelFactory: (initializedService: MongooseSeedwork.MongooseContextFactory) => Model<User, {}, {}, {}, import("mongoose").Document<unknown, {}, User> & User & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export type UserModelType = ReturnType<typeof UserModelFactory>;
