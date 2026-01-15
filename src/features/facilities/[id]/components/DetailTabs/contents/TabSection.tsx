import { ReactNode } from 'react';

import styles from './TabContent.module.scss';

type TabSectionProps = {
  /** セクションのタイトル（見出し） */
  title?: string;
  /** 本文テキスト（後で編集可能な想定） */
  content?: string;
  /** カスタムコンテンツ（リストやカードなど） */
  children?: ReactNode;
};

/**
 * タブコンテンツ用の汎用セクションコンポーネント
 * タイトル + 本文（またはカスタムコンテンツ）の構成
 */
export const TabSection = ({ title, content, children }: TabSectionProps) => {
  return (
    <div className={styles.section}>
      {title && <h3 className={styles.contentTitle}>{title}</h3>}
      {children ? children : <p className={styles.textContent}>{content || '-'}</p>}
    </div>
  );
};
