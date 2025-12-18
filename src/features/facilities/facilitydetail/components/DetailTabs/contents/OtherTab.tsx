import styles from './TabContent.module.scss';

type OtherTabProps = {
  otherInfo: string;
};

export const OtherTab = ({ otherInfo }: OtherTabProps) => {
  return (
    <div className={styles.tabContentWrapper}>
      <div className={styles.textSection}>
        <p className={styles.simpleText}>{otherInfo}</p>
      </div>
    </div>
  );
};
