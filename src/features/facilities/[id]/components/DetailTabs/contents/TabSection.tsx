import { ReactNode } from 'react';

import styles from './TabContent.module.scss';

type TabSectionBaseProps = {
  /** セクションのタイトル（見出し） */
  title?: string;
};

type TabSectionWithContent = TabSectionBaseProps & {
  /** 本文テキスト（データがない場合は「-」を表示） */
  content?: string;
  children?: never;
};

type TabSectionWithChildren = TabSectionBaseProps & {
  content?: never;
  /** カスタムコンテンツ（リストやカードなど） */
  children: ReactNode;
};

type TabSectionProps = TabSectionWithContent | TabSectionWithChildren;

/**
 * タブコンテンツ用の汎用セクションコンポーネント
 * タイトル + 本文（またはカスタムコンテンツ）の構成
 *
 * @example contentを使用する場合
 * <TabSection title="セクション名" content={data.text} />
 *
 * @example childrenを使用する場合（カスタムレイアウト）
 * <TabSection title="セクション名">
 *   <p>カスタムコンテンツ</p>
 * </TabSection>
 */
export const TabSection = ({ title, content, children }: TabSectionProps) => {
  return (
    <div className={styles.section}>
      {title && <h3 className={styles.contentTitle}>{title}</h3>}
      {children ? children : <p className={styles.textContent}>{content || '-'}</p>}
    </div>
  );
};
