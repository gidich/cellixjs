import type React from 'react';
import { Card, Typography, Tag, Space } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const { Meta } = Card;
const { Text } = Typography;

export interface PropertyCardProps {
  /** Property ID */
  id: string;
  /** Property title */
  title: string;
  /** Property description */
  description?: string;
  /** Property image URL */
  imageUrl?: string;
  /** Property address */
  address?: string;
  /** Property status */
  status?: 'available' | 'occupied' | 'maintenance' | 'pending';
  /** Property type */
  type?: string;
  /** Monthly rent amount */
  rent?: number;
  /** Currency symbol */
  currency?: string;
  /** Click handler */
  onClick?: (id: string) => void;
  /** Custom className */
  className?: string;
}

const statusColors = {
  available: 'green',
  occupied: 'blue',
  maintenance: 'orange',
  pending: 'gold'
} as const;

/**
 * Property card component for displaying property information
 */
export const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  title,
  description,
  imageUrl,
  address,
  status = 'available',
  type,
  rent,
  currency = '$',
  onClick,
  className
}) => {
  const handleClick = () => {
    onClick?.(id);
  };

  return (
    <Card
      className={`property-card hover:shadow-lg transition-shadow cursor-pointer ${className || ''}`}
      cover={
        imageUrl ? (
          <img
            alt={title}
            src={imageUrl}
            style={{ height: 200, objectFit: 'cover' }}
          />
        ) : (
          <div 
            className="flex items-center justify-center bg-gray-100"
            style={{ height: 200 }}
          >
            <HomeOutlined style={{ fontSize: 48, color: '#ccc' }} />
          </div>
        )
      }
      onClick={handleClick}
      actions={rent ? [
        <div key="rent" className="text-center">
          <Text strong className="text-lg">
            {currency}{rent.toLocaleString()}/mo
          </Text>
        </div>
      ] : []}
    >
      <Meta
        title={
          <Space direction="vertical" size="small" className="w-full">
            <div className="flex justify-between items-start">
              <span className="truncate">{title}</span>
              <Tag color={statusColors[status]} className="ml-2">
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Tag>
            </div>
            {type && (
              <Text type="secondary" className="text-sm">
                {type}
              </Text>
            )}
          </Space>
        }
        description={
          <Space direction="vertical" size="small" className="w-full">
            {address && (
              <Text type="secondary" className="text-sm">
                📍 {address}
              </Text>
            )}
            {description && (
              <Text className="text-sm line-clamp-2">
                {description}
              </Text>
            )}
          </Space>
        }
      />
    </Card>
  );
};