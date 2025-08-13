import type { ApiContextSpec } from "@ocom/api-context-spec";
import type { Domain } from "@ocom/api-domain";

export interface EndUserQueryByNameCommand {
    displayName: string;
    fields?: string[];
}

export const queryByName = (
    infrastructureServiceRegistry: ApiContextSpec,
    passport: Domain.Passport,
) => {
    return async (
        command: EndUserQueryByNameCommand,
    ): Promise<Domain.Contexts.User.EndUser.EndUserEntityReference[]> => {
        return await infrastructureServiceRegistry.dataSources.readonlyDataSource.User.EndUser.EndUserReadRepo.getByName(
            passport,
            command.displayName,
            {
                fields: command.fields
            }
        );
    }
}