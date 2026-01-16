'use client';

import { useState, useId, type ReactNode } from 'react';

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

/** 共通プロパティ */
type BaseProps = {
  annexFacilities: AnnexFacility[] | undefined;
};

/** 閲覧モード用Props */
type ViewModeProps = BaseProps & {
  isEditing?: false;
  annexText: string;
  children?: never;
};

/** 編集モード用Props */
type EditModeProps = BaseProps & {
  isEditing: true;
  annexText?: never;
  children: ReactNode;
};

/** 併設施設カードのProps（Discriminated Union） */
type AnnexCardProps = ViewModeProps | EditModeProps;

/**
 * 併設施設カード
 * - PC: 常に展開表示
 * - スマホ閲覧: アコーディオン形式（開閉可能）
 * - スマホ編集: 常に展開表示（閉じられない）
 */
export const AnnexCard = (props: AnnexCardProps) => {
  const { annexFacilities, isEditing = false } = props;
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();
  const contentId = useId();

  // ステータステキスト
  const statusText = annexFacilities?.length ? 'あり' : 'なし';

  // コンテンツ（編集 or 閲覧用）
  const content = isEditing ? (
    props.children
  ) : (
    <span className={styles.value}>{props.annexText}</span>
  );

  // PC表示: 常に展開
  if (!isMobile) {
    return (
      <div className={`${styles.infoCard} ${styles.annexCard}`}>
        <div className={styles.annexHeader}>
          <span className={styles.label}>併設施設</span>
          <span className={styles.subStatus}>{statusText}</span>
        </div>
        <div className={styles.annexContent}>{content}</div>
      </div>
    );
  }

  // スマホ編集モード: アコーディオンの見た目を維持、常に展開（トグル不可）
  if (isEditing) {
    return (
      <div className={`${styles.infoCard} ${styles.annexCard} ${styles.annexAccordion}`}>
        <div className={styles.annexToggle} aria-expanded="true">
          <span className={styles.annexToggleText}>
            <span className={styles.label}>併設施設</span>
            <span className={styles.subStatus}>{statusText}</span>
          </span>
        </div>
        <div className={styles.annexContent}>{content}</div>
      </div>
    );
  }

  // スマホ閲覧モード: データなしの場合はアコーディオンにせず、静的に表示（開閉不可）
  if (!annexFacilities?.length) {
    return (
      <div className={`${styles.infoCard} ${styles.annexCard} ${styles.annexAccordion}`}>
        <div className={styles.annexToggle} style={{ cursor: 'default' }}>
          <span className={styles.annexToggleText}>
            <span className={styles.label}>併設施設</span>
            <span className={styles.subStatus}>{statusText}</span>
          </span>
        </div>
      </div>
    );
  }

  // スマホ閲覧モード: アコーディオン形式（開閉可能）
  return (
    <div className={`${styles.infoCard} ${styles.annexCard} ${styles.annexAccordion}`}>
      <button
        type="button"
        className={styles.annexToggle}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        aria-controls={contentId}
        aria-label={`併設施設の詳細を${isExpanded ? '閉じる' : '開く'}`}
      >
        <span className={styles.annexToggleText}>
          <span className={styles.label}>併設施設</span>
          <span className={styles.subStatus}>{statusText}</span>
        </span>
        <ChevronIcon isExpanded={isExpanded} />
      </button>
      <div id={contentId} className={styles.annexContent} hidden={!isExpanded}>
        {content}
      </div>
    </div>
  );
};
