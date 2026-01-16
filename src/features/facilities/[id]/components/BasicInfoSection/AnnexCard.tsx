'use client';

import { useState } from 'react';

import type { AnnexFacility } from '@/types/facility';
import { useIsMobile } from '@/hooks/useIsMobile';

import styles from './BasicInfoSection.module.scss';

/** シェブロンアイコンのProps */
type ChevronIconProps = {
  isExpanded: boolean;
};

/** シェブロンアイコン（展開/折りたたみ用） */
const ChevronIcon = ({ isExpanded }: ChevronIconProps) => (
  <svg
    className={`${styles.chevronIcon} ${isExpanded ? styles.chevronExpanded : ''}`}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/** 併設施設カード（PC: 従来表示 / スマホ: アコーディオン形式） */
type AnnexCardProps = {
  annexFacilities: AnnexFacility[] | undefined;
  annexText: string;
};

export const AnnexCard = ({ annexFacilities, annexText }: AnnexCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();

  // データがない場合は非表示
  if (!annexFacilities?.length) return null;

  // PC表示: 従来のカードレイアウト
  if (!isMobile) {
    return (
      <div className={`${styles.infoCard} ${styles.annexCard}`}>
        <div className={styles.annexHeader}>
          <span className={styles.label}>併設施設</span>
          <span className={styles.subStatus}>あり</span>
        </div>
        <div className={styles.annexContent}>
          <span className={styles.value}>{annexText}</span>
        </div>
      </div>
    );
  }

  // スマホ表示: アコーディオン形式
  return (
    <div className={`${styles.infoCard} ${styles.annexCard} ${styles.annexAccordion}`}>
      <button
        type="button"
        className={styles.annexToggle}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls="annex-content"
        aria-label="併設施設の詳細を表示"
      >
        <span className={styles.annexToggleText}>
          <span className={styles.label}>併設施設</span>
          <span className={styles.subStatus}>あり</span>
        </span>
        <ChevronIcon isExpanded={isExpanded} />
      </button>
      {isExpanded && (
        <div id="annex-content" className={styles.annexContent}>
          <span className={styles.value}>{annexText}</span>
        </div>
      )}
    </div>
  );
};
