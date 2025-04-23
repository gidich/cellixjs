import { MongooseSeedwork } from '../../../../cellix-data-sources-mongoose/dist/src';
import { EndUserConverter } from './end-user.domain-adapter';
import { EndUserRepository } from './end-user.repository';
import { InProcEventBusInstance, NodeEventBusInstance } from 'event-bus-seedwork-node';
import { Models } from 'api-data-sources-mongoose-models';
import { Domain } from 'api-domain';



export const getEndUserUnitOfWork = (endUserModel:Models.User.EndUserModelType) : Domain.Contexts.User.EndUser.EndUserUnitOfWork  => {
  return new MongooseSeedwork.MongoUnitOfWork(
    endUserModel, 
    new EndUserConverter(), 
    InProcEventBusInstance, 
    NodeEventBusInstance,
    EndUserRepository 
  );
}

