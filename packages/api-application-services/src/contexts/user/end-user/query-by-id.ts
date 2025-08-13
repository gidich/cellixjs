import type { ApiContextSpec } from "@ocom/api-context-spec";
import type { Domain } from "@ocom/api-domain";

export interface EndUserQueryByIdCommand {
    id: string;
    fields?: string[];
}

export const queryById = (
    infrastructureServiceRegistry: ApiContextSpec,
    passport: Domain.Passport,
) => {
    return async (
        command: EndUserQueryByIdCommand,
    ): Promise<Domain.Contexts.User.EndUser.EndUserEntityReference | null> => {
        return await infrastructureServiceRegistry.dataSources.readonlyDataSource.User.EndUser.EndUserReadRepo.getById(
            passport,
            command.id, 
            { fields: command.fields }
        )
    }
}