import React from 'react';
import { Tag } from 'antd';
import { UserOutlined, CrownOutlined, ToolOutlined, EyeOutlined } from '@ant-design/icons';

export type UserStatus = 'owner' | 'resident' | 'manager' | 'guest' | 'maintenance';

export interface UserStatusBadgeProps {
  /** User status */
  status: UserStatus;
  /** Custom text override */
  text?: string;
  /** Show icon */
  showIcon?: boolean;
  /** Custom className */
  className?: string;
}

const statusConfig = {
  owner: {
    color: 'gold',
    icon: <CrownOutlined />,
    defaultText: 'Owner'
  },
  resident: {
    color: 'blue',
    icon: <UserOutlined />,
    defaultText: 'Resident'
  },
  manager: {
    color: 'purple',
    icon: <CrownOutlined />,
    defaultText: 'Manager'
  },
  guest: {
    color: 'default',
    icon: <EyeOutlined />,
    defaultText: 'Guest'
  },
  maintenance: {
    color: 'orange',
    icon: <ToolOutlined />,
    defaultText: 'Maintenance'
  }
} as const;

/**
 * Badge component to display user status in community context
 */
export const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({
  status,
  text,
  showIcon = true,
  className
}) => {
  const config = statusConfig[status];
  const displayText = text || config.defaultText;

  return (
    <Tag
      color={config.color}
      icon={showIcon ? config.icon : undefined}
      className={className || ''}
    >
      {displayText}
    </Tag>
  );
};