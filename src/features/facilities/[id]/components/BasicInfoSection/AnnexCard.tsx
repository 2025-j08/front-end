'use client';

import { type ReactNode } from 'react';

import type { AnnexFacility } from '@/types/facility';
import { useIsMobile } from '@/hooks/useIsMobile';

import styles from './BasicInfoSection.module.scss';

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
 * - スマホ: 常に静的なカード形式で表示（アコーディオンは廃止）
 */
export const AnnexCard = (props: AnnexCardProps) => {
  const { annexFacilities, isEditing = false } = props;
  const isMobile = useIsMobile();

  // ステータステキスト
  const statusText = annexFacilities?.length ? 'あり' : 'なし';

  // コンテンツ（編集 or 閲覧用）
  const content = isEditing ? (
    props.children
  ) : (
    <span className={styles.value}>{props.annexText}</span>
  );

  // スマホ: アコーディオン風の見た目を維持しつつ静的に表示（閲覧・編集共通）
  if (isMobile) {
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

  // PC: 通常のカード形式
  return (
    <div className={`${styles.infoCard} ${styles.annexCard}`}>
      <div className={styles.annexHeader}>
        <span className={styles.label}>併設施設</span>
        <span className={styles.subStatus}>{statusText}</span>
      </div>
      <div className={styles.annexContent}>{content}</div>
    </div>
  );
};
