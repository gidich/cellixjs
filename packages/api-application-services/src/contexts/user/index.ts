import type { ApiContextSpec } from "@ocom/api-context-spec"
import type { Domain } from "@ocom/api-domain"
import { EndUser, type EndUserApplicationService } from "./end-user/index.ts"

export interface UserApplicationService {
    EndUser: EndUserApplicationService;
}

export const User = (
    infrastructureServiceRegistry: ApiContextSpec,
    passport: Domain.Passport
): UserApplicationService => {
    return {
        EndUser: EndUser(infrastructureServiceRegistry, passport),
    }
}