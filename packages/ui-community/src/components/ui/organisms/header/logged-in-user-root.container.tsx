import { useApolloClient, useQuery } from '@apollo/client';
import { useAuth } from 'react-oidc-context';
import { ComponentQueryLoader } from '../../molecules/component-query-loader';
import { LoggedInUser, type LoggedInUserProps } from '../../molecules/logged-in-user';
import { HandleLogout } from './handle-logout.tsx';
import { LoggedInUserRootContainerCurrentEndUserAndCreateIfNotExistsDocument } from '../../../../generated.tsx';

export interface LoggedInUserRootContainerProps {
  autoLogin: boolean;
}

export const LoggedInUserRootContainer: React.FC<LoggedInUserRootContainerProps> = () => {
  const auth = useAuth();
  const apolloClient = useApolloClient();

  const { loading, error, data } = useQuery(LoggedInUserRootContainerCurrentEndUserAndCreateIfNotExistsDocument);

  const handleLogout = () => {
    HandleLogout(auth, apolloClient, window.location.origin);
  };

  const LoggedInRootContainer = () => {
    const userData: LoggedInUserProps = {
      data: {
        isLoggedIn: true,
        firstName: data?.currentEndUserAndCreateIfNotExists?.personalInformation?.identityDetails?.restOfName ?? '',
        lastName: data?.currentEndUserAndCreateIfNotExists?.personalInformation?.identityDetails?.lastName ?? '',
        notificationCount: 0
      }
    };
    return (
      <div className="text-right text-sky-400  flex-grow">
        <LoggedInUser key={data?.currentEndUserAndCreateIfNotExists?.id} data={userData.data} onLogoutClicked={handleLogout} />
      </div>
    );
  };

  return (
    <ComponentQueryLoader
      loading={loading}
      hasData={data?.currentEndUserAndCreateIfNotExists}
      hasDataComponent={<LoggedInRootContainer />}
      error={error}
      noDataComponent={<div>Nothing</div>}
    />
  );
};
