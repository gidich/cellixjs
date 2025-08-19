import { useQuery } from '@apollo/client';
import {
  AccountsCommunityListContainerCommunitiesForCurrentEndUserDocument,
  type Community,
//   AccountsCommunityListContainerMembersByUserExternalIdDocument,
} from '../../../../generated.tsx';
import { ComponentQueryLoader } from '../../../ui/molecules/component-query-loader/index.tsx';
import { CommunityList } from './community-list.tsx';

// import { jwtDecode } from 'jwt-decode';

export const CommunityListContainer: React.FC = () => {
  const {
    loading: communityLoading,
    error: communityError,
    data: communityData
  } = useQuery(AccountsCommunityListContainerCommunitiesForCurrentEndUserDocument);

  // extract externalId from jwt token
//   const sessionStorageKey = `oidc.user:${import.meta.env['VITE_AAD_B2C_ACCOUNT_AUTHORITY']}:${import.meta.env['VITE_AAD_B2C_ACCOUNT_CLIENTID']}`;
//   const { id_token } = JSON.parse(sessionStorage.getItem(sessionStorageKey) as string);

//   const userExternalId = jwtDecode(id_token).sub ?? '';

//   const {
//     loading: membersLoading,
//     error: membersError,
//     data: membersData
//   } = useQuery(AccountsCommunityListContainerMembersByUserExternalIdDocument, {
//     variables: { userExternalId },
//     fetchPolicy: 'network-only'
//   });

//   let members: Member[][] = [];
//   if (
//     membersData?.membersByUserExternalId &&
//     membersData?.membersByUserExternalId.length > 0 &&
//     communityData?.communities
//   ) {
//     for (const community of communityData.communities) {
//       members.push(
//         membersData.membersByUserExternalId.filter((member) => member?.community?.id === community?.id) as Member[]
//       );
//     }
//   }

  return (
    <ComponentQueryLoader
      loading={communityLoading}
      hasData={communityData?.communitiesForCurrentEndUser}
      hasDataComponent={<CommunityList data={{ communities: communityData?.communitiesForCurrentEndUser as Community[] }} />}
      noDataComponent={<div>No Data...</div>}
      error={communityError}
      errorComponent={
        <div>Error :( {JSON.stringify(communityError)}</div>
      }
    />
  );
};
