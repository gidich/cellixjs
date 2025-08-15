import { PageHeader } from '@ant-design/pro-layout';
import { useNavigate } from 'react-router-dom';
// import { CommunityCreateContainer } from '../components/community-create.container';
import { SubPageLayout } from '../sub-page-layout';

export const CreateCommunity: React.FC = () => {
  const navigate = useNavigate();
  return (
    <SubPageLayout
      fixedHeader={false}
      header={<PageHeader title="Create a Community" onBack={() => navigate('../')} />}
    >
      {/* <CommunityCreateContainer /> */}
      <div>Pretend that this is the Create Community page</div>
    </SubPageLayout>
  );
};
