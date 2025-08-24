import type React from 'react';
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
/**
 * Badge component to display user status in community context
 */
export declare const UserStatusBadge: React.FC<UserStatusBadgeProps>;
//# sourceMappingURL=UserStatusBadge.d.ts.map