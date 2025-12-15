import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import styles from './Pagination.module.scss';

// ページネーション表示設定
const DEFAULT_MAX_VISIBLE_PAGES = 5;
// 先頭・末尾付近と判定する境界値（この値以下/以上で省略表示が変わる）
const EDGE_THRESHOLD = 3;
// 先頭付近で表示する連続ページ数
const PAGES_AT_START = 4;
// 末尾付近で表示する連続ページ数
const PAGES_AT_END = 4;

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = DEFAULT_MAX_VISIBLE_PAGES;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= EDGE_THRESHOLD) {
        for (let i = 1; i <= PAGES_AT_START; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - (EDGE_THRESHOLD - 1)) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - (PAGES_AT_END - 1); i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className={styles.pagination}>
      <button className={styles.arrow} onClick={handlePrev} disabled={currentPage === 1}>
        <ChevronLeftIcon />
      </button>

      {getPageNumbers().map((page, index) =>
        typeof page === 'number' ? (
          <button
            key={`page-${page}`}
            className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ) : (
          <span key={`ellipsis-${index}`} className={styles.ellipsis}>
            {page}
          </span>
        ),
      )}

      <button className={styles.arrow} onClick={handleNext} disabled={currentPage === totalPages}>
        <ChevronRightIcon />
      </button>
    </div>
  );
};
