import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Card, Typography, Tag, Space } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
const { Meta } = Card;
const { Text } = Typography;
const statusColors = {
    available: 'green',
    occupied: 'blue',
    maintenance: 'orange',
    pending: 'gold'
};
/**
 * Property card component for displaying property information
 */
export const PropertyCard = ({ id, title, description, imageUrl, address, status = 'available', type, rent, currency = '$', onClick, className }) => {
    const handleClick = () => {
        onClick?.(id);
    };
    return (_jsx(Card, { className: `property-card hover:shadow-lg transition-shadow cursor-pointer ${className || ''}`, cover: imageUrl ? (_jsx("img", { alt: title, src: imageUrl, style: { height: 200, objectFit: 'cover' } })) : (_jsx("div", { className: "flex items-center justify-center bg-gray-100", style: { height: 200 }, children: _jsx(HomeOutlined, { style: { fontSize: 48, color: '#ccc' } }) })), onClick: handleClick, actions: rent ? [
            _jsx("div", { className: "text-center", children: _jsxs(Text, { strong: true, className: "text-lg", children: [currency, rent.toLocaleString(), "/mo"] }) }, "rent")
        ] : [], children: _jsx(Meta, { title: _jsxs(Space, { direction: "vertical", size: "small", className: "w-full", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsx("span", { className: "truncate", children: title }), _jsx(Tag, { color: statusColors[status], className: "ml-2", children: status.charAt(0).toUpperCase() + status.slice(1) })] }), type && (_jsx(Text, { type: "secondary", className: "text-sm", children: type }))] }), description: _jsxs(Space, { direction: "vertical", size: "small", className: "w-full", children: [address && (_jsxs(Text, { type: "secondary", className: "text-sm", children: ["\uD83D\uDCCD ", address] })), description && (_jsx(Text, { className: "text-sm line-clamp-2", children: description }))] }) }) }));
};
//# sourceMappingURL=PropertyCard.js.map