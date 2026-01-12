import { ReactNode } from 'react';

import styles from './TabContent.module.scss';

type EditSectionProps = {
  title: string;
  children: ReactNode;
};

/**
 * 編集画面用のセクションコンポーネント
 * 表示画面のTabSectionに対応する編集画面用のグループ化コンポーネント
 */
export const EditSection = ({ title, children }: EditSectionProps) => {
  return (
    <div className={styles.editSectionWrapper}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <div className={styles.editSectionContent}>{children}</div>
    </div>
  );
};
