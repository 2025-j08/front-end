/**
 * Supabaseリレーション結果のヘルパー関数
 * リレーションクエリの結果を安全に抽出するためのユーティリティ
 */

/**
 * Supabaseのリレーション結果から最初の要素を抽出する
 * Supabaseは1対多/多対1の関係で配列またはオブジェクトを返すため、両方に対応
 *
 * @param relation - リレーション結果（配列、単一オブジェクト、またはnull/undefined）
 * @returns 最初の要素、またはundefined
 *
 * @example
 * // 配列の場合
 * extractFirstFromRelation([{ name: 'test' }]) // { name: 'test' }
 *
 * // 単一オブジェクトの場合
 * extractFirstFromRelation({ name: 'test' }) // { name: 'test' }
 *
 * // nullの場合
 * extractFirstFromRelation(null) // undefined
 */
export function extractFirstFromRelation<T>(relation: T[] | T | null | undefined): T | undefined {
  if (!relation) return undefined;
  return Array.isArray(relation) ? relation[0] : relation;
}
