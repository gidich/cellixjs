import type React from 'react';
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
/**
 * Property card component for displaying property information
 */
export declare const PropertyCard: React.FC<PropertyCardProps>;
//# sourceMappingURL=PropertyCard.d.ts.map