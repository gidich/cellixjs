import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
/**
 * Reusable confirmation dialog component
 */
export const ConfirmDialog = ({ open, title = 'Confirm Action', content = 'Are you sure you want to proceed?', confirmText = 'Confirm', cancelText = 'Cancel', confirmLoading = false, confirmType = 'primary', onConfirm, onCancel, icon = _jsx(ExclamationCircleOutlined, {}) }) => {
    return (_jsx(Modal, { title: _jsxs("div", { className: "flex items-center gap-2", children: [icon, _jsx("span", { children: title })] }), open: open, onCancel: onCancel, footer: [
            _jsx(Button, { onClick: onCancel, children: cancelText }, "cancel"),
            _jsx(Button, { type: confirmType, danger: confirmType === 'primary' ? false : undefined, loading: confirmLoading, onClick: onConfirm, children: confirmText }, "confirm"),
        ], children: content }));
};
//# sourceMappingURL=ConfirmDialog.js.map