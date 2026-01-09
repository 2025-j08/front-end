import { useEffect, useRef, RefObject } from 'react';

/**
 * クリックアウトサイドフック
 * 指定した要素の外側をクリックした際にコールバックを実行します。
 *
 * @param ref - 監視対象の要素のRefObject
 * @param callback - 外側がクリックされたら実行される関数
 */
export const useClickOutside = (ref: RefObject<HTMLElement | null>, callback: () => void) => {
  // コールバックをRefに保持することで、useEffectの依存配列から除外する
  // これにより、callbackが再生成されてもイベントリスナーの再登録が発生しない
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // refが存在し、かつクリックされた要素がrefの内側でない場合
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callbackRef.current();
      }
    };

    // NOTE: ref.currentの有無に関わらず、コンポーネントマウント時にリスナーを登録します。
    // ref.currentは変更されても再レンダリングをトリガーしないため、
    // イベント発生時にハンドラー内部で現在値をチェックすることで整合性を保っています。
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
};
