/**
 * StaffTab のフィールド定義（メタデータ）
 * フィールド追加時はこの配列に1行追加するだけでOK
 */

import { StaffInfo } from '@/types/facility';

type SelectOption = {
  value: string;
  label: string;
};

/** フィールド定義の共通プロパティ */
type BaseFieldConfig = {
  /** フィールドID（StaffInfoのキー） */
  id: keyof StaffInfo;
  /** ラベル */
  label: string;
  /** 表示モード用のタイトル（省略時はlabelを使用） */
  displayTitle?: string;
  /** 行グループID（同じIDのフィールドは横並び） */
  rowGroup?: number;
};

/** テキストフィールド定義 */
type TextFieldConfig = BaseFieldConfig & {
  type: 'text';
  placeholder?: string;
};

/** 数値フィールド定義 */
type NumberFieldConfig = BaseFieldConfig & {
  type: 'number';
  placeholder?: string;
  /** 接尾辞（例: "名", "年"） */
  suffix?: string;
};

/** テキストエリアフィールド定義 */
type TextareaFieldConfig = BaseFieldConfig & {
  type: 'textarea';
  /** テキストエリアの行数 */
  rows?: number;
};

/** セレクトフィールド定義 */
type SelectFieldConfig = BaseFieldConfig & {
  type: 'select';
  /** セレクトボックスの選択肢（必須） */
  options: SelectOption[];
};

/**
 * StaffTabのフィールド設定型
 * 型に応じて必要なプロパティが変わる判別共用体
 */
export type StaffFieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | TextareaFieldConfig
  | SelectFieldConfig;

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
