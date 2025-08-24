import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { Tag } from 'antd';
import { UserOutlined, CrownOutlined, ToolOutlined, EyeOutlined } from '@ant-design/icons';
const statusConfig = {
    owner: {
        color: 'gold',
        icon: _jsx(CrownOutlined, {}),
        defaultText: 'Owner'
    },
    resident: {
        color: 'blue',
        icon: _jsx(UserOutlined, {}),
        defaultText: 'Resident'
    },
    manager: {
        color: 'purple',
        icon: _jsx(CrownOutlined, {}),
        defaultText: 'Manager'
    },
    guest: {
        color: 'default',
        icon: _jsx(EyeOutlined, {}),
        defaultText: 'Guest'
    },
    maintenance: {
        color: 'orange',
        icon: _jsx(ToolOutlined, {}),
        defaultText: 'Maintenance'
    }
};
/**
 * Badge component to display user status in community context
 */
export const UserStatusBadge = ({ status, text, showIcon = true, className }) => {
    const config = statusConfig[status];
    const displayText = text || config.defaultText;
    return (_jsx(Tag, { color: config.color, icon: showIcon ? config.icon : undefined, className: className || '', children: displayText }));
};
//# sourceMappingURL=UserStatusBadge.js.map