import styles from './TabContent.module.scss';
import { TabSection } from './TabSection';

type CommunityRelationProps = {
  relationInfo: string;
};

export const CommunityRelation = ({ relationInfo }: CommunityRelationProps) => {
  if (!relationInfo) return null;

  return (
    <div className={styles.tabContentWrapper}>
      <div className={styles.textSection}>
        <TabSection title="地域社会との関係や連携状況" content={relationInfo} />
      </div>
    </div>
  );
};
