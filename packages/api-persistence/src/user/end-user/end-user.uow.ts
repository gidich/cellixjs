import { Domain } from '@ocom/api-domain';
import { Models } from '@ocom/api-data-sources-mongoose-models';
import { MongooseSeedwork } from '@cellix/data-sources-mongoose';
import { EndUserConverter } from './end-user.domain-adapter';
import { EndUserRepository } from './end-user.repository';
import { InProcEventBusInstance, NodeEventBusInstance } from 'event-bus-seedwork-node';




export const getEndUserUnitOfWork = (endUserModel:Models.User.EndUserModelType) : Domain.Contexts.User.EndUser.EndUserUnitOfWork  => {
  return new MongooseSeedwork.MongoUnitOfWork(
    endUserModel, 
    new EndUserConverter(), 
    InProcEventBusInstance, 
    NodeEventBusInstance,
    EndUserRepository 
  );
}

