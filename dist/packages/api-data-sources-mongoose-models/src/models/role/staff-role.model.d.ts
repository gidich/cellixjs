import { Schema, Model, ObjectId } from 'mongoose';
import { Role } from './role.model';
export interface StaffRoleServicePermissions {
    id?: ObjectId;
}
export interface StaffRoleServiceTicketPermissions {
    id?: ObjectId;
}
export interface StaffRoleViolationTicketPermissions {
    id?: ObjectId;
}
export interface StaffRolePropertyPermissions {
    id?: ObjectId;
}
export interface StaffRoleCommunityPermissions {
    id?: ObjectId;
    canManageStaffRolesAndPermissions: boolean;
    canManageAllCommunities: boolean;
    canDeleteCommunities: boolean;
    canChangeCommunityOwner: boolean;
    canReIndexSearchCollections: boolean;
}
export interface StaffRolePermissions {
    id?: ObjectId;
    servicePermissions: StaffRoleServicePermissions;
    serviceTicketPermissions: StaffRoleServiceTicketPermissions;
    violationTicketPermissions: StaffRoleViolationTicketPermissions;
    communityPermissions: StaffRoleCommunityPermissions;
    propertyPermissions: StaffRolePropertyPermissions;
}
export interface StaffRole extends Role {
    permissions: StaffRolePermissions;
    roleName: string;
    roleType?: string;
    isDefault: boolean;
}
export declare const StaffRoleSchema: Schema<StaffRole, Model<StaffRole, {}, {}, {}, import("mongoose").Document<unknown, {}, StaffRole> & StaffRole & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, StaffRole, {}, {}, {}, import("mongoose").DefaultSchemaOptions, StaffRole, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<StaffRole>> & Omit<import("mongoose").FlatRecord<StaffRole> & Required<{
    _id: unknown;
}> & {
    __v: number;
}, keyof StaffRole> & StaffRole>;
export declare const StaffRoleModel: Model<unknown, {}, {}, {}, import("mongoose").Document<unknown, {}, unknown> & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
