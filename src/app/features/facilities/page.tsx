import { Suspense } from 'react';

import { FacilitiesList } from '@/features/facilities/FacilitiesList';

function FacilitiesListFallback() {
  return (
    <div style={{ padding: '24px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <p>読み込み中...</p>
    </div>
  );
}

export default function FacilitiesPage() {
  return (
    <Suspense fallback={<FacilitiesListFallback />}>
      <FacilitiesList />
    </Suspense>
  );
}
