import { useApolloClient } from '@apollo/client';
// import {
//   LoggedInUserCommunityContainerUserCurrentQueryDocument,
//   LoggedInUserCommunityContainerUserCurrentQueryQuery
// } from '../../../../generated';
import { Skeleton } from 'antd';
import { useAuth } from 'react-oidc-context';
import { useParams } from 'react-router-dom';
import { ComponentQueryLoader } from '../../molecules/component-query-loader';
import { LoggedInUser, type LoggedInUserProps } from '../../molecules/logged-in-user';
import { HandleLogout } from './handle-logout.tsx';

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

  const handleLogout = async () => {
    await HandleLogout(auth, apolloClient, window.location.origin);
  };

  const LoggedInCommunityContainer = () => {
    const userData: LoggedInUserProps = {
      data: {
        isLoggedIn: true,
        firstName: data?.userCurrent?.personalInformation?.identityDetails?.restOfName ?? '',
        lastName: data?.userCurrent?.personalInformation?.identityDetails?.lastName ?? '',
        notificationCount: 0,

        profileImage: data?.memberForCurrentUser?.profile?.avatarDocumentId
          // biome-ignore lint:useLiteralKeys
          ? `https://ownercommunity.blob.core.windows.net/${params['communityId']}/${data.memberForCurrentUser.profile.avatarDocumentId}`
          : undefined
      }
    };
    console.log('LoggedInCommunityContainer', userData);
    return (
      <div className="text-right text-sky-400" style={{ flexGrow: '1' }}>
        <LoggedInUser key={data?.userCurrent?.id} data={userData.data} onLogoutClicked={handleLogout} />
      </div>
    );
  };

  return (
    <ComponentQueryLoader
      loading={loading}
      hasData={data?.userCurrent && data.memberForCurrentUser}
      hasDataComponent={<LoggedInCommunityContainer />}
      error={error}
      noDataComponent={<Skeleton loading />}
    />
  );
};
