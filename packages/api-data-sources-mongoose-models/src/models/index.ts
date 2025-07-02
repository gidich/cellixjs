export * as Community from './community/index.ts';
export * as Role from './role/index.ts';
export * as User from './user/index.ts';
import type { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { CommunityModelFactory } from './community/index.ts';

export const mongooseContextBuilder = (
	initializedService: MongooseSeedwork.MongooseContextFactory
) => {
	return {
		Community: {
			Community: CommunityModelFactory(initializedService)
		}
	};
};
/*
export type MongooseContext = ReturnType<typeof mongooseContextBuilder>;

Community.CommunityModel.findById('123').then((doc) => {
  doc?.whiteLabelDomain
  doc?.createdBy
});

let x = mongooseContextBuilder(null as any).Community.Community;
x.findById('123').then((doc) => {
  doc?.whiteLabelDomain
  doc?.createdBy
  console.log(doc);
});

*/
