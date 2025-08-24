import React from 'react';
import { Modal, Button } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

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
  confirmType?: 'primary' | 'danger';
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
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = 'Confirm Action',
  content = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmLoading = false,
  confirmType = 'primary',
  onConfirm,
  onCancel,
  icon = <ExclamationCircleOutlined />
}) => {
  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          {icon}
          <span>{title}</span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {cancelText}
        </Button>,
        <Button
          key="confirm"
          type={confirmType}
          loading={confirmLoading}
          onClick={onConfirm}
        >
          {confirmText}
        </Button>,
      ]}
    >
      {content}
    </Modal>
  );
};