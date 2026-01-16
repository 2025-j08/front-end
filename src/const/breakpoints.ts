/**
 * レスポンシブデザイン用ブレークポイント定数
 * SCSS と TypeScript で共有するため、値の変更はここで一元管理する
 */

/** モバイル判定のブレークポイント（px） */
export const MOBILE_BREAKPOINT = 768;

/** メディアクエリ文字列（TypeScript用） */
export const MOBILE_MEDIA_QUERY = `(max-width: ${MOBILE_BREAKPOINT}px)`;
