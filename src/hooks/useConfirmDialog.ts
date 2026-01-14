import { useState, useCallback } from 'react';

import { ConfirmDialogProps } from '@/components/ui/ConfirmDialog/ConfirmDialog';

type DialogConfig = Omit<ConfirmDialogProps, 'isOpen' | 'onConfirm' | 'onCancel'> & {
  isOpen: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export const useConfirmDialog = () => {
  const [dialogConfig, setDialogConfig] = useState<DialogConfig>({
    isOpen: false,
    message: '',
    title: '確認',
    showCancel: true,
  });

  const closeDialog = useCallback(() => {
    setDialogConfig((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const showDialog = useCallback((config: Partial<DialogConfig>) => {
    setDialogConfig((prev) => ({
      ...prev,
      ...config,
      isOpen: true,
      onCancel: config.onCancel || (() => setDialogConfig((p) => ({ ...p, isOpen: false }))),
    }));
  }, []);

  const showError = useCallback(
    (message: string) => {
      showDialog({
        title: 'エラー',
        message,
        showCancel: false,
        confirmLabel: '閉じる',
        onConfirm: () => closeDialog(),
      });
    },
    [showDialog, closeDialog],
  );

  return {
    dialogConfig,
    showDialog,
    closeDialog,
    showError,
  };
};
