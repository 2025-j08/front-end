export const PREFECTURES = [
  { name: '兵庫県', id: 'hyogo' },
  { name: '京都府', id: 'kyoto' },
  { name: '大阪府', id: 'osaka' },
  { name: '和歌山県', id: 'wakayama' },
  { name: '滋賀県', id: 'shiga' },
  { name: '奈良県', id: 'nara' },
] as const;

export const SEARCH_CONDITIONS = [
  '定員数',
  '現在の生徒数',
  '教員の定員数',
  '教員の人数',
  '少人数制',
  'グループ制',
  '給料',
  '雇用形態',
  '資格条件',
] as const;
