import { jsx as _jsx } from "react/jsx-runtime";
import { Spin } from 'antd';
/**
 * General purpose loading spinner component
 * Can be used as a wrapper or standalone spinner
 */
export const LoadingSpinner = ({ loading = true, size = 'default', tip = 'Loading...', children, className }) => {
    if (!children) {
        // Standalone spinner
        return (_jsx("div", { className: `flex justify-center items-center p-4 ${className || ''}`, children: _jsx(Spin, { size: size, tip: tip, spinning: loading }) }));
    }
    // Wrapper spinner
    return (_jsx(Spin, { size: size, tip: tip, spinning: loading, className: className, children: children }));
};
//# sourceMappingURL=LoadingSpinner.js.map