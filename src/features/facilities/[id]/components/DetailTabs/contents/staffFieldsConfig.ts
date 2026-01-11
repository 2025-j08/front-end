/**
 * StaffTab のフィールド定義（メタデータ）
 * フィールド追加時はこの配列に1行追加するだけでOK
 */

import { StaffInfo } from '@/types/facility';

type FieldType = 'text' | 'number' | 'textarea' | 'select';

type SelectOption = {
  value: string;
  label: string;
};

export type StaffFieldConfig = {
  /** フィールドID（StaffInfoのキー） */
  id: keyof StaffInfo;
  /** 入力フィールドの型 */
  type: FieldType;
  /** ラベル */
  label: string;
  /** プレースホルダー */
  placeholder?: string;
  /** 接尾辞（例: "名", "年"） */
  suffix?: string;
  /** テキストエリアの行数 */
  rows?: number;
  /** セレクトボックスの選択肢 */
  options?: SelectOption[];
  /** 表示モード用のタイトル（省略時はlabelを使用） */
  displayTitle?: string;
  /** 行グループID（同じIDのフィールドは横並び） */
  rowGroup?: number;
};

/** hasUniversityLecturer の選択オプション */
const LECTURER_OPTIONS: SelectOption[] = [
  { value: '', label: '未設定' },
  { value: 'true', label: '有' },
  { value: 'false', label: '無' },
];

/**
 * StaffTabのフィールド定義
 * 配列の順序が表示順序になる
 */
export const STAFF_FIELDS: readonly StaffFieldConfig[] = [
  {
    id: 'fullTimeStaffCount',
    type: 'number',
    label: '常勤職員数',
    placeholder: '例:16',
    suffix: '名',
    rowGroup: 1,
  },
  {
    id: 'partTimeStaffCount',
    type: 'number',
    label: '非常勤職員数',
    placeholder: '例:5',
    suffix: '名',
    rowGroup: 1,
  },
  {
    id: 'specialties',
    type: 'textarea',
    label: '職員の特徴・専門性',
    rows: 3,
  },
  {
    id: 'averageTenure',
    type: 'text',
    label: '平均勤続年数',
    placeholder: '例: 8.5年',
    rowGroup: 2,
  },
  {
    id: 'ageDistribution',
    type: 'text',
    label: '年齢層の傾向',
    rowGroup: 2,
  },
  {
    id: 'workStyle',
    type: 'textarea',
    label: '働き方の特徴',
    rows: 2,
  },
  {
    id: 'hasUniversityLecturer',
    type: 'select',
    label: '大学講義担当',
    options: LECTURER_OPTIONS,
    rowGroup: 3,
  },
  {
    id: 'lectureSubjects',
    type: 'text',
    label: '担当科目',
    rowGroup: 3,
  },
  {
    id: 'externalActivities',
    type: 'textarea',
    label: '他機関での活動実績',
    displayTitle: '他機関での活動実績（外部講演・講師）',
    rows: 2,
  },
  {
    id: 'qualificationsAndSkills',
    type: 'textarea',
    label: '資格やスキル',
    displayTitle: '職員個人の資格やスキルで活かされているもの',
    rows: 2,
  },
  {
    id: 'internshipDetails',
    type: 'textarea',
    label: '実習生受け入れ',
    displayTitle: '実習生受け入れについて特筆的なこと',
    rows: 2,
  },
] as const;
