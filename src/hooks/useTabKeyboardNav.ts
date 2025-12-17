import { useCallback } from 'react';

/**
 * タブのキーボードナビゲーションを処理するフック
 * 左右矢印キー、Home、Endキーでタブを切り替え
 *
 * @param tabIds - タブのID配列（順序はDOM順と一致させる）
 * @param onTabChange - タブ変更時のコールバック
 * @returns handleKeyDown - キーボードイベントハンドラ
 */
export const useTabKeyboardNav = <T extends string>(
  tabIds: T[],
  onTabChange: (tabId: T) => void,
) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, currentIndex: number) => {
      let nextIndex: number;

      switch (e.key) {
        case 'ArrowRight':
          nextIndex = (currentIndex + 1) % tabIds.length;
          break;
        case 'ArrowLeft':
          nextIndex = (currentIndex - 1 + tabIds.length) % tabIds.length;
          break;
        case 'Home':
          nextIndex = 0;
          break;
        case 'End':
          nextIndex = tabIds.length - 1;
          break;
        default:
          return;
      }

      e.preventDefault();
      onTabChange(tabIds[nextIndex]);
      document.getElementById(`tab-${tabIds[nextIndex]}`)?.focus();
    },
    [tabIds, onTabChange],
  );

  return { handleKeyDown };
};
