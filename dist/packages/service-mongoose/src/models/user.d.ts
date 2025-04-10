import { Model } from 'mongoose';
interface User {
    name: string;
    email: string;
    avatar?: string;
}
export declare const UserModel: Model<User, {}, {}, {}, import("mongoose").Document<unknown, {}, User> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>;
export {};
