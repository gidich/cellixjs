import { Model } from 'mongoose';
import { MongooseSeedwork } from 'api-data-sources-mongoose-seedwork';
export interface Role extends MongooseSeedwork.Base {
    discriminatorKey: string;
}
export declare const roleOptions: {
    discriminatorKey: string;
    timestamps: boolean;
};
export declare const RoleModel: Model<Role, {}, {}, {}, import("mongoose").Document<unknown, {}, Role> & Role & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
