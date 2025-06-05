import { Domain } from "@ocom/api-domain";

export interface DomainDataSource {
  Community : {
    Community: {
      CommunityUnitOfWork : Domain.Contexts.Community.Community.CommunityUnitOfWork;
    }
  }
  User : {
    EndUser : {
      EndUserUnitOfWork : Domain.Contexts.User.EndUser.EndUserUnitOfWork;
    }
  }
}