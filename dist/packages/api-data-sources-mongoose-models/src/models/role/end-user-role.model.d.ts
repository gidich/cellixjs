import { Schema, Model, PopulatedDoc, ObjectId } from 'mongoose';
import { Community } from '../community/community.model';
import { Role } from './role.model';
export interface EndUserRoleServicePermissions {
    id?: ObjectId;
    canManageServices: boolean;
    isSystemAccount: false;
}
export interface EndUserRoleServiceTicketPermissions {
    id?: ObjectId;
    canCreateTickets: boolean;
    canManageTickets: boolean;
    canAssignTickets: boolean;
    canWorkOnTickets: boolean;
    isEditingOwnTicket: false;
    isEditingAssignedTicket: false;
    isSystemAccount: false;
}
export interface EndUserRoleViolationTicketPermissions {
    id?: ObjectId;
    canCreateTickets: boolean;
    canManageTickets: boolean;
    canAssignTickets: boolean;
    canWorkOnTickets: boolean;
    isEditingOwnTicket: false;
    isEditingAssignedTicket: false;
    isSystemAccount: false;
}
export interface EndUserRolePropertyPermissions {
    id?: ObjectId;
    canManageProperties: boolean;
    canEditOwnProperty: boolean;
    isEditingOwnProperty: false;
    isSystemAccount: false;
}
export interface EndUserRoleCommunityPermissions {
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
export interface EndUserRolePermissions {
    id?: ObjectId;
    servicePermissions: EndUserRoleServicePermissions;
    serviceTicketPermissions: EndUserRoleServiceTicketPermissions;
    violationTicketPermissions: EndUserRoleViolationTicketPermissions;
    communityPermissions: EndUserRoleCommunityPermissions;
    propertyPermissions: EndUserRolePropertyPermissions;
}
export interface EndUserRole extends Role {
    community: PopulatedDoc<Community> | ObjectId;
    permissions: EndUserRolePermissions;
    roleName: string;
    roleType?: string;
    isDefault: boolean;
}
export declare const EndUserRoleSchema: Schema<EndUserRole, Model<EndUserRole, {}, {}, {}, import("mongoose").Document<unknown, {}, EndUserRole> & EndUserRole & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, EndUserRole, {}, {}, {}, import("mongoose").DefaultSchemaOptions, EndUserRole, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<EndUserRole>> & Omit<import("mongoose").FlatRecord<EndUserRole> & Required<{
    _id: unknown;
}> & {
    __v: number;
}, keyof EndUserRole> & EndUserRole>;
export declare const EndUserRoleModel: Model<unknown, {}, {}, {}, import("mongoose").Document<unknown, {}, unknown> & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
