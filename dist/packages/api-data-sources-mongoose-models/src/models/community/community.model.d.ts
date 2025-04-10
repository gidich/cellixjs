import mongoose, { ObjectId, PopulatedDoc } from 'mongoose';
import { MongooseSeedwork } from 'api-data-sources-mongoose-seedwork';
import * as EndUser from '../user/end-user.model';
export interface Community extends MongooseSeedwork.Base {
    name: string;
    domain: string;
    whiteLabelDomain: string;
    handle: string;
    createdBy: PopulatedDoc<EndUser.EndUser> | ObjectId;
}
export declare const CommunityModelName = "Community";
export declare const CommunityModelFactory: (initializedService: MongooseSeedwork.MongooseContextFactory) => mongoose.Model<Community, {}, {}, {}, mongoose.Document<unknown, {}, Community> & Community & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export type CommunityModelType = ReturnType<typeof CommunityModelFactory>;
