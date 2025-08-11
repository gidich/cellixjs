import type { Models } from "@ocom/api-data-sources-mongoose-models";
import { MongoDataSourceImpl, type MongoDataSource } from "../../mongo-data-source.ts";

export interface CommunityDataSource extends MongoDataSource<Models.Community.Community> {}

class CommunityDataSourceImpl extends MongoDataSourceImpl<Models.Community.Community> implements CommunityDataSource {}

export const getCommunityDataSource = (
    model: Models.Community.CommunityModelType
): CommunityDataSource => {
    return new CommunityDataSourceImpl(model);
}