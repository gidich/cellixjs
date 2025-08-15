import { Typography } from 'antd';
// import { useNavigate } from 'react-router-dom';
// import { CommunityListContainer } from '../components/community-list.container';
// import { UserInfoContainer } from '../components/user-info.container';
import { Helmet } from '@dr.pogodin/react-helmet';
import { SubPageLayout } from '../sub-page-layout';
const { Title } = Typography;

export const Home: React.FC = () => {
  return (
    <SubPageLayout
      fixedHeader={false}
      header={
        <></>
      }
    >
      <Helmet>
        <title>Owner Community Home</title>
      </Helmet>
      <Title level={3}>Welcome to Owner Community</Title>
      To join a community, you must provide the community manager with the following:
      <br />
      <br />
      {/* <UserInfoContainer /> */}
      {/* <Button type="primary" onClick={onNavigateToAHP}>AHP Proof of Concepts</Button> */}
      <br />
      <br />
      {/* <CommunityListContainer /> */}

    </SubPageLayout>
  );
};
