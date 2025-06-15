import type { DomainDataSource } from "@ocom/api-domain";
import { QueueStorage } from "@ocom/api-queue-storage";
export interface ApiContextSpec {
    //mongooseService:Exclude<ServiceMongoose, ServiceBase>;
    domainDataSource : DomainDataSource,
    queueSender: ReturnType<typeof QueueStorage>
}