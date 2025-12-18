import styles from './TabContent.module.scss'; // Reuse existing styles for now

type CommunityRelationProps = {
  relationInfo: string;
};

export const CommunityRelation = ({ relationInfo }: CommunityRelationProps) => {
  if (!relationInfo) return null;

  return (
    <div className={styles.relationSection}>
      <h3 className={styles.subTitle}>地域社会との関係や連携状況</h3>
      <p className={styles.relationText}>{relationInfo}</p>
    </div>
  );
};
