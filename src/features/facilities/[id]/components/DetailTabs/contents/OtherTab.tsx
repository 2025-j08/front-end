import styles from './TabContent.module.scss';

type OtherInfo = {
  title: string;
  description: string;
};

type OtherTabProps = {
  otherInfo: OtherInfo | string;
};

export const OtherTab = ({ otherInfo }: OtherTabProps) => {
  // 文字列の場合は後方互換性のため対応
  const isString = typeof otherInfo === 'string';
  const title = isString ? '' : otherInfo.title;
  const description = isString ? otherInfo : otherInfo.description;

  return (
    <div className={styles.tabContentWrapper}>
      <div className={styles.textSection}>
        {title && <h3 className={styles.contentTitle}>{title}</h3>}
        <p className={styles.simpleText}>{description}</p>
      </div>
    </div>
  );
};
