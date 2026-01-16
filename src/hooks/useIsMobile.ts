'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';

import { MOBILE_MEDIA_QUERY } from '@/const/breakpoints';

/**
 * 画面幅がモバイル（768px以下）かどうかを判定するフック
 * @returns スマホ画面の場合true（SSR時は常にfalse）
 */
export const useIsMobile = (): boolean => {
  // useSyncExternalStoreを使用してSSR/CSR間の一貫性を確保
  const isMobile = useSyncExternalStore(
    // subscribe: メディアクエリの変更を監視
    (callback) => {
      if (typeof window === 'undefined') return () => {};
      const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);
      mediaQuery.addEventListener('change', callback);
      return () => mediaQuery.removeEventListener('change', callback);
    },
    // getSnapshot: クライアント側の現在値
    () => {
      if (typeof window === 'undefined') return false;
      return window.matchMedia(MOBILE_MEDIA_QUERY).matches;
    },
    // getServerSnapshot: SSR時の値
    () => false,
  );

  return isMobile;
};
