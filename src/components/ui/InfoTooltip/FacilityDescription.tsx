import styles from './FacilityDescription.module.scss';

/**
 * 施設形態（大舎、中舎、小舎、グループホーム）の詳細説明を表示するコンポーネント
 */
export const FacilityDescription = () => {
  return (
    <div className={styles.root}>
      <p className={styles.title}>施設の運営形態による区分</p>

      <div className={styles.item}>
        <strong>・大舎（1舎20人以上）</strong>
        <p className={styles.description}>
          多くの児童が生活する伝統的な形態です。集団生活が中心となります。
        </p>
      </div>

      <div className={styles.item}>
        <strong>・中舎（1舎13〜19人）</strong>
        <p className={styles.description}>
          大舎より小規模で、区画ごとの生活集団により家庭的な雰囲気を重視しています。
        </p>
      </div>

      <div className={styles.item}>
        <strong>・小舎（1舎12人以下）</strong>
        <p className={styles.description}>
          少人数単位での生活により、職員との愛着形成やきめ細かい個別ケアがしやすい環境です。
        </p>
      </div>

      <div className={styles.item}>
        <strong>・グループホーム（6人程度）</strong>
        <p className={styles.description}>
          地域の一般住宅などを利用した小規模な形態です。最も家庭に近い環境で生活できます。
        </p>
      </div>
    </div>
  );
};
