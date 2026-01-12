/**
 * フィールド名マッピングユーティリティ
 * camelCaseとsnake_case間の型安全な変換
 */

/**
 * 基本情報のフィールドマッピング
 */
export const basicInfoFieldMapping = {
  establishedYear: 'established_year',
  annexFacilities: 'annex_facilities',
} as const;

/**
 * camelCaseのフィールド名をsnake_caseに変換
 * マッピングが定義されていない場合はそのまま返す
 */
export function toSnakeCase<T extends string>(
  field: T,
  mapping: Record<string, string> = basicInfoFieldMapping,
): string {
  return mapping[field] || field;
}

/**
 * snake_caseのフィールド名をcamelCaseに変換
 */
export function toCamelCase(field: string, mapping: Record<string, string>): string {
  const reverseMapping = Object.entries(mapping).reduce(
    (acc, [key, value]) => {
      acc[value] = key;
      return acc;
    },
    {} as Record<string, string>,
  );
  return reverseMapping[field] || field;
}
