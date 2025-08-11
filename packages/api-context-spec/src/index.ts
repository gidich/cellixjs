import type { DataSources } from '@ocom/api-persistence';
import type { TokenValidation } from '@ocom/service-token-validation';
export interface ApiContextSpec {
	//mongooseService:Exclude<ServiceMongoose, ServiceBase>;
	dataSources: DataSources; // NOT an infrastructure service
    tokenValidationService: TokenValidation;
}
