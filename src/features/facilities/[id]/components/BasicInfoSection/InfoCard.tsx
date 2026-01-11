import styles from './BasicInfoSection.module.scss';

/** 情報カード（ラベルと値を表示する共通コンポーネント） */
type InfoCardProps = {
  label: string;
  value: string;
};

export const InfoCard = ({ label, value }: InfoCardProps) => (
  <div className={styles.infoCard}>
    <span className={styles.label}>{label}</span>
    <span className={styles.value}>{value}</span>
  </div>
);
