import { AddFacilityForm } from '@/features/admin/facilities/components/AddFacilityForm';

import styles from './page.module.scss';

export default function AddFacilityPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>施設追加</h1>
      <AddFacilityForm />
    </div>
  );
}
