import type { ServiceMongoose } from "service-mongoose";
import type { ServiceBase } from "api-services-spec";
export interface ApiContextSpec {
    mongooseService: Exclude<ServiceMongoose, ServiceBase>;
}
