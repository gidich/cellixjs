import type { DomainDataSource } from '@ocom/api-domain';
import type { TokenValidation } from '@ocom/service-token-validation';
export interface ApiContextSpec {
	//mongooseService:Exclude<ServiceMongoose, ServiceBase>;
	domainDataSource: DomainDataSource; // NOT an infrastructure service
    tokenValidationService: TokenValidation;
}
