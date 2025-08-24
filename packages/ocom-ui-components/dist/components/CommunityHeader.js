import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Layout, Typography, Space, Avatar } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
const { Header } = Layout;
const { Title, Text } = Typography;
/**
 * Header component for community pages
 */
export const CommunityHeader = ({ communityName, logoUrl, userName, userAvatar, actions, className }) => {
    return (_jsxs(Header, { className: `bg-white shadow-sm px-6 flex items-center justify-between ${className || ''}`, children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(Avatar, { size: "large", src: logoUrl, icon: _jsx(HomeOutlined, {}), className: "bg-blue-500" }), _jsxs("div", { children: [_jsx(Title, { level: 4, className: "mb-0", children: communityName }), _jsx(Text, { type: "secondary", className: "text-sm", children: "Community Portal" })] })] }), _jsxs(Space, { children: [actions, userName && (_jsxs(Space, { children: [_jsx(Text, { children: userName }), _jsx(Avatar, { src: userAvatar, icon: _jsx(UserOutlined, {}), className: "bg-gray-500" })] }))] })] }));
};
//# sourceMappingURL=CommunityHeader.js.map