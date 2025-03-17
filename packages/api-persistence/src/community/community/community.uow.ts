import { MongooseSeedwork } from 'api-data-sources-mongoose-seedwork';
import { CommunityConverter } from './community.domain-adapter';
import { CommunityRepository } from './community.repository';
import { InProcEventBusInstance, NodeEventBusInstance } from 'event-bus-seedwork-node';
import { Models } from 'api-data-sources-mongoose-models';
import { Domain } from 'api-domain';

export const getCommunityUnitOfWork = (communityModel:Models.Community.CommunityModelType): Domain.Contexts.Community.Community.CommunityUnitOfWork => {

  return new MongooseSeedwork.MongoUnitOfWork(
    communityModel, 
    new CommunityConverter(), 
    InProcEventBusInstance, 
    NodeEventBusInstance,
    CommunityRepository 
  );

}