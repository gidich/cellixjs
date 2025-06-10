import { Domain } from '@ocom/api-domain';
import { Models } from '@ocom/api-data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { InProcEventBusInstance, NodeEventBusInstance } from '@cellix/event-bus-seedwork-node';

import { EndUserConverter } from './end-user.domain-adapter.ts';
import { EndUserRepository } from './end-user.repository.ts';


export const getEndUserUnitOfWork = (endUserModel:Models.User.EndUserModelType) : Domain.Contexts.User.EndUser.EndUserUnitOfWork  => {

  return new MongooseSeedwork.MongoUnitOfWork(
    InProcEventBusInstance, 
    NodeEventBusInstance,
    endUserModel, 
    new EndUserConverter(), 
    EndUserRepository 
  );

}