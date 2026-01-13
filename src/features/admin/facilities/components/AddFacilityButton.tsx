'use client';

import React from 'react';

interface AddFacilityButtonProps {
  onClick: () => void;
}

export const AddFacilityButton: React.FC<AddFacilityButtonProps> = ({ onClick }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', width: '100%' }}>
      <button
        onClick={onClick}
        style={{
          backgroundColor: '#FFFF00', // 画像に基づく黄色
          border: '1px solid #000',
          borderRadius: '999px',
          padding: '0.5rem 2rem',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '2px 2px 0px rgba(0,0,0,0.2)',
        }}
      >
        追加
      </button>
    </div>
  );
};
