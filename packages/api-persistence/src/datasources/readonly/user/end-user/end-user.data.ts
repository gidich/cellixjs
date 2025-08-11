import type { Models } from "@ocom/api-data-sources-mongoose-models";
import { MongoDataSourceImpl, type MongoDataSource } from "../../mongo-data-source.ts";

export interface EndUserDataSource extends MongoDataSource<Models.User.EndUser> {}

class EndUserDataSourceImpl extends MongoDataSourceImpl<Models.User.EndUser> implements EndUserDataSource {}

export const getEndUserDataSource = (
    model: Models.User.EndUserModelType
): EndUserDataSource => {
    return new EndUserDataSourceImpl(model);
}