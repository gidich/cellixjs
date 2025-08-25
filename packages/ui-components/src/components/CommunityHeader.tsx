import type React from 'react';
import { Layout, Typography, Space, Avatar } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Title, Text } = Typography;

export interface CommunityHeaderProps {
  /** Community name */
  communityName: string;
  /** Community logo URL */
  logoUrl?: string;
  /** User name */
  userName?: string;
  /** User avatar URL */
  userAvatar?: string;
  /** Additional actions to render */
  actions?: React.ReactNode;
  /** Custom className */
  className?: string;
}

/**
 * Header component for community pages
 */
export const CommunityHeader: React.FC<CommunityHeaderProps> = ({
  communityName,
  logoUrl,
  userName,
  userAvatar,
  actions,
  className
}) => {
  return (
    <Header className={`bg-white shadow-sm px-6 flex items-center justify-between ${className || ''}`}>
      <div className="flex items-center space-x-4">
        <Avatar
          size="large"
          src={logoUrl}
          icon={<HomeOutlined />}
          className="bg-blue-500"
        />
        <div>
          <Title level={4} className="mb-0">
            {communityName}
          </Title>
          <Text type="secondary" className="text-sm">
            Community Portal
          </Text>
        </div>
      </div>

      <Space>
        {actions}
        {userName && (
          <Space>
            <Text>{userName}</Text>
            <Avatar
              src={userAvatar}
              icon={<UserOutlined />}
              className="bg-gray-500"
            />
          </Space>
        )}
      </Space>
    </Header>
  );
};