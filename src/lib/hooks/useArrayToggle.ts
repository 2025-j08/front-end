import { useState, useCallback } from 'react';

/**
 * 配列の要素をトグル（追加/削除）するためのカスタムフック
 *
 * @param initialValues - 初期値の配列
 * @returns [values, toggle, setValues] - 現在の配列、トグル関数、セッター関数
 *
 * @example
 * const [selectedTypes, toggleType] = useArrayToggle<string>([]);
 * toggleType('大舎'); // ['大舎']
 * toggleType('小舎'); // ['大舎', '小舎']
 * toggleType('大舎'); // ['小舎']
 */
export function useArrayToggle<T>(
  initialValues: T[] = [],
): [T[], (value: T) => void, React.Dispatch<React.SetStateAction<T[]>>] {
  const [values, setValues] = useState<T[]>(initialValues);

  const toggle = useCallback((value: T) => {
    setValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }, []);

  return [values, toggle, setValues];
}
