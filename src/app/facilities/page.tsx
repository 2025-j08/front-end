import React from 'react';

import FacilityCard, { Facility } from '../../components/facilitycard/facilitycard';

const dummy: Facility[] = [
  {
    id: 1,
    name: 'xxxx(施設名)',
    address: 'xx県xx市xx町xx.....',
    postalCode: 'XXX-XXXX',
    phone: 'xxx-xxxx-xxxx',
  },
  {
    id: 2,
    name: 'xxxx(施設名)',
    address: 'xx県xx市xx町xx.....',
    postalCode: 'XXX-XXXX',
    phone: 'xxx-xxxx-xxxx',
  },
  {
    id: 3,
    name: 'xxxx(施設名)',
    address: 'xx県xx市xx町xx.....',
    postalCode: 'XXX-XXXX',
    phone: 'xxx-xxxx-xxxx',
  },
  {
    id: 4,
    name: 'xxxx(施設名)',
    address: 'xx県xx市xx町xx.....',
    postalCode: 'XXX-XXXX',
    phone: 'xxx-xxxx-xxxx',
  },
];

export default function FacilitiesPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>施設一覧</h1>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
          justifyItems: 'center',
        }}
      >
        {dummy.map((f) => (
          <FacilityCard key={f.id} facility={f} />
        ))}
      </section>
    </main>
  );
}
