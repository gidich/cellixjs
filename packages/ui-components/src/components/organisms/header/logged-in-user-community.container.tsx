import { useApolloClient } from '@apollo/client';
// import {
//   LoggedInUserCommunityContainerUserCurrentQueryDocument,
//   LoggedInUserCommunityContainerUserCurrentQueryQuery
// } from '../../../../generated';
import { Skeleton } from 'antd';
import { useAuth } from 'react-oidc-context';
import { useParams } from 'react-router-dom';
import { ComponentQueryLoader } from '@cellix/ui-core';
import { HandleLogout } from './handle-logout.tsx';
import { LoggedInUserCommunity } from './logged-in-user-community.tsx';

export interface LoggedInUserCommunityContainerProps {
  autoLogin: boolean;
}

export const LoggedInUserCommunityContainer: React.FC<LoggedInUserCommunityContainerProps> = () => {
  const auth = useAuth();
  const apolloClient = useApolloClient();
  const params = useParams();

//   const [memberQuery] = useLazyQuery(LoggedInUserCommunityContainerUserCurrentQueryDocument);
//   const [data, setData] = useState<LoggedInUserCommunityContainerUserCurrentQueryQuery | null>(null);

    const loading = false;
    let error: Error | undefined;
    const data = {
        userCurrent: {
            id: '1',
            personalInformation: {
                identityDetails: {
                    restOfName: 'John',
                    lastName: 'Doe'
                }
            }
        },
        memberForCurrentUser: {
            profile: {
                avatarDocumentId: 'avatar-id'
            }
        }
    };

//   useEffect(() => {
//     const getData = () => {
//       try {
//         // const { data: dataTemp, loading: loadingTemp, error: errorTemp } = await memberQuery();
//         setData(dataTemp as LoggedInUserCommunityContainerUserCurrentQueryQuery);
//         setError(loadingTemp);
//         setLoading(errorTemp);
//       } catch (e) {
//         console.error('Error getting data in logged in user component: ', e);
//       }
//     };
//     getData();
//   }, [params]);

    const handleLogout = () => {
        HandleLogout(auth, apolloClient, window.location.origin);
    };

    return (
        <ComponentQueryLoader
            loading={loading}
            hasData={data?.userCurrent && data.memberForCurrentUser}
            hasDataComponent={
                <LoggedInUserCommunity
                    data={{
                        // biome-ignore lint:useLiteralKeys
                        communityId: params['communityId'] as string,
                        userCurrent: data?.userCurrent,
                        memberForCurrentUser: data?.memberForCurrentUser,
                    }}
                    handleLogout={handleLogout}
                />
            }
            error={error}
            noDataComponent={<Skeleton loading />}
        />
    );
};
