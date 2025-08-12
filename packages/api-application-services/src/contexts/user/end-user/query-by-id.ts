import type { ApiContextSpec } from "@ocom/api-context-spec";
import type { Models } from "@ocom/api-data-sources-mongoose-models";
import type { Domain } from "@ocom/api-domain";

export interface EndUserQueryByIdCommand {
    id: string;
    fields?: string[];
}

export const queryById = (
    infrastructureServiceRegistry: ApiContextSpec,
    _passport: Domain.Passport,
) => {
    return async (
        command: EndUserQueryByIdCommand,
    ): Promise<Models.User.EndUser | null> => {
        return await infrastructureServiceRegistry.dataSources.readonlyDataSource.User.EndUser.EndUserData.findById(command.id, {
            fields: command.fields
        })
    }
}