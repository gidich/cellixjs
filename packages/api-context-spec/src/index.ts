import type { DomainDataSource } from "api-domain";
export interface ApiContextSpec {
    //mongooseService:Exclude<ServiceMongoose, ServiceBase>;
    domainDataSource : DomainDataSource
}