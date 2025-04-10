import { Models } from 'api-data-sources-mongoose-models';
import { Domain } from 'api-domain';
export declare const getEndUserUnitOfWork: (endUserModel: Models.User.EndUserModelType) => Domain.Contexts.User.EndUser.EndUserUnitOfWork;
