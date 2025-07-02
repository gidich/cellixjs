import { Schema, type Model, type PopulatedDoc, type ObjectId } from 'mongoose';
import {
	type Community,
	CommunityModelName
} from '../community/community.model.ts';
import { type Role, RoleModel, roleOptions } from './role.model.ts';

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

export const VendorUserRoleSchema = new Schema<
	VendorUserRole,
	Model<VendorUserRole>,
	VendorUserRole
>(
	{
		community: {
			type: Schema.Types.ObjectId,
			ref: CommunityModelName,
			required: true,
			index: true
		},
		permissions: {
			servicePermissions: {
				canManageServices: { type: Boolean, required: true, default: false }
			},
			serviceTicketPermissions: {
				canCreateTickets: { type: Boolean, required: true, default: false },
				canManageTickets: { type: Boolean, required: true, default: false },
				canAssignTickets: { type: Boolean, required: true, default: false },
				canWorkOnTickets: {
					type: Boolean,
					required: true,
					default: false,
					index: true
				}
			},
			violationTicketPermissions: {
				canCreateTickets: { type: Boolean, required: true, default: false },
				canManageTickets: { type: Boolean, required: true, default: false },
				canAssignTickets: { type: Boolean, required: true, default: false },
				canWorkOnTickets: {
					type: Boolean,
					required: true,
					default: false,
					index: true
				}
			},
			communityPermissions: {
				canManageRolesAndPermissions: {
					type: Boolean,
					required: true,
					default: false
				},
				canManageCommunitySettings: {
					type: Boolean,
					required: true,
					default: false
				},
				canManageSiteContent: { type: Boolean, required: true, default: false },
				canManageMembers: { type: Boolean, required: true, default: false },
				canEditOwnMemberProfile: {
					type: Boolean,
					required: true,
					default: false
				},
				canEditOwnMemberAccounts: {
					type: Boolean,
					required: true,
					default: false
				}
			},
			propertyPermissions: {
				canManageProperties: { type: Boolean, required: true, default: false },
				canEditOwnProperty: { type: Boolean, required: true, default: false }
			}
		},
		schemaVersion: { type: String, default: '1.0.0' },
		roleName: { type: String, required: true, maxlength: 50 },
		isDefault: { type: Boolean, required: true, default: false }
	},
	roleOptions
).index({ roleName: 1, community: 1 }, { unique: true });

export const VendorUserRoleModel = RoleModel.discriminator(
	'vendor-user-roles',
	VendorUserRoleSchema
);
