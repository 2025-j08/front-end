/** 関西6府県の一覧 */
export const KINKI_PREFECTURES = [
  '大阪府',
  '京都府',
  '滋賀県',
  '奈良県',
  '兵庫県',
  '和歌山県',
] as const;

/** 都道府県名からCSSクラス名へのマッピング */
export const PREFECTURE_TO_CSS_CLASS: Record<string, string> = {
  大阪府: 'osaka',
  京都府: 'kyoto',
  滋賀県: 'shiga',
  奈良県: 'nara',
  兵庫県: 'hyogo',
  和歌山県: 'wakayama',
};

/** 施設形態の一覧 */
export const FACILITY_TYPES = ['大舎', '中舎', '小舎', 'グループホーム', '地域小規模'] as const;

/** 施設形態の選択肢（フォーム用） */
export const FACILITY_TYPE_OPTIONS = FACILITY_TYPES.map((type) => ({
  value: type,
  label: type,
}));
