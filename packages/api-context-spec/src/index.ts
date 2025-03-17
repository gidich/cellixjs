import type { ServiceMongoose } from "service-mongoose";
import type { ServiceBase } from "api-services-spec";
import type { DomainDataSource } from "api-domain";
export interface ApiContextSpec {
    //mongooseService:Exclude<ServiceMongoose, ServiceBase>;
    domainDataSource : DomainDataSource
}