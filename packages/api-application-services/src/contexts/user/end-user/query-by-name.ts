import type { ApiContextSpec } from "@ocom/api-context-spec";
import type { Models } from "@ocom/api-data-sources-mongoose-models";
import type { Domain } from "@ocom/api-domain";

export interface EndUserQueryByNameCommand {
    displayName: string;
    fields?: string[];
}

export const queryByName = (
    infrastructureServiceRegistry: ApiContextSpec,
    _passport: Domain.Passport,
) => {
    return async (
        command: EndUserQueryByNameCommand,
    ): Promise<Models.User.EndUser[]> => {
        return await infrastructureServiceRegistry.dataSources.readonlyDataSource.User.EndUser.EndUserData.find(
            {
                displayName: command.displayName
            },
            {
                fields: command.fields
            }
        );
    }
}