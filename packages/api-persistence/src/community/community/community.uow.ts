import type { Domain } from '@ocom/api-domain';
import type { Models } from '@ocom/api-data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { InProcEventBusInstance, NodeEventBusInstance } from '@cellix/event-bus-seedwork-node';

import { CommunityConverter } from './community.domain-adapter.ts';
import { CommunityRepository } from './community.repository.ts';

export const getCommunityUnitOfWork = (communityModel: Models.Community.CommunityModelType): Domain.Contexts.Community.Community.CommunityUnitOfWork => {
  return new MongooseSeedwork.MongoUnitOfWork(InProcEventBusInstance, NodeEventBusInstance, communityModel, new CommunityConverter(), CommunityRepository);
};
