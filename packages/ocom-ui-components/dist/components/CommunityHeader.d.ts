import type React from 'react';
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
export declare const CommunityHeader: React.FC<CommunityHeaderProps>;
//# sourceMappingURL=CommunityHeader.d.ts.map