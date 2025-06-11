import type { DomainDataSource } from "@ocom/api-domain";
import type { QueueSender } from "@cellix/service-queue-sender";
export interface ApiContextSpec {
    //mongooseService:Exclude<ServiceMongoose, ServiceBase>;
    domainDataSource : DomainDataSource,
    queueSender: QueueSender
}