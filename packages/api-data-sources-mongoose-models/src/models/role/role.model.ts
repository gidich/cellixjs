import { Schema, model, type Model } from 'mongoose';
import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';

export interface Role extends MongooseSeedwork.Base {
	discriminatorKey: string;
}

// TODO: Discriminator key and Version can't exist together, if we don't use version key it will fall back to __v
export const roleOptions = {
	discriminatorKey: 'roleType',
	timestamps: true,
	// versionKey: 'version',
};

const RoleSchema = new Schema<Role, Model<Role>, Role>({}, roleOptions);

export const RoleModel = model<Role>('Role', RoleSchema);
