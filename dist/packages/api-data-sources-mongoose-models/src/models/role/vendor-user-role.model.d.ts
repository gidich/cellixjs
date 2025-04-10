import { Schema, Model, PopulatedDoc, ObjectId } from 'mongoose';
import { Community } from '../community/community.model';
import { Role } from './role.model';
export interface VendorUserRoleServicePermissions {
    id?: ObjectId;
    canManageServices: boolean;
    isSystemAccount: false;
}
export interface VendorUserRoleServiceTicketPermissions {
    id?: ObjectId;
    canCreateTickets: boolean;
    canManageTickets: boolean;
    canAssignTickets: boolean;
    canWorkOnTickets: boolean;
    isEditingOwnTicket: false;
    isEditingAssignedTicket: false;
    isSystemAccount: false;
}
export interface VendorUserRoleViolationTicketPermissions {
    id?: ObjectId;
    canCreateTickets: boolean;
    canManageTickets: boolean;
    canAssignTickets: boolean;
    canWorkOnTickets: boolean;
    isEditingOwnTicket: false;
    isEditingAssignedTicket: false;
    isSystemAccount: false;
}
export interface VendorUserRolePropertyPermissions {
    id?: ObjectId;
    canManageProperties: boolean;
    canEditOwnProperty: boolean;
    isEditingOwnProperty: false;
    isSystemAccount: false;
}
export interface VendorUserRoleCommunityPermissions {
    id?: ObjectId;
    canManageRolesAndPermissions: boolean;
    canManageCommunitySettings: boolean;
    canManageSiteContent: boolean;
    canManageMembers: boolean;
    canEditOwnMemberProfile: boolean;
    canEditOwnMemberAccounts: boolean;
    isEditingOwnMemberAccount: false;
    isSystemAccount: false;
}
export interface VendorUserRolePermissions {
    id?: ObjectId;
    servicePermissions: VendorUserRoleServicePermissions;
    serviceTicketPermissions: VendorUserRoleServiceTicketPermissions;
    violationTicketPermissions: VendorUserRoleViolationTicketPermissions;
    communityPermissions: VendorUserRoleCommunityPermissions;
    propertyPermissions: VendorUserRolePropertyPermissions;
}
export interface VendorUserRole extends Role {
    community: PopulatedDoc<Community> | ObjectId;
    permissions: VendorUserRolePermissions;
    roleName: string;
    roleType?: string;
    isDefault: boolean;
}
export declare const VendorUserRoleSchema: Schema<VendorUserRole, Model<VendorUserRole, {}, {}, {}, import("mongoose").Document<unknown, {}, VendorUserRole> & VendorUserRole & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, VendorUserRole, {}, {}, {}, import("mongoose").DefaultSchemaOptions, VendorUserRole, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<VendorUserRole>> & Omit<import("mongoose").FlatRecord<VendorUserRole> & Required<{
    _id: unknown;
}> & {
    __v: number;
}, keyof VendorUserRole> & VendorUserRole>;
export declare const VendorUserRoleModel: Model<unknown, {}, {}, {}, import("mongoose").Document<unknown, {}, unknown> & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
