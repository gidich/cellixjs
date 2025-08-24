import type React from 'react';
export interface ConfirmDialogProps {
    /** Whether the dialog is open */
    open: boolean;
    /** Dialog title */
    title?: string;
    /** Dialog content */
    content?: React.ReactNode;
    /** Confirm button text */
    confirmText?: string;
    /** Cancel button text */
    cancelText?: string;
    /** Loading state for confirm button */
    confirmLoading?: boolean;
    /** Confirm button type */
    confirmType?: 'primary';
    /** Callback when confirm is clicked */
    onConfirm?: () => void;
    /** Callback when cancel is clicked */
    onCancel?: () => void;
    /** Custom icon */
    icon?: React.ReactNode;
}
/**
 * Reusable confirmation dialog component
 */
export declare const ConfirmDialog: React.FC<ConfirmDialogProps>;
//# sourceMappingURL=ConfirmDialog.d.ts.map