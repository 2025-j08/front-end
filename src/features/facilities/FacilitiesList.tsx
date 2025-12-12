'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import facilitiesData from '@/dummy_data/facilities_list.json';
import { FacilitiesData } from '@/types/facility';

import { FacilityCard } from './components/FacilityCard/FacilityCard';
import { Pagination } from './components/Pagination/Pagination';
import styles from './FacilitiesList.module.scss';

const data: FacilitiesData = facilitiesData;

export const FacilitiesList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Object.keys(data.pages).length;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const currentFacilities = data.pages[currentPage.toString()] || [];

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/">施設を探す</Link> &gt; <span>施設一覧</span>
      </div>

      <h1 className={styles.title}>施設一覧</h1>

      <div className={styles.facilitiesGrid}>
        {currentFacilities.map((facility) => (
          <FacilityCard key={facility.id} facility={facility} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
