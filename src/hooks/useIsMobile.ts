'use client';

import { useState, useEffect } from 'react';

/**
 * 画面幅がモバイル（768px以下）かどうかを判定するフック
 * @returns スマホ画面の場合true
 */
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    // イベントハンドラー
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(event.matches);
    };

    // 初期値を設定
    handleChange(mediaQuery);

    // メディアクエリの変更を監視
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return isMobile;
};
