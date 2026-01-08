/**
 * ユーザー情報の型定義
 */
export type User = {
  /** ユーザーID */
  id: string;
  /** 所属施設名 */
  facilityName: string;
  /** 氏名 */
  name: string;
  /** メールアドレス */
  email: string;
};
