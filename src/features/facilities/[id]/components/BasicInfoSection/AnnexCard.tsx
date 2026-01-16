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

/** 併設施設カード（PC: 従来表示 / スマホ: アコーディオン形式） */
type AnnexCardProps = {
  annexFacilities: AnnexFacility[] | undefined;
  /** 閲覧モードで表示するテキスト（annexFacilitiesから生成） */
  annexText?: string;
  /** 編集モードかどうか */
  isEditing?: boolean;
  /** 編集モード時に表示するコンテンツ（AnnexFacilityEditorなど） */
  children?: ReactNode;
};

export const AnnexCard = ({
  annexFacilities,
  annexText = '-',
  isEditing = false,
  children,
}: AnnexCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();
  const contentId = useId();

  // 閲覧モード: データがない場合は非表示
  // 編集モード: 常に表示（追加ボタンを表示するため）
  if (!isEditing && !annexFacilities?.length) return null;

  // ステータステキスト
  const statusText = annexFacilities?.length ? 'あり' : 'なし';

  // コンテンツ（編集 or 閲覧用）
  const content = isEditing ? children : <span className={styles.value}>{annexText}</span>;

  // PC表示: 従来のカードレイアウト
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

  // スマホ表示: アコーディオン形式
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
      <div
        id={contentId}
        className={styles.annexContent}
        // アクセシビリティ: コンテンツは常にDOMに存在させ、非表示時は hidden にする
        hidden={!isExpanded}
      >
        {content}
      </div>
    </div>
  );
};
