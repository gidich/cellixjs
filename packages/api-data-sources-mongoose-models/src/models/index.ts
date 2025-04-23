export * as Community from './community';
export * as Role from './role';
export * as User from './user';
import { MongooseSeedwork } from '../../../cellix-data-sources-mongoose/dist/src';
import { CommunityModelFactory } from './community';




export const mongooseContextBuilder = ( initializedService :MongooseSeedwork.MongooseContextFactory) => {
  return {
    Community: {
      Community : CommunityModelFactory(initializedService)
    }
  };
}
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