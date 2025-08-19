import { useQuery } from "@apollo/client";
import { AccountsUserInfoContainerCurrentEndUserAndCreateIfNotExistsDocument, type AccountsUserInfoContainerEndUserFieldsFragment } from "../../../../generated"
import { ComponentQueryLoader } from "../../../ui/molecules/component-query-loader"
import { UserInfo } from "./user-info";

export const UserInfoContainer: React.FC = () => {
    const { loading, error, data } = useQuery(AccountsUserInfoContainerCurrentEndUserAndCreateIfNotExistsDocument);

    return (
        <ComponentQueryLoader
            loading={loading}
            error={error}
            hasData={data?.currentEndUserAndCreateIfNotExists}
            hasDataComponent={<UserInfo userData={data?.currentEndUserAndCreateIfNotExists as AccountsUserInfoContainerEndUserFieldsFragment} />}
            noDataComponent={<div>No User Data</div>}
        />
    )
}