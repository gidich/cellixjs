import type { DomainDataSource } from '@ocom/api-domain';
export interface ApiContextSpec {
	//mongooseService:Exclude<ServiceMongoose, ServiceBase>;
	domainDataSource: DomainDataSource;
    domainDataSourceFromJwt: (validatedJwt?: string) => DomainDataSource;
}
