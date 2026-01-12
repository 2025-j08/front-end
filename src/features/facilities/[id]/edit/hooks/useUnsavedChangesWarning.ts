import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

/**
 * 未保存の変更がある場合に離脱時に警告を表示するフック
 * @param isDirty 未保存の変更があるかどうか
 * @param message 警告メッセージ（デフォルト: '未保存の変更があります。このページを離れますか？'）
 */
export const useUnsavedChangesWarning = (
  isDirty: boolean,
  message: string = '未保存の変更があります。このページを離れますか？',
) => {
  const router = useRouter();

  // ブラウザの閉じる/リロード時の警告
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        // Chrome requires returnValue to be set
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty, message]);

  // Next.jsのルーター遷移時の警告
  const confirmNavigation = useCallback(() => {
    if (isDirty) {
      return window.confirm(message);
    }
    return true;
  }, [isDirty, message]);

  return { confirmNavigation };
};
