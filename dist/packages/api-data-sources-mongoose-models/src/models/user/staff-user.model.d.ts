import { Model, ObjectId, PopulatedDoc, Schema } from "mongoose";
import { StaffRole } from "../role/staff-role.model";
import { User, UserModelType } from './user.model';
export interface StaffUser extends User {
    role?: PopulatedDoc<StaffRole> | ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    displayName: string;
    externalId: string;
    userType?: string;
    accessBlocked: boolean;
    tags?: string[];
}
export declare const StaffUserSchema: Schema<StaffUser, Model<StaffUser, {}, {}, {}, import("mongoose").Document<unknown, {}, StaffUser> & StaffUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, StaffUser, {}, {}, {}, import("mongoose").DefaultSchemaOptions, StaffUser, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<StaffUser>> & Omit<import("mongoose").FlatRecord<StaffUser> & Required<{
    _id: unknown;
}> & {
    __v: number;
}, keyof StaffUser> & StaffUser>;
export declare const StaffUserModelName: string;
export declare const StaffUserModelFactory: (UserModel: UserModelType) => Model<unknown, {}, {}, {}, import("mongoose").Document<unknown, {}, unknown> & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export type StaffUserModelType = ReturnType<typeof StaffUserModelFactory>;
