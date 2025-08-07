import type { Domain, DomainDataSource } from '@ocom/api-domain';
import type { TokenValidation } from '@ocom/service-token-validation';
export interface ApiContextSpec {
	//mongooseService:Exclude<ServiceMongoose, ServiceBase>;
	domainDataSource: DomainDataSource;
    domainDataSourceFromJwt: (validatedJwt: Domain.Types.VerifiedJwt | null) => DomainDataSource;
    tokenValidationService: TokenValidation;
}
